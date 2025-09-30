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
            (sum, item) => sum + parseFloat(item.price) * item.quantity,
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
        if (!customer.customerId) {
            alert("Please log in to proceed with checkout");
            navigate("/login");
            return;
        }

        // Use existing checkout logic
        try {
            console.log("Starting checkout process...");
            
            // Validate cart is not empty
            if (cartItems.length === 0) {
                alert("Your cart is empty. Please add items before checkout.");
                return;
            }
            console.log("Cart items:", cartItems.length);

            // 0. Try to save cart to backend before processing checkout (optional)
            try {
                console.log("Saving cart to backend...");
                await saveCartToBackend(cartItems);
                console.log("Cart saved successfully");
            } catch (error) {
                console.log("Cart save failed, but continuing with checkout:", error);
                // Don't block checkout if cart save fails
            }
            
            // 0.5. Mark cart as checked out (to avoid duplicate constraint issues)
            try {
                console.log("Marking cart as checked out...");
                const checkoutPayload = {
                    customer: { customerId: customer.customerId },
                    isCheckedOut: true // Mark as checked out to avoid duplicates
                };
                await api.put("/api/cart/update", checkoutPayload);
                console.log("Cart marked as checked out");
            } catch (checkoutError) {
                console.log("Cart checkout marking failed:", checkoutError.response?.status);
                // Continue even if this fails
            }

            // 1. Create the shipment first
            console.log("Creating shipment...");
            const shipmentData = {
                shipmentMethod: "Standard",
                status: "Pending",
                trackingNumber: "N/A"
            };
            
            const shipmentRes = await api.post("/shipment/create", shipmentData);
            const shipment = shipmentRes.data;
            console.log("Shipment created:", shipment);

            // 2. Prepare order data with persisted shipment
            console.log("Creating order...");
            const orderData = {
                orderDate: new Date().toISOString().slice(0,10),
                totalAmount: getTotalPrice,
                orderLines: null,
                customer: { customerId: customer.customerId },
                shipment: shipment
            };
            
            // 3. Create the order
            const order = await createOrder(orderData);
            console.log("Order created:", order);
            
            // 4. Create order lines for each cart item
            console.log("Creating order lines...");
            const orderLinePromises = cartItems.map(async (item, index) => {
                const orderLineData = {
                    quantity: item.quantity,
                    unitPrice: parseFloat(item.price),
                    subTotal: parseFloat(item.price) * item.quantity,
                    order: { orderId: order.orderId },
                    product: { productId: item.id }
                };
                
                try {
                    return await createOrderLine(orderLineData);
                } catch (orderLineError) {
                    console.error(`Failed to create order line ${index + 1}:`, orderLineError);
                    throw orderLineError;
                }
            });

            const orderLines = await Promise.all(orderLinePromises);
            console.log("All order lines created:", orderLines.length);
            
            // 5. Clear cart after successful order creation
            clearCart();
            console.log("Cart cleared");
            
            // 6. Save order ID and navigate to shipping
            localStorage.setItem("orderId", order.orderId);
            console.log("Order ID saved:", order.orderId);
            
            alert("Order created successfully!");
            navigate("/shipping");
            
        } catch (err) {
            console.error("Checkout error:", err);
            alert("Failed to create order. Please try again.");
        }
    }, [cartItems, getTotalPrice, clearCart, navigate]);

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
        
        if (cartItems.length === 0) {
            console.log("Cart is empty, skipping save");
            return;
        }
        
        // Try to update existing cart first, then create if needed
        const updatePayload = {
            customer: { 
                customerId: customer.customerId,
                firstName: customer.firstName || "Customer",
                lastName: customer.lastName || "User", 
                email: customer.email || "customer@example.com"
            },
            items: cartItems.map(item => ({
                product: { 
                    productId: item.id,
                    productName: item.name,
                    price: parseFloat(item.price)
                },
                quantity: item.quantity,
                unitPrice: parseFloat(item.price),
                subTotal: parseFloat(item.price) * item.quantity
            })),
            isCheckedOut: false
        };
        
        try {
            const response = await api.put("/api/cart/update", updatePayload);
            console.log("Cart updated successfully:", response.data);
        } catch (updateError) {
            if (updateError.response?.status === 404) {
                // Cart doesn't exist, create new one
                const response = await api.post("/api/cart/create", updatePayload);
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