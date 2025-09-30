import React, { useState } from 'react';
import { createCustomer } from '../api/api';
import { Person, Mail, Phone, Lock, Visibility, VisibilityOff } from '@mui/icons-material';
import "./SignUp.css";

function SignUp() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  // Validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^[\+]?[\d\s\-\(\)]{10,15}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  };

  const validateName = (name) => {
    const nameRegex = /^[a-zA-Z\s]+$/;
    return nameRegex.test(name) && name.length >= 2;
  };

  const validatePassword = (password) => {
    return password.length >= 6;
  };

  // Real-time field validation
  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    if (value && !validateEmail(value)) {
      setFieldErrors(prev => ({ ...prev, email: 'Please enter a valid email address' }));
    } else {
      setFieldErrors(prev => ({ ...prev, email: '' }));
    }
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    setPhoneNumber(value);
    if (value && !validatePhone(value)) {
      setFieldErrors(prev => ({ ...prev, phone: 'Please enter a valid phone number' }));
    } else {
      setFieldErrors(prev => ({ ...prev, phone: '' }));
    }
  };

  const handleFirstNameChange = (e) => {
    const value = e.target.value;
    setFirstName(value);
    if (value && !validateName(value)) {
      setFieldErrors(prev => ({ ...prev, firstName: 'Name should only contain letters (min 2 chars)' }));
    } else {
      setFieldErrors(prev => ({ ...prev, firstName: '' }));
    }
  };

  const handleLastNameChange = (e) => {
    const value = e.target.value;
    setLastName(value);
    if (value && !validateName(value)) {
      setFieldErrors(prev => ({ ...prev, lastName: 'Name should only contain letters (min 2 chars)' }));
    } else {
      setFieldErrors(prev => ({ ...prev, lastName: '' }));
    }
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    if (value && !validatePassword(value)) {
      setFieldErrors(prev => ({ ...prev, password: 'Password must be at least 6 characters long' }));
    } else {
      setFieldErrors(prev => ({ ...prev, password: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic field validation
    if (!firstName || !lastName || !email || !phoneNumber || !password) {
      setError('Please fill in all fields.');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    // Phone number validation (basic format check)
    const phoneRegex = /^[\+]?[\d\s\-\(\)]{10,15}$/;
    if (!phoneRegex.test(phoneNumber.replace(/\s/g, ''))) {
      setError('Please enter a valid phone number (10-15 digits).');
      return;
    }

    // Password validation
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    // Name validation (no numbers or special characters)
    const nameRegex = /^[a-zA-Z\s]+$/;
    if (!nameRegex.test(firstName)) {
      setError('First name should only contain letters.');
      return;
    }
    if (!nameRegex.test(lastName)) {
      setError('Last name should only contain letters.');
      return;
    }

    setError('');
    try {
      const customerData = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim().toLowerCase(),
        phoneNumber: phoneNumber.trim(),
        password
      };
      await createCustomer(customerData);
      alert('Sign up successful! You can now log in.');
      window.location.href = '/login';
    } catch (err) {
      console.error('Sign up error:', err, err?.response?.data);
      if (err?.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err?.response?.status === 409) {
        setError('Email already exists. Please use a different email or login.');
      } else {
        setError('Sign up failed. Please try again.');
      }
    }
  };

  return (
  <div className="auth-card" style={{ fontFamily: 'Roboto, Arial, sans-serif' }}>
  <h2 className="auth-title">Sign Up</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        
        {/* First Name */}
        <div className="input-group">
          <label htmlFor="signup-firstname">First Name</label>
          <div className="input-icon">
            <Person style={{ marginRight: 8, color: '#888' }} />
            <input
              id="signup-firstname"
              type="text"
              placeholder="Enter your first name"
              value={firstName}
              onChange={handleFirstNameChange}
              required
            />
          </div>
          {fieldErrors.firstName && <div className="field-error">{fieldErrors.firstName}</div>}
        </div>

        {/* Last Name */}
        <div className="input-group">
          <label htmlFor="signup-lastname">Last Name</label>
          <div className="input-icon">
            <Person style={{ marginRight: 8, color: '#888' }} />
            <input
              id="signup-lastname"
              type="text"
              placeholder="Enter your last name"
              value={lastName}
              onChange={handleLastNameChange}
              required
            />
          </div>
          {fieldErrors.lastName && <div className="field-error">{fieldErrors.lastName}</div>}
        </div>

        {/* Email */}
        <div className="input-group">
          <label htmlFor="signup-email">Email</label>
          <div className="input-icon">
            <Mail style={{ marginRight: 8, color: '#888' }} />
            <input
              id="signup-email"
              type="email"
              placeholder="Enter your email (e.g., john@example.com)"
              value={email}
              onChange={handleEmailChange}
              autoComplete="username"
              required
            />
          </div>
          {fieldErrors.email && <div className="field-error">{fieldErrors.email}</div>}
        </div>

        {/* Phone Number */}
        <div className="input-group">
          <label htmlFor="signup-phone">Phone Number</label>
          <div className="input-icon">
            <Phone style={{ marginRight: 8, color: '#888' }} />
            <input
              id="signup-phone"
              type="tel"
              placeholder="Enter your phone number (e.g., +27 123 456 7890)"
              value={phoneNumber}
              onChange={handlePhoneChange}
              required
            />
          </div>
          {fieldErrors.phone && <div className="field-error">{fieldErrors.phone}</div>}
        </div>

        {/* Password */}
        <div className="input-group">
          <label htmlFor="signup-password">Password</label>
          <div className="input-icon">
            <Lock style={{ marginRight: 8, color: '#888' }} />
            <input
              id="signup-password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Create a password (min. 6 characters)"
              value={password}
              onChange={handlePasswordChange}
              autoComplete="new-password"
              required
            />
            {showPassword ? (
              <VisibilityOff
                className="password-toggle"
                onClick={() => setShowPassword(s => !s)}
                title="Hide password"
                style={{ cursor: 'pointer', marginLeft: 8 }}
              />
            ) : (
              <Visibility
                className="password-toggle"
                onClick={() => setShowPassword(s => !s)}
                title="Show password"
                style={{ cursor: 'pointer', marginLeft: 8 }}
              />
            )}
          </div>
          {fieldErrors.password && <div className="field-error">{fieldErrors.password}</div>}
        </div>

        {/* Error Message */}
        {error && <div className="auth-error">{error}</div>}

        {/* Submit Button */}
  <button className="auth-btn" type="submit">Sign Up</button>
      </form>

      <div className="auth-footer">
        <span>Already have an account?</span>{' '}
        <a href="/login" style={{ textDecoration: 'underline', fontWeight: 600 }}>
          Login
        </a>
      </div>
    </div>
  );
}

export default SignUp;