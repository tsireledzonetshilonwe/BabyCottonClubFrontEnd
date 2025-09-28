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

  // Auto-save to backend with debouncing (DISABLED for debugging)
  useEffect(() => {
    // Temporarily disabled auto-save to avoid spamming backend during debugging
    // Uncomment the code below once cart endpoint is working properly
    
    /*
    const saveToBackend = async () => {
      try {
        const customer = JSON.parse(localStorage.getItem("customer") || "{}");
        if (customer.customerId && cartItems.length > 0) {
          const cartPayload = {
            customerId: customer.customerId,  // Send just the ID
            items: cartItems.map(item => ({
              productId: item.id,  // Send just the ID
              quantity: item.quantity,
              price: parseFloat(item.price)
            })),
            isCheckedOut: false
          };
          await api.post("/api/cart/create", cartPayload);
          console.log("Cart automatically saved to backend");
        }
      } catch (error) {
        console.error("Auto-save to backend failed:", error);
      }
    };
    
    // Debounce the backend save to avoid too many API calls
    const timeoutId = setTimeout(saveToBackend, 2000);
    return () => clearTimeout(timeoutId);
    */
  }, [cartItems]);

  const addToCart = (item) => {
    // Validate item structure
    if (!item.id) {
      console.error("❌ Item missing ID:", item);
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
