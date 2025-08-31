import React, { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { fetchAllReviews, createReview } from "../api/api";
import "./Product.css";

const productsData = [
    { id: 1, name: "Baby Cotton Onesie", price: 199, inStock: true, category: "Clothing", brand: "TinyWear", image: "/images/onesie.jpg" },
    { id: 2, name: "Soft Cotton Blanket", price: 250, inStock: true, category: "Bedding", brand: "SnuggleCo", image: "/images/bedding.jpg" },
    { id: 3, name: "Baby Booties", price: 120, inStock: false, category: "Footwear", brand: "LittleSteps", image: "/images/boots.jpg" },
    { id: 4, name: "Baby Cotton Onesie", price: 135, inStock: true, category: "Clothing", brand: "TinyWear", image: "/images/onesy.jpg" },
    { id: 5, name: "Baby Cotton Onesie", price: 90, inStock: true, category: "Clothing", brand: "TinyWear", image: "/images/wolf.jpg" },
    { id: 6, name: "Soft Cotton Blanket", price: 60, inStock: true, category: "Bedding", brand: "SnuggleCo", image: "/images/cotton.jpg" },
    { id: 7, name: "Soft Cotton Blanket", price: 1500, inStock: false, category: "Bedding", brand: "SnuggleCo", image: "/images/fleece.jpg" },
    { id: 8, name: "Baby Booties", price: 70, inStock: true, category: "Footwear", brand: "LittleSteps", image: "/images/loafers.jpg" },
    { id: 9, name: "Baby Booties", price: 200, inStock: true, category: "Footwear", brand: "LittleSteps", image: "/images/sneakers.jpg" }
];

export default function Products() {
    const [expandedProduct, setExpandedProduct] = useState(null);
    const [reviews, setReviews] = useState({});
    const [reviewInputs, setReviewInputs] = useState({});
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [selectedBrand, setSelectedBrand] = useState("All");
    const [allReviews, setAllReviews] = useState([]);
    const [loadingReviews, setLoadingReviews] = useState(false);
    const [reviewError, setReviewError] = useState("");
    const { addToCart } = useCart();

    useEffect(() => {
        setLoadingReviews(true);
        fetchAllReviews()
            .then((data) => setAllReviews(data))
            .catch(() => setReviewError("Failed to load reviews."))
            .finally(() => setLoadingReviews(false));
    }, []);

    const toggleExpand = (id) => {
        setExpandedProduct(expandedProduct === id ? null : id);
    };

    const handleReviewSubmit = async (e, productId) => {
        e.preventDefault();
        const { name, comment, rating } = reviewInputs[productId] || {};
        if (!name || !comment) return;
        try {
            await createReview({
                productId,
                name,
                comment,
                rating: rating || 5
            });
            // Refresh reviews after submit
            const data = await fetchAllReviews();
            setAllReviews(data);
            setReviewInputs({ ...reviewInputs, [productId]: { name: "", comment: "", rating: 5 } });
        } catch (err) {
            setReviewError("Failed to submit review.");
        }
    };

    const handleInputChange = (productId, field, value) => {
        setReviewInputs({
            ...reviewInputs,
            [productId]: { ...reviewInputs[productId], [field]: value },
        });
    };

    // 🔥 Get unique categories & brands
    const categories = ["All", ...new Set(productsData.map((p) => p.category))];
    const brands = ["All", ...new Set(productsData.map((p) => p.brand))];

    // 🔥 Filter products based on selected category + brand
    const filteredProducts = productsData.filter((p) => {
        const categoryMatch = selectedCategory === "All" || p.category === selectedCategory;
        const brandMatch = selectedBrand === "All" || p.brand === selectedBrand;
        return categoryMatch && brandMatch;
    });

    return (
        <div className="products-page">
            <h1 className="products-title">All Products</h1>

            {/* Filters */}
            <div className="category-filter">
                {/* Category Filter */}
                <label htmlFor="category-select">Category: </label>
                <select
                    id="category-select"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                >
                    {categories.map((cat, idx) => (
                        <option key={idx} value={cat}>
                            {cat}
                        </option>
                    ))}
                </select>

                {/* Brand Filter */}
                <label htmlFor="brand-select">Brand: </label>
                <select
                    id="brand-select"
                    value={selectedBrand}
                    onChange={(e) => setSelectedBrand(e.target.value)}
                >
                    {brands.map((brand, idx) => (
                        <option key={idx} value={brand}>
                            {brand}
                        </option>
                    ))}
                </select>
            </div>

            {/* Products Grid */}
            <div className="products-grid">
                {filteredProducts.map((product) => (
                    <div key={product.id} className="product-card">
                        <img src={product.image} alt={product.name} className="product-image" />
                        <div className="product-info">
                            <h2 className="product-name">{product.name}</h2>
                            <p className="product-category">{product.category}</p>
                            <p className="product-price">R {product.price}</p>
                            <p className="product-brand">Brand: {product.brand}</p>
                            <p className={`category-stock ${product.inStock ? "in" : "out"}`}>
                                {product.inStock ? "In Stock" : "Out of Stock"}
                            </p>
                        </div>

                        <button className="product-buy-btn" onClick={() => toggleExpand(product.id)}>
                            {expandedProduct === product.id ? "Hide Details" : "View Details"}
                        </button>
                        <button
                            className="product-buy-btn"
                            onClick={() => addToCart({
                                id: product.id,
                                name: product.name,
                                price: product.price,
                                image: product.image,
                                quantity: 1
                            })}
                            disabled={!product.inStock}
                            style={{ marginTop: 8, background: product.inStock ? '#90e0ef' : '#ccc', color: product.inStock ? '#023e8a' : '#888', cursor: product.inStock ? 'pointer' : 'not-allowed' }}
                        >
                            {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                        </button>

                        {expandedProduct === product.id && (
                            <div className="product-detail-section">
                                <h3>Product Details</h3>
                                <p>
                                    This is a soft, high-quality {product.name} by {product.brand}.
                                    Perfect for comfort and care.
                                </p>

                                {/* Reviews */}
                                <div className="review-section">
                                    <h4>Customer Reviews</h4>
                                    <div className="review-list">
                                        {loadingReviews && <p>Loading reviews...</p>}
                                        {reviewError && <p className="error-message">{reviewError}</p>}
                                        {allReviews.filter(r => r.productId === product.id).length === 0 && <p>No reviews yet.</p>}
                                        {allReviews.filter(r => r.productId === product.id).map((rev, index) => (
                                            <div key={index} className="review-card">
                                                <div className="review-card-header">
                                                    <span>{rev.name}</span>
                                                    <span className="review-rating">{"⭐".repeat(rev.rating)}</span>
                                                </div>
                                                <p>{rev.comment}</p>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Add Review Form */}
                                    <form
                                        onSubmit={(e) => handleReviewSubmit(e, product.id)}
                                        className="review-form"
                                    >
                                        <input
                                            type="text"
                                            placeholder="Your Name"
                                            value={reviewInputs[product.id]?.name || ""}
                                            onChange={(e) => handleInputChange(product.id, "name", e.target.value)}
                                        />
                                        <textarea
                                            placeholder="Write your review..."
                                            value={reviewInputs[product.id]?.comment || ""}
                                            onChange={(e) => handleInputChange(product.id, "comment", e.target.value)}
                                        />
                                        <label>
                                            Rating:
                                            <select
                                                value={reviewInputs[product.id]?.rating || 5}
                                                onChange={(e) =>
                                                    handleInputChange(product.id, "rating", Number(e.target.value))
                                                }
                                            >
                                                {[1, 2, 3, 4, 5].map((n) => (
                                                    <option key={n} value={n}>
                                                        {n}
                                                    </option>
                                                ))}
                                            </select>
                                        </label>
                                        <button type="submit">Submit Review</button>
                                    </form>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}