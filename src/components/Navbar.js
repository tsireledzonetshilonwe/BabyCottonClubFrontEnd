import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "../App.css";

function Navbar() {
    const [search, setSearch] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const navigate = useNavigate();
    const { cartItems } = useCart();

    useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("customer"));
    setIsAdmin(!!localStorage.getItem("admin"));
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        navigate("/supplier-search");
    };

    const handleLogout = () => {
        localStorage.removeItem("customer");
        localStorage.removeItem("admin");
        setIsLoggedIn(false);
        setIsAdmin(false);
        navigate("/");
    };

    return (
        <header className="header adidas-navbar">
            <div className="navbar-left">
                <span className="adidas-logo" onClick={() => navigate("/")} style={{cursor: "pointer", fontSize: "2rem", fontWeight: "bold", letterSpacing: "2px"}}>
                  
                </span>
                <nav className="main-nav">
                    {!isAdmin && <>
                        <button onClick={() => navigate("/")}>Home</button>
                        {!isLoggedIn && <button onClick={() => navigate("/login")}>Login</button>}
                        {!isLoggedIn && <button onClick={() => navigate("/signup")}>Register</button>}
                        <button onClick={() => navigate("/orders")}>Orders</button>
                        <button onClick={() => navigate("/products")}>Products</button>
                        {isLoggedIn && <button onClick={handleLogout}>Logout</button>}
                    </>}
                    {isAdmin && <>
                        <button onClick={() => navigate("/admin/dashboard")}>Admin Dashboard</button>
                        <button onClick={() => navigate("/admin/products")}>Manage Products</button>
                        <button onClick={() => navigate("/admin/orders")}>Manage Orders</button>
                        <button onClick={handleLogout}>Logout</button>
                    </>}
                </nav>
            </div>
            {!isAdmin && (
                <>
                <form className="search-bar" onSubmit={handleSearch}>
                    <input
                        type="text"
                        placeholder="Search..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                    <button type="submit" aria-label="Search">🔍</button>
                </form>
                <div className="navbar-right">
                    <button onClick={() => navigate("/cart")} className="cart-icon" aria-label="Cart">🛒{cartItems.length > 0 && ` (${cartItems.length})`}</button>
                    <button onClick={() => navigate("/customers")} className="profile-icon" aria-label="Profile">👤</button>
                </div>
                </>
            )}
        </header>
    );
}

export default Navbar;
