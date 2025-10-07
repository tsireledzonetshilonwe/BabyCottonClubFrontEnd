import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createAddress } from "../api/api";
import { getStoredCustomer } from "../utils/customer";
import "./Shipping.css";

export default function Shipping() {
    const navigate = useNavigate();
    const [shippingInfo, setShippingInfo] = useState({
        streetNumber: "",
        streetName: "",
        suburb: "",
        city: "",
        postalCode: "",
        province: "",
    });
    const [error, setError] = useState("");
    const [fieldErrors, setFieldErrors] = useState({});
    const [saving, setSaving] = useState(false);

    // Prefill from stored customer address if available
    useEffect(() => {
        try {
            const customer = getStoredCustomer();
            if (customer && customer.raw && Array.isArray(customer.raw.addresses) && customer.raw.addresses.length > 0) {
                const a = customer.raw.addresses[0];
                setShippingInfo((s) => ({
                    ...s,
                    streetNumber: a.streetNumber ?? a.number ?? s.streetNumber,
                    streetName: a.streetName ?? a.street ?? s.streetName,
                    suburb: a.suburb ?? a.neighbourhood ?? s.suburb,
                    city: a.city ?? a.town ?? s.city,
                    postalCode: a.postalCode ?? a.zip ?? s.postalCode,
                    province: a.province ?? a.state ?? s.province,
                }));
            }
        } catch (e) {
            // ignore prefill errors
            console.debug("No prefill address available", e);
        }
    }, []);

    const validate = () => {
        const errs = {};
        if (!shippingInfo.streetNumber) errs.streetNumber = "Street number is required";
        if (!shippingInfo.streetName) errs.streetName = "Street name is required";
        if (!shippingInfo.suburb) errs.suburb = "Suburb is required";
        if (!shippingInfo.city) errs.city = "City is required";
        if (!shippingInfo.postalCode) errs.postalCode = "Postal code is required";
        if (!shippingInfo.province) errs.province = "Province is required";
        setFieldErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleChange = (e) => {
        setShippingInfo({ ...shippingInfo, [e.target.name]: e.target.value });
        setFieldErrors((f) => ({ ...f, [e.target.name]: undefined }));
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) {
            setError("Please fix the errors above.");
            return;
        }
        try {
            setSaving(true);
            const customer = getStoredCustomer();
            if (!customer || !customer.customerId) {
                setError("You must be logged in to add an address.");
                setSaving(false);
                return;
            }

            const addressData = {
                streetNumber: Number(shippingInfo.streetNumber) || 0,
                streetName: shippingInfo.streetName,
                suburb: shippingInfo.suburb,
                city: shippingInfo.city,
                postalCode: shippingInfo.postalCode,
                province: shippingInfo.province,
                customerId: customer.customerId,
            };

            const savedAddress = await createAddress(addressData);
            setSaving(false);
            navigate("/payment", { state: { address: savedAddress } });
        } catch (err) {
            console.error("Failed to save address", err);
            setSaving(false);
            setError("Failed to save address. Please try again.");
        }
    };

    return (
        <div className="shipping-container">
            <div className="shipping-content">
                <div className="shipping-progress">
                    <div className="progress-step completed">
                        <div className="step-icon">1</div>
                        <span>Cart</span>
                    </div>
                    <div className="progress-step active">
                        <div className="step-icon">2</div>
                        <span>Shipping</span>
                    </div>
                    <div className="progress-step">
                        <div className="step-icon">3</div>
                        <span>Payment</span>
                    </div>
                    <div className="progress-step">
                        <div className="step-icon">4</div>
                        <span>Confirm</span>
                    </div>
                </div>

                <div className="shipping-header">
                    <h1>Shipping Address</h1>
                    <p>Enter a shipping address where you'd like your order delivered.</p>
                </div>

                <div className="address-form">
                    {error && <div className="shipping-error">{error}</div>}
                    <form className="form-grid" onSubmit={handleSubmit} noValidate>
                        <div className="input-group input-with-icon">
                            <label>Street Number</label>
                            <input name="streetNumber" type="text" value={shippingInfo.streetNumber} onChange={handleChange} />
                            {fieldErrors.streetNumber && <div className="field-error">{fieldErrors.streetNumber}</div>}
                        </div>

                        <div className="input-group input-with-icon">
                            <label>Street Name</label>
                            <input name="streetName" type="text" value={shippingInfo.streetName} onChange={handleChange} />
                            {fieldErrors.streetName && <div className="field-error">{fieldErrors.streetName}</div>}
                        </div>

                        <div className="input-group input-with-icon">
                            <label>Suburb</label>
                            <input name="suburb" type="text" value={shippingInfo.suburb} onChange={handleChange} />
                            {fieldErrors.suburb && <div className="field-error">{fieldErrors.suburb}</div>}
                        </div>

                        <div className="input-group input-with-icon">
                            <label>City</label>
                            <input name="city" type="text" value={shippingInfo.city} onChange={handleChange} />
                            {fieldErrors.city && <div className="field-error">{fieldErrors.city}</div>}
                        </div>

                        <div className="input-group input-with-icon">
                            <label>Postal Code</label>
                            <input name="postalCode" type="text" value={shippingInfo.postalCode} onChange={handleChange} />
                            {fieldErrors.postalCode && <div className="field-error">{fieldErrors.postalCode}</div>}
                        </div>

                        <div className="input-group input-with-icon">
                            <label>Province</label>
                            <input name="province" type="text" value={shippingInfo.province} onChange={handleChange} />
                            {fieldErrors.province && <div className="field-error">{fieldErrors.province}</div>}
                        </div>

                        <div style={{ gridColumn: '1 / -1' }}>
                            <button className="submit-btn" type="submit" disabled={saving}>{saving ? 'Saving...' : 'Continue to Payment'}</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

