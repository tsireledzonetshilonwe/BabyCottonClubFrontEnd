import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api";
import { getStoredCustomer } from "../utils/customer";
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
  const [search, setSearch] = useState("");
  
  
  
  const navigate = useNavigate();

  const fetchCustomerOrders = async (isManualRefresh = false) => {
    if (isManualRefresh) setRefreshing(true);

    try {
      // Get logged-in customer (normalized)
      const customer = getStoredCustomer();
      if (!customer || !customer.customerId) {
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

  // Helpers to normalize different backend shapes
  const getLineProductId = (line) => {
    if (!line) return undefined;
    if (typeof line.productId === "number") return line.productId;
    if (line.product && typeof line.product === "object") {
      return line.product.productId ?? line.product.id ?? line.productId;
    }
    if (typeof line.product === "number") return line.product;
    return line.productId ?? undefined;
  };

  const getLineProductName = (line) => {
    if (!line) return "";
    if (line.product && typeof line.product === "object") {
      return line.product.name || line.product.productName || line.product.title || "";
    }
    return line.productName || line.name || "";
  };

  const handleManualRefresh = () => {
    fetchCustomerOrders(true);
  };

  // copy order id feedback
  
  

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

  // derive filtered/paged list (no status or sort filtering; show all orders)
  const processedOrders = React.useMemo(() => {
    let arr = Array.isArray(orders) ? [...orders] : [];
    // optional search across order id, product names, email
    const q = String(search || "").trim().toLowerCase();
    if (q) {
      arr = arr.filter(o => {
        if (String(o.orderId || '').toLowerCase().includes(q)) return true;
        if (String(o.totalAmount || o.total || '').toLowerCase().includes(q)) return true;
        const cust = o.customer || {};
        if (String(cust.email || cust.name || cust.firstName || '').toLowerCase().includes(q)) return true;
        const names = (o.orderLines || []).map(getLineProductName).join(' ').toLowerCase();
        if (names.includes(q)) return true;
        return false;
      });
    }
    return arr;
  }, [orders, search]);

  // show all orders (no pagination)

  return (
    <div className="orders-page-wrapper">
      <div className="orders-container">
        <div className="orders-header">
          <div>
            <h1 className="orders-title">My Orders</h1>
            <p className="orders-subtitle">Track and manage your orders</p>
          </div>
          <div className="orders-controls">
            <input className="search-input" placeholder="Search orders or products..." value={search} onChange={e => setSearch(e.target.value)} />
            <button className={`refresh-button ${refreshing || loading ? 'is-loading' : ''}`} onClick={handleManualRefresh} disabled={refreshing || loading} aria-busy={refreshing || loading} aria-label="Refresh orders">
              {refreshing ? (<><span className="refresh-spinner" aria-hidden="true"></span><span>Refreshing...</span></>) : (<><span className="refresh-emoji" aria-hidden="true">🔄</span><span>Refresh</span></>)}
            </button>
          </div>
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
            {processedOrders.map((order) => (
              <div className="order-card" key={order.orderId}>
                <div className="order-header">
                  <div className="order-info">
                    <h3 className="order-number">Order #{order.orderId}</h3>
                    <p className="order-date">Placed on {formatDate(order.orderDate)}</p>
                  </div>
                  <div className="order-right">
                    <div className="order-status">
                      <span className={`status-badge status-${String(order.status||'Pending').toLowerCase()}`.replace(/\s/g,'-')}>{order.status || 'Pending'}</span>
                    </div>
                    <div className="order-actions">
                      <button className="btn-secondary" onClick={() => setExpandedOrderId(expandedOrderId === order.orderId ? null : order.orderId)}>{expandedOrderId === order.orderId ? 'Hide Details' : 'View Details'}</button>
                      {(order.status === 'Shipped' || order.status === 'Processing') && (<button className="btn-outline">Track Order</button>)}
                    </div>
                  </div>
                </div>

                <div className="order-summary">
                  <div className="order-total">
                    <span className="total-label">Total:</span>
                    <span className="total-amount">{formatCurrency(order.totalAmount)}</span>
                  </div>

                  {order.orderLines && order.orderLines.length > 0 && (
                    <div className="order-items-preview">
                      <span className="items-count">{order.orderLines.length} item{order.orderLines.length !== 1 ? "s" : ""}</span>
                    </div>
                  )}
                </div>
                {expandedOrderId === order.orderId && (
                  <div className="order-details" style={{ marginTop: 12 }}>
                    <h4 style={{ marginBottom: 8 }}>Order details</h4>

                    <div style={{ overflowX: "auto" }}>
                      <table className="order-lines-table" style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                          <tr>
                            <th style={{ textAlign: "left", padding: 8, borderBottom: "1px solid #eee" }}>Product</th>
                            <th style={{ textAlign: "right", padding: 8, borderBottom: "1px solid #eee" }}>Qty</th>
                            <th style={{ textAlign: "right", padding: 8, borderBottom: "1px solid #eee" }}>Unit</th>
                            <th style={{ textAlign: "right", padding: 8, borderBottom: "1px solid #eee" }}>Subtotal</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(order.orderLines || []).map((line, idx) => {
                            const pid = getLineProductId(line);
                            const pname = getLineProductName(line) || `Product #${pid ?? "?"}`;
                            const qty = line.quantity ?? line.qty ?? 0;
                            const unit = (line.unitPrice ?? line.price ?? 0).toFixed ? Number(line.unitPrice ?? line.price ?? 0).toFixed(2) : String(line.unitPrice ?? line.price ?? 0);
                            const subtotal = (line.subTotal ?? line.subtotal ?? (qty * (line.unitPrice ?? line.price ?? 0)) ).toFixed ? Number(line.subTotal ?? line.subtotal ?? qty * (line.unitPrice ?? line.price ?? 0)).toFixed(2) : String(line.subTotal ?? line.subtotal ?? 0);
                            return (
                              <tr key={idx}>
                                <td style={{ padding: 8, borderBottom: "1px solid #f4f4f4" }}>{pname} {pid ? <span style={{ color: '#666' }}>#{pid}</span> : null}</td>
                                <td style={{ padding: 8, textAlign: 'right', borderBottom: "1px solid #f4f4f4" }}>{qty}</td>
                                <td style={{ padding: 8, textAlign: 'right', borderBottom: "1px solid #f4f4f4" }}>R{unit}</td>
                                <td style={{ padding: 8, textAlign: 'right', borderBottom: "1px solid #f4f4f4" }}>R{subtotal}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>

                    {/* Shipping / address */}
                    {(order.shippingAddress || order.address || order.customerAddress) && (
                      <div style={{ marginTop: 12 }}>
                        <h5 style={{ marginBottom: 6 }}>Shipping address</h5>
                        <div style={{ color: '#444' }}>
                          {order.shippingAddress?.line1 || order.address?.line1 || order.customerAddress || order.shippingAddress || order.address}
                        </div>
                      </div>
                    )}

                    {/* Payment / totals */}
                    <div style={{ marginTop: 12, display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ color: '#666' }}>Subtotal</div>
                        <div style={{ fontWeight: 600 }}>R{(order.subtotal ?? order.totalAmount ?? order.total ?? 0).toFixed ? Number(order.subtotal ?? order.totalAmount ?? order.total ?? 0).toFixed(2) : String(order.subtotal ?? order.totalAmount ?? order.total ?? 0)}</div>
                      </div>
                    </div>
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
