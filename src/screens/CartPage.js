import React, { useEffect, useMemo, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Separator } from "../components/ui/separator";
import { ShoppingBag } from "lucide-react";
import { useCart } from "../context/CartContext";
import { createOrder } from "../api/api";
import api from "../api/api";
import CartItem from "../components/CartItem";
import "./CartPage.css";

export default function CartPage() {
    const { cartItems, removeFromCart, clearCart, increaseQuantity, decreaseQuantity } = useCart();
    const navigate = useNavigate();

    // Memoized calculations
    const getTotalPrice = useMemo(() => cartItems.reduce((sum, item) => sum + parseFloat(item.price) * item.quantity, 0), [cartItems]);
    const getTotalItems = useMemo(() => cartItems.reduce((sum, item) => sum + item.quantity, 0), [cartItems]);
    const tax = useMemo(() => getTotalPrice * 0.15, [getTotalPrice]);
    const total = useMemo(() => getTotalPrice + tax, [getTotalPrice, tax]);

    const handleQuantityChange = useCallback((id, newQuantity) => {
        if (newQuantity < 1 || newQuantity > 999) return;
        const currentItem = cartItems.find(item => item.id === id);
        if (currentItem) {
            const diff = newQuantity - currentItem.quantity;
            if (diff > 0) for (let i = 0; i < diff; i++) increaseQuantity(id);
            if (diff < 0) for (let i = 0; i < Math.abs(diff); i++) decreaseQuantity(id);
        }
    }, [cartItems, increaseQuantity, decreaseQuantity]);

    useEffect(() => {
        const testBackendConnection = async () => {
            try {
                const response = await api.get("/api/products/getall");
                console.log("Backend connection successful:", response.status);
            } catch (error) {
                console.error("Backend connection failed:", error);
            }
        };
        testBackendConnection();
    }, []);

    const handleCheckout = useCallback(async () => {
        try {
            const customer = JSON.parse(localStorage.getItem("customer") || "{}");

            if (!customer.customerId || customer.customerId > 2147483647) {
                console.warn("Invalid customerId, using default ID 1");
                customer.customerId = 1;
            }

            if (!customer.customerId) {
                alert("Please log in to proceed with checkout");
                navigate("/login");
                return;
            }

            if (cartItems.length === 0) {
                alert("Your cart is empty. Please add items before checkout.");
                return;
            }

            const totalAmount = Math.round((getTotalPrice + tax) * 100) / 100;

            // Validate product IDs against backend product list before building payload
            const productsRes = await api.get('/api/products/getall');
            const products = Array.isArray(productsRes.data) ? productsRes.data : productsRes;
            const validProductIds = new Set(products.map(p => Number(p.productId ?? p.id)).filter(n => Number.isFinite(n) && n >= 1));

            const invalidItems = cartItems.filter(item => {
                const pid = Number(item.id ?? item.productId);
                return !Number.isFinite(pid) || pid < 1 || !validProductIds.has(pid);
            });

            if (invalidItems.length > 0) {
                console.error('Checkout aborted: invalid product IDs detected for items:', invalidItems);
                const ids = invalidItems.map(i => i.id ?? i.productId).join(', ');
                alert(`Cannot create order: invalid productId(s) found: ${ids}. Please remove these items or contact support.`);
                return;
            }

            // Build full order payload including order lines (all productIds validated)
            const orderPayload = {
                customerId: customer.customerId,
                orderDate: new Date().toISOString().slice(0,10),
                totalAmount,
                status: "Pending",
                orderLines: cartItems.map(item => ({
                    quantity: item.quantity,
                    unitPrice: parseFloat(item.price),
                    subTotal: parseFloat(item.price) * item.quantity,
                    productId: Number(item.id ?? item.productId)
                }))
            };

            // Log payload (dev) and create order with nested lines in a single request
            console.log("ORDER PAYLOAD ->", JSON.stringify(orderPayload, null, 2));
            const order = await createOrder(orderPayload);
            console.log("Order created with lines:", order);

            // 3. Clear cart and save order ID
            clearCart();
            localStorage.setItem("orderId", String(order.orderId));

            alert("Order created successfully!");
            navigate("/shipping");

        } catch (err) {
                // Improved Axios error logging for debugging 500s
                console.error("❌ Checkout error:", err);
                try {
                    // Axios provides response with status and data when available
                    if (err && err.response) {
                        console.error("Axios response status:", err.response.status);
                        console.error("Axios response data:", err.response.data);
                        const backendMessage = err.response.data?.message || err.response.data || JSON.stringify(err.response.data);
                        alert(`Failed to create order: ${backendMessage}`);
                    } else if (err && err.request) {
                        // Request was made but no response received
                        console.error("No response received:", err.request);
                        alert("Failed to create order: no response from server. Check backend logs or CORS settings.");
                    } else {
                        // Something happened in setting up the request
                        alert(`Failed to create order: ${err.message}`);
                    }
                } catch (loggingErr) {
                    console.error("Error while handling checkout error:", loggingErr);
                    alert("Failed to create order. See console for details.");
                }
        }
    }, [cartItems, getTotalPrice, tax, clearCart, navigate]);

    const formatCurrency = useCallback((amount) => {
        if (amount === null || amount === undefined || isNaN(amount)) return 'R0.00';
        return `R${Number(amount).toFixed(2)}`;
    }, []);

    if (cartItems.length === 0) {
        return (
            <div className="container mx-auto px-4 py-16">
                <div className="text-center">
                    <ShoppingBag className="h-24 w-24 text-muted-foreground mx-auto mb-6" />
                    <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
                    <p className="text-muted-foreground mb-8">Discover our beautiful collection of baby clothing</p>
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

                <div className="lg:col-span-1">
                    <Card className="order-summary-card">
                        <CardHeader>
                            <CardTitle>Order Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between">
                                <span>Subtotal ({getTotalItems} items)</span>
                                <span>{formatCurrency(getTotalPrice)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>VAT (15%)</span>
                                <span>{formatCurrency(tax)}</span>
                            </div>
                            <Separator />
                            <div className="flex justify-between font-semibold text-lg">
                                <span>Total</span>
                                <span>{formatCurrency(total)}</span>
                            </div>

                            <div className="space-y-2 mt-4">
                                <Button onClick={handleCheckout} className="w-full" size="lg">
                                    Proceed to Checkout
                                </Button>
                                <Button variant="outline" asChild className="w-full">
                                    <Link to="/products">Continue Shopping</Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

// Helper: Save cart to backend (optional)
const saveCartToBackend = async (cartItems) => {
    try {
        const customerRaw = localStorage.getItem("customer");
        const customer = customerRaw ? JSON.parse(customerRaw) : null;
        if (!customer || !Number.isFinite(Number(customer.customerId)) || Number(customer.customerId) <= 0) return;

        const updatePayload = {
            customer: {
                customerId: customer.customerId,
                firstName: customer.firstName || "Customer",
                lastName: customer.lastName || "User",
                email: customer.email || "customer@example.com"
            },
            items: cartItems.map(item => ({
                productId: item.id,
                quantity: item.quantity,
                unitPrice: parseFloat(item.price),
                subTotal: parseFloat(item.price) * item.quantity
            })),
            isCheckedOut: false
        };

        try {
            await api.put("/api/cart/update", updatePayload);
        } catch (updateError) {
            if (updateError.response?.status === 404) {
                await api.post("/api/cart/create", updatePayload);
            } else {
                throw updateError;
            }
        }

    } catch (error) {
        console.error("Failed to save cart:", error);
        throw error;
    }
};
