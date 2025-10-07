import React, { useState, useEffect } from "react";
import { fetchCustomerById, updateCustomer } from "../api/api";
import "./Profile.css";

export default function Profile() {
    const [customer, setCustomer] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");

    // Assuming you store customerId in localStorage after login
    const customerId = localStorage.getItem("customerId");

    useEffect(() => {
        const loadCustomer = async () => {
            try {
                const data = await fetchCustomerById(customerId);
                setCustomer({
                    firstName: data.firstName || "",
                    lastName: data.lastName || "",
                    email: data.email || "",
                    phoneNumber: data.phoneNumber || "",
                });
            } catch (err) {
                console.error(err);
                setMessage("Failed to load profile.");
            } finally {
                setLoading(false);
            }
        };
        if (customerId) loadCustomer();
    }, [customerId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCustomer((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        setSaving(true);
        setMessage("");
        try {
            await updateCustomer({ ...customer, customerId: Number(customerId) });
            setMessage("Profile updated successfully!");
        } catch (err) {
            console.error(err);
            setMessage("Failed to update profile.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <p>Loading profile...</p>;

    return (
        <div className="profile-page">
            <h2>Personal Information</h2>
            {message && <p className="profile-success">{message}</p>}
            <div className="profile-form">
                <label>
                    First Name
                    <input
                        type="text"
                        name="firstName"
                        value={customer.firstName}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Last Name
                    <input
                        type="text"
                        name="lastName"
                        value={customer.lastName}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Email
                    <input
                        type="email"
                        name="email"
                        value={customer.email}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Phone Number
                    <input
                        type="text"
                        name="phoneNumber"
                        value={customer.phoneNumber}
                        onChange={handleChange}
                    />
                </label>
                <button className="profile-save-btn" onClick={handleSave} disabled={saving}>
                    {saving ? "Saving..." : "Save Changes"}
                </button>
            </div>
        </div>
    );
}
