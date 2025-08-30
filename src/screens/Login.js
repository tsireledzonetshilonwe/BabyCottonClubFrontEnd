import React, { useState } from 'react';
import { loginCustomer } from '../api/api';

function Login() {
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
      const customer = await loginCustomer(email, password);
      if (customer && customer.id) {
        alert('Login successful!');
        // You can store customer info in localStorage or context here
        window.location.href = '/';
      } else {
        setError('Invalid email or password.');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    }
  };

  return (
    <div className="auth-card">
      <h2 className="auth-title">Login</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="input-group">
          <label htmlFor="login-email">Email</label>
          <div className="input-icon">
            <span className="material-icons">mail</span>
            <input
              id="login-email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoComplete="username"
              required
            />
          </div>
        </div>
        <div className="input-group">
          <label htmlFor="login-password">Password</label>
          <div className="input-icon">
            <span className="material-icons">lock</span>
            <input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
            <span
              className="material-icons password-toggle"
              onClick={() => setShowPassword(s => !s)}
              title={showPassword ? 'Hide password' : 'Show password'}
              style={{ cursor: 'pointer', marginLeft: 8 }}
            >
              {showPassword ? 'visibility_off' : 'visibility'}
            </span>
          </div>
        </div>
        {error && <div className="auth-error">{error}</div>}
        <button className="auth-btn" type="submit">Login</button>
      </form>
      <div className="auth-footer">
        <span>Don't have an account?</span> <a href="/signup">Sign Up</a>
      </div>
    </div>
  );
}

export default Login;
