import React from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { createOrder } from "../api/api";
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

    // Handle checkout: just navigate to payment
    const handleCheckout = () => {
        navigate("/payment");
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
                        Proceed to Payment
                    </button>
                </div>
            </div>
        </div>
    );
}