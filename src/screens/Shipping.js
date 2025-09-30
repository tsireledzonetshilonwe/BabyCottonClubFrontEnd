import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
    Home, LocationOn, Business, LocationCity, 
    LocalPostOffice, Map, Save, ArrowForward,
    CheckCircle, RadioButtonUnchecked
} from '@mui/icons-material';
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
    const [fieldErrors, setFieldErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // South African provinces
    const provinces = [
        "Eastern Cape", "Free State", "Gauteng", "KwaZulu-Natal",
        "Limpopo", "Mpumalanga", "Northern Cape", "North West", "Western Cape"
    ];

    // Validation functions
    const validatePostalCode = (code) => {
        return /^\d{4}$/.test(code);
    };

    const validateStreetNumber = (number) => {
        return /^\d+[a-zA-Z]?$/.test(number);
    };

    const validateText = (text, minLength = 2) => {
        return text.trim().length >= minLength;
    };

    // Input change handler
    const handleInputChange = (field, value) => {
        setShippingInfo(prev => ({ ...prev, [field]: value }));
        
        // Clear previous error
        setFieldErrors(prev => ({ ...prev, [field]: '' }));
        
        // Validate based on field
        switch (field) {
            case 'streetNumber':
                if (value && !validateStreetNumber(value)) {
                    setFieldErrors(prev => ({ ...prev, [field]: 'Enter a valid street number (e.g., 123 or 123A)' }));
                }
                break;
            case 'streetName':
            case 'suburb':
            case 'city':
                if (value && !validateText(value)) {
                    setFieldErrors(prev => ({ ...prev, [field]: 'Must be at least 2 characters' }));
                }
                break;
            case 'postalCode':
                if (value && !validatePostalCode(value)) {
                    setFieldErrors(prev => ({ ...prev, [field]: 'Enter a valid 4-digit postal code' }));
                }
                break;
            default:
                break;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError("");
        
        // Validate all fields
        const errors = {};
        if (!validateStreetNumber(shippingInfo.streetNumber)) {
            errors.streetNumber = 'Valid street number required';
        }
        if (!validateText(shippingInfo.streetName)) {
            errors.streetName = 'Street name required';
        }
        if (!validateText(shippingInfo.suburb)) {
            errors.suburb = 'Suburb required';
        }
        if (!validateText(shippingInfo.city)) {
            errors.city = 'City required';
        }
        if (!validatePostalCode(shippingInfo.postalCode)) {
            errors.postalCode = 'Valid 4-digit postal code required';
        }
        if (!shippingInfo.province) {
            errors.province = 'Province required';
        }

        if (Object.keys(errors).length > 0) {
            setFieldErrors(errors);
            setIsSubmitting(false);
            return;
        }

        try {
            const customer = JSON.parse(localStorage.getItem("customer"));
            if (!customer || !customer.customerId) {
                setError("You must be logged in to add an address.");
                setIsSubmitting(false);
                return;
            }

            const addressData = {
                ...shippingInfo,
                customer: { customerId: customer.customerId }
            };

            const savedAddress = await createAddress(addressData);
            navigate("/payment", { state: { address: savedAddress } });
        } catch (err) {
            setError("Failed to save address. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="shipping-container">
            {/* Progress Indicator */}
            <div className="shipping-progress">
                <div className="progress-step completed">
                    <CheckCircle className="step-icon" />
                    <span>Cart</span>
                </div>
                <div className="progress-step active">
                    <LocationOn className="step-icon" />
                    <span>Shipping</span>
                </div>
                <div className="progress-step">
                    <RadioButtonUnchecked className="step-icon" />
                    <span>Payment</span>
                </div>
                <div className="progress-step">
                    <RadioButtonUnchecked className="step-icon" />
                    <span>Confirmation</span>
                </div>
            </div>

            {/* Main Content */}
            <div className="shipping-content">
                <div className="shipping-header">
                    <h1>Shipping Address</h1>
                    <p>Please enter your delivery address</p>
                </div>

                {error && <div className="shipping-error">{error}</div>}
                
                <form onSubmit={handleSubmit} className="address-form">
                    <div className="form-grid">
                        <div className="input-group">
                            <label>Street Number *</label>
                            <div className="input-with-icon">
                                <Home className="input-icon" />
                                <input
                                    type="text"
                                    placeholder="e.g., 123"
                                    value={shippingInfo.streetNumber}
                                    onChange={(e) => handleInputChange('streetNumber', e.target.value)}
                                    required
                                />
                            </div>
                            {fieldErrors.streetNumber && <span className="field-error">{fieldErrors.streetNumber}</span>}
                        </div>
                        
                        <div className="input-group">
                            <label>Street Name *</label>
                            <div className="input-with-icon">
                                <LocationOn className="input-icon" />
                                <input
                                    type="text"
                                    placeholder="e.g., Main Street"
                                    value={shippingInfo.streetName}
                                    onChange={(e) => handleInputChange('streetName', e.target.value)}
                                    required
                                />
                            </div>
                            {fieldErrors.streetName && <span className="field-error">{fieldErrors.streetName}</span>}
                        </div>

                        <div className="input-group">
                            <label>Suburb *</label>
                            <div className="input-with-icon">
                                <Business className="input-icon" />
                                <input
                                    type="text"
                                    placeholder="e.g., Sandton"
                                    value={shippingInfo.suburb}
                                    onChange={(e) => handleInputChange('suburb', e.target.value)}
                                    required
                                />
                            </div>
                            {fieldErrors.suburb && <span className="field-error">{fieldErrors.suburb}</span>}
                        </div>
                        
                        <div className="input-group">
                            <label>City *</label>
                            <div className="input-with-icon">
                                <LocationCity className="input-icon" />
                                <input
                                    type="text"
                                    placeholder="e.g., Johannesburg"
                                    value={shippingInfo.city}
                                    onChange={(e) => handleInputChange('city', e.target.value)}
                                    required
                                />
                            </div>
                            {fieldErrors.city && <span className="field-error">{fieldErrors.city}</span>}
                        </div>

                        <div className="input-group">
                            <label>Province *</label>
                            <div className="input-with-icon">
                                <Map className="input-icon" />
                                <select
                                    value={shippingInfo.province}
                                    onChange={(e) => handleInputChange('province', e.target.value)}
                                    required
                                >
                                    <option value="">Select Province</option>
                                    {provinces.map(province => (
                                        <option key={province} value={province}>{province}</option>
                                    ))}
                                </select>
                            </div>
                            {fieldErrors.province && <span className="field-error">{fieldErrors.province}</span>}
                        </div>
                        
                        <div className="input-group">
                            <label>Postal Code *</label>
                            <div className="input-with-icon">
                                <LocalPostOffice className="input-icon" />
                                <input
                                    type="text"
                                    placeholder="e.g., 2196"
                                    maxLength="4"
                                    value={shippingInfo.postalCode}
                                    onChange={(e) => handleInputChange('postalCode', e.target.value)}
                                    required
                                />
                            </div>
                            {fieldErrors.postalCode && <span className="field-error">{fieldErrors.postalCode}</span>}
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        className="submit-btn"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <span>Saving Address...</span>
                        ) : (
                            <>
                                Continue to Payment
                                <ArrowForward className="btn-icon" />
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}

