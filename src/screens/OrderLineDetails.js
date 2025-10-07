import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchOrderLineDetails } from "../api/api";

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    minimumFractionDigits: 2,
  }).format(amount);

function OrderLineDetails() {
  const { orderLineId } = useParams();
  const [orderLine, setOrderLine] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderLine = async () => {
      try {
        const data = await fetchOrderLineDetails(orderLineId);
        setOrderLine(data);
      } catch (err) {
        setError("Order line not found or failed to load.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrderLine();
  }, [orderLineId]);

  if (loading) return <div className="orders-empty">Loading order line...</div>;
  if (error || !orderLine) return <div className="orders-empty">{error || "Order line not found."}</div>;

  return (
    <div className="order-details-page">
      <h2 className="orders-title">Order Line Details</h2>
      <div className="order-details-card">
        <div><b>Order Line ID:</b> {orderLine.orderLineId}</div>
        <div><b>Product:</b> {orderLine.product?.name || "-"}</div>
        <div><b>SKU:</b> {orderLine.product?.sku || "-"}</div>
        <div><b>Quantity:</b> {orderLine.quantity}</div>
        <div><b>Unit Price:</b> {formatCurrency(orderLine.unitPrice)}</div>
        <div><b>Subtotal:</b> {formatCurrency(orderLine.subTotal)}</div>
        {orderLine.discount && (
          <div><b>Discount:</b> {orderLine.discount.description} ({orderLine.discount.amount})</div>
        )}
        <div style={{ marginTop: "1rem" }}>
          <Link to={"/orders/" + (orderLine.order?.orderId || orderLine.customerOrder?.orderId)}>Back to Order</Link>
        </div>
      </div>
    </div>
  );
}

export default OrderLineDetails;
