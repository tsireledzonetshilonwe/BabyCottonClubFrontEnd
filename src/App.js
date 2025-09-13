import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./screens/Home";
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
import { CartProvider } from "./context/CartContext";
import "./App.css";

function App() {
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