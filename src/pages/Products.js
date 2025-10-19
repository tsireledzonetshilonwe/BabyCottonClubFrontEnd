import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api, { fetchAllReviews, fetchProducts, fetchCustomerById } from '../api/api';
import { Button } from '../components/ui/button';
import { resolveProductImage, IMAGE_PLACEHOLDER } from '../utils/images';
import { mapToCategory } from '../utils/categoryMapper';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [customerCache, setCustomerCache] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        // fetch all products and find by id (backend returns productId as number)
        const prods = await fetchProducts();
        const found = prods.find(p => String(p.productId) === String(id) || String(p.id) === String(id));
        setProduct(found || null);

        // load reviews for the product
        const all = await fetchAllReviews();
        const filtered = (all || []).filter(r => {
          if (!r) return false;
          if (r.product && (r.product.productId || r.product.id)) {
            return String(r.product.productId || r.product.id) === String(found?.productId || id || found?.id);
          }
          if (r.productId) return String(r.productId) === String(found?.productId || id || found?.id);
          return false;
        });
        setReviews(filtered);

        // If reviews lack nested customer objects but have customerId, fetch those customers
        const missingCustomerIds = Array.from(new Set((filtered || [])
          .map(r => r && (r.customerId || (r.customer && (r.customer.customerId || r.customer.id))))
          .filter(Boolean)
          .map(String)
          .filter(cid => !customerCache[cid])
        ));

        if (missingCustomerIds.length > 0) {
          try {
            const fetched = await Promise.all(missingCustomerIds.map(cid => fetchCustomerById(cid).catch(() => null)));
            const map = {};
            fetched.forEach((c, i) => { if (c) map[String(missingCustomerIds[i])] = c; });
            setCustomerCache(prev => ({ ...prev, ...map }));
          } catch (e) {
            // ignore customer fetch errors
            console.warn('Failed to fetch some customers for reviews', e);
          }
        }
      } catch (err) {
        setError('Failed to load product or reviews');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) return <div className="container mx-auto p-4">Loading...</div>;
  if (error) return <div className="container mx-auto p-4 text-destructive">{error}</div>;
  if (!product) return <div className="container mx-auto p-4">Product not found</div>;

  // compute average rating and count from reviews array
  const reviewCount = (reviews || []).length;
  const avgRating = reviewCount > 0 ? (reviews.reduce((s, r) => s + (Number(r.rating) || 0), 0) / reviewCount) : null;

  // breakdown counts per star (5 to 1)
  const ratingCounts = [5,4,3,2,1].map(star => (
    (reviews || []).filter(r => Number(r.rating) === star).length
  ));
  const maxCount = Math.max(...ratingCounts, 1);

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/3 bg-muted p-4 rounded">
          <img src={resolveProductImage(product)} onError={(e)=>{e.currentTarget.src=IMAGE_PLACEHOLDER}} alt={product.productName || product.name} className="w-full object-contain h-64 mx-auto" />
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-bold mb-2">{product.productName || product.name}</h1>
          <p className="text-muted-foreground mb-4">{product.description}</p>
          <div className="flex items-center mb-4">
            <div className="flex items-center mr-3" aria-hidden>
              {[...Array(5)].map((_, i) => (
                <span key={i} className={`mr-1 ${i < Math.round(Number(avgRating || product.rating || 0)) ? 'text-yellow-400' : 'text-gray-300'}`}>
                  ★
                </span>
              ))}
            </div>
            <div className="text-sm text-muted-foreground">{avgRating ? Number(avgRating).toFixed(1) : (product.rating || '4.0')} · {reviewCount} review{reviewCount === 1 ? '' : 's'}</div>
          </div>
          <div className="mb-4">
            <span className="text-xl font-semibold">R{product.price}</span>
            <span className="ml-4 text-sm text-muted-foreground">Category: {product.category?.categoryName || product.category || mapToCategory({ name: product.productName || product.name, category: product.category?.categoryName }) || 'Other'}</span>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Reviews</h2>
            <div className="rating-summary mb-6">
              <div className="rating-left">
                <div className="avg-rating">{avgRating ? Number(avgRating).toFixed(1) : (product.rating || '4.0')}</div>
                <div className="avg-stars" aria-hidden>
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={`mr-1 ${i < Math.round(Number(avgRating || product.rating || 0)) ? 'text-yellow-400' : 'text-gray-300'}`}>★</span>
                  ))}
                </div>
                <div className="review-count text-sm text-muted-foreground">{reviewCount} review{reviewCount === 1 ? '' : 's'}</div>
              </div>
              <div className="rating-right">
                {[5,4,3,2,1].map((star, idx) => {
                  const count = ratingCounts[idx];
                  const pct = Math.round((count / maxCount) * 100);
                  return (
                    <div className="rating-row" key={star}>
                      <div className="star-label">{star} <span className="sr-only">stars</span></div>
                      <div className="rating-bar-wrap">
                        <div className="rating-bar" style={{ width: `${pct}%` }}></div>
                      </div>
                      <div className="rating-num">{count}</div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <Link to="/orders" style={{ textDecoration: 'none' }}>
                <Button variant="default" className="write-review-btn">Write Review</Button>
              </Link>
            </div>
            {reviews.length === 0 && (
              <div className="no-reviews">
                <div className="no-reviews-icon">💬</div>
                <h5>No reviews yet</h5>
                <p>Be the first to review this product!</p>
              </div>
            )}
            <div className="reviews-list">
              {reviews.map((r) => {
                const idKey = String(r.reviewId || r.id || Math.random());
                // pick comment from several possible field names (backend uses reviewComment)
                const comment = String(r.reviewComment ?? r.comment ?? r.text ?? r.content ?? r.body ?? '').trim();
                // resolve customer: prefer nested, else look in cache by customerId
                let customer = r.customer || null;
                const cid = r.customerId || (r.customer && (r.customer.customerId || r.customer.id));
                if (!customer && cid) {
                  customer = customerCache[String(cid)] || null;
                }

                const customerName = customer && (customer.firstName || customer.name || customer.fullName)
                  ? `${customer.firstName || customer.name || customer.fullName}${customer.lastName ? ' ' + customer.lastName : ''}`
                  : (customer && (customer.email || customer.username) ? (customer.email || customer.username) : 'Anonymous');

                return (
                  <div key={idKey} className="review-card">
                    <div className="review-card-header">
                      <div className="reviewer-name">{customerName}</div>
                      <div className="review-rating">{[...Array(5)].map((_, i) => (
                        <span key={i} className={`${i < (Number(r.rating) || 0) ? 'text-yellow-400' : 'text-gray-300'} mr-0.5`}>★</span>
                      ))}</div>
                    </div>
                    <div className="review-meta">
                      <span className="review-date">{r.reviewDate || new Date().toLocaleDateString()}</span>
                      <span className="review-purchase-info">Reviewed after purchase</span>
                      {r.size && <span className="review-size">Size: {r.size}</span>}
                    </div>
                    <div className="review-body">{comment || '(no comment)'}</div>
                    <div className="review-helpful">
                      <span className="helpful-text">Helpful?</span>
                      <span className="helpful-count">{Math.floor(Math.random() * 15)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-6">
            <Link to="/products" className="mr-4 back-to-products-link" style={{ textDecoration: 'none' }}>
              <Button variant="default" className="back-to-products-btn">Back to products</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;