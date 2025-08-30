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
        <div style={{ maxWidth: "800px", margin: "2rem auto" }}>
            <h2>Payment</h2>

            {/* Order Summary */}
            <div style={{ marginBottom: "1.5rem" }}>
                <h3>Order Summary</h3>
                <ul>
                    {cartItems.map((item) => (
                        <li key={item.id}>
                            {item.name} – {item.quantity} × {item.price}
                        </li>
                    ))}
                </ul>
                <h3>Total: R {totalAmount.toFixed(2)}</h3>
            </div>

            {/* Payment Form */}
            <form onSubmit={handlePayment}>
                <label>
                    Payment Method:
                    <select
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                    >
                        <option>Credit Card</option>
                        <option>EFT</option>
                        <option>Cash on Delivery</option>
                    </select>
                </label>

                {paymentMethod === "Credit Card" && (
                    <div style={{ marginTop: "1rem" }}>
                        <input
                            type="text"
                            placeholder="Card Number"
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value)}
                            required
                        />
                        <input
                            type="text"
                            placeholder="Expiry Date (MM/YY)"
                            value={expiry}
                            onChange={(e) => setExpiry(e.target.value)}
                            required
                        />
                        <input
                            type="text"
                            placeholder="CVV"
                            value={cvv}
                            onChange={(e) => setCvv(e.target.value)}
                            required
                        />
                    </div>
                )}

                {paymentMethod === "EFT" && (
                    <p style={{ marginTop: "1rem" }}>
                        Please transfer to FNB Account: 1234567890, Ref: Your Order ID
                    </p>
                )}

                {paymentMethod === "Cash on Delivery" && (
                    <p style={{ marginTop: "1rem" }}>
                        You will pay the driver upon delivery.
                    </p>
                )}

                <button type="submit" style={{ marginTop: "1.5rem", padding: "10px 20px" }}>
                    Confirm Payment
                </button>
            </form>
        </div>
    );
}

