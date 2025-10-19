import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api, { fetchAllReviews, fetchProducts, fetchCustomerById } from '../api/api';
import { Button } from '../components/ui/button';
import { resolveProductImage, IMAGE_PLACEHOLDER } from '../utils/images';
import { mapToCategory } from '../utils/categoryMapper';
import { useCart } from '../context/CartContext';
import { useToast } from '../hooks/use-toast';
import SizeSelector from '../components/SizeSelector';
import { normalizeLocalImage } from '../utils/images';
import { ShoppingCart } from 'lucide-react';
import SizeGuide from '../components/SizeGuide';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [customerCache, setCustomerCache] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [sizeError, setSizeError] = useState(null);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [selectedSizeCategory, setSelectedSizeCategory] = useState(null);
  
  const { addToCart } = useCart();
  const { toast } = useToast();

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

  // compute average rating and count from reviews array
  const reviewCount = (reviews || []).length;
  const avgRating = reviewCount > 0 ? (reviews.reduce((s, r) => s + (Number(r.rating) || 0), 0) / reviewCount) : null;

  // Check if product has sizes (and it's not just "One Size")
  const hasSizes = product?.sizes && 
    Array.isArray(product.sizes) && 
    product.sizes.length > 0 && 
    !(product.sizes.length === 1 && product.sizes[0] === 'One Size');

  // Normalize helpers
  const normalize = (s) => (s || '').toString().trim();
  const toKey = (s) => normalize(s).toLowerCase();

  // Derive product category name
  const productCategoryName = normalize(product?.category?.categoryName || product?.category || mapToCategory({ name: product?.productName || product?.name, category: product?.category?.categoryName }));

  // Determine if backend sizes indicate category-based selection (newborn/baby/toddler)
  const backendSizes = Array.isArray(product?.sizes) ? product.sizes.map(normalize) : [];
  const hasCategoryBasedSizes = backendSizes.some(s => ['newborn', 'baby', 'toddler'].includes(toKey(s)));

  // Available size categories from backend (intersection with our known ones)
  const sizeCategories = hasCategoryBasedSizes
    ? Array.from(new Set(backendSizes
        .map(s => toKey(s))
        .filter(s => ['newborn', 'baby', 'toddler'].includes(s))
      ))
    : [];

  // Map categories to concrete sizes
  const babySizes = ['0-3M', '3-6M', '6-9M', '9-12M', '12-18M', '18-24M'];
  const toddlerSizes = ['2-3 years', '3-4 years', '4-5 years', '5-6 years'];
  const newbornSizes = ['Newborn'];
  const duvetSizes = ['Cot Duvet', 'Toddler Duvet', 'Single Duvet', 'Double Duvet'];

  const getSizesForCategory = (key) => {
    switch (toKey(key)) {
      case 'baby': return babySizes;
      case 'toddler': return toddlerSizes;
      case 'newborn': return newbornSizes;
      default: return [];
    }
  };

  // Derive the sizes to render in the selector
  let derivedSizes = [];
  if (/duvet/i.test(productCategoryName)) {
    // Duvet products: always show duvet sizes
    derivedSizes = duvetSizes;
  } else if (hasCategoryBasedSizes) {
    // Show sizes based on the selected size category
    derivedSizes = selectedSizeCategory ? getSizesForCategory(selectedSizeCategory) : [];
  } else {
    // Fallback: use backend-provided concrete sizes
    derivedSizes = backendSizes;
  }

  // Auto-select the sole newborn size when the newborn category is chosen
  useEffect(() => {
    if (selectedSizeCategory && toKey(selectedSizeCategory) === 'newborn') {
      setSelectedSize('Newborn');
      setSizeError(null);
    }
  }, [selectedSizeCategory]);
  
  const handleAddToCart = () => {
    // Validate size if product has sizes
    if (hasSizes && !selectedSize) {
      setSizeError('Please select a size before adding to cart');
      toast({
        title: 'Size Required',
        description: 'Please select a size before adding to cart',
        variant: 'destructive',
      });
      return;
    }
    
    setSizeError(null);
    
    try {
      const cartItem = {
        id: product.productId,
        name: product.productName || product.name,
        price: product.price,
        image: normalizeLocalImage(product.imageUrl) || resolveProductImage(product)
      };
      
      // Include size if selected
      if (hasSizes && selectedSize) {
        cartItem.size = selectedSize;
      }
      
      addToCart(cartItem);
      
      const sizeInfo = selectedSize ? ` (Size: ${selectedSize})` : '';
      toast({
        title: 'Added to cart',
        description: `${product.productName || product.name}${sizeInfo} has been added to your cart`,
      });
      
      // Reset size selection after adding
      if (hasSizes) {
        setSelectedSize(null);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to add item to cart',
        variant: 'destructive',
      });
    }
  };

  // Early returns to avoid accessing properties on a null product during load
  if (loading) {
    return (
      <div className="container mx-auto p-6 max-w-6xl">
        <p className="text-muted-foreground">Loading product…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6 max-w-6xl">
        <p className="text-red-600">{String(error)}</p>
        <div className="mt-4">
          <Link to="/products" className="no-underline">
            <Button className="bg-pink-500 hover:bg-pink-600 text-white">Back to Products</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto p-6 max-w-6xl">
        <p className="text-gray-700">Product not found.</p>
        <div className="mt-4">
          <Link to="/products" className="no-underline">
            <Button className="bg-pink-500 hover:bg-pink-600 text-white">Back to Products</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      {/* Back Button with Pink Styling - No Underline */}
      <div className="mb-6">
        <Link to="/products" style={{ textDecoration: 'none' }}>
          <Button className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
            Back to Products
          </Button>
        </Link>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Product Image Section */}
        <div className="w-full lg:w-2/5">
          <div className="bg-white p-6 rounded-lg border">
            <img
              src={resolveProductImage(product)}
              onError={(e) => { e.currentTarget.src = IMAGE_PLACEHOLDER }}
              alt={product.productName || product.name}
              className="w-full h-80 object-contain"
            />
          </div>
        </div>
        <div className="w-full lg:w-3/5">
          <h1 className="text-2xl font-bold mb-2">{product.productName || product.name}</h1>
          <p className="text-gray-600 leading-relaxed mb-4">{product.description}</p>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center" aria-hidden>
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className={`text-xl ${i < Math.round(Number(avgRating || product.rating || 0)) ? 'text-yellow-400' : 'text-gray-300'}`}
                  >
                    ★
                  </span>
                ))}
              </div>
              <span className="text-gray-600">
                {avgRating ? Number(avgRating).toFixed(1) : (product.rating || '4.0')} ({reviewCount} reviews)
              </span>
            </div>
            <div className="text-2xl font-bold text-gray-900">R{product.price}</div>
          </div>

          {/* Category */}
          <div className="text-gray-600 mb-4">
            <strong>Category:</strong> {product.category?.categoryName || product.category || mapToCategory({ name: product.productName || product.name, category: product.category?.categoryName }) || 'Other'}
          </div>

          {/* Size selector if product has sizes */}
          {hasSizes && (
            <div className="mb-6">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <h4 style={{ margin: 0 }}>Select Size</h4>
                <button 
                  onClick={() => setShowSizeGuide(true)}
                  style={{
                    background: 'none',
                    border: '1px solid #333',
                    padding: '5px 15px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    borderRadius: '4px'
                  }}
                >
                  Size Guide
                </button>
              </div>
              {/* Step 1: Category selection when applicable and not duvet */}
              {hasCategoryBasedSizes && !/duvet/i.test(productCategoryName) && (
                <div className="flex flex-wrap gap-2 mb-3" role="tablist" aria-label="Size categories">
                  {['newborn', 'baby', 'toddler']
                    .filter(k => sizeCategories.includes(k))
                    .map((catKey) => {
                      const isActive = toKey(selectedSizeCategory) === catKey;
                      const label = catKey.charAt(0).toUpperCase() + catKey.slice(1);
                      return (
                        <button
                          key={catKey}
                          type="button"
                          role="tab"
                          aria-selected={isActive}
                          onClick={() => {
                            setSelectedSizeCategory(catKey);
                            setSelectedSize(null);
                            setSizeError(null);
                          }}
                          style={{
                            padding: '0.4rem 0.9rem',
                            border: isActive ? '1.5px solid #FFB6C1' : '1.5px solid #e5e7eb',
                            borderRadius: '9999px',
                            backgroundColor: isActive ? '#FFB6C1' : '#ffffff',
                            color: isActive ? '#ffffff' : '#5D5D5D',
                            fontWeight: isActive ? 600 : 500,
                            fontSize: '0.85rem',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease-in-out',
                          }}
                        >
                          {label}
                        </button>
                      );
                    })}
                </div>
              )}
              <SizeSelector
                sizes={derivedSizes}
                selectedSize={selectedSize}
                onSizeChange={(size) => {
                  setSelectedSize(size);
                  setSizeError(null);
                }}
                required={true}
                error={sizeError}
              />
            </div>
          )}

          {/* Add to Cart button */}
          <div className="mb-6">
            <Button 
              onClick={handleAddToCart} 
              size="lg"
              className="baby-pink-button"
              disabled={product.inStock === 'Out of Stock'}
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              {product.inStock === 'Out of Stock' ? 'Out of Stock' : 'Add to Cart'}
            </Button>
          </div>

            {/* Reviews Section */}
            <div className="mt-8 pt-6 border-t">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Customer Reviews</h2>
                <div className="text-sm text-gray-600">{reviewCount} review{reviewCount === 1 ? '' : 's'}</div>
              </div>

              {reviews.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                  <div className="text-4xl text-gray-400 mb-3">💬</div>
                  <p className="text-gray-500 text-lg">No reviews yet</p>
                  <p className="text-gray-400 text-sm mt-1">Be the first to share your thoughts!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {reviews.map((r) => {
                    const idKey = String(r.reviewId || r.id || Math.random());
                    const comment = String(r.reviewComment ?? r.comment ?? r.text ?? r.content ?? r.body ?? '').trim();
                    let customer = r.customer || null;
                    const cid = r.customerId || (r.customer && (r.customer.customerId || r.customer.id));
                    if (!customer && cid) {
                      customer = customerCache[String(cid)] || null;
                    }

                    const customerName = customer && (customer.firstName || customer.name || customer.fullName)
                      ? `${customer.firstName || customer.name || customer.fullName}${customer.lastName ? ' ' + customer.lastName : ''}`
                      : (customer && (customer.email || customer.username) ? (customer.email || customer.username) : 'Anonymous');

                    return (
                      <div key={idKey} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center border">
                              <span className="text-gray-700 font-semibold text-sm">
                                {customerName.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <div className="font-medium text-gray-900 text-sm">{customerName}</div>
                              <div className="text-xs text-gray-500">{r.reviewDate}</div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-1 bg-yellow-50 px-2 py-1 rounded-full border border-yellow-100">
                            <span className="text-yellow-500 text-sm">⭐</span>
                            <span className="font-bold text-gray-900 text-sm">{r.rating}</span>
                          </div>
                        </div>
                        <div className="text-gray-700 text-sm leading-relaxed">
                          {comment || 'No comment provided.'}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
        </div>
      </div>

        {/* Size Guide Modal */}
        <SizeGuide isOpen={showSizeGuide} onClose={() => setShowSizeGuide(false)} />
      </div>
    );
};

export default ProductDetails;
