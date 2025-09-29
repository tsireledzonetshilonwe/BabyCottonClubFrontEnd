import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Header = () => {
  const { cartItems } = useCart();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef(null);
  
  // Simple auth check using localStorage (like the original Navbar)
  const isLoggedIn = !!localStorage.getItem("customer");
  const isAdmin = !!localStorage.getItem("admin");
  const user = JSON.parse(localStorage.getItem("customer") || localStorage.getItem("admin") || "null");

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("customer");
    localStorage.removeItem("admin");
    navigate('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      navigate('/products');
    }
  };

  const getTotalItems = () => {
    return cartItems ? cartItems.reduce((total, item) => total + item.quantity, 0) : 0;
  };

  return (
    <header className="modern-header">
      <div className="header-container">
        {/* Logo */}
        <Link to="/" className="logo-section">
          <div className="logo-circle">BC</div>
          <span className="logo-text">Baby Cotton Club</span>
        </Link>

        {/* Navigation */}
        <nav className="main-nav">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/products" className="nav-link">Products</Link>
          <Link to="/about" className="nav-link">About</Link>
          <Link to="/contact" className="nav-link">Contact</Link>
        </nav>

        {/* Search */}
        <form onSubmit={handleSearch} className="search-form">
          <input 
            type="text"
            placeholder="Search products..." 
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit" className="search-button">🔍</button>
        </form>

        {/* Actions */}
        <div className="header-actions">
          {isLoggedIn || isAdmin ? (
            <>
              {/* Cart - only show for customers */}
              {isLoggedIn && (
                <Link to="/cart" className="cart-link">
                  <span className="cart-icon">🛒</span>
                  {getTotalItems() > 0 && (
                    <span className="cart-badge">{getTotalItems()}</span>
                  )}
                </Link>
              )}
              
              {/* User Menu */}
              <div className="user-menu-container" ref={userMenuRef}>
                <button 
                  className="user-button"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                >
                  👤
                </button>
                
                {showUserMenu && (
                  <div className="user-dropdown">
                    {user && (
                      <>
                        <div className="user-info">
                          <div className="user-name">{user.firstName || user.username} {user.lastName}</div>
                          <div className="user-email">{user.email}</div>
                        </div>
                        <div className="dropdown-divider"></div>
                      </>
                    )}
                    
                    {isLoggedIn ? (
                      <>
                        <button onClick={() => { navigate('/profile'); setShowUserMenu(false); }} className="dropdown-item">
                          Profile
                        </button>
                        <button onClick={() => { navigate('/orders'); setShowUserMenu(false); }} className="dropdown-item">
                          My Orders
                        </button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => { navigate('/admin/dashboard'); setShowUserMenu(false); }} className="dropdown-item">
                          Admin Dashboard
                        </button>
                        <button onClick={() => { navigate('/admin/products'); setShowUserMenu(false); }} className="dropdown-item">
                          Manage Products
                        </button>
                        <button onClick={() => { navigate('/admin/orders'); setShowUserMenu(false); }} className="dropdown-item">
                          Manage Orders
                        </button>
                      </>
                    )}
                    
                    <div className="dropdown-divider"></div>
                    <button onClick={handleLogout} className="dropdown-item logout-item">
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="auth-buttons">
              <button className="auth-button sign-in" onClick={() => navigate('/login')}>
                Sign In
              </button>
              <button className="auth-button sign-up" onClick={() => navigate('/signup')}>
                Sign Up
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;