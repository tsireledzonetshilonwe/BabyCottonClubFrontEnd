
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchOrderDetails } from "../api/api";

import "./OrderDetails.css";


const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    minimumFractionDigits: 2,
  }).format(amount);


function OrderDetails({ user }) {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await fetchOrderDetails(orderId);
        setOrder(data);
      } catch (err) {
        setError("Order not found or failed to load.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);




  if (loading) return <div className="orders-empty">Loading order...</div>;
  if (error || !order) return <div className="orders-empty">{error || "Order not found."}</div>;
  if (order.customer?.email && order.customer.email !== user.email) {
    return <div className="orders-empty">You are not authorized to view this order.</div>;
  }

  return (
    <div className="order-details-page">
      <h2 className="orders-title">Order Details</h2>

      <div className="order-details-card">
        <div><b>Order ID:</b> {order.orderId}</div>
        <div><b>Date:</b> {order.orderDate}</div>
        <div><b>Status:</b> <span className="order-status">{order.status}</span></div>
        <div><b>Total Amount:</b> {formatCurrency(order.totalAmount)}</div>
      </div>

      <h3 style={{ marginTop: "2rem" }}>Order Items</h3>

      {order.orderLines.length === 0 ? (
        <div className="orders-empty">No items in this order.</div>
      ) : (
        <table className="order-details-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>SKU</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {order.orderLines.map(line => (
              <tr key={line.orderLineId}>
                <td>
                  <Link to={`/orderline/${line.orderLineId}`}>
                    {line.product?.name || "-"}
                  </Link>
                </td>
                <td>{line.product?.sku || "-"}</td>
                <td>{line.quantity}</td>
                <td>{formatCurrency(line.unitPrice)}</td>
                <td>{formatCurrency(line.subTotal)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default OrderDetails;
