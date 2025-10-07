import React, { useState, useEffect } from "react";
import { createPayment } from "../api/api";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "./Payment.css";

export default function Payment() {
    const { cartItems, clearCart } = useCart();
    const navigate = useNavigate();
    const location = useLocation();

    const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery"); // Set default to Cash on Delivery
    const [shippingInfo, setShippingInfo] = useState(location.state?.address || null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [totalAmount, setTotalAmount] = useState(0);

    useEffect(() => {
        console.log("Payment component mounted");
        console.log("Shipping info:", shippingInfo);
        console.log("Cart items:", cartItems);

        const orderId = localStorage.getItem("orderId");
        console.log("Order ID in localStorage:", orderId);

        if (!shippingInfo) {
            console.log("No shipping info, redirecting to shipping...");
            navigate("/shipping");
            return;
        }

        // Calculate total amount properly
        calculateTotalAmount();
    }, [shippingInfo, navigate, cartItems]);

    const calculateTotalAmount = () => {
        // Try multiple sources for the total amount in order of priority
        const storedOrderTotal = localStorage.getItem("orderTotal");
        const shippingStateTotal = location.state?.totalAmount;

        console.log("Available total sources:");
        console.log(" - Stored order total:", storedOrderTotal);
        console.log(" - Shipping state total:", shippingStateTotal);
        console.log(" - Cart items count:", cartItems.length);

        if (storedOrderTotal) {
            console.log("Using stored order total:", storedOrderTotal);
            setTotalAmount(parseFloat(storedOrderTotal));
        } else if (shippingStateTotal) {
            console.log("Using shipping state total:", shippingStateTotal);
            setTotalAmount(parseFloat(shippingStateTotal));
        } else if (cartItems.length > 0) {
            // Calculate from cart items as fallback
            const subtotal = cartItems.reduce((sum, item) => {
                const price = parseFloat(item.price) || 0;
                const quantity = item.quantity || 1;
                return sum + (price * quantity);
            }, 0);

            // Calculate shipping and tax to match cart page logic
            const shipping = subtotal > 500 ? 0 : 150;
            const tax = subtotal * 0.15;
            const calculatedTotal = subtotal + shipping + tax;

            console.log("Calculated total from cart:", calculatedTotal);
            setTotalAmount(calculatedTotal);

            // Also store it for future reference
            localStorage.setItem("orderTotal", calculatedTotal.toFixed(2));
        } else {
            // Default fallback
            console.log("Using default amount calculation");
            setTotalAmount(0);
        }
    };

    const handlePayment = async (e) => {
        e.preventDefault();
        if (!paymentMethod) {
            alert("Please select a payment method.");
            return;
        }

        setIsProcessing(true);

        try {
            // Check for existing orderId
            let orderId = localStorage.getItem("orderId");

            // Validate we have an order ID
            if (!orderId) {
                console.error("No order ID found for payment");
                alert("No order found. Please complete the checkout process from your cart.");
                navigate("/cart");
                return;
            }

            console.log("Processing payment for order:", orderId);
            console.log("Payment amount:", totalAmount);
            console.log("Payment method:", paymentMethod);

            // Create payment record
            const today = new Date().toISOString().split("T")[0];
            const paymentData = {
                paymentDate: today,
                paymentMethod: paymentMethod,
                amount: totalAmount, // Make sure to include the amount
                status: "Completed", // Add status field
                customerOrder: {
                    orderId: parseInt(orderId)
                },
            };

            console.log("Payment data being sent:", paymentData);

            // Create payment - FIXED: Using correct endpoint from your API
            const createdPayment = await createPayment(paymentData);
            console.log("Payment created successfully:", createdPayment);

            // Clear cart and local storage after successful payment
            clearCart();
            localStorage.removeItem("orderId");
            localStorage.removeItem("orderTotal");

            alert(`Payment of R${totalAmount.toFixed(2)} successful with ${paymentMethod}!`);
            navigate("/order-confirmation", {
                state: {
                    orderId: orderId,
                    paymentMethod: paymentMethod,
                    amount: totalAmount
                }
            });

        } catch (err) {
            console.error("Payment processing failed:", err);
            console.error("Error details:", err.response?.data || err.message);

            let errorMessage = "Payment failed. Please try again.";

            if (err.response?.status === 404) {
                errorMessage = "Order not found. Please restart checkout from your cart.";
            } else if (err.response?.status === 400) {
                errorMessage = "Invalid payment data. Please check your order details.";
            }

            alert(errorMessage);
        } finally {
            setIsProcessing(false);
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
                                        <span className="payment-summary-price">R {parseFloat(item.price).toFixed(2)}</span>
                                    </li>
                                ))}
                            </ul>
                            <div className="payment-summary-total">
                                <strong>Total: R {totalAmount.toFixed(2)}</strong>
                            </div>
                        </>
                    ) : (
                        <div style={{ textAlign: "center", padding: "1rem" }}>
                            <p>Processing your order...</p>
                            <p><strong>Order ID:</strong> {localStorage.getItem("orderId")}</p>
                            <p><strong>Amount to pay:</strong> R {totalAmount.toFixed(2)}</p>
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
                                disabled={isProcessing}
                            >
                                <option value="Cash on Delivery">Cash on Delivery</option>
                            </select>
                        </div>

                        {/* Cash on Delivery Info */}
                        {paymentMethod === "Cash on Delivery" && (
                            <div className="cod-info">
                                <p><strong>You will pay R {totalAmount.toFixed(2)} to the driver upon delivery.</strong></p>
                                <p>Please have the exact amount ready for the delivery driver.</p>
                            </div>
                        )}

                        <button
                            className="payment-confirm-btn"
                            type="submit"
                            disabled={isProcessing || !paymentMethod}
                        >
                            {isProcessing ? "Processing Payment..." : `Confirm Cash on Delivery Order`}
                        </button>
                    </form>
                </section>
            </div>
        </div>
    );
}