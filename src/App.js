import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./contexts/AuthContext";
import ErrorBoundary from "./components/ErrorBoundary";

import Header from "./components/Header";
import Footer from "./components/Footer";
import { getStoredCustomer } from "./utils/customer";

// Screens
import Home from "./screens/Home";
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
import Shipping from "./screens/Shipping";
import Profile from "./screens/Profile";

// Static Pages
import HomePage from './components/HomePage';
import AboutPage from './components/AboutPage';
import ProductsPage from './components/ProductsPage';
import ContactPage from './components/ContactPage';
import OrderConfirmation from './components/OrderConfirmation';


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

  // Protected route for customer profile
  const CustomerRoute = ({ children }) => {
    const customer = getStoredCustomer();
    return customer && customer.customerId ? children : <Navigate to="/login" replace />;
  };

  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="app" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Header />
            <main style={{ flex: 1 }}>
              <ErrorBoundary>
                <Routes>
                  {/* Home */}
                  <Route path="/" element={<HomePage />} />
                  <Route path="/homepage" element={<HomePage />} />
                  <Route path="/home" element={<Home />} />

                  {/* Customer Profile */}
                  <Route path="/profile" element={
                    <CustomerRoute>
                      <Profile />
                    </CustomerRoute>
                  } />

                  {/* Customer & Product Routes */}
                  <Route path="/products" element={<Products />} />
                  <Route path="/productspage" element={<ProductsPage />} />
                  <Route path="/customers" element={<Customers />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/payment" element={<Payment />} />
                  <Route path="/shipping" element={<Shipping />} />
                  <Route path="/supplier-search" element={<SupplierSearch />} />

                  {/* Auth Routes */}
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<SignUp />} />

                  {/* Admin Routes */}
                  <Route path="/admin/login" element={<AdminLogin setIsAdmin={setIsAdmin} />} />
                  <Route path="/admin-dashboard" element={<AdminDashboard />} />
                  <Route path="/admin/dashboard" element={<AdminDashboard />} />
                  <Route path="/admin/orders" element={<AdminOrders />} />
                  <Route path="/admin/customers" element={<AdminCustomers />} />
                  <Route path="/admin/products" element={<AdminProducts />} />

                  {/* Orders */}
                  <Route path="/orders" element={<Orders />} />
                  <Route path="/create-order" element={<CreateOrder />} />
                  <Route path="/order-details/:id" element={<OrderDetails />} />
                  <Route path="/order-line-details/:id" element={<OrderLineDetails />} />
                  <Route path="/order-lines" element={<OrderLines />} />

                  {/* Static Pages */}
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/contact" element={<ContactPage />} />

                    <Route path="/order-confirmation" element={<OrderConfirmation />} />
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
