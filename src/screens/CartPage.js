import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { createOrder, createOrderLine } from "../api/api";
import api from "../api/api";
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

    const totalAmount = cartItems.reduce(
        (sum, item) => sum + parseFloat(item.price) * item.quantity,
        0
    );

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

    // Save cart to backend database
    const saveCartToBackend = async () => {
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
            try {
                // First, try to update existing cart
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
                
                const response = await api.put("/api/cart/update", updatePayload);
                console.log("Cart updated successfully:", response.data);
                
            } catch (updateError) {
                // If update fails (cart doesn't exist), try to create new cart
                console.log("Cart update failed, trying to create new cart:", updateError.response?.status);
                
                if (updateError.response?.status === 404) {
                    // Cart doesn't exist, create new one
                    const createPayload = {
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
                    
                    const response = await api.post("/api/cart/create", createPayload);
                    console.log("New cart created successfully:", response.data);
                } else {
                    throw updateError; // Re-throw if it's not a 404 error
                }
            }
            
        } catch (error) {
            // Handle duplicate cart error gracefully
            if (error.response?.data?.message?.includes("Duplicate entry")) {
                console.log("⚠️ Customer already has a cart, skipping cart save");
                return; // Don't throw error for duplicate cart
            }
            
            console.error("Failed to save cart to backend:", error);
            throw error; // Re-throw other errors
        }
    };

    // Handle checkout: create order, store orderId, then navigate to shipping
    const handleCheckout = async () => {
        try {
            console.log("🛒 Starting checkout process...");
            
            // Get customer from localStorage
            const customer = JSON.parse(localStorage.getItem("customer"));
            if (!customer || !customer.customerId) {
                alert("No customer found. Please log in first.");
                return;
            }
            console.log("✅ Customer found:", customer);

            // Validate cart is not empty
            if (cartItems.length === 0) {
                alert("Your cart is empty. Please add items before checkout.");
                return;
            }
            console.log("✅ Cart items:", cartItems.length);

            // 0. Try to save cart to backend before processing checkout (optional)
            try {
                console.log("💾 Saving cart to backend...");
                await saveCartToBackend();
                console.log("✅ Cart saved successfully");
            } catch (error) {
                console.log("⚠️ Cart save failed, but continuing with checkout:", error);
                // Don't block checkout if cart save fails
            }
            
            // 0.5. Mark cart as checked out (to avoid duplicate constraint issues)
            try {
                console.log("📦 Marking cart as checked out...");
                const checkoutPayload = {
                    customer: { customerId: customer.customerId },
                    isCheckedOut: true // Mark as checked out to avoid duplicates
                };
                await api.put("/api/cart/update", checkoutPayload);
                console.log("✅ Cart marked as checked out");
            } catch (checkoutError) {
                console.log("⚠️ Cart checkout marking failed:", checkoutError.response?.status);
                // Continue even if this fails
            }

            // 1. Create the shipment first
            console.log("📦 Creating shipment...");
            const shipmentData = {
                shipmentMethod: "Standard",
                status: "Pending",
                trackingNumber: "N/A"
            };
            console.log("Shipment payload:", shipmentData);
            
            const shipmentRes = await api.post("/shipment/create", shipmentData);
            const shipment = shipmentRes.data;
            console.log("✅ Shipment created:", shipment);

            // 2. Prepare order data with persisted shipment
            console.log("📋 Creating order...");
            const orderData = {
                orderDate: new Date().toISOString().slice(0,10),
                totalAmount: cartItems.reduce((sum, item) => sum + parseFloat(item.price) * item.quantity, 0),
                orderLines: null,
                customer: { customerId: customer.customerId },
                shipment: shipment
            };
            console.log("Order payload:", orderData);
            
            // 3. Create the order
            const order = await createOrder(orderData);
            console.log("✅ Order created:", order);
            
            // 4. Create order lines for each cart item
            console.log("📝 Creating order lines...");
            const orderLinePromises = cartItems.map(async (item, index) => {
                const orderLineData = {
                    quantity: item.quantity,
                    unitPrice: parseFloat(item.price),
                    subTotal: parseFloat(item.price) * item.quantity,
                    order: { orderId: order.orderId },
                    product: { productId: item.id } // Backend must fetch Product entity
                };
                console.log(`Order line ${index + 1}:`, orderLineData);
                
                try {
                    return await createOrderLine(orderLineData);
                } catch (orderLineError) {
                    console.error(`❌ Failed to create order line ${index + 1}:`, orderLineError);
                    
                    // If Product reference fails, try with just productId
                    if (orderLineError.message?.includes("transient instance")) {
                        console.log(`🔄 Retrying order line ${index + 1} with productId only...`);
                        const simpleOrderLineData = {
                            quantity: item.quantity,
                            unitPrice: parseFloat(item.price),
                            subTotal: parseFloat(item.price) * item.quantity,
                            order: { orderId: order.orderId },
                            productId: item.id // Try sending just the ID
                        };
                        return await createOrderLine(simpleOrderLineData);
                    }
                    
                    throw orderLineError; // Re-throw if it's a different error
                }
            });

            const orderLines = await Promise.all(orderLinePromises);
            console.log("✅ All order lines created:", orderLines.length);
            
            // 5. Clear cart after successful order creation
            clearCart();
            console.log("✅ Cart cleared");
            
            // 6. Save order ID and navigate to shipping
            localStorage.setItem("orderId", order.orderId);
            console.log("✅ Order ID saved:", order.orderId);
            
            alert("Order created successfully!");
            navigate("/shipping");
            
        } catch (err) {
            console.error("❌ Checkout error:", err);
            console.error("Error details:", {
                message: err.message,
                status: err.response?.status,
                data: err.response?.data,
                config: err.config
            });
            
            let errorMessage = "Failed to create order: ";
            if (err.response?.status === 404) {
                errorMessage += "Endpoint not found. Check if backend server is running.";
            } else if (err.response?.status === 500) {
                errorMessage += "Server error. Check backend logs.";
            } else if (err.response?.data?.message) {
                errorMessage += err.response.data.message;
            } else {
                errorMessage += err.message || "Unknown error";
            }
            
            alert(errorMessage);
        }
    };

    return (
        <div className="cart-container">
            <h2>Your Shopping Cart</h2>
            <div className="cart-list">
                {cartItems.map((item) => (
                    <div key={item.id} className="cart-item">
                        <img src={item.image} alt={item.name} className="cart-item-image" />
                        <div className="cart-item-details">
                            <h3>{item.name}</h3>
                            <p>{item.price}</p>
                            <div className="quantity-control">
                                <button onClick={() => decreaseQuantity(item.id)}>-</button>
                                <span>{item.quantity}</span>
                                <button onClick={() => increaseQuantity(item.id)}>+</button>
                            </div>
                            <button onClick={() => removeFromCart(item.id)} className="remove-btn">
                                Remove
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="cart-summary">
                <h3>Total: R {totalAmount.toFixed(2)}</h3>
                <div className="cart-actions">
                    <button onClick={clearCart} className="clear-btn">Clear Cart</button>
                    <button onClick={handleCheckout} className="checkout-btn">
                        Proceed to Shipping
                    </button>
                </div>
            </div>
        </div>
    );
}