import React, { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { fetchAllReviews, createReview, fetchProducts } from "../api/api";
import "./Product.css";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [expandedProduct, setExpandedProduct] = useState(null);
  const [reviewInputs, setReviewInputs] = useState({});
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [allReviews, setAllReviews] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [productError, setProductError] = useState("");
  const [reviewError, setReviewError] = useState("");
  const { addToCart } = useCart();

  // ✅ Fetch products
  useEffect(() => {
    const loadProducts = async () => {
      setLoadingProducts(true);
      try {
        const data = await fetchProducts();
        setProducts(data);
      } catch (err) {
        console.error("Failed to fetch products", err);
        setProductError("Failed to load products. Please try again later.");
      } finally {
        setLoadingProducts(false);
      }
    };
    loadProducts();
  }, []);

  // ✅ Fetch reviews
  useEffect(() => {
    const loadReviews = async () => {
      setLoadingReviews(true);
      try {
        const data = await fetchAllReviews();
        setAllReviews(data);
      } catch (err) {
        console.error("Failed to fetch reviews", err);
        setReviewError("Failed to load reviews.");
      } finally {
        setLoadingReviews(false);
      }
    };
    loadReviews();
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
        rating: rating || 5,
      });
      const data = await fetchAllReviews();
      setAllReviews(data);
      setReviewInputs({
        ...reviewInputs,
        [productId]: { name: "", comment: "", rating: 5 },
      });
    } catch (err) {
      console.error("Failed to submit review", err);
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

 
  const filteredProducts = products.filter((p) => {
    const categoryMatch = selectedCategory === "All" || p.category?.categoryName === selectedCategory;
    return categoryMatch;
  });

  return (
    <div className="products-page">
      <h1 className="products-title">All Products</h1>

      {/* Error or Loading */}
      {loadingProducts && <p className="info-message">Loading products...</p>}
      {productError && <p className="error-message">{productError}</p>}

      {/* Category filter */}
      {!loadingProducts && !productError && (
        <div className="category-filter">
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
        </div>
      )}

      {/* Product grid */}
      <div className="products-grid">
        {!loadingProducts &&
          !productError &&
          filteredProducts.map((product) => {
            
            const imageSrc = product.imageUrl?.startsWith("http")
              ? product.imageUrl
              : process.env.PUBLIC_URL + product.imageUrl;

            
            const productReviews = allReviews.filter((r) => r.productId === product.productId);

            return (
              <div key={product.productId} className="product-card">
                <img
                  src={imageSrc}
                  alt={product.productName}
                  className="product-image"
                />
                <div className="product-info">
                  <h2 className="product-name">{product.productName}</h2>
                  <p className="product-category">{product.category?.categoryName}</p>
                  <p className="product-price">R {product.price}</p>
                  <p
                    className={`category-stock ${product.inStock === "available" ? "in" : "out"}`}
                  >
                    {product.inStock === "available" ? "In Stock" : "Out of Stock"}
                  </p>
                </div>

                {/* View details button */}
                <button
                  className="product-buy-btn"
                  onClick={() => toggleExpand(product.productId)}
                >
                  {expandedProduct === product.productId ? "Hide Details" : "View Details"}
                </button>

                {/* Add to cart button */}
                <button
                  className="product-buy-btn"
                  onClick={() =>
                    addToCart({
                      id: product.productId,
                      name: product.productName,
                      price: product.price,
                      image: product.imageUrl,
                      quantity: 1,
                    })
                  }
                  disabled={product.inStock !== "available"}
                  style={{
                    marginTop: 8,
                    background: product.inStock === "available" ? "#90e0ef" : "#ccc",
                    color: product.inStock === "available" ? "#023e8a" : "#888",
                    cursor: product.inStock === "available" ? "pointer" : "not-allowed",
                  }}
                >
                  {product.inStock === "available" ? "Add to Cart" : "Out of Stock"}
                </button>

                {/* Product details + reviews */}
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
                        {loadingReviews && <p className="info-message">Loading reviews...</p>}
                        {reviewError && <p className="error-message">{reviewError}</p>}

                        {productReviews.length === 0 && !loadingReviews && <p>No reviews yet.</p>}
                        {productReviews.map((rev, index) => (
                          <div key={index} className="review-card">
                            <div className="review-card-header">
                              <span>{rev.name}</span>
                              <span className="review-rating">{"⭐".repeat(rev.rating)}</span>
                            </div>
                            <p>{rev.comment}</p>
                          </div>
                        ))}
                      </div>

                      {/* Review form */}
                      <form
                        onSubmit={(e) => handleReviewSubmit(e, product.productId)}
                        className="review-form"
                      >
                        <input
                          type="text"
                          placeholder="Your Name"
                          value={reviewInputs[product.productId]?.name || ""}
                          onChange={(e) =>
                            handleInputChange(product.productId, "name", e.target.value)
                          }
                        />
                        <textarea
                          placeholder="Write your review..."
                          value={reviewInputs[product.productId]?.comment || ""}
                          onChange={(e) =>
                            handleInputChange(product.productId, "comment", e.target.value)
                          }
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
            );
          })}
      </div>
    </div>
  );
}
