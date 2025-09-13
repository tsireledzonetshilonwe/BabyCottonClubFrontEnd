import React from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { createOrder } from "../api/api";
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

    if (cartItems.length === 0) {
        return <h2 style={{ textAlign: "center", marginTop: "2rem" }}>Your cart is empty</h2>;
    }

    // Handle checkout: create order, store orderId, then navigate to payment
    const handleCheckout = async () => {
        try {
            // Get customer from localStorage
            const customer = JSON.parse(localStorage.getItem("customer"));
            if (!customer || !customer.customerId) {
                alert("No customer found. Please log in first.");
                return;
            }
            // Prepare order data as required by backend
            const orderData = {
                customer: { customerId: customer.customerId },
                orderLines: cartItems.map(item => {
                    const unitPrice = parseFloat(item.price);
                    const quantity = item.quantity;
                    return {
                        quantity,
                        unitPrice,
                        subTotal: unitPrice * quantity,
                        product: { productId: item.id }
                    };
                })
            };
            const order = await createOrder(orderData);
            localStorage.setItem("orderId", order.orderId);
            navigate("/payment");
        } catch (err) {
            alert("Failed to create order. Please try again.");
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
                        Proceed to Payment
                    </button>
                </div>
            </div>
        </div>
    );
}