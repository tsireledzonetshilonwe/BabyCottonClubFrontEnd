import React, { useState } from 'react';
import { Mail, Lock, Visibility, VisibilityOff } from '@mui/icons-material';
import { loginAdmin } from '../api/api';
import "./Login.css"; // Reuse the same styling

function AdminLogin({ setIsAdmin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setError('');

    try {
      const admin = await loginAdmin(email, password);

      if (admin && admin.adminId) {
        alert('Admin login successful!');
        // Store admin object for admin dashboard access
        localStorage.setItem('admin', JSON.stringify(admin));
        localStorage.setItem('adminId', admin.adminId);
        if (setIsAdmin) setIsAdmin(true);
        window.location.href = '/admin/dashboard';
      } else {
        setError('Invalid admin email or password.');
      }
    } catch (err) {
      setError('Admin login failed. Please try again.');
      console.error(err);
    }
  };

  return (
    <div className="auth-card" style={{ fontFamily: 'Roboto, Arial, sans-serif' }}>
      <h2 className="auth-title">Admin Login</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="input-group">
          <label htmlFor="admin-email">Admin Email</label>
          <div className="input-icon">
            <Mail style={{ marginRight: 8, color: '#888' }} />
            <input
              id="admin-email"
              type="email"
              placeholder="Enter admin email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
              required
            />
          </div>
        </div>

        <div className="input-group">
          <label htmlFor="admin-password">Password</label>
          <div className="input-icon">
            <Lock style={{ marginRight: 8, color: '#888' }} />
            <input
              id="admin-password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
            {showPassword ? (
              <VisibilityOff
                className="password-toggle"
                onClick={() => setShowPassword((s) => !s)}
                title="Hide password"
                style={{ cursor: 'pointer', marginLeft: 8 }}
              />
            ) : (
              <Visibility
                className="password-toggle"
                onClick={() => setShowPassword((s) => !s)}
                title="Show password"
                style={{ cursor: 'pointer', marginLeft: 8 }}
              />
            )}
          </div>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <button className="auth-btn" type="submit">
          Admin Login
        </button>
      </form>

      <div className="auth-footer">
        <span>Need an admin account?</span>{' '}
        <a href="/signup/admin" style={{ textDecoration: 'underline', fontWeight: 600 }}>
          Admin Sign Up
        </a>
      </div>
      
      <div className="auth-footer" style={{ marginTop: '1rem' }}>
        <span>Not an admin?</span>{' '}
        <a href="/login" style={{ textDecoration: 'underline', fontWeight: 600 }}>
          Customer Login
        </a>
      </div>
    </div>
  );
}

export default AdminLogin;