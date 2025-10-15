import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Star, ShoppingCart } from 'lucide-react';

// Memoized product card component to prevent unnecessary re-renders
const ProductCard = memo(({ product, onAddToCart, showViewButton = true }) => {
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
            <div className="flex items-stretch w-full" style={{ gap: 8 }}>
              <Button
                size="sm"
                onClick={() => onAddToCart(product)}
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