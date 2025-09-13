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

    // Handle checkout: create order, store orderId, then navigate to payment
    const handleCheckout = async () => {
        try {
            // Get customer from localStorage
            const customer = JSON.parse(localStorage.getItem("customer"));
            if (!customer || !customer.customerId) {
                alert("No customer found. Please log in first.");
                return;
            }
            // 1. Create the shipment first
            const shipmentData = {
                shipmentMethod: "Standard",
                status: "Pending",
                trackingNumber: "N/A"
            };
            const shipmentRes = await api.post("/shipment/create", shipmentData);
            const shipment = shipmentRes.data;

            // 2. Prepare order data with persisted shipment
            const orderData = {
                orderDate: new Date().toISOString().slice(0,10),
                totalAmount: cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
                orderLines: null,
                customer: { customerId: customer.customerId },
                shipment: shipment
            };
            console.log("Order payload:", orderData);
            // 3. Create the order
            const order = await createOrder(orderData);
            // 4. Create order lines for each cart item
            await Promise.all(cartItems.map(item => {
                const orderLineData = {
                    quantity: item.quantity,
                    unitPrice: item.price,
                    subTotal: item.price * item.quantity,
                    order: { orderId: order.orderId },
                    product: { productId: item.id }
                };
                return api.post("/api/orderline/create", orderLineData);
            }));
            localStorage.setItem("orderId", order.orderId); // Save for payment page
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