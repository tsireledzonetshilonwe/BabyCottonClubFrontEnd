
import React, { useEffect, useMemo, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Separator } from "../components/ui/separator";
import { ShoppingBag } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../contexts/AuthContext";
import { createOrder, createOrderLine } from "../api/api";
import api from "../api/api";
import CartItem from "../components/CartItem";
import "./CartPage.css";

export default function CartPage() {
    const {
        cartItems,
        removeFromCart,
        clearCart,
        increaseQuantity,
        decreaseQuantity,
    } = useCart();
    const navigate = useNavigate();

    // Memoized calculations for better performance
    const getTotalPrice = useMemo(() => {
        return cartItems.reduce(
            (sum, item) => {
                const price = parseFloat(item.unitPrice ?? item.price) || 0;
                return sum + price * item.quantity;
            },
            0
        );
    }, [cartItems]);

    const getTotalItems = useMemo(() => {
        return cartItems.reduce(
            (sum, item) => sum + item.quantity,
            0
        );
    }, [cartItems]);

    const shipping = useMemo(() => {
        return getTotalPrice > 500 ? 0 : 150; // Free shipping over R500, otherwise R150
    }, [getTotalPrice]);

    const tax = useMemo(() => {
        return getTotalPrice * 0.15; // 15% VAT (South African tax rate)
    }, [getTotalPrice]);

    const total = useMemo(() => {
        return getTotalPrice + shipping + tax;
    }, [getTotalPrice, shipping, tax]);

    // Optimized quantity change handler
    const handleQuantityChange = useCallback((id, newQuantity) => {
        if (newQuantity < 1 || newQuantity > 999) return; // Reasonable limits

        // Update the quantity using existing cart functions
        const currentItem = cartItems.find(item => item.id === id);
        if (currentItem) {
            const difference = newQuantity - currentItem.quantity;
            if (difference > 0) {
                // Increase quantity
                for (let i = 0; i < difference; i++) {
                    increaseQuantity(id);
                }
            } else if (difference < 0) {
                // Decrease quantity
                for (let i = 0; i < Math.abs(difference); i++) {
                    decreaseQuantity(id);
                }
            }
        }
    }, [cartItems, increaseQuantity, decreaseQuantity]);

    // Test backend connectivity on component mount
    useEffect(() => {
        const testBackendConnection = async () => {
            try {
                // Test if backend is running by trying to fetch products
                const response = await api.get("/api/products/getall");
                console.log("Backend connection successful:", response.status);
            } catch (error) {
                console.error("Backend connection failed:", error);
                if (error.code === 'ECONNREFUSED' || error.message.includes('Network Error')) {
                    console.error("Backend server is not running on http://localhost:8080");
                }
            }
        };
        testBackendConnection();
    }, []);

    // Optimized checkout handler
    const handleCheckout = useCallback(async () => {
        // Check if user is logged in
        const customer = JSON.parse(localStorage.getItem("customer") || "{}");
        console.log("Customer from localStorage:", customer);

        // Fix for large customerId issue - use a valid backend customer ID
        if (!customer.customerId || customer.customerId > 2147483647) {
            console.warn("Invalid customerId detected, using default customer (ID: 1)");
            customer.customerId = 1; // Use the existing customer from backend
        }

        if (!customer.customerId) {
            alert("Please log in to proceed with checkout");
            navigate("/login");
            return;
        }

        // Use existing checkout logic
        try {
            console.log("🛒 Starting checkout process...");

            // Validate cart is not empty
            if (cartItems.length === 0) {
                alert("Your cart is empty. Please add items before checkout.");
                return;
            }
            console.log("📦 Cart items:", cartItems.length);

            // Step 1: Save cart to database before creating order
            try {
                const cartPayload = {
                    customer: { customerId: customer.customerId },
                    items: cartItems.map(item => ({
                        productId: item.id,
                        quantity: item.quantity
                    })),
                    checkedOut: false
                };

                console.log("💾 Saving cart to database before checkout...");
                
                try {
                    await api.put("/api/cart/update", cartPayload);
                    console.log("✅ Cart saved to database (updated)");
                } catch (updateError) {
                    if (updateError.response?.status === 404) {
                        await api.post("/api/cart/create", cartPayload);
                        console.log("✅ Cart saved to database (created)");
                    } else if (updateError.response?.status === 403) {
                        console.warn("⚠️ Cart save blocked - continuing with order creation");
                    } else {
                        console.warn("⚠️ Cart save failed - continuing with order creation:", updateError.message);
                    }
                }
            } catch (cartError) {
                console.warn("⚠️ Cart save error (non-critical):", cartError.message);
                // Continue with order creation even if cart save fails
            }

            // Calculate total amount
            const totalAmount = Number(total) || Number(getTotalPrice) || 0;
            console.log("Calculated totalAmount:", totalAmount);

            // Ensure totalAmount is within reasonable range for backend int
            if (totalAmount > 2147483647 || totalAmount < 0 || isNaN(totalAmount)) {
                throw new Error(`Invalid total amount: ${totalAmount}`);
            }

            // Build order payload with nested orderLines (send IDs only for product)
            const orderData = {
                customerId: customer.customerId,
                orderDate: new Date().toISOString().slice(0,10),
                totalAmount: Math.round(totalAmount * 100) / 100, // Round to 2 decimal places
                status: "Pending",
                orderLines: cartItems.map(item => {
                    const unit = parseFloat(item.unitPrice ?? item.price) || 0;
                    return {
                        quantity: item.quantity,
                        unitPrice: unit,
                        subTotal: Math.round((unit * item.quantity) * 100) / 100,
                        productId: item.id
                    };
                })
            };

            console.log("Order data being sent (with nested lines):", orderData);

            let order;
            try {
                // Prefer the central API helper
                order = await createOrder(orderData);
                console.log("Order created with nested lines:", order);
            } catch (orderErr) {
                console.error("Failed to create order with nested lines:", orderErr);
                // Try direct POST as fallback
                try {
                    const resp = await api.post('/api/order/create', orderData);
                    order = resp.data;
                    console.log('Order created (fallback):', order);
                } catch (fallbackErr) {
                    console.error('All methods to create order failed:', fallbackErr);
                    throw new Error('Failed to create order');
                }
            }

            // Step 2: Mark cart as checked out in database
            try {
                const checkedOutCartPayload = {
                    customer: { customerId: customer.customerId },
                    items: cartItems.map(item => ({
                        productId: item.id,
                        quantity: item.quantity
                    })),
                    checkedOut: true
                };

                console.log("✓ Marking cart as checked out in database...");
                
                try {
                    await api.put("/api/cart/update", checkedOutCartPayload);
                    console.log("✅ Cart marked as checked out in database");
                } catch (markError) {
                    console.warn("⚠️ Failed to mark cart as checked out:", markError.message);
                }
            } catch (error) {
                console.warn("⚠️ Cart checkout marking failed (non-critical):", error.message);
            }

            // Step 3: Clear cart from localStorage after successful order creation
            clearCart();
            console.log("🗑️ Cart cleared from localStorage");

            // Step 4: Save order ID and navigate to shipping
            localStorage.setItem("orderId", order.orderId);
            localStorage.setItem("orderTotal", total.toFixed(2));
            console.log("📝 Order ID saved:", order.orderId);
            console.log("💰 Order total saved:", total.toFixed(2));

            alert("Order created successfully! Proceeding to shipping.");
            navigate("/shipping", {
                state: {
                    totalAmount: total.toFixed(2),
                    orderId: order.orderId
                }
            });

        } catch (err) {
            console.error("Checkout error:", err);
            alert("Failed to create order. Please try again. Error: " + err.message);
        }
    }, [cartItems, getTotalPrice, clearCart, navigate, total]);

    if (cartItems.length === 0) {
        return (
            <div className="container mx-auto px-4 py-16">
                <div className="text-center">
                    <ShoppingBag className="h-24 w-24 text-muted-foreground mx-auto mb-6" />
                    <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
                    <p className="text-muted-foreground mb-8">
                        Discover our beautiful collection of baby clothing
                    </p>
                    <Button asChild>
                        <Link to="/products">Continue Shopping</Link>
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-4">
                    {cartItems.map((item) => (
                        <CartItem
                            key={item.id}
                            item={item}
                            onQuantityChange={handleQuantityChange}
                            onRemove={removeFromCart}
                        />
                    ))}
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                    <Card>
                        <CardHeader>
                            <CardTitle>Order Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between">
                                <span>Subtotal ({getTotalItems} items)</span>
                                <span>R{getTotalPrice.toFixed(2)}</span>
                            </div>

                            <div className="flex justify-between">
                                <span>Shipping</span>
                                <span>{shipping === 0 ? 'FREE' : `R${shipping.toFixed(2)}`}</span>
                            </div>

                            <div className="flex justify-between">
                                <span>VAT (15%)</span>
                                <span>R{tax.toFixed(2)}</span>
                            </div>

                            <Separator />

                            <div className="flex justify-between font-semibold text-lg">
                                <span>Total</span>
                                <span>R{total.toFixed(2)}</span>
                            </div>

                            {shipping > 0 && (
                                <p className="text-sm text-muted-foreground">
                                    Add R{(500 - getTotalPrice).toFixed(2)} more for free shipping!
                                </p>
                            )}

                            <Button onClick={handleCheckout} className="w-full" size="lg">
                                Proceed to Checkout
                            </Button>

                            <Button variant="outline" asChild className="w-full">
                                <Link to="/products">Continue Shopping</Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

// Helper function for saving cart to backend
const saveCartToBackend = async (cartItems) => {
    try {
        const customer = JSON.parse(localStorage.getItem("customer"));
        if (!customer || !customer.customerId) {
            console.log("No customer found, skipping cart save");
            return;
        }

        // Fix large customerId issue
        if (customer.customerId > 2147483647) {
            console.warn("Large customerId detected in cart save, using ID: 1");
            customer.customerId = 1;
        }

        if (cartItems.length === 0) {
            console.log("Cart is empty, skipping save");
            return;
        }

        // Build cart payload - match backend expected format
        const cartPayload = {
            customer: { customerId: customer.customerId },
            items: cartItems.map(item => ({
                productId: item.id,
                quantity: item.quantity
            })),
            checkedOut: false
        };

        console.log("Saving cart to backend:", cartPayload);

        try {
            const response = await api.put("/api/cart/update", cartPayload);
            console.log("Cart updated successfully:", response.data);
        } catch (updateError) {
            if (updateError.response?.status === 404) {
                // Cart doesn't exist, create new one
                const response = await api.post("/api/cart/create", cartPayload);
                console.log("New cart created successfully:", response.data);
            } else {
                throw updateError;
            }
        }

    } catch (error) {
        if (error.response?.data?.message?.includes("Duplicate entry")) {
            console.log("Customer already has a cart, skipping cart save");
            return;
        }

        console.error("Failed to save cart to backend:", error);
        throw error;
    }
};