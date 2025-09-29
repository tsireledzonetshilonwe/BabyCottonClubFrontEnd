import React, { memo } from 'react';
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Star, ShoppingCart } from 'lucide-react';

// Memoized product card component to prevent unnecessary re-renders
const ProductCard = memo(({ product, onAddToCart }) => {
  return (
    <Card className="group baby-pink-card baby-pink-hover transition-all duration-300">
      <CardContent className="p-0">
        <div className="aspect-square bg-muted relative">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover rounded-t-lg"
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
        <div className="p-4">
          <Badge variant="secondary" className="mb-2" style={{ backgroundColor: '#FFB6C1', color: 'white' }}>
            {product.category}
          </Badge>
          <h3 className="font-semibold mb-2">{product.name}</h3>
          <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
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
            <span className="text-sm text-muted-foreground ml-2">
              ({product.rating})
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold">R{product.price}</span>
            <Button
              size="sm"
              onClick={() => onAddToCart(product)}
              disabled={!product.inStock}
              className="opacity-0 group-hover:opacity-100 transition-opacity baby-pink-button"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              {product.inStock ? 'Add to Cart' : 'Out of Stock'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

ProductCard.displayName = 'ProductCard';

export default ProductCard;