import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Star, ShoppingCart } from 'lucide-react';

// Memoized product card component to prevent unnecessary re-renders
const ProductCard = memo(({ product, onAddToCart }) => {
  // No inline review previews here: product list shows only star ratings.

  return (
    <Card className="group baby-pink-card baby-pink-hover transition-all duration-300">
      <CardContent className="p-0">
        <div className="bg-muted relative">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-40 object-contain rounded-t-lg"
            onError={(e) => {
              e.target.src = require('../assets/img.png');
            }}
          />
          {!product.inStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-t-lg">
              <Badge variant="destructive">Out of Stock</Badge>
            </div>
          )}
        </div>
        <div className="p-3">
          <Badge variant="secondary" className="mb-2" style={{ backgroundColor: '#FFB6C1', color: 'white' }}>
            {product.category}
          </Badge>
          <h3 className="font-semibold mb-1 text-sm">{product.name}</h3>
          <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
            {product.description}
          </p>
          <div className="flex items-center mb-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.floor(product.rating)
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground ml-2">
              ({product.rating})
            </span>
          </div>

          {/* No review previews here; users should click through to see full product details */}

          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold">R{product.price}</span>
            <div className="flex items-center space-x-2">
              <Button
                size="sm"
                onClick={() => onAddToCart(product)}
                disabled={!product.inStock}
                className="opacity-0 group-hover:opacity-100 transition-opacity baby-pink-button"
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                {product.inStock ? 'Add to Cart' : 'Out of Stock'}
              </Button>
              <Button asChild size="sm" className="button-as-link">
                <Link to={`/products/${product.id}`} className="button-as-link">View product details</Link>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

ProductCard.displayName = 'ProductCard';

export default ProductCard;