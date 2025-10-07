import React from "react";

// Props: order { id, customerName, date, total, status }
function Order({ order }) {
    if (!order) return null;
    return (
        <div className="order-card">
            <div className="order-header">
                <span className="order-id">Order #{order.id}</span>
                <span className={`order-status status-${order.status.toLowerCase()}`}>{order.status}</span>
            </div>
            <div className="order-details">
                <div><strong>Customer:</strong> {order.customerName}</div>
                <div><strong>Date:</strong> {order.date}</div>
                <div><strong>Total:</strong> R {order.total}</div>
            </div>
        </div>
    );
}

export default Order;
