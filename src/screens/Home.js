// ...existing code before product page changes...
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "./Home.css";
import { fetchProducts } from "../api/api";
import { resolveProductImage, IMAGE_PLACEHOLDER, normalizeLocalImage } from "../utils/images";
import { mapToCategory } from '../utils/categoryMapper';
import ProductCard from "../components/ProductCard";

// Use public images to avoid bundling missing src/assets
const bannerImages = [
        "/images/banner1.webp",
        "/images/banner2.jpg",
        "/images/banner3.webp",
];

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
                { name: "Shoes", image: "/images/sneakers.jpg" },
                { name: "Dresses", image: "/images/dress.jpg" },
                { name: "Duvet", image: "/images/duvet.jpg" },
                { name: "2 Piece Sets", image: "/images/img_1.png" },
                { name: "Rompers", image: "/images/onesie.webp" }
        ];

        // Normalize for ProductCard and limit to 4 featured
        const convertBackendProduct = (p) => {
                const reviewsArray = Array.isArray(p.reviews) ? p.reviews : [];
                const reviewCount = reviewsArray.length;
                const avgRating = reviewCount > 0
                        ? reviewsArray.reduce((s, r) => s + (Number(r.rating) || 0), 0) / reviewCount
                        : null;
                return {
                        id: String(p.productId ?? p.id ?? ""),
                        name: p.productName || p.name || "Unnamed Product",
                        price: p.price || 0,
                        image: resolveProductImage(p),
                        rating: avgRating != null ? Number(avgRating.toFixed(1)) : (p.rating || 4.0),
                        reviewCount,
                        category: p.category?.categoryName || "Other",
                        sizes: ["One Size"],
                        colors: [p.color || "Default"],
                        description: p.description || `High-quality ${(p.productName || p.name || 'baby item').toLowerCase()} for your little one.`,
                        inStock: p.inStock === 'available' || p.inStock === 'In Stock',
                        backendData: p,
                };
        };
        const normalizedProducts = Array.isArray(products) ? products.map(p => ({ ...convertBackendProduct(p), category: mapToCategory({ name: p.productName || p.name, category: p.category?.categoryName }) })) : [];
        const featuredProducts = normalizedProducts.slice(0, 4);

        const handleAddToCart = async (product) => {
                try {
                        const p = product.backendData || {};
                        await addToCart({
                                id: p.productId || product.id,
                                name: p.productName || product.name,
                                price: p.price ?? product.price,
                                image: normalizeLocalImage(p.imageUrl || product.image) || product.image,
                                quantity: 1,
                        });
                } catch (e) {
                        console.error('Add to cart failed', e);
                }
        };

        return (
                <div className="home-page">
                        {/* Hero Section */}
                        <section className="hero-section">
                                <img src={bannerImages[currentBanner]} alt="Main Banner" className="hero-banner" />
                                <div className="hero-content">
                                        <h1>Welcome to Baby Cotton Club</h1>
                                        <p>Discover the softest, cutest clothes for your little ones. Shop our new arrivals and best sellers!</p>
                                        <button className="shop-now-btn" onClick={() => navigate("/products")}>Shop Now</button>
                                </div>
                        </section>

                        {/* Featured Products */}
                        <section className="featured-products">
                                <h2>Featured Products</h2>
                                {loading ? (
                                        <p>Loading products...</p>
                                ) : error ? (
                                        <p>{error}</p>
                                ) : featuredProducts.length === 0 ? (
                                        <p>No products available.</p>
                                ) : (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                                {featuredProducts.map((product) => (
                                                        <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
                                                ))}
                                        </div>
                                )}
                        </section>
                </div>
        );
}
