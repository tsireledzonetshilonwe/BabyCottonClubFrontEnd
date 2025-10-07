// Navbar.js
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "../App.css";
import { getStoredCustomer } from "../utils/customer";

function Navbar() {
    const navigate = useNavigate();
    const { cartItems } = useCart();
    const isLoggedIn = !!getStoredCustomer()?.customerId;
    const isAdmin = !!localStorage.getItem("admin");

    const handleLogout = () => {
        localStorage.removeItem("customer");
        localStorage.removeItem("admin");
        navigate("/");
    };

    return (
        <header className="header navbar-homepage">
            <nav className="navbar-container">
                {/* Logo section with the style from Header.js */}
                <div className="navbar-logo">
                    <Link to="/" style={{ textDecoration: "none" }}>
                        <h1 style={{
                            fontSize: '2rem',
                            fontWeight: 'bold',
                            color: 'var(--primary)',
                            margin: 0,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-start'
                        }}>
                            BABY COTTON CLUB
                            <span style={{
                                fontSize: '0.9rem',
                                color: 'var(--accent)',
                                fontWeight: 'normal',
                                marginTop: '0.2rem'
                            }}>
                                Comfy Clothes | Happy Babies
                            </span>
                        </h1>
                    </Link>
                </div>

                <ul className="navbar-links">
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/about">About</Link></li>
                    <li><Link to="/productspage">Products</Link></li>
                    <li><Link to="/contact">Contact</Link></li>
                    <li>
                        <Link to="/cart" data-count={cartItems.length}>
                            Cart ({cartItems.length})
                        </Link>
                    </li>
                    {!isLoggedIn && <li><Link to="/login">Login</Link></li>}
                    {!isLoggedIn && <li><Link to="/signup">Register</Link></li>}
                    {!isLoggedIn && !isAdmin && <li><Link to="/login/admin">Admin Login</Link></li>}
                    {isLoggedIn && <li><Link to="/profile">My Profile</Link></li>}
                    {isLoggedIn && <li><Link to="/orders">My Orders</Link></li>}
                    {isLoggedIn && <li><button className="navbar-logout-btn" onClick={handleLogout}>Logout</button></li>}
                    {isAdmin && <>
                        <li><Link to="/admin/dashboard">Admin Dashboard</Link></li>
                        <li><Link to="/admin/products">Manage Products</Link></li>
                        <li><Link to="/admin/orders">Manage Orders</Link></li>
                    </>}
                </ul>
            </nav>
        </header>
    );
}

export default Navbar;