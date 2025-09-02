// Currency formatter for ZAR
const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    minimumFractionDigits: 2,
  }).format(amount);
import "./Orders.css";

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchOrdersByCustomer } from "../api/api";

function Orders({ user }) {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!user) return;
    const fetchOrders = async () => {
      try {
        const data = await fetchOrdersByCustomer(user.email);
        setOrders(data);
      } catch (err) {
        setOrders([]);
      }
    };
    fetchOrders();
  }, [user]);



  // If backend already filters by user, just use orders
  const userOrders = orders;

  return (
    <div className="orders-page">
      <h2 className="orders-title">My Orders</h2>
      {userOrders.length === 0 ? (
        <div className="orders-empty">You have no orders yet.</div>
      ) : (
        <div className="orders-list">
          {userOrders.map(order => (
            <div className="order-card" key={order.orderId}>
              <div className="order-card-header">
                <span className="order-id">Order #{order.orderId}</span>
                <span className="order-status">{order.status}</span>
              </div>
              <div className="order-card-body">
                <div><b>Date:</b> {order.orderDate}</div>
                <div><b>Total:</b> {formatCurrency(order.totalAmount)}</div>
                <Link to={`/orders/${order.orderId}`} className="order-details-link">View Details</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Orders;
