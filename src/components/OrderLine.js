import React from "react";

// Props: orderLine { id, productName, quantity, price, subtotal }
function OrderLine({ orderLine }) {
    if (!orderLine) return null;
    return (
        <div className="orderline-row">
            <span className="orderline-product">{orderLine.productName}</span>
            <span className="orderline-qty">Qty: {orderLine.quantity}</span>
            <span className="orderline-price">Price: R {orderLine.price}</span>
            <span className="orderline-subtotal">Subtotal: R {orderLine.subtotal}</span>
        </div>
    );
}

export default OrderLine;
