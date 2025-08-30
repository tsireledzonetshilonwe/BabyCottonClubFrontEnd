import React, { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaHeart, FaShoppingCart } from "react-icons/fa";
import { User } from "react-feather";
import { useCart } from "../context/CartContext";
import "../App.css";

function Navbar({ isAuthenticated, logout }) {
    const [profileOpen, setProfileOpen] = useState(false);
    const profileRef = useRef(null);
    const navigate = useNavigate();
    const { cartItems } = useCart(); //

    useEffect(() => {
        function handleClick(e) {
            if (profileRef.current && !profileRef.current.contains(e.target)) {
                setProfileOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    return (
        <header className="bg-white shadow-md px-6 py-3 flex items-center justify-between sticky top-0 z-50">
            <div className="flex items-center gap-6">
                <h1
                    className="font-bold text-xl cursor-pointer"
                    onClick={() => navigate("/")}
                >
                    Baby Cotton Club
                </h1>
                <NavLink to="/" end className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
                    Home
                </NavLink>
                <NavLink to="/order-lines" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
                    Shop
                </NavLink>
                <NavLink to="/orders" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
                    Orders
                </NavLink>
            </div>

            <div className="flex items-center gap-4">
                <FaHeart className="icon cursor-pointer" size={22} onClick={() => navigate("/wishlist")} />

                <div className="relative cursor-pointer" onClick={() => navigate("/cart")}>
                    <FaShoppingCart className="icon" size={22} />
                    {cartItems.length > 0 && (
                        <span className="cart-count absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                            {cartItems.length}
                        </span>
                    )}
                </div>

                <div className="relative nav-profile" ref={profileRef}>
                    <button
                        className="profile-btn flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200"
                        onClick={() => setProfileOpen((o) => !o)}
                        aria-label="Profile"
                    >
                        <User size={28} className="text-gray-700" />
                    </button>
                    {profileOpen && (
                        <div className="profile-dropdown absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                            {!isAuthenticated ? (
                                <>
                                    <button className="dropdown-item" onClick={() => { setProfileOpen(false); navigate("/login"); }}>
                                        Login
                                    </button>
                                    <button className="dropdown-item" onClick={() => { setProfileOpen(false); navigate("/signup"); }}>
                                        Sign Up
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button className="dropdown-item" onClick={() => { setProfileOpen(false); logout(); }}>
                                        Logout
                                    </button>
                                    <button className="dropdown-item" onClick={() => { setProfileOpen(false); navigate("/orders"); }}>
                                        My Orders
                                    </button>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}

export default Navbar;
