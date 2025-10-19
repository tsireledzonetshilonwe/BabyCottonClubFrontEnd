// Authentication utility functions

/**
 * Check if user has a valid token
 */
export const hasValidToken = () => {
  const token = localStorage.getItem('token');
  return !!token;
};

/**
 * Get the JWT token from localStorage
 */
export const getToken = () => {
  return localStorage.getItem('token');
};

/**
 * Clear all authentication data
 */
export const clearAuth = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('customer');
  localStorage.removeItem('customerId');
  localStorage.removeItem('admin');
  console.log('🔓 Authentication cleared');
};

/**
 * Check if user is authenticated (has token and customer/admin data)
 */
export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  const customer = localStorage.getItem('customer');
  const admin = localStorage.getItem('admin');
  
  return !!(token && (customer || admin));
};

/**
 * Get current user info
 */
export const getCurrentUser = () => {
  const customerStr = localStorage.getItem('customer');
  const adminStr = localStorage.getItem('admin');
  
  if (customerStr) {
    try {
      return { type: 'customer', data: JSON.parse(customerStr) };
    } catch (e) {
      console.error('Failed to parse customer data:', e);
    }
  }
  
  if (adminStr) {
    try {
      return { type: 'admin', data: JSON.parse(adminStr) };
    } catch (e) {
      console.error('Failed to parse admin data:', e);
    }
  }
  
  return null;
};
