import React, { useState } from "react";
import { createAdmin } from "../api/api";
import { useNavigate } from "react-router-dom";

function AdminSignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }
    try {
      const adminData = { email, password };
      const admin = await createAdmin(adminData);
      if (admin && admin.adminId) {
        localStorage.setItem("admin", JSON.stringify(admin));
        navigate("/admin/dashboard");
      } else {
        setError("Sign up failed. Please try again.");
      }
    } catch (err) {
      setError("Sign up failed. Please try again.");
    }
  };

  return (
    <div className="auth-card" style={{ fontFamily: 'Roboto, Arial, sans-serif' }}>
      <h2 className="auth-title" style={{ color: '#d32f2f' }}>Admin Sign Up</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="input-group">
          <label htmlFor="admin-signup-email">Email</label>
          <div className="input-icon">
            <input
              id="admin-signup-email"
              type="email"
              placeholder="Admin Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoComplete="username"
              required
            />
          </div>
        </div>
        <div className="input-group">
          <label htmlFor="admin-signup-password">Password</label>
          <div className="input-icon">
            <input
              id="admin-signup-password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="new-password"
              required
            />
          </div>
        </div>
        {error && <div className="auth-error">{error}</div>}
        <button className="auth-btn" type="submit" style={{ background: '#d32f2f', color: '#fff', fontWeight: 600 }}>
          Sign Up
        </button>
      </form>
      <div className="auth-footer">
        <span>Already have an admin account?</span>{' '}
        <a href="/login/admin" style={{ textDecoration: 'underline', color: '#d32f2f', fontWeight: 600 }}>
          Login
        </a>
      </div>
    </div>
  );
}

export default AdminSignUp;
