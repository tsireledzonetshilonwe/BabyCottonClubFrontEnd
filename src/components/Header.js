import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { getStoredCustomer } from '../utils/customer';

const Header = () => {
  const { cartItems } = useCart();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef(null);
  
  // Simple auth check using localStorage (like the original Navbar)
  const isLoggedIn = !!localStorage.getItem("customer");
  const isAdmin = !!localStorage.getItem("admin");
  const user = getStoredCustomer() || JSON.parse(localStorage.getItem("admin") || "null");

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
            placeholder="Search products" 
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            autoComplete="off"
          />
          <button type="submit" className="search-button" title="Search products">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path 
                d="M21 21L16.514 16.506M19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z" 
                stroke="currentColor" 
                strokeWidth="2.5" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </form>

        {/* Actions */}
        <div className="header-actions">
          {isLoggedIn || isAdmin ? (
            <>
              {/* Cart - only show for customers */}
              {isLoggedIn && (
                <Link to="/cart" className="cart-link">
                  <div className="cart-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 22C9.55228 22 10 21.5523 10 21C10 20.4477 9.55228 20 9 20C8.44772 20 8 20.4477 8 21C8 21.5523 8.44772 22 9 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M20 22C20.5523 22 21 21.5523 21 21C21 20.4477 20.5523 20 20 20C19.4477 20 19 20.4477 19 21C19 21.5523 19.4477 22 20 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M1 1H5L7.68 14.39C7.77144 14.8504 8.02191 15.264 8.38755 15.5583C8.75318 15.8526 9.2107 16.009 9.68 16H19.4C19.8693 16.009 20.3268 15.8526 20.6925 15.5583C21.0581 15.264 21.3086 14.8504 21.4 14.39L23 6H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
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
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
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