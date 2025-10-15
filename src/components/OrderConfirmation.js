import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "./OrderConfirmation.css";

export default function OrderConfirmation() {
    const { clearCart } = useCart();
    const navigate = useNavigate();
    const location = useLocation();

    const [orderDetails, setOrderDetails] = useState(null);
    const [isDownloading, setIsDownloading] = useState(false);

    useEffect(() => {
        // Clear cart when confirmation page loads
        clearCart();

        // Get order details from navigation state
        if (location.state) {
            const orderTime = new Date();
            setOrderDetails({
                orderId: location.state.orderId,
                paymentMethod: location.state.paymentMethod,
                amount: location.state.amount,
                shippingInfo: location.state.shippingInfo,
                orderDate: orderTime.toLocaleDateString(),
                orderTime: orderTime.toLocaleTimeString(),
                // Store the actual date object for static reference
                orderDateTime: orderTime
            });
        } else {
            // If no state, redirect to home
            navigate("/");
        }
    }, [location.state, navigate, clearCart]);

    const downloadConfirmation = () => {
        setIsDownloading(true);

        try {
            // Create a printable confirmation document
            const confirmationContent = `
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Order Confirmation - Order #${orderDetails.orderId}</title>
                    <style>
                        body { 
                            font-family: Arial, sans-serif; 
                            margin: 40px; 
                            line-height: 1.6;
                            color: #333;
                        }
                        .header { 
                            text-align: center; 
                            border-bottom: 2px solid #FFB6C1;
                            padding-bottom: 20px;
                            margin-bottom: 30px;
                        }
                        .logo { 
                            font-size: 24px; 
                            font-weight: bold; 
                            color: #FFB6C1;
                            margin-bottom: 10px;
                        }
                        .order-id { 
                            font-size: 20px; 
                            margin: 10px 0; 
                        }
                        .confirmation-message { 
                            color: #28a745; 
                            font-size: 18px;
                            margin: 15px 0;
                        }
                        .details-section { 
                            margin: 25px 0; 
                        }
                        .detail-row { 
                            display: flex; 
                            justify-content: space-between; 
                            margin: 8px 0;
                            padding: 5px 0;
                        }
                        .detail-label { 
                            font-weight: bold; 
                        }
                        .thank-you { 
                            text-align: center; 
                            margin-top: 40px;
                            padding-top: 20px;
                            border-top: 1px solid #ddd;
                            font-style: italic;
                        }
                        .footer { 
                            text-align: center; 
                            margin-top: 50px;
                            font-size: 12px;
                            color: #666;
                        }
                        @media print {
                            body { margin: 20px; }
                            .no-print { display: none; }
                        }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <div class="logo">Baby Cotton Club</div>
                        <h1>Order Confirmation</h1>
                        <div class="confirmation-message">Thank you for your order!</div>
                    </div>
                    
                    <div class="details-section">
                        <div class="detail-row">
                            <span class="detail-label">Order Number:</span>
                            <span>#${orderDetails.orderId}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Order Date:</span>
                            <span>${orderDetails.orderDate}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Order Time:</span>
                            <span>${orderDetails.orderTime}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Payment Method:</span>
                            <span>${orderDetails.paymentMethod}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Total Amount:</span>
                            <span><strong>R ${orderDetails.amount.toFixed(2)}</strong></span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Status:</span>
                            <span style="color: #28a745;"><strong>Confirmed</strong></span>
                        </div>
                    </div>

                    ${orderDetails.shippingInfo ? `
                    <div class="details-section">
                        <h3>Shipping Address</h3>
                        <div class="detail-row">
                            <span class="detail-label">Address:</span>
                            <span>${orderDetails.shippingInfo.streetNumber} ${orderDetails.shippingInfo.streetName}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Suburb:</span>
                            <span>${orderDetails.shippingInfo.suburb}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">City:</span>
                            <span>${orderDetails.shippingInfo.city}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Province:</span>
                            <span>${orderDetails.shippingInfo.province}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Postal Code:</span>
                            <span>${orderDetails.shippingInfo.postalCode}</span>
                        </div>
                    </div>
                    ` : ''}

                    <div class="details-section">
                        <h3>What happens next?</h3>
                       <p>• Our team is preparing your order for shipment</p>
                        <p>• You will be notified when your order ships</p>
                        ${orderDetails.paymentMethod === "Cash on Delivery" ?
                '<p>• Please have the exact amount ready for the delivery driver</p>' : ''}
                    </div>

                    <div class="thank-you">
                        <p>We appreciate your business and look forward to serving you!</p>
                    </div>

                    <div class="footer">
                        <p>If you have any questions, please contact our customer service.</p>
                        <p>Email: support@babycottonclub.com | Phone: (021) 436-6678</p>
                        <p>Generated on: ${orderDetails.orderDateTime.toLocaleString()}</p>
                    </div>
                </body>
                </html>
            `;

            // Create a blob and download link
            const blob = new Blob([confirmationContent], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `order-confirmation-${orderDetails.orderId}.html`;

            // Trigger download
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

        } catch (error) {
            console.error('Error generating download:', error);
            alert('Error downloading confirmation. Please try again.');
        } finally {
            setIsDownloading(false);
        }
    };

    const printConfirmation = () => {
        window.print();
    };

    if (!orderDetails) {
        return (
            <div className="confirmation-loading">
                <h2>Loading order details...</h2>
            </div>
        );
    }

    return (
        <div className="confirmation-container">
            {/* Progress Bar */}
            <div className="confirmation-progress">
                <div className="step completed">Cart</div>
                <div className="step completed">Shipping</div>
                <div className="step completed">Payment</div>
                <div className="step active">Confirmation</div>
            </div>

            <div className="confirmation-content">
                {/* Success Header */}
                <section className="confirmation-header">
                    <div className="success-icon">✓</div>
                    <h1>Order Confirmed!</h1>
                    <p className="confirmation-message">
                        Thank you for your purchase. Your order has been successfully placed.
                    </p>
                    <div className="order-id-badge">
                        Order #: <strong>{orderDetails.orderId}</strong>
                    </div>
                </section>

                {/* Order Summary */}
                <section className="confirmation-summary">
                    <h2>Order Summary</h2>
                    <div className="summary-grid">
                        <div className="summary-item">
                            <span className="summary-label">Order Date:</span>
                            <span className="summary-value">{orderDetails.orderDate}</span>
                        </div>
                        <div className="summary-item">
                            <span className="summary-label">Order Time:</span>
                            <span className="summary-value">{orderDetails.orderTime}</span>
                        </div>
                        <div className="summary-item">
                            <span className="summary-label">Payment Method:</span>
                            <span className="summary-value">{orderDetails.paymentMethod}</span>
                        </div>
                        <div className="summary-item total">
                            <span className="summary-label">Total Amount:</span>
                            <span className="summary-value">R {orderDetails.amount.toFixed(2)}</span>
                        </div>
                    </div>
                </section>

                {/* Shipping Address */}
                {orderDetails.shippingInfo && (
                    <section className="shipping-info">
                        <h2>Shipping Address</h2>
                        <div className="address-details">
                            <p>{orderDetails.shippingInfo.streetNumber} {orderDetails.shippingInfo.streetName}</p>
                            <p>{orderDetails.shippingInfo.suburb}</p>
                            <p>{orderDetails.shippingInfo.city}, {orderDetails.shippingInfo.province}</p>
                            <p>{orderDetails.shippingInfo.postalCode}</p>
                        </div>
                    </section>
                )}

                {/* Next Steps */}
                <section className="next-steps">
                    <h2>What happens next?</h2>
                    <div className="steps-timeline">
                        <div className="step-item">
                            <div className="step-number">1</div>
                            <div className="step-content">
                                <h3>Order Processing</h3>
                                <p>We're preparing your order for shipment</p>
                            </div>
                        </div>
                        <div className="step-item">
                            <div className="step-number">2</div>
                            <div className="step-content">
                                <h3>Shipping</h3>
                                <p>Your order will be shipped within 1-2 business days</p>
                            </div>
                        </div>
                        <div className="step-item">
                            <div className="step-number">3</div>
                            <div className="step-content">
                                <h3>Delivery</h3>
                                <p>Expected delivery: 3-5 business days</p>
                            </div>
                        </div>
                    </div>

                    {orderDetails.paymentMethod === "Cash on Delivery" && (
                        <div className="cod-reminder">
                            <h3>Cash on Delivery Reminder</h3>
                            <p>Please have <strong>R {orderDetails.amount.toFixed(2)}</strong> ready for the delivery driver.</p>
                        </div>
                    )}
                </section>

                {/* Action Buttons */}
                <section className="confirmation-actions">
                    <button
                        className="download-btn"
                        onClick={downloadConfirmation}
                        disabled={isDownloading}
                    >
                        {isDownloading ? "Downloading..." : "Download Confirmation"}
                    </button>

                    <button
                        className="print-btn"
                        onClick={printConfirmation}
                    >
                        Print Confirmation
                    </button>

                    <button
                        className="continue-shopping-btn"
                        onClick={() => navigate("/products")}
                    >
                        Continue Shopping
                    </button>
                </section>

                {/* Support Info */}
                <section className="support-info">
                    <h3>Need help with your order?</h3>
                    <p>Contact our customer support team:</p>
                    <div className="contact-methods">
                        <p>Email: support@babycottonclub.com</p>
                        <p>Phone: (021) 436-6678</p>
                    </div>
                </section>
            </div>
        </div>
    );
}