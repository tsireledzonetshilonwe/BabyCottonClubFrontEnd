
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
    Ready: { bg: "#d1ecf1", color: "#0c5460", border: "#17a2b8" },
    Collected: { bg: "#d4edda", color: "#155724", border: "#28a745" },
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

    // Helper to determine if order is cafeteria/food order
    const isCafeteriaOrder = (order) => {
        return order.orderType === 'cafeteria' ||
            order.orderType === 'Cafeteria' ||
            (order.orderLines && order.orderLines.some(line =>
                line.product?.category?.toLowerCase().includes('food') ||
                line.product?.category?.toLowerCase().includes('beverage') ||
                line.product?.category?.toLowerCase().includes('cafe') ||
                line.productName?.toLowerCase().includes('coffee') ||
                line.productName?.toLowerCase().includes('juice') ||
                line.productName?.toLowerCase().includes('sandwich') ||
                line.productName?.toLowerCase().includes('burger')
            ));
    };

    // Helper to get appropriate tracking steps based on order type
    const getTrackingStepLabels = (order) => {
        const cafeteriaOrder = isCafeteriaOrder(order);

        if (cafeteriaOrder) {
            return {
                step1: 'Order Placed',
                step2: 'Preparing',
                step3: 'Ready',
                step4: 'Collected'
            };
        } else {
            return {
                step1: 'Order Placed',
                step2: 'Processing',
                step3: 'Shipped',
                step4: 'Delivered'
            };
        }
    };

    // Improved helper to get step completion based on current status
    const getStepCompletion = (orderStatus, stepLabels) => {
        const status = (orderStatus || 'Pending').toLowerCase();
        const isCafeteria = stepLabels.step4 === 'Collected';

        if (isCafeteria) {
            // Cafeteria order flow: Pending → Processing → Ready → Collected
            switch (status) {
                case 'collected':
                    return { step1: true, step2: true, step3: true, step4: true };
                case 'ready':
                    return { step1: true, step2: true, step3: true, step4: false };
                case 'processing':
                    return { step1: true, step2: true, step3: false, step4: false };
                case 'pending':
                default:
                    return { step1: true, step2: false, step3: false, step4: false };
            }
        } else {
            // Regular order flow: Pending → Processing → Shipped → Delivered/Completed
            switch (status) {
                case 'completed':
                case 'delivered':
                    return { step1: true, step2: true, step3: true, step4: true };
                case 'shipped':
                    return { step1: true, step2: true, step3: true, step4: false };
                case 'processing':
                    return { step1: true, step2: true, step3: false, step4: false };
                case 'pending':
                default:
                    return { step1: true, step2: false, step3: false, step4: false };
            }
        }
    };

    // Helper to get payment method - default to Cash on Delivery
    const getPaymentMethod = (order) => {
        return order.paymentMethod || 'Cash on Delivery';
    };

    const fetchCustomerOrders = async (isManualRefresh = false) => {
        if (isManualRefresh) setRefreshing(true);

        try {
            const customer = getStoredCustomer();
            if (!customer || !customer.customerId) {
                setError("Please log in to view your orders.");
                setLoading(false);
                return;
            }

            try {
                const res = await api.get(`/api/order/customer/${customer.customerId}`);
                console.log("ORDERS FOR CUSTOMER from /api/order/customer ->", res.data);
                setOrders(Array.isArray(res.data) ? res.data : (res.data ? [res.data] : []));
            } catch (err) {
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
                    throw err;
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

    const getLineId = (line) => {
        if (!line) return undefined;
        return line.orderLineId ?? line.id ?? line.orderlineId ?? line.order_line_id ?? undefined;
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
            const derivedProductId = getLineProductId(orderLine) || product?.productId || product?.id || product?.productId;
            const derivedOrderLineId = orderLine?.orderLineId ?? orderLine?.id ?? orderLine?.orderlineId ?? null;
            const derivedOrderId = orderLine?.orderId ?? orderLine?.order?.orderId ?? null;

            const safeRating = Math.max(1, Math.min(5, Math.round(Number(rating) || 0)));

            const payload = {
                rating: safeRating,
                reviewComment: comment,
                ...(derivedProductId != null ? { product: { productId: Number(derivedProductId) } } : {}),
                ...(customer?.customerId != null ? { customer: { customerId: Number(customer.customerId) } } : {}),
            };

            const filteredPayload = Object.fromEntries(Object.entries(payload).filter(([, v]) => v !== undefined && v !== null && v !== ""));

            const created = await createReview(filteredPayload);
            const refreshed = await fetchAllReviews();
            setReviews(refreshed || []);
            setReviewInputs(prev => ({ ...prev, [lineIdKey]: { rating: '', comment: '' } }));
            try {
                window.dispatchEvent(new CustomEvent('reviewCreated', { detail: { productId: derivedProductId } }));
            } catch (e) {}
            alert('your review has been submitted!');
        } catch (err) {
            console.error('Failed to submit review', err);
        } finally {
            setSubmitting(prev => ({ ...prev, [lineIdKey]: false }));
        }
    };

    const processedOrders = React.useMemo(() => {
        let arr = Array.isArray(orders) ? [...orders] : [];
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
                        {processedOrders.map((order) => {
                            const stepLabels = getTrackingStepLabels(order);
                            const stepCompletion = getStepCompletion(order.status, stepLabels);
                            const paymentMethod = getPaymentMethod(order);
                            const showTracking = expandedOrderId === order.orderId &&
                                !['Cancelled'].includes(order.status);

                            return (
                                <div className="order-card" key={order.orderId}>
                                    <div className="order-header">
                                        <div className="order-info">
                                            <h3 className="order-number">Order #{order.orderId}</h3>
                                            <p className="order-date">Placed on {formatDate(order.orderDate)}</p>
                                        </div>
                                        <div className="order-right">
                                            <div className="order-status">
                        <span className={`status-badge status-${String(order.status||'Pending').toLowerCase()}`.replace(/\s/g,'-')}>
                          {order.status || 'Pending'}
                        </span>
                                            </div>
                                            <div className="order-actions">
                                                <button className="btn-secondary" onClick={() => setExpandedOrderId(expandedOrderId === order.orderId ? null : order.orderId)}>
                                                    {expandedOrderId === order.orderId ? 'Hide Details' : 'View Details'}
                                                </button>
                                                {showTracking && (
                                                    <button className="btn-outline">Track Order</button>
                                                )}
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

                                    {/* Enhanced Tracking Section - Show for all active orders except Cancelled */}
                                    {showTracking && (
                                        <div style={{
                                            marginTop: 16,
                                            padding: 16,
                                            border: "1px solid #e0e0e0",
                                            borderRadius: 8,
                                            background: "#fafafa"
                                        }}>
                                            <div style={{ marginBottom: 16 }}>
                                                <h4 style={{ margin: "0 0 4px 0", fontSize: "1.1rem", fontWeight: 600 }}>
                                                    Tracking Order #{order.orderId}
                                                </h4>
                                                <p style={{ margin: 0, color: "#666", fontSize: "0.9rem" }}>
                                                    Order placed on {formatDate(order.orderDate)}
                                                </p>
                                            </div>

                                            {/* Enhanced Tracking Steps */}
                                            <div style={{
                                                display: "grid",
                                                gridTemplateColumns: "repeat(4, 1fr)",
                                                gap: "8px",
                                                margin: "20px 0",
                                                position: "relative"
                                            }}>
                                                {/* Dynamic Progress Line */}
                                                <div style={{
                                                    position: "absolute",
                                                    top: "12px",
                                                    left: "10%",
                                                    right: "10%",
                                                    height: "2px",
                                                    background: "#e0e0e0",
                                                    zIndex: 1
                                                }}>
                                                    {/* Progress Fill */}
                                                    <div style={{
                                                        height: "100%",
                                                        background: "#28a745",
                                                        transition: "all 0.3s ease",
                                                        width: stepCompletion.step4 ? "100%" :
                                                            stepCompletion.step3 ? "66%" :
                                                                stepCompletion.step2 ? "33%" : "0%"
                                                    }}></div>
                                                </div>

                                                {/* Step 1 - Order Placed */}
                                                <div style={{
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    alignItems: "center",
                                                    textAlign: "center",
                                                    position: "relative",
                                                    zIndex: 2
                                                }}>
                                                    <div style={{
                                                        width: "24px",
                                                        height: "24px",
                                                        borderRadius: "50%",
                                                        background: stepCompletion.step1 ? "#28a745" : "#e0e0e0",
                                                        border: "2px solid #fff",
                                                        marginBottom: "8px",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        position: "relative",
                                                        transition: "all 0.3s ease"
                                                    }}>
                                                        {stepCompletion.step1 && (
                                                            <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                                                                <path
                                                                    d="M13.3334 4L6.00008 11.3333L2.66675 8"
                                                                    stroke="white"
                                                                    strokeWidth="2"
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                />
                                                            </svg>
                                                        )}
                                                    </div>
                                                    <span style={{
                                                        fontSize: "0.8rem",
                                                        color: stepCompletion.step1 ? "#28a745" : "#666",
                                                        fontWeight: stepCompletion.step1 ? 600 : 500
                                                    }}>
                                                        {stepLabels.step1}
                                                    </span>
                                                </div>

                                                {/* Step 2 - Processing/Preparing */}
                                                <div style={{
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    alignItems: "center",
                                                    textAlign: "center",
                                                    position: "relative",
                                                    zIndex: 2
                                                }}>
                                                    <div style={{
                                                        width: "24px",
                                                        height: "24px",
                                                        borderRadius: "50%",
                                                        background: stepCompletion.step2 ? "#28a745" : "#e0e0e0",
                                                        border: "2px solid #fff",
                                                        marginBottom: "8px",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        position: "relative",
                                                        transition: "all 0.3s ease"
                                                    }}>
                                                        {stepCompletion.step2 && (
                                                            <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                                                                <path
                                                                    d="M13.3334 4L6.00008 11.3333L2.66675 8"
                                                                    stroke="white"
                                                                    strokeWidth="2"
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                />
                                                            </svg>
                                                        )}
                                                    </div>
                                                    <span style={{
                                                        fontSize: "0.8rem",
                                                        color: stepCompletion.step2 ? "#28a745" : "#666",
                                                        fontWeight: stepCompletion.step2 ? 600 : 500
                                                    }}>
                                                        {stepLabels.step2}
                                                    </span>
                                                </div>

                                                {/* Step 3 - Shipped/Ready */}
                                                <div style={{
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    alignItems: "center",
                                                    textAlign: "center",
                                                    position: "relative",
                                                    zIndex: 2
                                                }}>
                                                    <div style={{
                                                        width: "24px",
                                                        height: "24px",
                                                        borderRadius: "50%",
                                                        background: stepCompletion.step3 ? "#28a745" : "#e0e0e0",
                                                        border: "2px solid #fff",
                                                        marginBottom: "8px",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        position: "relative",
                                                        transition: "all 0.3s ease"
                                                    }}>
                                                        {stepCompletion.step3 && (
                                                            <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                                                                <path
                                                                    d="M13.3334 4L6.00008 11.3333L2.66675 8"
                                                                    stroke="white"
                                                                    strokeWidth="2"
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                />
                                                            </svg>
                                                        )}
                                                    </div>
                                                    <span style={{
                                                        fontSize: "0.8rem",
                                                        color: stepCompletion.step3 ? "#28a745" : "#666",
                                                        fontWeight: stepCompletion.step3 ? 600 : 500
                                                    }}>
                                                        {stepLabels.step3}
                                                    </span>
                                                </div>

                                                {/* Step 4 - Delivered/Collected */}
                                                <div style={{
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    alignItems: "center",
                                                    textAlign: "center",
                                                    position: "relative",
                                                    zIndex: 2
                                                }}>
                                                    <div style={{
                                                        width: "24px",
                                                        height: "24px",
                                                        borderRadius: "50%",
                                                        background: stepCompletion.step4 ? "#28a745" : "#e0e0e0",
                                                        border: "2px solid #fff",
                                                        marginBottom: "8px",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        position: "relative",
                                                        transition: "all 0.3s ease"
                                                    }}>
                                                        {stepCompletion.step4 && (
                                                            <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                                                                <path
                                                                    d="M13.3334 4L6.00008 11.3333L2.66675 8"
                                                                    stroke="white"
                                                                    strokeWidth="2"
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                />
                                                            </svg>
                                                        )}
                                                    </div>
                                                    <span style={{
                                                        fontSize: "0.8rem",
                                                        color: stepCompletion.step4 ? "#28a745" : "#666",
                                                        fontWeight: stepCompletion.step4 ? 600 : 500
                                                    }}>
                                                        {stepLabels.step4}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Current Status Display */}
                                            <div style={{
                                                textAlign: "center",
                                                padding: "12px",
                                                background: statusColors[order.status]?.bg || "#f8f9fa",
                                                border: `1px solid ${statusColors[order.status]?.border || "#dee2e6"}`,
                                                borderRadius: "6px",
                                                marginTop: "16px"
                                            }}>
                                                <strong style={{ color: statusColors[order.status]?.color || "#495057" }}>
                                                    Current Status: {order.status}
                                                </strong>
                                            </div>

                                            {/* Tracking Details */}
                                            <div style={{
                                                display: "grid",
                                                gridTemplateColumns: "repeat(3, 1fr)",
                                                gap: "16px",
                                                marginTop: "16px",
                                                paddingTop: "16px",
                                                borderTop: "1px solid #e0e0e0"
                                            }}>
                                                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                                                    <div style={{ fontSize: "0.85rem", color: "#666", fontWeight: 500 }}>Order Status</div>
                                                    <div style={{ fontSize: "0.95rem", fontWeight: 600, color: "#333" }}>{order.status}</div>
                                                </div>
                                                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                                                    <div style={{ fontSize: "0.85rem", color: "#666", fontWeight: 500 }}>Payment</div>
                                                    <div style={{ fontSize: "0.95rem", fontWeight: 600, color: "#333" }}>{paymentMethod}</div>
                                                </div>
                                                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                                                    <div style={{ fontSize: "0.85rem", color: "#666", fontWeight: 500 }}>Total Amount</div>
                                                    <div style={{ fontSize: "0.95rem", fontWeight: 600, color: "#333" }}>{formatCurrency(order.totalAmount)}</div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

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
                                                                                <div>{myReview.reviewComment ?? myReview.comment ?? myReview.text ?? ''}</div>
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
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Orders;