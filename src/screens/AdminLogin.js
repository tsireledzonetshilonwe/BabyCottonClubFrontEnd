import React, { useState } from "react";
import { loginAdmin } from "../api/api";
import { useNavigate } from "react-router-dom";

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Accept setIsAdmin as a prop
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const admin = await loginAdmin(email, password);
      if (admin && admin.adminId) {
        localStorage.setItem("admin", JSON.stringify(admin));
        if (typeof window.setIsAdmin === "function") window.setIsAdmin(true);
        if (typeof window.setIsAdmin !== "function" && typeof setIsAdmin === "function") setIsAdmin(true);
        navigate("/admin/dashboard");
      } else {
        setError("Invalid admin credentials");
      }
    } catch (err) {
      setError("Login failed. Please try again.");
    }
  };

  return (
    <div className="auth-card" style={{ fontFamily: 'Roboto, Arial, sans-serif' }}>
      <h2 className="auth-title" style={{ color: '#d32f2f' }}>Admin Login</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="input-group">
          <label htmlFor="admin-login-email">Email</label>
          <div className="input-icon">
            <input
              id="admin-login-email"
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
          <label htmlFor="admin-login-password">Password</label>
          <div className="input-icon">
            <input
              id="admin-login-password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>
        </div>
        {error && <div className="auth-error">{error}</div>}
        <button className="auth-btn" type="submit" style={{ background: '#d32f2f', color: '#fff', fontWeight: 600 }}>
          Login
        </button>
      </form>
      <div className="auth-footer">
        <span>Don't have an admin account?</span>{' '}
        <a href="/signup/admin" style={{ textDecoration: 'underline', color: '#d32f2f', fontWeight: 600 }}>
          Sign Up
        </a>
      </div>
    </div>
  );
}

export default AdminLogin;
