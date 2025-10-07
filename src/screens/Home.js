// ...existing code before product page changes...
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import banner1 from "../assets/banner1.webp";
import banner2 from "../assets/banner2.jpg";
import banner3 from "../assets/banner3.webp";
import onesie from "../assets/onesie.webp";
import img1 from "../assets/img_1.png";
import img2 from "../assets/img_2.png";
import img3 from "../assets/img_3.png";
import img4 from "../assets/img_4.png";
import "./Home.css";
import { fetchProducts } from "../api/api";

const bannerImages = [banner1, banner2, banner3];

export default function Home() {
        const [products, setProducts] = useState([]);
        const [currentBanner, setCurrentBanner] = useState(0);
        const [fade, setFade] = useState(true);
        const [viewSupplierSearch, setViewSupplierSearch] = useState(false);
        const [toast, setToast] = useState("");
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState("");
        const [expandedProduct, setExpandedProduct] = useState(null);
        const [reviewInputs, setReviewInputs] = useState({});
        const [selectedCategory, setSelectedCategory] = useState("All");
        const [allReviews, setAllReviews] = useState([]);
        const [loadingReviews, setLoadingReviews] = useState(false);
        const [reviewError, setReviewError] = useState("");

        const { addToCart } = useCart();
        const navigate = useNavigate();

        // Load products from backend
        useEffect(() => {
                const loadProducts = async () => {
                        try {
                                const data = await fetchProducts();
                                setProducts(data);
                        } catch (err) {
                                console.error(err);
                                setError("Failed to load products.");
                        } finally {
                                setLoading(false);
                        }
                };
                loadProducts();
        }, []);

        useEffect(() => {
                setLoadingReviews(true);
                // If you want to fetch reviews, do it here
                // fetchAllReviews().then(...)
        }, []);

        // Featured categories
        const categories = [
                { name: "Onesies", image: onesie },
                { name: "Blankets", image: img1 },
                { name: "Shoes", image: img2 },
                { name: "Accessories", image: img3 },
                { name: "Gift Sets", image: img4 }
        ];

        // Featured products (first 4)
        const featuredProducts = products.slice(0, 4);

        return (
                <div className="home-page">
                        {/* Hero Section */}
                        <section className="hero-section">
                                <img src={banner1} alt="Main Banner" className="hero-banner" />
                                <div className="hero-content">
                                        <h1>Welcome to Baby Cotton Club</h1>
                                        <p>Discover the softest, cutest clothes for your little ones. Shop our new arrivals and best sellers!</p>
                                        <button className="shop-now-btn" onClick={() => navigate("/products")}>Shop Now</button>
                                </div>
                        </section>

                        {/* Featured Products */}
                        <section className="featured-products">
                                <h2>Featured Products</h2>
                                <div className="products-grid">
                                        {loading ? (
                                                <p>Loading products...</p>
                                        ) : error ? (
                                                <p>{error}</p>
                                        ) : featuredProducts.length === 0 ? (
                                                <p>No products available.</p>
                                        ) : (
                                                featuredProducts.map((product) => (
                                                        <div key={product.productId || product.id} className="product-card">
                                                                <img src={product.imageUrl || product.image || onesie} alt={product.productName || product.name} className="product-image" />
                                                                <div className="product-info">
                                                                        <h2 className="product-name">{product.productName || product.name}</h2>
                                                                        <p className="product-category">{product.category?.categoryName}</p>
                                                                        <p className="product-price">R {product.price}</p>
                                                                </div>
                                                                <button className="product-buy-btn" onClick={() => addToCart({
                                                                        id: product.productId || product.id,
                                                                        name: product.productName || product.name,
                                                                        price: product.price,
                                                                        image: product.imageUrl || product.image,
                                                                        quantity: 1
                                                                })}>
                                                                        Add to Cart
                                                                </button>
                                                        </div>
                                                ))
                                        )}
                                </div>
                        </section>
                </div>
        );
}
