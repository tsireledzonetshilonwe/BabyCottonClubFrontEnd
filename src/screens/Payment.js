import React, { useState, useEffect } from "react";
import { createPayment } from "../api/api";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "./Payment.css";

export default function Payment() {
    const { cartItems, clearCart } = useCart();
    const navigate = useNavigate();
    const location = useLocation();

    const [paymentMethod, setPaymentMethod] = useState("");
    const [shippingInfo, setShippingInfo] = useState(location.state?.address || null);
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        console.log("Payment component mounted");
        console.log("Shipping info:", shippingInfo);
        console.log("Cart items:", cartItems);
        
        const orderId = localStorage.getItem("orderId");
        console.log("Order ID in localStorage:", orderId);
        
        if (!shippingInfo) {
            console.log("No shipping info, redirecting to shipping...");
            navigate("/shipping");
        }
    }, [shippingInfo, navigate]);

    const totalAmount = cartItems.reduce((sum, item) => {
        const price = parseFloat(item.price) || 0;
        return sum + price * (item.quantity || 1);
    }, 0);

    const handlePayment = async (e) => {
        e.preventDefault();
        if (!paymentMethod) {
            alert("Please select a payment method.");
            return;
        }

        // Check for existing orderId first
        let orderId = localStorage.getItem("orderId");
        
        // If no orderId exists but we have cart items, try to create an order on the fly
        if (!orderId && cartItems.length > 0) {
            console.log("No orderId found, creating order during payment...");
            try {
                const customer = JSON.parse(localStorage.getItem("customer"));
                if (!customer || !customer.customerId) {
                    alert("Please log in to complete your order.");
                    navigate("/login");
                    return;
                }

                // Create a simple order for payment
                const orderData = {
                    orderDate: new Date().toISOString().slice(0,10),
                    totalAmount: totalAmount,
                    customer: { customerId: customer.customerId }
                };

                const response = await fetch('http://localhost:8080/api/order/create', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(orderData)
                });

                if (response.ok) {
                    const order = await response.json();
                    orderId = order.orderId;
                    localStorage.setItem("orderId", orderId);
                    console.log("Order created during payment:", orderId);
                } else {
                    throw new Error("Failed to create order");
                }
            } catch (err) {
                console.error("Failed to create order during payment:", err);
                alert("Unable to process order. Please try starting from your cart.");
                navigate("/cart");
                return;
            }
        }

        // If still no orderId and no cart items, redirect to cart
        if (!orderId) {
            console.log("No order ID and no cart items, redirecting to cart...");
            alert("No order found. Please add items to your cart first.");
            navigate("/cart");
            return;
        }

        console.log("Processing payment for order:", orderId);

        try {
            // Simulate payment processing
            await new Promise((resolve) => setTimeout(resolve, 1000));

            // Create payment record
            const today = new Date().toISOString().split("T")[0];
            const paymentData = {
                paymentDate: today,
                paymentMethod,
                customerOrder: { orderId: Number(orderId) },
            };
            await createPayment(paymentData);

            alert(`Payment successful with ${paymentMethod}!`);
            clearCart();
            localStorage.removeItem("orderId");
            navigate("/");
        } catch (err) {
            console.error("Payment processing failed:", err);
            alert("Payment failed. Please try again.");
        }
    };

    // Check if we have either cart items OR an existing order
    const hasCartItems = cartItems.length > 0;
    const hasExistingOrder = localStorage.getItem("orderId");
    
    if (!hasCartItems && !hasExistingOrder) {
        return (
            <div style={{ textAlign: "center", marginTop: "2rem" }}>
                <h2>No order found</h2>
                <p>Please add items to your cart and proceed through checkout.</p>
                <Link to="/products" style={{ color: "#FFB6C1", textDecoration: "underline" }}>
                    Continue Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="payment-container">
            {/* Progress Bar */}
            <div className="payment-progress">
                <div className="step completed">Cart</div>
                <div className="step completed">Shipping</div>
                <div className="step active">Payment</div>
                <div className="step">Confirmation</div>
            </div>

            <div className="payment-content">
                {/* Shipping Info */}
                {shippingInfo && (
                    <section className="shipping-summary">
                        <h2>Shipping Address</h2>
                        <div>
                            {shippingInfo.streetNumber} {shippingInfo.streetName}, {shippingInfo.suburb}
                        </div>
                        <div>
                            {shippingInfo.city}, {shippingInfo.province}, {shippingInfo.postalCode}
                        </div>
                    </section>
                )}

                {/* Order Summary */}
                <section className="payment-summary">
                    <h2>Order Summary</h2>
                    {cartItems.length > 0 ? (
                        <>
                            <ul>
                                {cartItems.map((item) => (
                                    <li key={item.id} className="payment-summary-item">
                                        <span className="payment-summary-name">{item.name}</span>
                                        <span className="payment-summary-qty">× {item.quantity}</span>
                                        <span className="payment-summary-price">R {item.price}</span>
                                    </li>
                                ))}
                            </ul>
                            <div className="payment-summary-total">
                                <strong>Total:</strong> R {totalAmount.toFixed(2)}
                            </div>
                        </>
                    ) : (
                        <div style={{ textAlign: "center", padding: "1rem" }}>
                            <p>Order details will be processed based on your previous checkout.</p>
                            <p><strong>Order ID:</strong> {localStorage.getItem("orderId") || "Processing..."}</p>
                        </div>
                    )}
                </section>

                {/* Payment Form */}
                <section className="payment-form-section">
                    <h2>Payment Details</h2>
                    <form className="payment-form" onSubmit={handlePayment}>
                        <div className="input-group">
                            <label>Payment Method</label>
                            <select
                                value={paymentMethod}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                                className="payment-method-select"
                                required
                            >
                                <option value="">Select a method</option>
                                <option value="Credit Card">Credit Card</option>
                                <option value="EFT">EFT</option>
                                <option value="Cash on Delivery">Cash on Delivery</option>
                            </select>
                        </div>

                        {/* Simulated Credit Card */}
                        {paymentMethod === "Credit Card" && (
                            <div className="payment-simulation">
                                <p>
                                    Click confirm to pay <strong>R {totalAmount.toFixed(2)}</strong> with Credit Card (simulated).
                                </p>
                                <p>In a real system, you would be redirected to a secure payment gateway like Stripe.</p>
                            </div>
                        )}

                        {/* EFT Info */}
                        {paymentMethod === "EFT" && (
                            <div className="eft-info">
                                <p>
                                    Please transfer <strong>R {totalAmount.toFixed(2)}</strong> to{" "}
                                    <strong>FNB Account: 1234567890</strong> using your Order ID as reference.
                                </p>
                            </div>
                        )}

                        {/* Cash on Delivery */}
                        {paymentMethod === "Cash on Delivery" && (
                            <div className="cod-info">
                                <p>You will pay <strong>R {totalAmount.toFixed(2)}</strong> to the driver upon delivery.</p>
                            </div>
                        )}

                        <button className="payment-confirm-btn" type="submit" disabled={isProcessing}>
                            {isProcessing ? "Processing..." : "Confirm Payment"}
                        </button>
                    </form>
                </section>
            </div>
        </div>
    );
}

