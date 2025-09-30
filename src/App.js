// App.js
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./screens/Home";
import AdminSignUp from "./screens/AdminSignUp";
import AdminLogin from "./screens/AdminLogin";
import AdminDashboard from "./screens/AdminDashboard";
import AdminOrders from "./screens/AdminOrders";
import AdminCustomers from "./screens/AdminCustomers";
import AdminProducts from "./screens/AdminProducts";
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
import Profile from "./screens/Profile";
import Shipping from "./screens/Shipping";

import Header from "./components/Header";
import Footer from "./components/Footer";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./contexts/AuthContext";
import ErrorBoundary from "./components/ErrorBoundary";
import "./App.css";

// Import your new pages
import HomePage from './components/HomePage';
import AboutPage from './components/AboutPage';
import ProductsPage from './components/ProductsPage';
import ContactPage from './components/ContactPage';

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
        <AuthProvider>
            <CartProvider>
                <Router>
                    <div className="app" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                        <Header />
                    <main style={{ flex: 1 }}>
                        <ErrorBoundary>
                        <Routes>
                            <Route path="/" element={<HomePage />} />
                            <Route path="/homepage" element={<HomePage />} />
                            <Route path="/customers" element={<Customers />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/signup" element={<SignUp />} />
                            <Route path="/signup/admin" element={<AdminSignUp setIsAdmin={setIsAdmin} />} />
                            <Route path="/login/admin" element={<AdminLogin setIsAdmin={setIsAdmin} />} />
                            <Route path="/admin-dashboard" element={<AdminDashboard />} />
                            <Route path="/admin/dashboard" element={<AdminDashboard />} />
                            <Route path="/admin/orders" element={<AdminOrders />} />
                            <Route path="/admin/customers" element={<AdminCustomers />} />
                            <Route path="/admin/products" element={<AdminProducts />} />
                            <Route path="/order-lines" element={<OrderLines />} />
                            <Route path="/orders" element={<Orders />} />
                            <Route path="/create-order" element={<CreateOrder />} />
                            <Route path="/order-details/:id" element={<OrderDetails />} />
                            <Route path="/order-line-details/:id" element={<OrderLineDetails />} />
                            <Route path="/cart" element={<CartPage />} />
                            <Route path="/profile" element={<Profile />} />
                            <Route path="/payment" element={<Payment />} />
                            <Route path="/shipping" element={<Shipping />} />
                            {/* Use the Products component from screens folder */}
                            <Route path="/products" element={<Products />} />
                            <Route path="/supplier-search" element={<SupplierSearch />} />
                            {/* New static pages */}
                            <Route path="/about" element={<AboutPage />} />
                            {/* Keep productspage route for backward compatibility */}
                            <Route path="/productspage" element={<Products />} />
                            <Route path="/contact" element={<ContactPage />} />
                        </Routes>
                        </ErrorBoundary>
                    </main>
                    <Footer />
                    </div>
                </Router>
            </CartProvider>
        </AuthProvider>
    );
}

export default App;