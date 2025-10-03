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
  Cancelled: { bg: "#f8d7da", color: "#721c24", border: "#dc3545" }
};

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const navigate = useNavigate();

  // Extract fetchCustomerOrders function so it can be reused
  const fetchCustomerOrders = async (isManualRefresh = false) => {
    if (isManualRefresh) {
      setRefreshing(true);
    }
    
    try {
      // Get the logged-in customer
      const customer = JSON.parse(localStorage.getItem("customer") || "{}");
      
      console.log("Customer from localStorage:", customer); // Debug log
      
      if (!customer.customerId && !customer.email) {
        setError("Please log in to view your orders.");
        setLoading(false);
        return;
      }

      // Skip the API endpoints that don't work and go straight to fallback
      console.log("Using fallback approach - getting all orders and filtering...");

      // Approach: Get all orders and filter by customer ID or email
      const res = await api.get("/api/order/getall");
      console.log("All orders fetched for filtering:", res.data);
      
      const customerOrders = res.data.filter(order => {
        const matchesId = customer.customerId && order.customer?.customerId === customer.customerId;
        const matchesEmail = customer.email && order.customer?.email === customer.email;
        return matchesId || matchesEmail;
      });
      
      console.log("Filtered customer orders:", customerOrders);
      setOrders(customerOrders);
      setLoading(false);
      if (isManualRefresh) setRefreshing(false);

    } catch (fallbackErr) {
      console.error("All order fetching approaches failed:", fallbackErr);
      setError("Failed to load your orders. Please try again later.");
      setLoading(false);
      if (isManualRefresh) setRefreshing(false);
    }
  };

  const handleManualRefresh = () => {
    fetchCustomerOrders(true);
  };

  useEffect(() => {
    // Initial load
    fetchCustomerOrders();

    // Set up polling to check for order updates every 30 seconds
    const pollInterval = setInterval(() => {
      console.log("Polling for order updates...");
      fetchCustomerOrders();
    }, 30000); // 30 seconds

    // Set up focus listener to refresh when user returns to tab
    const handleFocus = () => {
      console.log("Tab focused, refreshing orders...");
      fetchCustomerOrders();
    };
    
    window.addEventListener('focus', handleFocus);

    // Cleanup function
    return () => {
      clearInterval(pollInterval);
      window.removeEventListener('focus', handleFocus);
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
              padding: '10px 20px',
              backgroundColor: '#ff6b9d',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: refreshing || loading ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              opacity: refreshing || loading ? 0.7 : 1,
              transition: 'all 0.2s ease'
            }}
          >
            {refreshing ? (
              <>
                <span style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }}>🔄</span>
                Refreshing...
              </>
            ) : (
              <>
                🔄 Refresh
              </>
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
              <button 
                className="btn-primary" 
                onClick={() => navigate("/login")}
              >
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
            {orders.map(order => (
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
                        borderColor: statusColors[order.status]?.border || statusColors.Pending.border
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
                        {order.orderLines.length} item{order.orderLines.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                  )}
                </div>

                <div className="order-actions">
                  <button
                    className="btn-secondary"
                    onClick={() => setExpandedOrderId(expandedOrderId === order.orderId ? null : order.orderId)}
                  >
                    {expandedOrderId === order.orderId ? "Hide Details" : "View Details"}
                  </button>
                  
                  {(order.status === "Shipped" || order.status === "Processing") && (
                    <button className="btn-outline">
                      Track Order
                    </button>
                  )}
                </div>

                {expandedOrderId === order.orderId && (
                  <div className="order-details">
                    <div className="details-grid">
                      <div className="detail-item">
                        <span className="detail-label">Order ID:</span>
                        <span className="detail-value">{order.orderId}</span>
                      </div>
                      
                      <div className="detail-item">
                        <span className="detail-label">Date:</span>
                        <span className="detail-value">{formatDate(order.orderDate)}</span>
                      </div>
                      
                      <div className="detail-item">
                        <span className="detail-label">Status:</span>
                        <span 
                          className="detail-value status-text"
                          style={{ color: statusColors[order.status]?.color || statusColors.Pending.color }}
                        >
                          {order.status || "Pending"}
                        </span>
                      </div>
                      
                      <div className="detail-item">
                        <span className="detail-label">Total:</span>
                        <span className="detail-value total-text">{formatCurrency(order.totalAmount)}</span>
                      </div>

                      {order.shipment && (
                        <>
                          <div className="detail-item">
                            <span className="detail-label">Shipping Method:</span>
                            <span className="detail-value">{order.shipment.shipmentMethod || "Standard"}</span>
                          </div>
                          
                          <div className="detail-item">
                            <span className="detail-label">Tracking Number:</span>
                            <span className="detail-value">{order.shipment.trackingNumber || "Not available"}</span>
                          </div>
                        </>
                      )}
                    </div>

                    {order.orderLines && order.orderLines.length > 0 && (
                      <div className="order-items">
                        <h4 className="items-title">Order Items</h4>
                        <div className="items-list">
                          {order.orderLines.map(line => (
                            <div key={line.orderLineId} className="item-row">
                              <div className="item-info">
                                <h5 className="item-name">{line.product?.name || line.product?.productName || "Product"}</h5>
                                {line.product?.sku && (
                                  <p className="item-sku">SKU: {line.product.sku}</p>
                                )}
                              </div>
                              <div className="item-details">
                                <span className="item-quantity">Qty: {line.quantity}</span>
                                <span className="item-price">{formatCurrency(line.unitPrice)}</span>
                                <span className="item-subtotal">{formatCurrency(line.subTotal)}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Orders;


