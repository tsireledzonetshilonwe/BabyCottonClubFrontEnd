
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "../App.css";

export default function Payment() {
    const { cartItems, clearCart } = useCart();
    const navigate = useNavigate();

    const [paymentMethod, setPaymentMethod] = useState("Credit Card");
    const [cardNumber, setCardNumber] = useState("");
    const [expiry, setExpiry] = useState("");
    const [cvv, setCvv] = useState("");

    const totalAmount = cartItems.reduce((sum, item) => {
        const price = parseFloat(item.price.replace("R ", "")) || 0;
        return sum + price * (item.quantity || 1);
    }, 0);

    const handlePayment = (e) => {
        e.preventDefault();
        alert(`Payment successful with ${paymentMethod}!`);
        clearCart();
        navigate("/");
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
                {/* Order Summary */}
                <section className="payment-summary">
                    <h2>Order Summary</h2>
                    <ul>
                        {cartItems.map((item) => (
                            <li key={item.id} className="payment-summary-item">
                                <span className="payment-summary-name">{item.name}</span>
                                <span className="payment-summary-qty">× {item.quantity}</span>
                                <span className="payment-summary-price">{item.price}</span>
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
                            >
                                <option>Credit Card</option>
                                <option>EFT</option>
                                <option>Cash on Delivery</option>
                            </select>
                        </div>

                        {paymentMethod === "Credit Card" && (
                            <div className="credit-card-fields">
                                <div className="input-group">
                                    <label>Card Number</label>
                                    <input
                                        type="text"
                                        placeholder="Card Number"
                                        value={cardNumber}
                                        onChange={(e) => setCardNumber(e.target.value)}
                                        required
                                    />
                                    <span className="card-icons">💳</span>
                                </div>
                                <div className="input-row">
                                    <div className="input-group">
                                        <label>Expiry</label>
                                        <input
                                            type="text"
                                            placeholder="MM/YY"
                                            value={expiry}
                                            onChange={(e) => setExpiry(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="input-group">
                                        <label>CVV</label>
                                        <input
                                            type="text"
                                            placeholder="CVV"
                                            value={cvv}
                                            onChange={(e) => setCvv(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {paymentMethod === "EFT" && (
                            <div className="eft-info">
                                <p>Please transfer to <strong>FNB Account: 1234567890</strong>, Ref: Your Order ID</p>
                            </div>
                        )}

                        {paymentMethod === "Cash on Delivery" && (
                            <div className="cod-info">
                                <p>You will pay the driver upon delivery.</p>
                            </div>
                        )}

                        <button className="payment-confirm-btn" type="submit">
                            Confirm Payment
                        </button>
                    </form>
                </section>
            </div>
        </div>
    );
}

