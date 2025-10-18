import React, { useState } from "react";
import { loginAdmin } from "../api/api";
import { useNavigate } from "react-router-dom";
import './AdminLogin.css';

function AdminLogin({ setIsAdmin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    try {
      const admin = await loginAdmin(email, password);
      if (admin && (admin.adminId || admin.id)) {
        // Persist the full admin object
        localStorage.setItem("admin", JSON.stringify(admin));
        // If the server returned a token (common property names), store it separately
        const token = admin?.token || admin?.accessToken || admin?.authToken || admin?.jwt || admin?.bearer;
        if (token) {
          localStorage.setItem('adminToken', token);
        }
        if (setIsAdmin) setIsAdmin(true);
        navigate("/admin/dashboard");
      } else {
        setError("Invalid admin credentials");
      }
    } catch (err) {
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-container">
        <div className="admin-login-card">
          <div className="admin-login-header">
            <h1 className="admin-login-title">Admin Portal</h1>
            <p className="admin-login-subtitle">Secure Administrator Access</p>
          </div>

          <form onSubmit={handleSubmit} className="admin-login-form">
            <div className="admin-form-group">
              <label htmlFor="admin-login-email" className="admin-form-label">Admin Email</label>
              <div className="admin-input-wrapper">
                <input
                  id="admin-login-email"
                  type="email"
                  placeholder="Enter admin email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="admin-form-input"
                  autoComplete="username"
                  required
                />
              </div>
            </div>

            <div className="admin-form-group">
              <label htmlFor="admin-login-password" className="admin-form-label">Password</label>
              <div className="admin-input-wrapper">
                <input
                  id="admin-login-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter admin password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="admin-form-input"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className="admin-password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                      <line x1="1" y1="1" x2="23" y2="23"></line>
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="admin-error-message">
                {error}
              </div>
            )}

            <button 
              type="submit" 
              className="admin-login-button"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Admin Login'}
            </button>
          </form>

          <div className="admin-login-footer">
            <p>Need admin account? 
              <a href="/admin/signup" className="admin-signup-link">Request Access</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
