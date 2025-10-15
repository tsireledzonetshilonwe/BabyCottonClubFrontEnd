import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Loader2 } from 'lucide-react';
import api, { fetchAllReviews, createReview } from "../api/api";
import { getStoredCustomer } from "../utils/customer";
import { Button } from '../components/ui/button';
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
  const [reviews, setReviews] = useState([]);
  const [reviewInputs, setReviewInputs] = useState({});
  const [submitting, setSubmitting] = useState({});
  
  
  
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

  // Normalize order-line id across different backend shapes
  const getLineId = (line) => {
    if (!line) return undefined;
    return line.orderLineId ?? line.id ?? line.orderlineId ?? line.order_line_id ?? undefined;
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

  // load reviews for display and checking
  useEffect(() => {
    const loadReviews = async () => {
      try {
        const res = await fetchAllReviews();
        setReviews(res || []);
      } catch (err) {
        console.warn('Failed to load reviews', err);
        setReviews([]);
      }
    };
    loadReviews();
  }, []);

  const handleReviewInput = (orderLineId, field, value) => {
    setReviewInputs(prev => ({ ...prev, [orderLineId]: { ...(prev[orderLineId]||{}), [field]: value } }));
  };

  const handleReviewSubmit = async (orderLine, product) => {
  // support multiple id shapes safely
  const lineIdKey = getLineId(orderLine);
    const vals = reviewInputs[lineIdKey] || {};
    const rating = Number(vals.rating);
    const comment = (vals.comment || '').trim();
    if (!rating || !comment) {
      alert('Please provide rating and comment');
      return;
    }
    setSubmitting(prev => ({ ...prev, [lineIdKey]: true }));
    try {
      const customer = getStoredCustomer();

      // Derive productId robustly from several possible shapes
      const derivedProductId = getLineProductId(orderLine) || product?.productId || product?.id || product?.productId;

      // Derive orderLineId defensively
      const derivedOrderLineId = orderLine?.orderLineId ?? orderLine?.id ?? orderLine?.orderlineId ?? null;

      // Try to include orderId if present (some backends expect it)
      const derivedOrderId = orderLine?.orderId ?? orderLine?.order?.orderId ?? null;

      // Ensure rating is an integer between 1 and 5
      const safeRating = Math.max(1, Math.min(5, Math.round(Number(rating) || 0)));

      // Construct payload to match backend Review entity fields exactly
      const payload = {
        rating: safeRating,
        // backend Review uses 'reviewComment' field (JsonAlias accepts comment/text/content too)
        reviewComment: comment,
        // nested product and customer objects expected by controller mapping
        ...(derivedProductId != null ? { product: { productId: Number(derivedProductId) } } : {}),
        ...(customer?.customerId != null ? { customer: { customerId: Number(customer.customerId) } } : {}),
      };

      // remove undefined/null to avoid backend NPE on unexpected fields
      const filteredPayload = Object.fromEntries(Object.entries(payload).filter(([, v]) => v !== undefined && v !== null && v !== ""));

      console.debug('Submitting review payload', filteredPayload);

      const created = await createReview(filteredPayload);
      console.debug('Review created (server response):', created);
      // surface quick debug info to user so they can see what the server actually persisted
      try {
        const createdComment = created?.comment ?? created?.text ?? created?.content ?? '(missing)';
        const createdCustomer = created?.customer ? (created.customer.firstName || created.customer.name || created.customer.email || JSON.stringify(created.customer)) : (created?.customerId ?? '(missing)');
        alert(`Review created. comment: ${createdComment}\ncustomer: ${createdCustomer}`);
      } catch (e) {
        // ignore any alert errors
      }
      // refresh reviews
      const refreshed = await fetchAllReviews();
      setReviews(refreshed || []);
      setReviewInputs(prev => ({ ...prev, [lineIdKey]: { rating: '', comment: '' } }));
      // Notify other parts of the app (product list/details) that a new review was created
      try {
        window.dispatchEvent(new CustomEvent('reviewCreated', { detail: { productId: derivedProductId } }));
      } catch (e) {
        // ignore if window not available in some test environments
      }
      alert('Review submitted');
    } catch (err) {
      console.error('Failed to submit review', {
        message: err?.message,
        status: err?.response?.status,
        data: err?.response?.data,
      });
      const status = err?.response?.status;
      const data = err?.response?.data;
      if (status === 500) {
        // Give actionable hint for server errors
        alert('Failed to submit review: Server error (500). Check backend logs for details.');
      } else if (data) {
        const msg = data?.message || data;
        alert(`Failed to submit review: ${JSON.stringify(msg)}`);
      } else {
        alert(`Failed to submit review: ${err?.message || 'Unknown error'}`);
      }
    } finally {
      setSubmitting(prev => ({ ...prev, [lineIdKey]: false }));
    }
  };

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

                    {/* Reviews: allow writing reviews for delivered orders */}
                    {String(order.status || '').toLowerCase() === 'delivered' && (
                      <div style={{ marginTop: 16 }}>
                        <h5 style={{ marginBottom: 8 }}>Write reviews for delivered items</h5>
                        {(order.orderLines || []).map((line) => {
                          const pid = getLineProductId(line);
                          const product = line.product || { productId: pid };
                          const orderLineId = getLineId(line);
                          const customer = getStoredCustomer();
                          const myReview = reviews.find(r => String(r.orderLineId ?? r.id ?? r.orderlineId ?? r.order_line_id) === String(orderLineId) && String(r.customerId ?? r.customer?.customerId) === String(customer?.customerId));
                          return (
                            <div key={orderLineId} style={{ padding: 8, borderBottom: '1px dashed #eee' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                  <strong>{getLineProductName(line)}</strong>
                                  <div style={{ fontSize: 13, color: '#666' }}>Qty: {line.quantity}</div>
                                </div>
                                <div style={{ minWidth: 240 }}>
                                  {myReview ? (
                                    <div>
                                      <div><strong>Your review:</strong></div>
                                      <div>Rating: {myReview.rating} / 5</div>
                                      <div>{myReview.comment}</div>
                                    </div>
                                  ) : (
                                    <form onSubmit={(e) => { e.preventDefault(); handleReviewSubmit(line, product); }} className="review-form">
                                      <select className="review-select" required value={reviewInputs[orderLineId]?.rating || ''} onChange={(e) => handleReviewInput(orderLineId, 'rating', e.target.value)}>
                                        <option value="">Rate</option>
                                        <option value="1">1</option>
                                        <option value="2">2</option>
                                        <option value="3">3</option>
                                        <option value="4">4</option>
                                        <option value="5">5</option>
                                      </select>
                                      <input className="review-input" required value={reviewInputs[orderLineId]?.comment || ''} onChange={(e) => handleReviewInput(orderLineId, 'comment', e.target.value)} placeholder="Write a short review" />
                                      <Button type="submit" size="sm" className="review-submit" disabled={submitting[orderLineId]}>
                                        {submitting[orderLineId] ? (
                                          <span className="flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Sending...</span>
                                        ) : 'Submit'}
                                      </Button>
                                    </form>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

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
