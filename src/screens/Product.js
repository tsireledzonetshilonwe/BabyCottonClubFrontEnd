import React, { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { TextField, Button } from "@mui/material";
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

  // Fetch products
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

  // Fetch reviews
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

  const toggleExpand = (id) => setExpandedProduct(expandedProduct === id ? null : id);

  const handleReviewSubmit = async (e, product) => {
    e.preventDefault();
  const { comment, rating } = reviewInputs[product.productId] || {};
  if (!comment) return;

    try {
      // Get customerId from localStorage customer object
      const customerObj = localStorage.getItem("customer");
      const customer = customerObj ? JSON.parse(customerObj) : null;
      const customerId = customer ? customer.customerId : null;
      if (!customerId) {
        setReviewError("You must be logged in to submit a review.");
        return;
      }

      // Build review payload for backend
      const reviewPayload = {
        rating: rating || 5,
        reviewDate: new Date().toISOString().split("T")[0],
        reviewComment: comment,
        productId: product.productId,
        customerId: customerId
      };
      console.log("Submitting review payload:", reviewPayload);

      await createReview(reviewPayload);

      // Always refresh all reviews from backend to ensure UI updates
      const updatedReviews = await fetchAllReviews();
      setAllReviews(updatedReviews);

      // Clear inputs only if review was submitted
      setReviewInputs({
  ...reviewInputs,
  [product.productId]: { comment: "", rating: 5 },
      });
      setReviewError("");
    } catch (err) {
      console.error("Failed to submit review", err);
      if (err.response) {
        console.error("API error status:", err.response.status);
        console.error("API error data:", err.response.data);
        console.error("API error headers:", err.response.headers);
      }
      let errorMsg = "Failed to submit review.";
      if (err.response && err.response.data) {
        errorMsg += ` ${JSON.stringify(err.response.data)}`;
      }
      setReviewError(errorMsg);
    }
  };

  const handleInputChange = (productId, field, value) => {
    setReviewInputs({
      ...reviewInputs,
      [productId]: { ...reviewInputs[productId], [field]: value },
    });
  };

  const categories = ["All", ...new Set(products.map((p) => p.category?.categoryName || "Other"))];

  const filteredProducts = products.filter(
    (p) => selectedCategory === "All" || p.category?.categoryName === selectedCategory
  );

  return (
    <div className="products-page">
      
     
      <h1 className="products-title">All Products</h1>

      {loadingProducts && <p className="info-message">Loading products...</p>}
      {productError && <p className="error-message">{productError}</p>}

      {!loadingProducts && !productError && (
        <div className="category-filter">
          <label htmlFor="category-select">Category: </label>
          <select
            id="category-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map((cat, idx) => (
              <option key={idx} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      )}

      <div className="products-grid">
        {filteredProducts.map((product) => {
          const imageSrc = product.imageUrl?.startsWith("http")
            ? product.imageUrl
            : process.env.PUBLIC_URL + product.imageUrl;

          // Filter reviews for this product only
          const productReviews = allReviews.filter(
            (rev) => rev.product && rev.product.productId === product.productId
          );

          return (
            <div key={product.productId} className="product-card">
              <img src={imageSrc} alt={product.productName} className="product-image" />
              <div className="product-info">
                <h2 className="product-name">{product.productName}</h2>
                <p className="product-category">{product.category?.categoryName}</p>
                <p className="product-price">R {product.price}</p>
                <p className={`category-stock ${product.inStock === "available" ? "in" : "out"}`}>
                  {product.inStock === "available" ? "In Stock" : "Out of Stock"}
                </p>
              </div>

              <button className="product-buy-btn" onClick={() => toggleExpand(product.productId)}>
                {expandedProduct === product.productId ? "Hide Details" : "View Details"}
              </button>

              <button
                className="product-buy-btn"
                onClick={() => addToCart({ id: product.productId, name: product.productName, price: product.price, image: product.imageUrl, quantity: 1 })}
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

              {expandedProduct === product.productId && (
                <div className="product-detail-section">
                  <h3>Product Details</h3>
                  <p>This is a soft, high-quality {product.productName}. Perfect for comfort and care.</p>

                  <div className="review-section">
                    <h4>Customer Reviews</h4>
                    <div className="review-list">
                      {loadingReviews && <p className="info-message">Loading reviews...</p>}
                      {reviewError && <p className="error-message">{reviewError}</p>}
                      {productReviews.length === 0 && !loadingReviews && <p>No reviews yet.</p>}
                      {productReviews.map((rev, idx) => (
                        <div key={idx} className="review-card">
                          <div className="review-card-header">
                            <span>{rev.customer && rev.customer.firstName ? rev.customer.firstName : "Anonymous"}</span>
                            <span className="review-rating">{"⭐".repeat(rev.rating)}</span>
                          </div>
                          <p>{rev.reviewComment}</p>
                        </div>
                      ))}
                    </div>

                    <form onSubmit={(e) => handleReviewSubmit(e, product)} className="review-form">


  <TextField
    label="Write your Review"
    variant="outlined"
    fullWidth
    multiline
    rows={3}
    margin="normal"
    value={reviewInputs[product.productId]?.comment || ""}
    onChange={(e) =>
      handleInputChange(product.productId, "comment", e.target.value)
    }
  />

  <TextField
    label="Rating (1-5)"
    type="number"
    variant="outlined"
    margin="normal"
    inputProps={{ min: 1, max: 5 }}
    value={reviewInputs[product.productId]?.rating || 5}
    onChange={(e) =>
      handleInputChange(
        product.productId,
        "rating",
        Math.min(Math.max(parseInt(e.target.value) || 1, 1), 5)
      )
    }
  />

  <Button type="submit" variant="contained" color="primary" style={{ marginTop: 10 }}>
    Submit Review
  </Button>
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
