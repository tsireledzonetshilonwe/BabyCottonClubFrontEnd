import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./screens/Home";
import AdminLogin from "./screens/AdminLogin";
import AdminSignUp from "./screens/AdminSignUp";
import AdminDashboard from "./screens/AdminDashboard";
import OrderLines from "./screens/OrderLines";
import Orders from "./screens/Orders";
import Customers from "./screens/Customers";
import Login from "./screens/Login";
import SignUp from "./screens/SignUp";
import CreateOrder from "./screens/CreateOrder";
import OrderDetails from "./screens/OrderDetails";
import OrderLineDetails from "./screens/OrderLineDetails";
import Payment from "./screens/Payment";
import SupplierSearch from "./screens/SupplierSearch";
import CartPage from "./screens/CartPage";
import Products from "./screens/Product";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { useState, useEffect } from "react";
import { CartProvider } from "./context/CartContext";
import "./App.css";

function App() {
    const [isAdmin, setIsAdmin] = useState(!!localStorage.getItem("admin"));

    useEffect(() => {
        const handleStorage = () => {
            setIsAdmin(!!localStorage.getItem("admin"));
        };
        window.addEventListener("storage", handleStorage);
        return () => window.removeEventListener("storage", handleStorage);
    }, []);

    return (
        <CartProvider>
            <Router>
                <div className="app">
                    <Navbar />
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/customers" element={<Customers />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<SignUp />} />
                        <Route path="/login/admin" element={<AdminLogin setIsAdmin={setIsAdmin} />} />
                        <Route path="/signup/admin" element={<AdminSignUp setIsAdmin={setIsAdmin} />} />
                        <Route path="/admin/dashboard" element={
                            isAdmin ? <AdminDashboard /> : <AdminLogin setIsAdmin={setIsAdmin} />
                        } />
                        <Route path="/order-lines" element={<OrderLines />} />
                        <Route path="/orders" element={<Orders />} />
                        <Route path="/create-order" element={<CreateOrder />} />
                        <Route path="/order-details/:id" element={<OrderDetails />} />
                        <Route path="/order-line-details/:id" element={<OrderLineDetails />} />
                        <Route path="/cart" element={<CartPage />} />
                        <Route path="/payment" element={<Payment />} />
                        <Route path="/products" element={<Products />} />
                        <Route path="/supplier-search" element={<SupplierSearch />} />
                    </Routes>
                    <Footer />
                </div>
            </Router>
        </CartProvider>
    );
}

export default App;