import React, { useState } from "react";

const productsData = [
  { id: 1, name: "Baby Cotton Onesie", price: 199, inStock: true, image: "/images/onesie.jpg" },
  { id: 2, name: "Soft Cotton Blanket", price: 250, inStock: true, image: "/images/blanket.jpg" },
  { id: 3, name: "Baby Booties", price: 120, inStock: false, image: "/images/booties.jpg" },
];

export default function Category() {
  const [reviews, setReviews] = useState({}); // { productId: [{name, comment, rating}] }

  const handleReviewSubmit = (productId, name, comment, rating) => {
    setReviews((prev) => ({
      ...prev,
      [productId]: [...(prev[productId] || []), { name, comment, rating }],
    }));
  };

  return (
    <div className="category-page">
      <h1 className="products-title">Baby Cotton Club</h1>

      <div className="products-grid">
        {productsData.map((product) => (
          <div key={product.id} className="product-card">
            {/* Product Image */}
            <img src={product.image} alt={product.name} className="product-image" />

            {/* Product Info */}
            <div className="product-info">
              <h2 className="product-name">{product.name}</h2>
              <p className="product-price">R {product.price}</p>
              <p className={`category-stock ${product.inStock ? "in" : "out"}`}>
                {product.inStock ? "In Stock" : "Out of Stock"}
              </p>
            </div>

            {/* Add to Cart */}
            <button className="product-buy-btn">Add to Cart</button>

            {/* Reviews Section */}
            <div className="review-section">
              <h3 className="review-title">Customer Reviews</h3>
              <div className="review-list">
                {(reviews[product.id] || []).map((rev, index) => (
                  <div key={index} className="review-card">
                    <div className="review-card-header">
                      <span>{rev.name}</span>
                      <span className="review-rating">{"⭐".repeat(rev.rating)}</span>
                    </div>
                    <p className="review-comment">{rev.comment}</p>
                  </div>
                ))}
              </div>

              {/* Review Form */}
              <ReviewForm productId={product.id} onSubmit={handleReviewSubmit} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ReviewForm({ productId, onSubmit }) {
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !comment) return;
    onSubmit(productId, name, comment, rating);
    setName("");
    setComment("");
    setRating(5);
  };

  return (
    <form onSubmit={handleSubmit} className="review-form">
      <input
        type="text"
        placeholder="Your Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <textarea
        placeholder="Write your review..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      <label>
        Rating:
        <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
          {[1, 2, 3, 4, 5].map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </label>
      <button type="submit">Submit Review</button>
    </form>
  );
}
