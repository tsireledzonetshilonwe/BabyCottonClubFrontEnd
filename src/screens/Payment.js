import React, { useState, useEffect } from "react";
import { createPayment, fetchOrderDetails, fetchProducts } from "../api/api";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "./Payment.css";

export default function Payment() {
    const { cartItems, clearCart } = useCart();
    const navigate = useNavigate();
    const location = useLocation();

    const [paymentMethod, setPaymentMethod] = useState("");
    const [shippingInfo, setShippingInfo] = useState(location.state?.address || null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [orderDetails, setOrderDetails] = useState(null);
    const [loadingOrder, setLoadingOrder] = useState(false);
    const [orderDisplayLines, setOrderDisplayLines] = useState([]);

    useEffect(() => {
        console.log("Payment component mounted");
        console.log("Shipping info:", shippingInfo);
        console.log("Cart items:", cartItems);
        
        const orderId = localStorage.getItem("orderId");
        console.log("Order ID in localStorage:", orderId);
        
        // Clean up accidental 'undefined' string stored in localStorage
        if (orderId === 'undefined' || orderId === null || orderId === 'null') {
            console.warn("Found invalid orderId in localStorage, removing it.");
            localStorage.removeItem('orderId');
        }

        if (!shippingInfo) {
            console.log("No shipping info, redirecting to shipping...");
            navigate("/shipping");
        }
    }, [shippingInfo, navigate]);

    // If the cart is empty but there's an orderId, fetch order details so we can show a summary
    useEffect(() => {
        const orderIdRaw = localStorage.getItem("orderId");
        const orderId = orderIdRaw && orderIdRaw !== 'undefined' ? Number(orderIdRaw) : null;
        if ((!cartItems || cartItems.length === 0) && orderId) {
            setLoadingOrder(true);
            fetchOrderDetails(orderId)
                .then((data) => {
                    setOrderDetails(data);
                })
                .catch((err) => {
                    console.warn("Failed to fetch order details:", err);
                    setOrderDetails(null);
                })
                .finally(() => setLoadingOrder(false));
        }
    }, [cartItems]);

    // Build display-friendly lines (with product names/images) from orderDetails
    useEffect(() => {
        if (!orderDetails || !orderDetails.orderLines) {
            setOrderDisplayLines([]);
            return;
        }

        const lines = orderDetails.orderLines;

        // If lines already contain product name, use them directly
        const needLookup = lines.some(l => !(l.product && (l.product.name || l.product.productName)) && !l.productName && !l.productName);

        const buildFromProducts = async () => {
            try {
                const products = await fetchProducts();
                const byId = new Map();
                products.forEach(p => {
                    // backend products may have productId or id
                    const id = p.productId ?? p.id ?? p.id;
                    byId.set(String(id), p);
                });

                const mapped = lines.map(l => {
                    // extract potential product id from order line
                    const pid = l.product?.productId ?? l.product?.id ?? l.productId ?? l.product_id ?? null;
                    const prod = pid ? byId.get(String(pid)) : null;
                    const name = l.product?.name ?? l.productName ?? prod?.productName ?? prod?.name ?? 'Item';
                    const image = l.product?.imageUrl ?? prod?.imageUrl ?? prod?.image ?? null;
                    const sku = l.product?.sku ?? prod?.sku ?? '';
                    const unitPrice = Number(l.unitPrice ?? l.price ?? l.unit_price ?? 0);
                    const qty = Number(l.quantity ?? l.qty ?? 1);
                    return {
                        key: l.orderLineId ?? l.id ?? `${pid}-${Math.random()}`,
                        name,
                        sku,
                        image,
                        unitPrice,
                        qty,
                        subTotal: unitPrice * qty
                    };
                });

                setOrderDisplayLines(mapped);
            } catch (err) {
                console.warn('Failed to enrich order lines with products:', err);
                // Fallback: map minimally from lines
                const mapped = lines.map(l => ({
                    key: l.orderLineId ?? l.id ?? Math.random(),
                    name: l.product?.name ?? l.productName ?? 'Item',
                    sku: l.product?.sku ?? '',
                    image: l.product?.imageUrl ?? null,
                    unitPrice: Number(l.unitPrice ?? l.price ?? 0),
                    qty: Number(l.quantity ?? 1),
                    subTotal: Number(l.unitPrice ?? l.price ?? 0) * Number(l.quantity ?? 1)
                }));
                setOrderDisplayLines(mapped);
            }
        };

        if (needLookup) {
            buildFromProducts();
        } else {
            // Build directly
            const mapped = lines.map(l => ({
                key: l.orderLineId ?? l.id ?? Math.random(),
                name: l.product?.name ?? l.productName ?? 'Item',
                sku: l.product?.sku ?? '',
                image: l.product?.imageUrl ?? null,
                unitPrice: Number(l.unitPrice ?? l.price ?? 0),
                qty: Number(l.quantity ?? 1),
                subTotal: Number(l.unitPrice ?? l.price ?? 0) * Number(l.quantity ?? 1)
            }));
            setOrderDisplayLines(mapped);
        }
    }, [orderDetails]);

    const totalAmount = cartItems && cartItems.length > 0
        ? cartItems.reduce((sum, item) => {
            const price = parseFloat(item.price) || 0;
            return sum + price * (item.quantity || 1);
        }, 0)
        : orderDetails?.totalAmount || 0;

    const handlePayment = async (e) => {
        e.preventDefault();
        if (!paymentMethod) {
            alert("Please select a payment method.");
            return;
        }

        // Check for existing orderId first
        let orderId = localStorage.getItem("orderId");
        
        // If no orderId exists but we have cart items, try to create an order on the fly
        if (!orderId && cartItems.length > 0) {
            console.log("No orderId found, creating order during payment...");
            try {
                const customer = JSON.parse(localStorage.getItem("customer"));
                if (!customer || !customer.customerId) {
                    alert("Please log in to complete your order.");
                    navigate("/login");
                    return;
                }

                // Create a simple order for payment
                const orderData = {
                    orderDate: new Date().toISOString().slice(0,10),
                    totalAmount: totalAmount,
                    customer: { customerId: customer.customerId }
                };

                const response = await fetch('http://localhost:8080/api/order/create', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(orderData)
                });

                    if (response.ok) {
                        const order = await response.json();
                        const oid = order.orderId ?? order.id ?? null;
                        const oidNum = oid ? Number(oid) : null;
                        if (Number.isFinite(oidNum) && oidNum > 0) {
                            orderId = oidNum;
                            localStorage.setItem("orderId", String(orderId));
                            console.log("Order created during payment:", orderId);
                        } else {
                            console.warn("Order created but response missing a valid orderId:", order);
                        }
                    } else {
                        throw new Error("Failed to create order");
                    }
            } catch (err) {
                console.error("Failed to create order during payment:", err);
                alert("Unable to process order. Please try starting from your cart.");
                navigate("/cart");
                return;
            }
        }

        // If still no orderId and no cart items, redirect to cart
        if (!orderId) {
            console.log("No order ID and no cart items, redirecting to cart...");
            alert("No order found. Please add items to your cart first.");
            navigate("/cart");
            return;
        }

        console.log("Processing payment for order:", orderId);

        try {
            // Simulate payment processing
            await new Promise((resolve) => setTimeout(resolve, 1000));

            // Create payment record
            const today = new Date().toISOString().split("T")[0];
            const paymentData = {
                paymentDate: today,
                paymentMethod,
                customerOrder: { orderId: Number(orderId) },
            };
            await createPayment(paymentData);

            alert(`Payment successful with ${paymentMethod}!`);
            clearCart();
            localStorage.removeItem("orderId");
            navigate("/");
        } catch (err) {
            console.error("Payment processing failed:", err);
            alert("Payment failed. Please try again.");
        }
    };

    // Check if we have either cart items OR an existing order
    const hasCartItems = cartItems.length > 0;
    const hasExistingOrder = localStorage.getItem("orderId");
    
    if (!hasCartItems && !hasExistingOrder) {
        return (
            <div style={{ textAlign: "center", marginTop: "2rem" }}>
                <h2>No order found</h2>
                <p>Please add items to your cart and proceed through checkout.</p>
                <Link to="/products" style={{ color: "#FFB6C1", textDecoration: "underline" }}>
                    Continue Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="payment-container">
            {/* Progress Bar */}
            <div className="payment-progress">
                <div className="step completed">Cart</div>
                <div className="step completed">Shipping</div>
                <div className="step active">Payment</div>
                <div className="step">Confirmation</div>
            </div>

            <div className="payment-content">
                {/* Shipping Info */}
                {shippingInfo && (
                    <section className="shipping-summary">
                        <h2>Shipping Address</h2>
                        <div>
                            {shippingInfo.streetNumber} {shippingInfo.streetName}, {shippingInfo.suburb}
                        </div>
                        <div>
                            {shippingInfo.city}, {shippingInfo.province}, {shippingInfo.postalCode}
                        </div>
                    </section>
                )}

                {/* Order Summary */}
                <section className="payment-summary">
                    <h2>Order Summary</h2>
                    {cartItems.length > 0 ? (
                        <>
                            <ul>
                                {cartItems.map((item) => (
                                    <li key={item.id} className="payment-summary-item">
                                        <span className="payment-summary-name">{item.name}</span>
                                        <span className="payment-summary-qty">× {item.quantity}</span>
                                        <span className="payment-summary-price">R {item.price}</span>
                                    </li>
                                ))}
                            </ul>
                            <div className="payment-summary-total">
                                <strong>Total:</strong> R {totalAmount.toFixed(2)}
                            </div>
                        </>
                    ) : (
                        <div style={{ padding: "1rem" }}>
                            {loadingOrder ? (
                                <p style={{ textAlign: 'center' }}>Loading order summary...</p>
                            ) : orderDisplayLines && orderDisplayLines.length > 0 ? (
                                <>
                                    <ul>
                                        {orderDisplayLines.map(line => (
                                            <li key={line.key} className="payment-summary-item" style={{display:'flex', gap:'0.75rem', alignItems:'center'}}>
                                                {line.image ? (
                                                    <img src={line.image} alt={line.name} style={{width:56,height:56,objectFit:'cover',borderRadius:8}} />
                                                ) : (
                                                    <div style={{width:56,height:56,background:'#f3f4f6',borderRadius:8}} />
                                                )}
                                                <div style={{flex:1}}>
                                                    <div style={{fontWeight:700}}>{line.name}</div>
                                                    {line.sku && <div style={{fontSize:'0.8rem', color:'#6b7280'}}>{line.sku}</div>}
                                                </div>
                                                <div style={{textAlign:'right'}}>
                                                    <div>× {line.qty}</div>
                                                    <div style={{fontWeight:700}}>R {Number(line.unitPrice).toFixed(2)}</div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                    <div className="payment-summary-total">
                                        <strong>Total:</strong> R {Number(orderDetails?.totalAmount || orderDisplayLines.reduce((s,l)=>s+l.subTotal,0)).toFixed(2)}
                                    </div>
                                    <div style={{ textAlign: 'center', marginTop: '0.5rem' }}>
                                        <small>Order ID: {orderDetails?.orderId || localStorage.getItem('orderId')}</small>
                                    </div>
                                </>
                            ) : orderDetails ? (
                                <>
                                    <div style={{ textAlign: "center" }}>
                                        <p>Order details will be processed based on your previous checkout.</p>
                                        <p><strong>Order ID:</strong> {localStorage.getItem("orderId") || "Processing..."}</p>
                                    </div>
                                </>
                            ) : (
                                <div style={{ textAlign: "center" }}>
                                    <p>Order details will be processed based on your previous checkout.</p>
                                    <p><strong>Order ID:</strong> {localStorage.getItem("orderId") || "Processing..."}</p>
                                </div>
                            )}
                        </div>
                    )}
                </section>

                {/* Payment Form */}
                <section className="payment-form-section">
                    <h2>Payment Details</h2>
                    <form className="payment-form" onSubmit={handlePayment}>
                        <div className="input-group">
                            <label>Payment Method</label>
                            <select
                                value={paymentMethod}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                                className="payment-method-select"
                                required
                            >
                                <option value="">Select a method</option>
                                <option value="Credit Card">Credit Card</option>
                                <option value="EFT">EFT</option>
                                <option value="Cash on Delivery">Cash on Delivery</option>
                            </select>
                        </div>

                        {/* Simulated Credit Card */}
                        {paymentMethod === "Credit Card" && (
                            <div className="payment-simulation">
                                <p>
                                    Click confirm to pay <strong>R {totalAmount.toFixed(2)}</strong> with Credit Card (simulated).
                                </p>
                                <p>In a real system, you would be redirected to a secure payment gateway like Stripe.</p>
                            </div>
                        )}

                        {/* EFT Info */}
                        {paymentMethod === "EFT" && (
                            <div className="eft-info">
                                <p>
                                    Please transfer <strong>R {totalAmount.toFixed(2)}</strong> to{" "}
                                    <strong>FNB Account: 1234567890</strong> using your Order ID as reference.
                                </p>
                            </div>
                        )}

                        {/* Cash on Delivery */}
                        {paymentMethod === "Cash on Delivery" && (
                            <div className="cod-info">
                                <p>You will pay <strong>R {totalAmount.toFixed(2)}</strong> to the driver upon delivery.</p>
                            </div>
                        )}

                        <button className="payment-confirm-btn baby-pink-button" type="submit" disabled={isProcessing}>
                            {isProcessing ? "Processing..." : "Confirm Payment"}
                        </button>
                    </form>
                </section>
            </div>
        </div>
    );
}

