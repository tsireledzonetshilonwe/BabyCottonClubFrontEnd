import React, { useState, useEffect } from "react";
import { createPayment } from "../api/api";
import { useNavigate, useLocation } from "react-router-dom";
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
        if (!shippingInfo) {
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

        setIsProcessing(true);
        const orderId = localStorage.getItem("orderId");
        if (!orderId) {
            alert("No order found. Please checkout again.");
            navigate("/cart");
            return;
        }

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
            alert("Payment failed. Please try again.");
        } finally {
            setIsProcessing(false);
        }
    };

    if (cartItems.length === 0) {
        return (
            <div style={{ textAlign: "center", marginTop: "2rem" }}>
                <h2>Your cart is empty</h2>
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

