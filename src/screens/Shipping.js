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
            // Attach customerId to address
            const addressData = {
                ...shippingInfo,
                customer: { customerId: customer.customerId }
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
            <div className="payment-progress">
                <div className="step completed">Cart</div>
                <div className="step active">Shipping</div>
                <div className="step">Payment</div>
                <div className="step">Confirmation</div>
            </div>
            <form className="shipping-form" onSubmit={handleSubmit}>
                <h2>Shipping Address</h2>
                {error && <div className="shipping-error">{error}</div>}
                <div className="input-group">
                    <label>Street Number</label>
                    <input
                        type="number"
                        name="streetNumber"
                        value={shippingInfo.streetNumber}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="input-group">
                    <label>Street Name</label>
                    <input
                        type="text"
                        name="streetName"
                        value={shippingInfo.streetName}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="input-group">
                    <label>Suburb</label>
                    <input
                        type="text"
                        name="suburb"
                        value={shippingInfo.suburb}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="input-group">
                    <label>City</label>
                    <input
                        type="text"
                        name="city"
                        value={shippingInfo.city}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="input-group">
                    <label>Postal Code</label>
                    <input
                        type="number"
                        name="postalCode"
                        value={shippingInfo.postalCode}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="input-group">
                    <label>Province</label>
                    <input
                        type="text"
                        name="province"
                        value={shippingInfo.province}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button className="shipping-next-btn" type="submit">
                    Continue to Payment
                </button>
            </form>
        </div>
    );
}

