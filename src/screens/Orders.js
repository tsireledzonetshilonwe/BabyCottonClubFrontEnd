import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api";
import "./Orders.css";

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    minimumFractionDigits: 2,
  }).format(amount);

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("en-ZA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const statusColors = {
  Pending: { bg: "#fff3cd", color: "#856404", border: "#ffc107" },
  Processing: { bg: "#cce5ff", color: "#004085", border: "#007bff" },
  Shipped: { bg: "#d1ecf1", color: "#0c5460", border: "#17a2b8" },
  Delivered: { bg: "#d4edda", color: "#155724", border: "#28a745" },
  Completed: { bg: "#d4edda", color: "#155724", border: "#28a745" },
  Cancelled: { bg: "#f8d7da", color: "#721c24", border: "#dc3545" },
};

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const navigate = useNavigate();

  const fetchCustomerOrders = async (isManualRefresh = false) => {
    if (isManualRefresh) setRefreshing(true);

    try {
      // Get logged-in customer
      const customer = JSON.parse(localStorage.getItem("customer") || "{}");
      if (!customer.customerId) {
        setError("Please log in to view your orders.");
        setLoading(false);
        return;
      }

      // Try a dedicated endpoint that returns orders for a customer (preferred)
      try {
        const res = await api.get(`/api/order/customer/${customer.customerId}`);
        console.log("ORDERS FOR CUSTOMER from /api/order/customer ->", res.data);
        // Ensure we always store an array
        setOrders(Array.isArray(res.data) ? res.data : (res.data ? [res.data] : []));
      } catch (err) {
        // If dedicated endpoint not available (404) or fails, fallback to fetching all and filtering
        if (err.response && err.response.status === 404) {
          console.warn("/api/order/customer endpoint not found; falling back to /api/order/getall");
          const res2 = await api.get("/api/order/getall");
          console.log("RAW ORDERS FROM /api/order/getall ->", res2.data);
          const customerOrders = (res2.data || []).filter((order) => {
            const cid = customer.customerId;
            if (!cid) return false;
            if (order?.customer?.customerId === cid) return true;
            if (order?.customerId === cid) return true;
            if (order?.customer?.id === cid) return true;
            return false;
          });
          setOrders(customerOrders);
        } else {
          throw err; // rethrow other errors to be caught by outer catch
        }
      }
      setLoading(false);
      if (isManualRefresh) setRefreshing(false);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
      setError("Failed to load your orders. Please try again later.");
      setLoading(false);
      if (isManualRefresh) setRefreshing(false);
    }
  };

  const handleManualRefresh = () => {
    fetchCustomerOrders(true);
  };

  useEffect(() => {
    fetchCustomerOrders();

    const pollInterval = setInterval(() => {
      fetchCustomerOrders();
    }, 30000);

    const handleFocus = () => {
      fetchCustomerOrders();
    };
    window.addEventListener("focus", handleFocus);

    return () => {
      clearInterval(pollInterval);
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  return (
    <div className="orders-page-wrapper">
      <div className="orders-container">
        <div className="orders-header">
          <div>
            <h1 className="orders-title">My Orders</h1>
            <p className="orders-subtitle">Track and manage your orders</p>
          </div>
          <button
            className="refresh-button"
            onClick={handleManualRefresh}
            disabled={refreshing || loading}
            style={{
              padding: "10px 20px",
              backgroundColor: "#ff6b9d",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: refreshing || loading ? "not-allowed" : "pointer",
              fontSize: "14px",
              fontWeight: "500",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              opacity: refreshing || loading ? 0.7 : 1,
              transition: "all 0.2s ease",
            }}
          >
            {refreshing ? (
              <>
                <span
                  style={{ animation: "spin 1s linear infinite", display: "inline-block" }}
                >
                  🔄
                </span>
                Refreshing...
              </>
            ) : (
              <>🔄 Refresh</>
            )}
          </button>
        </div>

        {loading ? (
          <div className="orders-loading">
            <div className="loading-spinner"></div>
            <p>Loading your orders...</p>
          </div>
        ) : error ? (
          <div className="orders-error">
            <div className="error-icon">⚠️</div>
            <h3>Oops! Something went wrong</h3>
            <p>{error}</p>
            {error.includes("log in") && (
              <button className="btn-primary" onClick={() => navigate("/login")}>
                Go to Login
              </button>
            )}
          </div>
        ) : orders.length === 0 ? (
          <div className="orders-empty">
            <div className="empty-icon">📦</div>
            <h3>No orders yet</h3>
            <p>You haven't placed any orders yet. Start shopping to see your orders here!</p>
            <Link to="/products" className="btn-primary">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div className="order-card" key={order.orderId}>
                <div className="order-header">
                  <div className="order-info">
                    <h3 className="order-number">Order #{order.orderId}</h3>
                    <p className="order-date">Placed on {formatDate(order.orderDate)}</p>
                  </div>
                  <div className="order-status">
                    <span
                      className="status-badge"
                      style={{
                        backgroundColor: statusColors[order.status]?.bg || statusColors.Pending.bg,
                        color: statusColors[order.status]?.color || statusColors.Pending.color,
                        borderColor: statusColors[order.status]?.border || statusColors.Pending.border,
                      }}
                    >
                      {order.status || "Pending"}
                    </span>
                  </div>
                </div>

                <div className="order-summary">
                  <div className="order-total">
                    <span className="total-label">Total:</span>
                    <span className="total-amount">{formatCurrency(order.totalAmount)}</span>
                  </div>

                  {order.orderLines && order.orderLines.length > 0 && (
                    <div className="order-items-preview">
                      <span className="items-count">
                        {order.orderLines.length} item{order.orderLines.length !== 1 ? "s" : ""}
                      </span>
                    </div>
                  )}
                </div>

                <div className="order-actions">
                  <button
                    className="btn-secondary"
                    onClick={() =>
                      setExpandedOrderId(expandedOrderId === order.orderId ? null : order.orderId)
                    }
                  >
                    {expandedOrderId === order.orderId ? "Hide Details" : "View Details"}
                  </button>

                  {(order.status === "Shipped" || order.status === "Processing") && (
                    <button className="btn-outline">Track Order</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Orders;
