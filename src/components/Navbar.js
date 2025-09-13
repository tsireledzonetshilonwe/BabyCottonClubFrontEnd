import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "../App.css";

function Navbar() {
    const [search, setSearch] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();
    const { cartItems } = useCart();

    useEffect(() => {
        setIsLoggedIn(!!localStorage.getItem("customer"));
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        navigate("/supplier-search");
    };

    const handleLogout = () => {
        localStorage.removeItem("customer");
        setIsLoggedIn(false);
        navigate("/");
    };

    return (
        <header className="header">
            <div className="header-left">
                <h1 style={{ cursor: "pointer" }} onClick={() => navigate("/")}>Baby Cotton Club</h1>
            </div>
            <form className="search-bar" onSubmit={handleSearch}>
                <input
                    type="text"
                    placeholder="Search for products..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
                <button type="submit">Search</button>
            </form>
            <div className="header-right">
                <div className="user-links">
                    <button onClick={() => navigate("/")}>Home</button>
                    {!isLoggedIn && <button onClick={() => navigate("/login")}>Login</button>}
                    {!isLoggedIn && <button onClick={() => navigate("/signup")}>Register</button>}
                    <button onClick={() => navigate("/orders")}>Orders</button>
                    <button onClick={() => navigate("/customers")}>My Account</button>
                    <button onClick={() => navigate("/products")}>Products</button>
                    <button onClick={() => navigate("/cart")}>Cart{cartItems.length > 0 && ` (${cartItems.length})`}</button>
                    {isLoggedIn && <button onClick={handleLogout}>Logout</button>}
                </div>
            </div>
        </header>
    );
}

export default Navbar;
