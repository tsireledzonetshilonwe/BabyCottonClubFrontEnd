import React, { useEffect, useState } from "react";
import { getStoredCustomer } from "../utils/customer";
import "./Customers.css";

function Customers() {
  const [customer, setCustomer] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    // Use normalized stored customer
    const parsed = getStoredCustomer();
    if (parsed && parsed.customerId) {
      setCustomer(parsed);
    } else {
      setError("You are not logged in.");
    }
  }, []);

  if (error) {
    return <div style={{ margin: "2rem", color: "#d32f2f" }}>{error}</div>;
  }
  if (!customer) {
    return <div style={{ margin: "2rem" }}>Loading your account...</div>;
  }

  return (
    <div className="my-account-page" style={{ maxWidth: 500, margin: "2rem auto", background: "#fff", borderRadius: 12, boxShadow: "0 2px 16px rgba(44,62,80,0.08)", padding: "2rem" }}>
      <h2 style={{ color: "#023e8a" }}>My Account</h2>
      <div style={{ marginBottom: 16 }}>
        <strong>Name:</strong> {customer.firstName} {customer.lastName}
      </div>
      <div style={{ marginBottom: 16 }}>
        <strong>Email:</strong> {customer.email}
      </div>
      <div style={{ marginBottom: 16 }}>
        <strong>Phone:</strong> {customer.phoneNumber || customer.phone}
      </div>
      {/* Add more fields as needed */}
    </div>
  );
}

export default Customers;
