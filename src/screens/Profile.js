import React, { useState, useEffect } from 'react';
import { 
  Person, Mail, Phone, Lock, Edit, Save, Cancel, Visibility, VisibilityOff,
  ShoppingBag, History, Favorite, LocationOn, CreditCard, Security,
  AccountCircle, Dashboard, Settings, Star, TrendingUp, Receipt
} from '@mui/icons-material';
import { fetchCustomerById, fetchOrdersByCustomer } from '../api/api';
import "./Profile.css";

function Profile() {
  const [customer, setCustomer] = useState(null);
  const [orders, setOrders] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [error, setError] = useState('');
  const [updateError, setUpdateError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [successMessage, setSuccessMessage] = useState('');
  
  // Form states for editing
  const [editData, setEditData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: ''
  });

  useEffect(() => {
    loadCustomerData();
  }, []);

  useEffect(() => {
    if (activeTab === 'orders' && customer) {
      loadOrderHistory();
    }
  }, [activeTab, customer]);

  const loadCustomerData = async () => {
    try {
      const storedCustomer = JSON.parse(localStorage.getItem("customer") || "{}");
      
      if (!storedCustomer.customerId) {
        setError('Please log in to view your profile.');
        setLoading(false);
        return;
      }

      // Fetch fresh customer data from backend
      const customerData = await fetchCustomerById(storedCustomer.customerId);
      setCustomer(customerData);
      
      // Initialize edit form with current data
      setEditData({
        firstName: customerData.firstName || '',
        lastName: customerData.lastName || '',
        email: customerData.email || '',
        phoneNumber: customerData.phoneNumber || '',
        password: '' // Don't pre-fill password for security
      });

      setLoading(false);
    } catch (err) {
      console.error('Error loading customer data:', err);
      setError('Failed to load profile data.');
      setLoading(false);
    }
  };

  const loadOrderHistory = async () => {
    try {
      setOrdersLoading(true);
      
      // Primary approach: Get customer data with orders (same as Orders.js)
      if (customer.customerId) {
        try {
          const response = await fetch(`http://localhost:8080/api/customer/read/${customer.customerId}`);
          if (response.ok) {
            const customerData = await response.json();
            
            // Get orders from customer data
            const customerOrders = customerData.orders || customerData.customerOrders || [];
            
            setOrders(customerOrders);
            setOrdersLoading(false);
            return;
          }
        } catch (customerErr) {
          // Continue to fallback method
        }
      }

      // Fallback: Try fetching by email if available
      if (customer.email) {
        try {
          const orderData = await fetchOrdersByCustomer(customer.email);
          setOrders(orderData || []);
          setOrdersLoading(false);
          return;
        } catch (emailErr) {
          // Continue to empty array
        }
      }

      // If both approaches fail, set empty array
      setOrders([]);
      
    } catch (err) {
      console.error('Error loading orders:', err);
      setOrders([]);
    } finally {
      setOrdersLoading(false);
    }
  };

  const handleEditToggle = () => {
    if (isEditing) {
      // Cancel editing - reset form data
      setEditData({
        firstName: customer.firstName || '',
        lastName: customer.lastName || '',
        email: customer.email || '',
        phoneNumber: customer.phoneNumber || '',
        password: ''
      });
      setUpdateError('');
    }
    setIsEditing(!isEditing);
  };

  const handleInputChange = (field, value) => {
    setEditData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    try {
      setUpdateError('');
      setSuccessMessage('');
      
      // Validate required fields
      if (!editData.firstName || !editData.lastName || !editData.email || !editData.phoneNumber) {
        setUpdateError('Please fill in all required fields.');
        return;
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(editData.email)) {
        setUpdateError('Please enter a valid email address.');
        return;
      }

      // Phone validation
      const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
      if (!phoneRegex.test(editData.phoneNumber.replace(/\s/g, ''))) {
        setUpdateError('Please enter a valid phone number.');
        return;
      }

      // Prepare update data (only include password if it was changed)
      const updateData = {
        customerId: customer.customerId,
        firstName: editData.firstName,
        lastName: editData.lastName,
        email: editData.email,
        phoneNumber: editData.phoneNumber
      };

      if (editData.password && editData.password.length >= 6) {
        updateData.password = editData.password;
      } else if (editData.password && editData.password.length < 6) {
        setUpdateError('Password must be at least 6 characters long.');
        return;
      }

      // Call update API
      const response = await fetch(`http://localhost:8080/api/customer/update/${customer.customerId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        throw new Error('Update failed');
      }

      const updatedCustomer = await response.json();
      
      // Update local state and localStorage
      setCustomer(updatedCustomer);
      localStorage.setItem('customer', JSON.stringify(updatedCustomer));
      
      setIsEditing(false);
      setEditData(prev => ({ ...prev, password: '' })); // Clear password field
      setSuccessMessage('Profile updated successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);

    } catch (err) {
      console.error('Error updating profile:', err);
      setUpdateError('Failed to update profile. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="profile-container">
        <div className="profile-loading">
          <AccountCircle style={{ fontSize: '3rem', color: '#3182ce', marginBottom: '1rem' }} />
          <div>Loading your profile...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-container">
        <div className="profile-error-page">
          <Security style={{ fontSize: '3rem', color: '#e53e3e', marginBottom: '1rem' }} />
          <div className="profile-error">{error}</div>
          <a href="/login" className="profile-login-link">Go to Login</a>
        </div>
      </div>
    );
  }

  const calculateAccountStats = () => {
    // Handle case when orders might not be loaded yet
    if (!orders || orders.length === 0) {
      return { totalOrders: 0, totalSpent: 0, averageOrder: 0, recentOrders: 0 };
    }

    const totalOrders = orders.length;
    const totalSpent = orders.reduce((sum, order) => {
      const amount = order.totalAmount || order.total || order.totalPrice || 0;
      return sum + amount;
    }, 0);
    const averageOrder = totalOrders > 0 ? totalSpent / totalOrders : 0;
    const recentOrders = orders.filter(order => {
      const orderDate = new Date(order.orderDate || order.createdAt);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return orderDate >= thirtyDaysAgo;
    }).length;

    return { totalOrders, totalSpent, averageOrder, recentOrders };
  };

  const stats = calculateAccountStats();

  return (
    <div className="profile-container">
      <div className="profile-wrapper">
        {/* Profile Header */}
        <div className="profile-hero">
          <div className="profile-avatar">
            <AccountCircle style={{ fontSize: '4rem', color: '#3182ce' }} />
          </div>
          <div className="profile-hero-info">
            <h1>{customer?.firstName} {customer?.lastName}</h1>
            <p>{customer?.email}</p>
            <span className="profile-member-badge">
              Member since {customer?.createdAt ? new Date(customer.createdAt).getFullYear() : 'N/A'}
            </span>
          </div>
          <div className="profile-hero-stats">
            <div className="stat-item">
              <ShoppingBag style={{ color: '#3182ce' }} />
              <span>{stats.totalOrders}</span>
              <label>Orders</label>
            </div>
            <div className="stat-item">
              <TrendingUp style={{ color: '#38a169' }} />
              <span>R{stats.totalSpent.toFixed(2)}</span>
              <label>Total Spent</label>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="profile-tabs">
          <button 
            className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <Person style={{ marginRight: '0.5rem' }} />
            Profile Info
          </button>
          <button 
            className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            <Receipt style={{ marginRight: '0.5rem' }} />
            Order History
          </button>
          <button 
            className={`tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <Dashboard style={{ marginRight: '0.5rem' }} />
            Dashboard
          </button>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="profile-success">{successMessage}</div>
        )}

        {/* Tab Content */}
        <div className="profile-content">
          {activeTab === 'profile' && renderProfileTab()}
          {activeTab === 'orders' && renderOrdersTab()}
          {activeTab === 'dashboard' && renderDashboardTab()}
        </div>
      </div>
    </div>
  );

  function renderProfileTab() {
    return (
      <div className="profile-card">
        <div className="profile-header">
          <h2 className="profile-title">Personal Information</h2>
          <button 
            className={`profile-edit-btn ${isEditing ? 'cancel' : 'edit'}`}
            onClick={handleEditToggle}
          >
            {isEditing ? (
              <>
                <Cancel style={{ marginRight: 8 }} />
                Cancel
              </>
            ) : (
              <>
                <Edit style={{ marginRight: 8 }} />
                Edit Profile
              </>
            )}
          </button>
        </div>
        <div className="profile-form-content">
          {/* First Name */}
          <div className="profile-field">
            <label>First Name</label>
            {isEditing ? (
              <div className="input-icon">
                <Person style={{ marginRight: 8, color: '#888' }} />
                <input
                  type="text"
                  value={editData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  placeholder="Enter first name"
                  required
                />
              </div>
            ) : (
              <div className="profile-value">
                <Person style={{ marginRight: 8, color: '#3182ce' }} />
                {customer.firstName}
              </div>
            )}
          </div>

          {/* Last Name */}
          <div className="profile-field">
            <label>Last Name</label>
            {isEditing ? (
              <div className="input-icon">
                <Person style={{ marginRight: 8, color: '#888' }} />
                <input
                  type="text"
                  value={editData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  placeholder="Enter last name"
                  required
                />
              </div>
            ) : (
              <div className="profile-value">
                <Person style={{ marginRight: 8, color: '#3182ce' }} />
                {customer.lastName}
              </div>
            )}
          </div>

          {/* Email */}
          <div className="profile-field">
            <label>Email</label>
            {isEditing ? (
              <div className="input-icon">
                <Mail style={{ marginRight: 8, color: '#888' }} />
                <input
                  type="email"
                  value={editData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Enter email address"
                  required
                />
              </div>
            ) : (
              <div className="profile-value">
                <Mail style={{ marginRight: 8, color: '#3182ce' }} />
                {customer.email}
              </div>
            )}
          </div>

          {/* Phone Number */}
          <div className="profile-field">
            <label>Phone Number</label>
            {isEditing ? (
              <div className="input-icon">
                <Phone style={{ marginRight: 8, color: '#888' }} />
                <input
                  type="tel"
                  value={editData.phoneNumber}
                  onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                  placeholder="Enter phone number"
                  required
                />
              </div>
            ) : (
              <div className="profile-value">
                <Phone style={{ marginRight: 8, color: '#3182ce' }} />
                {customer.phoneNumber}
              </div>
            )}
          </div>

          {/* Password - Only show in edit mode */}
          {isEditing && (
            <div className="profile-field">
              <label>Password (leave blank to keep current)</label>
              <div className="input-icon">
                <Lock style={{ marginRight: 8, color: '#888' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={editData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="Enter new password (min. 6 characters)"
                />
                {showPassword ? (
                  <VisibilityOff
                    className="password-toggle"
                    onClick={() => setShowPassword(false)}
                    style={{ cursor: 'pointer', marginLeft: 8 }}
                  />
                ) : (
                  <Visibility
                    className="password-toggle"
                    onClick={() => setShowPassword(true)}
                    style={{ cursor: 'pointer', marginLeft: 8 }}
                  />
                )}
              </div>
            </div>
          )}

          {/* Update Error */}
          {updateError && (
            <div className="profile-error">{updateError}</div>
          )}

          {/* Save Button - Only show in edit mode */}
          {isEditing && (
            <button className="profile-save-btn" onClick={handleSave}>
              <Save style={{ marginRight: 8 }} />
              Save Changes
            </button>
          )}
        </div>

        {/* Customer Info */}
        <div className="profile-info">
          <p><strong>Customer ID:</strong> {customer.customerId}</p>
          <p><strong>Member since:</strong> {customer.createdAt ? new Date(customer.createdAt).toLocaleDateString() : 'N/A'}</p>
          <p><strong>Account Status:</strong> <span className="status-active">Active</span></p>
        </div>
      </div>
    );
  }

  function renderOrdersTab() {
    return (
      <div className="profile-card">
        <div className="profile-header">
          <h2 className="profile-title">Order History</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span className="order-count">{orders.length} total orders</span>
            <button 
              className="refresh-orders-btn"
              onClick={loadOrderHistory}
              disabled={ordersLoading}
              style={{
                padding: '0.5rem 1rem',
                background: '#3182ce',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: ordersLoading ? 'not-allowed' : 'pointer',
                opacity: ordersLoading ? 0.6 : 1,
                fontSize: '0.9rem',
                fontWeight: '600'
              }}
            >
              {ordersLoading ? 'Loading...' : 'Refresh Orders'}
            </button>
          </div>
        </div>
        
        {ordersLoading ? (
          <div className="orders-loading">
            <Receipt style={{ fontSize: '2rem', color: '#3182ce', marginBottom: '1rem' }} />
            Loading your orders...
          </div>
        ) : orders.length === 0 ? (
          <div className="no-orders">
            <ShoppingBag style={{ fontSize: '3rem', color: '#cbd5e0', marginBottom: '1rem' }} />
            <h3>No orders yet</h3>
            <p>Start shopping to see your order history here!</p>
            <a href="/products" className="shop-now-btn">
              <ShoppingBag style={{ marginRight: '0.5rem' }} />
              Start Shopping
            </a>
          </div>
        ) : (
          <div className="orders-list">
            {orders.slice(0, 5).map((order, index) => (
              <div key={order.orderId || order.id || index} className="order-item">
                <div className="order-header">
                  <div className="order-id">
                    <Receipt style={{ marginRight: '0.5rem', color: '#3182ce' }} />
                    Order #{order.orderId || order.id || `ORD-${index + 1}`}
                  </div>
                  <div className="order-date">
                    {order.orderDate || order.createdAt ? 
                      new Date(order.orderDate || order.createdAt).toLocaleDateString() : 
                      'Date N/A'
                    }
                  </div>
                </div>
                <div className="order-details">
                  <span className="order-status">
                    {order.status || order.orderStatus || 'Processing'}
                  </span>
                  <span className="order-total">
                    R{(order.totalAmount || order.total || order.totalPrice || 0).toFixed(2)}
                  </span>
                </div>
                {/* Order Items Summary */}
                {(order.orderLines || order.items) && (
                  <div className="order-items-summary">
                    <small>
                      {(order.orderLines || order.items).length} item(s)
                      {order.orderLines && order.orderLines.length > 0 && order.orderLines[0].product && 
                        ` - ${order.orderLines[0].product.name}${order.orderLines.length > 1 ? ` and ${order.orderLines.length - 1} more` : ''}`
                      }
                    </small>
                  </div>
                )}
              </div>
            ))}
            {orders.length > 5 && (
              <a href="/orders" className="view-all-orders">
                View All Orders ({orders.length})
              </a>
            )}
          </div>
        )}
      </div>
    );
  }

  function renderDashboardTab() {
    return (
      <div className="dashboard-content">
        {/* Account Statistics */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">
              <ShoppingBag style={{ color: '#3182ce' }} />
            </div>
            <div className="stat-info">
              <h3>{stats.totalOrders}</h3>
              <p>Total Orders</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">
              <TrendingUp style={{ color: '#38a169' }} />
            </div>
            <div className="stat-info">
              <h3>R{stats.totalSpent.toFixed(2)}</h3>
              <p>Total Spent</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">
              <Star style={{ color: '#f6ad55' }} />
            </div>
            <div className="stat-info">
              <h3>R{stats.averageOrder.toFixed(2)}</h3>
              <p>Average Order</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">
              <History style={{ color: '#9f7aea' }} />
            </div>
            <div className="stat-info">
              <h3>{stats.recentOrders}</h3>
              <p>Recent Orders</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="profile-card">
          <h3>Quick Actions</h3>
          <div className="quick-actions">
            <a href="/products" className="action-card">
              <ShoppingBag style={{ color: '#3182ce' }} />
              <span>Browse Products</span>
            </a>
            <a href="/cart" className="action-card">
              <History style={{ color: '#38a169' }} />
              <span>View Cart</span>
            </a>
            <a href="/orders" className="action-card">
              <Receipt style={{ color: '#f6ad55' }} />
              <span>Order History</span>
            </a>
            <button 
              className="action-card" 
              onClick={() => setActiveTab('profile')}
            >
              <Settings style={{ color: '#9f7aea' }} />
              <span>Edit Profile</span>
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default Profile;