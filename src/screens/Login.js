import React, { useState } from 'react';
import { Mail, Lock, Visibility, VisibilityOff } from '@mui/icons-material';

// API call to login customer
const loginCustomer = async (email, password) => {
  const res = await fetch('http://localhost:8080/api/customer/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) throw new Error('Login failed');
  return res.json();
};

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

      
      if (customer && customer.customerId) {
        alert('Login successful!');

        
        localStorage.setItem('customer', JSON.stringify(customer));

      
        window.location.href = '/';
      } else {
        setError('Invalid email or password.');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
      console.error(err);
    }
  };

  return (
  <div className="auth-card" style={{ fontFamily: 'Roboto, Arial, sans-serif' }}>
  <h2 className="auth-title" style={{ color: '#d32f2f' }}>Login</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="input-group">
          <label htmlFor="login-email">Email</label>
          <div className="input-icon">
            <Mail style={{ marginRight: 8, color: '#888' }} />
            <input
              id="login-email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
              required
            />
          </div>
        </div>

        <div className="input-group">
          <label htmlFor="login-password">Password</label>
          <div className="input-icon">
            <Lock style={{ marginRight: 8, color: '#888' }} />
            <input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
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

        <button className="auth-btn" type="submit" style={{ background: '#d32f2f', color: '#fff', fontWeight: 600 }}>
          Login
        </button>
      </form>

      <div className="auth-footer">
        <span>Don't have an account?</span>{' '}
        <a href="/signup" style={{ textDecoration: 'underline', color: '#d32f2f', fontWeight: 600 }}>
          Sign Up
        </a>
      </div>
    </div>
  );
}

export default Login;
