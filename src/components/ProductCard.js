import React, { memo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Star, ShoppingCart } from 'lucide-react';
import SizeSelector from './SizeSelector';

// Memoized product card component to prevent unnecessary re-renders
const ProductCard = memo(({ product, onAddToCart, showViewButton = true }) => {
  const [selectedSize, setSelectedSize] = useState(null);
  const [sizeError, setSizeError] = useState(null);
  const [showSizeModal, setShowSizeModal] = useState(false);
  const [selectedSizeCategory, setSelectedSizeCategory] = useState(null);
  
  // Check if product has sizes (and it's not just "One Size")
  const hasSizes = product.sizes && 
    Array.isArray(product.sizes) && 
    product.sizes.length > 0 && 
    !(product.sizes.length === 1 && product.sizes[0] === 'One Size');

  // Helpers for two-step size selection
  const normalize = (s) => (s || '').toString().trim();
  const toKey = (s) => normalize(s).toLowerCase();
  const backendSizes = Array.isArray(product.sizes) ? product.sizes.map(normalize) : [];
  const hasCategoryBasedSizes = backendSizes.some(s => ['newborn', 'baby', 'toddler'].includes(toKey(s)));
  const sizeCategories = hasCategoryBasedSizes
    ? Array.from(new Set(backendSizes
        .map(s => toKey(s))
        .filter(s => ['newborn', 'baby', 'toddler'].includes(s))
      ))
    : [];
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
  let derivedSizes = [];
  if (/duvet/i.test(product.category)) {
    derivedSizes = duvetSizes;
  } else if (hasCategoryBasedSizes) {
    derivedSizes = selectedSizeCategory ? getSizesForCategory(selectedSizeCategory) : [];
  } else {
    derivedSizes = backendSizes;
  }
  
  const handleAddToCart = () => {
    // If size required and not selected, show modal
    if (hasSizes && !selectedSize) {
      setShowSizeModal(true);
      setSizeError(null);
      return;
    }
    setSizeError(null);
    const productWithSize = hasSizes ? { ...product, size: selectedSize } : product;
    onAddToCart(productWithSize);
    if (hasSizes) {
      setSelectedSize(null);
      setSelectedSizeCategory(null);
    }
  };
  // No inline review previews here: product list shows only star ratings.
  const PLACEHOLDER_IMG =
    'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="320" height="160"><rect width="100%" height="100%" fill="%23f3f4f6"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%239ca3af" font-family="sans-serif" font-size="14">No Image</text></svg>';

  return (
    <Card className="group baby-pink-card baby-pink-hover transition-all duration-300 h-full">
      <CardContent className="p-0 h-full flex flex-col">
        <div className="bg-muted relative" style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img
            src={product.image || PLACEHOLDER_IMG}
            alt={product.name}
            className="max-h-full max-w-full object-contain"
            style={{ height: '100%', width: 'auto' }}
            onError={(e) => {
              e.target.src = PLACEHOLDER_IMG;
            }}
          />
          {!product.inStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-t-lg">
              <Badge variant="destructive">Out of Stock</Badge>
            </div>
          )}
        </div>
        <div className="p-3 flex flex-col flex-1">
          <Badge variant="secondary" className="mb-2" style={{ backgroundColor: '#FFB6C1', color: 'white' }}>
            {product.category}
          </Badge>
          <h3 className="font-semibold mb-1 text-sm">{product.name}</h3>
          <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
            {product.description}
          </p>
          {product.sizes && product.sizes.length > 0 && (
            <p className="text-xs text-muted-foreground mb-2" style={{ color: '#87CEEB', fontWeight: '500' }}>
              Sizes: {product.sizes.length > 3 ? `${product.sizes.slice(0, 3).join(', ')}...` : product.sizes.join(', ')}
            </p>
          )}
          <div className="flex items-center mb-2" aria-label={`Average rating ${Number(product.rating || 0).toFixed(1)} out of 5, based on ${product.reviewCount || 0} reviews`}>
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.round(Number(product.rating || 0))
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground ml-2">({Number(product.rating || 0).toFixed(1)} · {product.reviewCount || 0})</span>
          </div>

          {/* No review previews here; users should click through to see full product details */}

          <div className="mt-auto pt-2">
            <div className="text-lg font-semibold mb-2">R{product.price}</div>
            
            {/* Size selector if product has sizes (for preview, not modal) */}
            {hasSizes && (
              <div className="mb-3">
                {hasCategoryBasedSizes && !/duvet/i.test(product.category) ? (
                  <div className="flex flex-wrap gap-2 mb-2" role="tablist" aria-label="Size categories">
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
                              padding: '0.3rem 0.7rem',
                              border: isActive ? '1.5px solid #FFB6C1' : '1.5px solid #e5e7eb',
                              borderRadius: '9999px',
                              backgroundColor: isActive ? '#FFB6C1' : '#ffffff',
                              color: isActive ? '#ffffff' : '#5D5D5D',
                              fontWeight: isActive ? 600 : 500,
                              fontSize: '0.8rem',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease-in-out',
                            }}
                          >
                            {label}
                          </button>
                        );
                      })}
                  </div>
                ) : null}
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
      {/* Size selection modal for Add to Cart */}
      {showSizeModal && hasSizes && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.25)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: 'white', borderRadius: 12, padding: 24, minWidth: 320, boxShadow: '0 2px 16px rgba(0,0,0,0.12)' }}>
            <h3 style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: 12 }}>Select Size</h3>
            {hasCategoryBasedSizes && !/duvet/i.test(product.category) ? (
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
            ) : null}
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
            <div style={{ display: 'flex', gap: 12, marginTop: 18 }}>
              <Button size="sm" className="baby-pink-button flex-1" onClick={() => {
                if (!selectedSize) {
                  setSizeError('Please select a size');
                  return;
                }
                setShowSizeModal(false);
                handleAddToCart();
              }}>
                Add to Cart
              </Button>
              <Button size="sm" variant="outline" className="flex-1" onClick={() => setShowSizeModal(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
            
            <div className="flex items-stretch w-full" style={{ gap: 8 }}>
              <Button
                size="sm"
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="baby-pink-button flex-1 justify-center"
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                {product.inStock ? 'Add to Cart' : 'Out of Stock'}
              </Button>
              {showViewButton && (
                <Button asChild size="sm" className="button-as-link flex-1 justify-center">
                  <Link to={`/products/${product.id}`} className="button-as-link">View product details</Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

ProductCard.displayName = 'ProductCard';

export default ProductCard;