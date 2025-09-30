import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../api/api";

const CartContext = createContext(null);
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const stored = localStorage.getItem("cartItems");
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error("Error loading cart from localStorage:", error);
      return [];
    }
  });

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
    } catch (error) {
      console.error("Error saving cart to localStorage:", error);
    }
  }, [cartItems]);

  // Auto-save to backend with debouncing (DISABLED - Backend constraints)
  useEffect(() => {
    // Cart auto-save to backend is disabled due to backend constraints:
    // 1. Unique constraint prevents multiple carts per customer
    // 2. Detached entity errors when creating cart items
    // 3. Complex entity relationships requiring full object structures
    
    // Cart items are still persisted to localStorage and will be saved
    // to database during checkout process when it's more critical
    
    console.log("Cart auto-save to backend is disabled - using localStorage only");
    console.log("Cart will be saved to database during checkout process");
    
    // Keep localStorage working as backup
    // (This is already handled in the useEffect above)
    
  }, [cartItems]);

  const addToCart = (item) => {
    // Validate item structure
    if (!item.id) {
      console.error("Item missing ID:", item);
      return;
    }
    
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      
      if (existing) {
        // Item exists, increase quantity
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      
      // New item, add to cart
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (id) =>
    setCartItems((prev) => prev.filter((i) => i.id !== id));

  const clearCart = () => setCartItems([]);

  const increaseQuantity = (id) =>
    setCartItems((prev) =>
      prev.map((i) =>
        i.id === id ? { ...i, quantity: i.quantity + 1 } : i
      )
    );

  const decreaseQuantity = (id) =>
    setCartItems((prev) =>
      prev
        .map((i) =>
          i.id === id && i.quantity > 1
            ? { ...i, quantity: i.quantity - 1 }
            : i
        )
        .filter((i) => i.quantity > 0)
    );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        increaseQuantity,
        decreaseQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
