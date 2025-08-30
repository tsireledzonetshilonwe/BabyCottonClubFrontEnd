import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "../App.css";

function Navbar() {
    const [search, setSearch] = useState("");
    const navigate = useNavigate();
    const { cartItems } = useCart();

    const handleSearch = (e) => {
        e.preventDefault();
        navigate("/supplier-search");
    };

    return (
        <header className="header">
            <div className="header-left">
                <h1 style={{ cursor: "pointer" }} onClick={() => navigate("/")}>Baby Cotton Club</h1>
            </div>
            <form className="search-bar" onSubmit={handleSearch}>
                <input
                    type="text"
                    placeholder="Search for suppliers..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
                <button type="submit">Search</button>
            </form>
            <div className="header-right">
                <div className="user-links">
                    <button onClick={() => navigate("/login")}>Login</button>
                    <button onClick={() => navigate("/signup")}>Register</button>
                    <button onClick={() => navigate("/orders")}>Orders</button>
                    <button onClick={() => navigate("/customers")}>My Account</button>
                    <button onClick={() => navigate("/products")}>Products</button>
                    <button onClick={() => navigate("/cart")}>Cart{cartItems.length > 0 && ` (${cartItems.length})`}</button>
                </div>
            </div>
        </header>
    );
}

export default Navbar;
