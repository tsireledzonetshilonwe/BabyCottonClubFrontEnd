import React, { useState } from 'react';
import { createCustomer } from '../api/api';

function SignUp() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!firstName || !lastName || !email || !phoneNumber || !password) {
      setError('Please fill in all fields.');
      return;
    }
    setError('');
    try {
      const customerData = {
        firstName,
        lastName,
        email,
        phoneNumber,
        password
      };
      await createCustomer(customerData);
      alert('Sign up successful! You can now log in.');
      window.location.href = '/login';
    } catch (err) {
      console.error('Sign up error:', err, err?.response?.data);
      setError('Sign up failed. Please try again.');
    }
  };

  return (
    <div className="auth-card">
      <h2 className="auth-title">Sign Up</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        
        {/* First Name */}
        <div className="input-group">
          <label htmlFor="signup-firstname">First Name</label>
          <div className="input-icon">
            <span className="material-icons">person</span>
            <input
              id="signup-firstname"
              type="text"
              placeholder="Enter your first name"
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Last Name */}
        <div className="input-group">
          <label htmlFor="signup-lastname">Last Name</label>
          <div className="input-icon">
            <span className="material-icons">person_outline</span>
            <input
              id="signup-lastname"
              type="text"
              placeholder="Enter your last name"
              value={lastName}
              onChange={e => setLastName(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Email */}
        <div className="input-group">
          <label htmlFor="signup-email">Email</label>
          <div className="input-icon">
            <span className="material-icons">mail</span>
            <input
              id="signup-email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoComplete="username"
              required
            />
          </div>
        </div>

        {/* Phone Number */}
        <div className="input-group">
          <label htmlFor="signup-phone">Phone Number</label>
          <div className="input-icon">
            <span className="material-icons">phone</span>
            <input
              id="signup-phone"
              type="tel"
              placeholder="Enter your phone number"
              value={phoneNumber}
              onChange={e => setPhoneNumber(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Password */}
        <div className="input-group">
          <label htmlFor="signup-password">Password</label>
          <div className="input-icon">
            <span className="material-icons">lock</span>
            <input
              id="signup-password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Create a password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="new-password"
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

        {/* Error Message */}
        {error && <div className="auth-error">{error}</div>}

        {/* Submit Button */}
        <button className="auth-btn" type="submit">Sign Up</button>
      </form>

      <div className="auth-footer">
        <span>Already have an account?</span>{' '}
        <a href="/login" style={{ textDecoration: 'underline', color: '#d32f2f', fontWeight: 600 }}>
          Login
        </a>
      </div>
    </div>
  );
}

export default SignUp;
