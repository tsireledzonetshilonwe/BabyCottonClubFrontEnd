import React, { useState } from "react";
import { createAdmin } from "../api/api";
import { useNavigate } from "react-router-dom";
import './AdminSignUp.css';

function AdminSignUp({ setIsAdmin }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    adminCode: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = () => {
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password || !formData.adminCode) {
      setError('Please fill in all required fields.');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return false;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return false;
    }

    // Basic admin code validation (you can make this more sophisticated)
    if (formData.adminCode !== 'BCC-ADMIN-2024') {
      setError('Invalid admin access code.');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address.');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      const adminData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password
      };
      
      const admin = await createAdmin(adminData);
      if (admin && admin.adminId) {
        localStorage.setItem("admin", JSON.stringify(admin));
        if (setIsAdmin) setIsAdmin(true);
        navigate("/admin/dashboard");
      } else {
        setError("Admin registration failed. Please try again.");
      }
    } catch (err) {
      setError("Admin registration failed. Please contact system administrator.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-signup-page">
      <div className="admin-signup-container">
        <div className="admin-signup-card">
          <div className="admin-signup-header">
            <h1 className="admin-signup-title">Admin Registration</h1>
            <p className="admin-signup-subtitle">Create Administrator Account</p>
          </div>

          <form onSubmit={handleSubmit} className="admin-signup-form">
            <div className="admin-name-row">
              <div className="admin-form-group">
                <label htmlFor="firstName" className="admin-form-label">First Name *</label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  placeholder="Enter first name"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="admin-form-input"
                  required
                />
              </div>

              <div className="admin-form-group">
                <label htmlFor="lastName" className="admin-form-label">Last Name *</label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  placeholder="Enter last name"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="admin-form-input"
                  required
                />
              </div>
            </div>

            <div className="admin-form-group">
              <label htmlFor="email" className="admin-form-label">Admin Email *</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="admin@babycottonclub.com"
                value={formData.email}
                onChange={handleChange}
                className="admin-form-input"
                autoComplete="username"
                required
              />
            </div>

            <div className="admin-form-group">
              <label htmlFor="adminCode" className="admin-form-label">Admin Access Code *</label>
              <input
                id="adminCode"
                name="adminCode"
                type="password"
                placeholder="Enter admin access code"
                value={formData.adminCode}
                onChange={handleChange}
                className="admin-form-input"
                required
              />
            </div>

            <div className="admin-form-group">
              <label htmlFor="password" className="admin-form-label">Password *</label>
              <div className="admin-input-wrapper">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create secure password"
                  value={formData.password}
                  onChange={handleChange}
                  className="admin-form-input"
                  autoComplete="new-password"
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

            <div className="admin-form-group">
              <label htmlFor="confirmPassword" className="admin-form-label">Confirm Password *</label>
              <div className="admin-input-wrapper">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="admin-form-input"
                  required
                />
                <button
                  type="button"
                  className="admin-password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
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
              className="admin-signup-button"
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Create Admin Account'}
            </button>
          </form>

          <div className="admin-signup-footer">
            <p>Already have admin access? 
              <a href="/admin/login" className="admin-login-link">Sign In</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminSignUp;
