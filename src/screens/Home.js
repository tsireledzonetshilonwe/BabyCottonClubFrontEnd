import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import img_1 from "../assets/img_1.png";
import img from "../assets/img.png";
import onesie from "../assets/onesie.webp";
import banner1 from "../assets/banner1.webp";
import banner2 from "../assets/banner2.jpg";
import banner3 from "../assets/banner3.webp";
import SupplierSearch from "./SupplierSearch";
import "../App.css";

const products = [
    { id: 1, name: "Baby Cotton Onesie", supplier: "Cotton Suppliers SA", price: "R 199", image: onesie },
    { id: 2, name: "Soft Cotton Blanket", supplier: "Cozy Fabrics Ltd", price: "R 250", image: img },
    { id: 3, name: "Baby Booties", supplier: "Cotton Suppliers SA", price: "R 120", image: img_1 },
];

const bannerImages = [banner1, banner2, banner3];

export default function Home() {
    const [currentBanner, setCurrentBanner] = useState(0);
    const [fade, setFade] = useState(true);
    const [viewSupplierSearch, setViewSupplierSearch] = useState(false);
    const [toast, setToast] = useState("");

    const { addToCart } = useCart();
    const navigate = useNavigate();

    useEffect(() => {
        const interval = setInterval(() => {
            setFade(false);
            setTimeout(() => {
                setCurrentBanner((prev) => (prev + 1) % bannerImages.length);
                setFade(true);
            }, 500);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    const handleAddToCart = (product) => {
        addToCart(product);
        setToast(`${product.name} added to cart`);
        setTimeout(() => setToast(""), 2000);
    };

    if (viewSupplierSearch) {
        return (
            <div>
                <SupplierSearch handleAddToCart={addToCart} />
                <button
                    onClick={() => setViewSupplierSearch(false)}
                    style={{ margin: "2rem", padding: "0.7rem 1rem", cursor: "pointer" }}
                >
                    Back to Home
                </button>
            </div>
        );
    }

    return (
        <div className="app">
            {toast && <div className="toast">{toast}</div>}

            <div className="banner">
                <img src={bannerImages[currentBanner]} alt="Banner" className={fade ? "fade-in" : "fade-out"} />
                <div className="banner-text">Want It Now?</div>
            </div>

            <div className="main">
                <aside className="sidebar">
                    <h2>Refine by Category</h2>
                    <ul>
                        <li>All Products</li>
                        <li>Clothes</li>
                        <li>Shoes</li>
                        <li>Blankets</li>
                        <li onClick={() => setViewSupplierSearch(true)}>See More</li>
                    </ul>
                    <div className="filters">
                        <h2>Filters</h2>
                        <label><input type="checkbox" defaultChecked /> In Stock</label>
                    </div>
                </aside>

                <main className="product-grid">
                    {products.map((product) => (
                        <div key={product.id} className="product-card">
                            <img src={product.image} alt={product.name} />
                            <div className="product-info">
                                <h3>{product.name}</h3>
                                <p>{product.supplier}</p>
                                <p className="price">{product.price}</p>
                                <button onClick={() => handleAddToCart(product)}>Add to Cart</button>
                            </div>
                        </div>
                    ))}
                </main>
            </div>

            <footer>© 2025 Baby Cotton Club | All Rights Reserved</footer>
        </div>
    );
}
