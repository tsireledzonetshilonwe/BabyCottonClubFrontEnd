import React, { useState } from 'react';
import { sendResetToken } from '../api/api'; // create this API call
import { Link } from 'react-router-dom'; // for navigation link
import './ForgotPassword.css';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    if (!email) return setError('Please enter your email.');

    setLoading(true);
    try {
      const response = await sendResetToken(email);
      if (response) {
        setMessage('Check your email for the reset token.');
      } else {
        setError('Email not found.');
      }
    } catch (err) {
      setError('Failed to send reset token.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-page">
      <h2>Forgot Password</h2>
      <form onSubmit={handleSubmit}>
        <input 
          type="email" 
          placeholder="Enter your email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Sending...' : 'Send Reset Token'}
        </button>
      </form>

      {message && <p className="success">{message}</p>}
      {error && <p className="error">{error}</p>}

      <p className="reset-link">
        Already have a token? <Link to="/reset-password">Reset your password</Link>
      </p>
    </div>
  );
}

export default ForgotPassword;
