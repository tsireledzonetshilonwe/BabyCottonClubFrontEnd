import React, { memo } from 'react';
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Minus, Plus, Trash2 } from "lucide-react";

// Memoized cart item component to prevent unnecessary re-renders
const CartItem = memo(({ item, onQuantityChange, onRemove }) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center space-x-4">
          <div className="w-20 h-20 bg-muted rounded-lg overflow-hidden">
            <img
              src={item.image || require('../assets/img.png')}
              alt={item.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = require('../assets/img.png');
              }}
            />
          </div>
          
          <div className="flex-1">
            <h3 className="font-semibold">{item.name}</h3>
            <p className="text-muted-foreground">R{parseFloat(item.price).toFixed(2)}</p>
            {item.size && (
              <p className="text-sm text-muted-foreground">Size: {item.size}</p>
            )}
            {item.color && (
              <p className="text-sm text-muted-foreground">Color: {item.color}</p>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => onQuantityChange(item.id, item.quantity - 1)}
              disabled={item.quantity <= 1}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <Input
              type="number"
              value={item.quantity}
              onChange={(e) => onQuantityChange(item.id, parseInt(e.target.value) || 1)}
              className="w-16 text-center"
              min="1"
              max="999"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={() => onQuantityChange(item.id, item.quantity + 1)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="text-right">
            <p className="font-semibold">R{(parseFloat(item.price) * item.quantity).toFixed(2)}</p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemove(item.id)}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

CartItem.displayName = 'CartItem';

export default CartItem;