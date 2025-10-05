import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createAddress } from "../api/api";
import "./Shipping.css";

export default function Shipping() {
    const navigate = useNavigate();
    const [shippingInfo, setShippingInfo] = useState({
        streetNumber: "",
        streetName: "",
        suburb: "",
        city: "",
        postalCode: "",
        province: ""
    });
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setShippingInfo({
            ...shippingInfo,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (
            !shippingInfo.streetNumber ||
            !shippingInfo.streetName ||
            !shippingInfo.suburb ||
            !shippingInfo.city ||
            !shippingInfo.postalCode ||
            !shippingInfo.province
        ) {
            setError("Please fill in all fields.");
            return;
        }
        try {
            // Get logged-in customer
            const customer = JSON.parse(localStorage.getItem("customer"));
            if (!customer || !customer.customerId) {
                setError("You must be logged in to add an address.");
                return;
            }
            // Attach customerId to address (simplified format)
            const addressData = {
                streetNumber: parseInt(shippingInfo.streetNumber) || 0,
                streetName: shippingInfo.streetName,
                suburb: shippingInfo.suburb,
                city: shippingInfo.city,
                postalCode: parseInt(shippingInfo.postalCode) || 0,
                province: shippingInfo.province
            };
            const savedAddress = await createAddress(addressData);
            // Pass address to payment page via navigation state
            navigate("/payment", { state: { address: savedAddress } });
        } catch (err) {
            setError("Failed to save address. Please try again.");
        }
    };

    return (
        <div className="shipping-container">
            <div className="shipping-progress">
                <div className="progress-step completed">
                    <div className="step-icon" aria-hidden>✓</div>
                    <span>Cart</span>
                </div>
                <div className="progress-step active">
                    <div className="step-icon" aria-hidden>🚚</div>
                    <span>Shipping</span>
                </div>
                <div className="progress-step">
                    <div className="step-icon" aria-hidden>💳</div>
                    <span>Payment</span>
                </div>
                <div className="progress-step">
                    <div className="step-icon" aria-hidden>✅</div>
                    <span>Confirmation</span>
                </div>
            </div>

            <div className="shipping-content">
                <header className="shipping-header">
                    <h1>Shipping Address</h1>
                    <p>Provide the delivery address where you'd like your order to arrive.</p>
                </header>

                <form className="address-form" onSubmit={handleSubmit} noValidate>
                    {error && <div className="shipping-error" role="alert">{error}</div>}

                    <div className="form-grid">
                        <div className="input-group">
                            <label htmlFor="streetNumber">Street Number</label>
                            <div className="input-with-icon">
                                <span className="input-icon" aria-hidden></span>
                                <input
                                    id="streetNumber"
                                    type="number"
                                    name="streetNumber"
                                    value={shippingInfo.streetNumber}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="input-group">
                            <label htmlFor="streetName">Street Name</label>
                            <div className="input-with-icon">
                                <span className="input-icon" aria-hidden></span>
                                <input
                                    id="streetName"
                                    type="text"
                                    name="streetName"
                                    value={shippingInfo.streetName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="input-group">
                            <label htmlFor="suburb">Suburb</label>
                            <div className="input-with-icon">
                                <span className="input-icon" aria-hidden></span>
                                <input
                                    id="suburb"
                                    type="text"
                                    name="suburb"
                                    value={shippingInfo.suburb}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="input-group">
                            <label htmlFor="city">City</label>
                            <div className="input-with-icon">
                                <span className="input-icon" aria-hidden></span>
                                <input
                                    id="city"
                                    type="text"
                                    name="city"
                                    value={shippingInfo.city}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="input-group">
                            <label htmlFor="postalCode">Postal Code</label>
                            <div className="input-with-icon">
                                <span className="input-icon" aria-hidden></span>
                                <input
                                    id="postalCode"
                                    type="number"
                                    name="postalCode"
                                    value={shippingInfo.postalCode}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="input-group">
                            <label htmlFor="province">Province</label>
                            <div className="input-with-icon">
                                <span className="input-icon" aria-hidden></span>
                                <input
                                    id="province"
                                    type="text"
                                    name="province"
                                    value={shippingInfo.province}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <button className="submit-btn" type="submit">Continue to Payment</button>
                </form>
            </div>
        </div>
    );
}

