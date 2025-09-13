import React, { useEffect, useState } from "react";
import api from "../api/api";
import { Link } from "react-router-dom";
import "./Orders.css";

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    minimumFractionDigits: 2,
  }).format(amount);

const statusColors = {
  Pending: "#fbc02d",
  Completed: "#388e3c",
  Cancelled: "#d32f2f",
  Processing: "#1976d2",
  Shipped: "#0288d1"
};

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  useEffect(() => {
    api.get("/api/order/getall")
      .then(res => {
        setOrders(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load orders.");
        setLoading(false);
      });
  }, []);

  return (
    <div className="orders-page" style={{ maxWidth: 900, margin: "0 auto", padding: "2rem 1rem" }}>
      <h1 style={{ textAlign: "center", color: "#d32f2f", marginBottom: "2rem" }}>Your Orders</h1>
      {loading ? (
        <div className="orders-loading" style={{ textAlign: "center", color: "#1976d2" }}>Loading orders...</div>
      ) : error ? (
        <div className="orders-error" style={{ textAlign: "center", color: "#d32f2f" }}>{error}</div>
      ) : orders.length === 0 ? (
        <div className="orders-empty" style={{ textAlign: "center", color: "#757575" }}>No orders found.</div>
      ) : (
        <div className="orders-list" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "2rem" }}>
          {orders.map(order => (
            <div className="order-card" key={order.orderId} style={{ background: "#fff", borderRadius: 16, boxShadow: "0 4px 24px rgba(211,47,47,0.08)", border: "2px solid #ffeaea", padding: "2rem 1.5rem", position: "relative" }}>
              <div style={{ position: "absolute", top: 20, right: 20 }}>
                <span style={{
                  background: statusColors[order.status] || "#e0e0e0",
                  color: "#fff",
                  borderRadius: 12,
                  padding: "0.4rem 1rem",
                  fontWeight: 600,
                  fontSize: "1rem"
                }}>{order.status || "Pending"}</span>
              </div>
              <div style={{ fontSize: "1.2rem", fontWeight: 700, color: "#d32f2f", marginBottom: "0.5rem" }}>Order #{order.orderId}</div>
              <div style={{ color: "#757575", marginBottom: "0.5rem" }}><b>Date:</b> {order.orderDate}</div>
              <div style={{ color: "#757575", marginBottom: "0.5rem" }}><b>Total:</b> {formatCurrency(order.totalAmount)}</div>
              <div style={{ display: "flex", gap: "1rem", marginTop: "1.5rem" }}>
                <button
                  style={{ background: "#d32f2f", color: "#fff", borderRadius: 8, padding: "0.7rem 1.2rem", fontWeight: 600, border: "none", cursor: "pointer" }}
                  onClick={() => setExpandedOrderId(expandedOrderId === order.orderId ? null : order.orderId)}
                >
                  {expandedOrderId === order.orderId ? "Hide Details" : "View Details"}
                </button>
              </div>
              {expandedOrderId === order.orderId && (
                <div style={{ marginTop: "2rem", background: "#f9f9f9", borderRadius: 12, padding: "1.5rem", boxShadow: "0 2px 8px rgba(211,47,47,0.04)" }}>
                  <div style={{ marginBottom: "1rem" }}><b>Status:</b> <span style={{ color: statusColors[order.status] || "#757575" }}>{order.status || "Pending"}</span></div>
                  <div style={{ marginBottom: "1rem" }}><b>Order ID:</b> {order.orderId}</div>
                  <div style={{ marginBottom: "1rem" }}><b>Date:</b> {order.orderDate}</div>
                  <div style={{ marginBottom: "1rem" }}><b>Total Amount:</b> {formatCurrency(order.totalAmount)}</div>
                  <div style={{ marginBottom: "1rem" }}><b>Customer:</b> {order.customer?.name || order.customer?.firstName || order.customer?.email || order.customer?.customerId || "-"}</div>
                  <div style={{ marginBottom: "1rem" }}><b>Shipment:</b> {order.shipment?.shipmentMethod || "-"} ({order.shipment?.status || "-"})</div>
                  <h4 style={{ marginTop: "1.5rem", marginBottom: "0.5rem" }}>Order Lines</h4>
                  {order.orderLines && order.orderLines.length > 0 ? (
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                      <thead>
                        <tr style={{ background: "#ffeaea" }}>
                          <th style={{ padding: "0.5rem", textAlign: "left" }}>Product</th>
                          <th style={{ padding: "0.5rem", textAlign: "left" }}>SKU</th>
                          <th style={{ padding: "0.5rem", textAlign: "left" }}>Quantity</th>
                          <th style={{ padding: "0.5rem", textAlign: "left" }}>Price</th>
                          <th style={{ padding: "0.5rem", textAlign: "left" }}>Subtotal</th>
                        </tr>
                      </thead>
                      <tbody>
                        {order.orderLines.map(line => (
                          <tr key={line.orderLineId}>
                            <td>{line.product?.name || "-"}</td>
                            <td>{line.product?.sku || "-"}</td>
                            <td>{line.quantity}</td>
                            <td>{formatCurrency(line.unitPrice)}</td>
                            <td>{formatCurrency(line.subTotal)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div style={{ color: "#757575" }}>No items in this order.</div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Orders;


