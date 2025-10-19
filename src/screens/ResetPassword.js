import React, { useState } from 'react';
import { resetPassword } from '../api/api'; // create this API call
import './ResetPassword.css';

function ResetPassword() {
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!token || !newPassword) return setError('All fields are required.');

    setLoading(true);
    try {
      const response = await resetPassword(token, newPassword);
      if (response) {
        setMessage('Password reset successful. You can now login.');
      } else {
        setError('Invalid token or token expired.');
      }
    } catch (err) {
      setError('Password reset failed.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-page">
      <h2>Reset Password</h2>
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          placeholder="Enter reset token" 
          value={token} 
          onChange={(e) => setToken(e.target.value)} 
          required 
        />
        <input 
          type="password" 
          placeholder="Enter new password" 
          value={newPassword} 
          onChange={(e) => setNewPassword(e.target.value)} 
          required 
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Resetting...' : 'Reset Password'}
        </button>
      </form>
      {message && <p className="success">{message}</p>}
      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default ResetPassword;
