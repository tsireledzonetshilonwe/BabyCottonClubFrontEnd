import React, { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { fetchAllReviews, createReview, fetchProducts } from "../api/api";
import SimpleFilters from "../components/SimpleFilters";
import "./Product.css";

export default function Products() {
    const [products, setProducts] = useState([]);
    const [expandedProduct, setExpandedProduct] = useState(null);
    const [reviewInputs, setReviewInputs] = useState({});
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [selectedBrand, setSelectedBrand] = useState("All");
    const [allReviews, setAllReviews] = useState([]);
    const [loadingReviews, setLoadingReviews] = useState(false);
    const [reviewError, setReviewError] = useState("");
    
    // Search and filter states
    const [searchTerm, setSearchTerm] = useState("");
    const [priceRange, setPriceRange] = useState("all");
    const [sortBy, setSortBy] = useState("name");
    
    const { addToCart } = useCart();

    useEffect(() => {
        fetchProducts()
            .then((data) => setProducts(data))
            .catch(() => setProducts([]));
    }, []);

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

    const categories = ["All", ...new Set(products.map((p) => p.category?.categoryName || "Other"))];
    const brands = ["All"]; // If you have a brand field, update this accordingly

    const filteredProducts = products.filter((p) => {
        // Category filter
        const categoryMatch = selectedCategory === "All" || (p.category?.categoryName === selectedCategory);
        
        // Search filter
        const searchMatch = searchTerm === "" || 
            p.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (p.category?.categoryName || "").toLowerCase().includes(searchTerm.toLowerCase());
        
        // Price range filter
        let priceMatch = true;
        const price = parseFloat(p.price);
        switch (priceRange) {
            case "under25":
                priceMatch = price < 25;
                break;
            case "25to40":
                priceMatch = price >= 25 && price <= 40;
                break;
            case "over40":
                priceMatch = price > 40;
                break;
            default:
                priceMatch = true;
        }
        
        return categoryMatch && searchMatch && priceMatch;
    });

    // Sort products
    const sortedProducts = [...filteredProducts].sort((a, b) => {
        switch (sortBy) {
            case "name":
                return a.productName.localeCompare(b.productName);
            case "price-low":
                return parseFloat(a.price) - parseFloat(b.price);
            case "price-high":
                return parseFloat(b.price) - parseFloat(a.price);
            case "rating":
                // Calculate average rating for each product
                const aRating = allReviews.filter(r => r.productId === a.productId)
                    .reduce((sum, r) => sum + r.rating, 0) / 
                    Math.max(1, allReviews.filter(r => r.productId === a.productId).length);
                const bRating = allReviews.filter(r => r.productId === b.productId)
                    .reduce((sum, r) => sum + r.rating, 0) / 
                    Math.max(1, allReviews.filter(r => r.productId === b.productId).length);
                return bRating - aRating;
            default:
                return 0;
        }
    });

    return (
        <div className="products-page">
            <h1 className="products-title">All Products</h1>

            <div className="products-layout">
                {/* Filters Sidebar */}
                <div className="products-sidebar">
                    <SimpleFilters
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        priceRange={priceRange}
                        setPriceRange={setPriceRange}
                        sortBy={sortBy}
                        setSortBy={setSortBy}
                    />
                    
                    {/* Category Filter */}
                    <div style={{ 
                        width: '300px', 
                        padding: '1rem', 
                        backgroundColor: 'white', 
                        border: '1px solid #e5e7eb', 
                        borderRadius: '8px',
                        marginTop: '1rem'
                    }}>
                        <label style={{ 
                            display: 'block', 
                            fontWeight: 'bold', 
                            marginBottom: '0.5rem',
                            color: '#374151'
                        }}>
                            Category
                        </label>
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                border: '2px solid #FFB6C1',
                                borderRadius: '12px',
                                fontSize: '0.875rem',
                                backgroundColor: 'white',
                                outline: 'none',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                boxShadow: '0 2px 8px rgba(255, 182, 193, 0.1)'
                            }}
                        >
                            {categories.map((cat, idx) => (
                                <option key={idx} value={cat}>
                                    {cat}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Products Content */}
                <div className="products-content">
                    <div style={{ marginBottom: '1rem', color: '#666' }}>
                        Showing {sortedProducts.length} of {products.length} products
                    </div>

                    <div className="products-grid">
                        {sortedProducts.map((product) => (
                    <div key={product.productId} className="product-card">
                        <img src={product.imageUrl} alt={product.productName} className="product-image" />
                        <div className="product-info">
                            <h2 className="product-name">{product.productName}</h2>
                            <p className="product-category">{product.category?.categoryName}</p>
                            <p className="product-price">R {product.price}</p>
                            <p className={`category-stock ${product.inStock === 'available' ? "in" : "out"}`}>
                                {product.inStock === 'available' ? "In Stock" : "Out of Stock"}
                            </p>
                        </div>
                        <button className="product-buy-btn" onClick={() => toggleExpand(product.productId)}>
                            {expandedProduct === product.productId ? "Hide Details" : "View Details"}
                        </button>
                        <button
                            className="product-buy-btn"
                            onClick={() => {
                                const cartItem = {
                                    id: product.productId,        // Map productId to id
                                    name: product.productName,    // Map productName to name
                                    price: product.price,         // Keep price as is
                                    image: product.imageUrl,      // Map imageUrl to image
                                };
                                console.log("Product clicked:", product);
                                console.log("Cart item being added:", cartItem);
                                console.log("Cart item ID:", cartItem.id, "Type:", typeof cartItem.id);
                                addToCart(cartItem);
                            }}
                            disabled={product.inStock !== 'available'}
                            style={{ marginTop: 8, background: product.inStock === 'available' ? '#90e0ef' : '#ccc', color: product.inStock === 'available' ? '#023e8a' : '#888', cursor: product.inStock === 'available' ? 'pointer' : 'not-allowed' }}
                        >
                            {product.inStock === 'available' ? 'Add to Cart' : 'Out of Stock'}
                        </button>
                        {expandedProduct === product.productId && (
                            <div className="product-detail-section">
                                <h3>Product Details</h3>
                                <p>
                                    This is a soft, high-quality {product.productName}.
                                    Perfect for comfort and care.
                                </p>
                                <div className="review-section">
                                    <h4>Customer Reviews</h4>
                                    <div className="review-list">
                                        {loadingReviews && <p>Loading reviews...</p>}
                                        {reviewError && <p className="error-message">{reviewError}</p>}
                                        {allReviews.filter(r => r.productId === product.productId).length === 0 && <p>No reviews yet.</p>}
                                        {allReviews.filter(r => r.productId === product.productId).map((rev, index) => (
                                            <div key={index} className="review-card">
                                                <div className="review-card-header">
                                                    <span>{rev.name}</span>
                                                    <span className="review-rating">{"★".repeat(rev.rating)}</span>
                                                </div>
                                                <p>{rev.comment}</p>
                                            </div>
                                        ))}
                                    </div>
                                    <form
                                        onSubmit={(e) => handleReviewSubmit(e, product.productId)}
                                        className="review-form"
                                    >
                                        <input
                                            type="text"
                                            placeholder="Your Name"
                                            value={reviewInputs[product.productId]?.name || ""}
                                            onChange={(e) => handleInputChange(product.productId, "name", e.target.value)}
                                        />
                                        <textarea
                                            placeholder="Write your review..."
                                            value={reviewInputs[product.productId]?.comment || ""}
                                            onChange={(e) => handleInputChange(product.productId, "comment", e.target.value)}
                                        />
                                        <label>
                                            Rating:
                                            <select
                                                value={reviewInputs[product.productId]?.rating || 5}
                                                onChange={(e) =>
                                                    handleInputChange(product.productId, "rating", Number(e.target.value))
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
            </div>
        </div>
    );
}

