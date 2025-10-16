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

  /** 🧩 Add to cart */
  const addToCart = (product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prev, { ...product, quantity: 1 }];
      }
    });
  };

  /** 🗑️ Remove item */
  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  /** 🧼 Clear all items */
  const clearCart = () => setCartItems([]);

  /** ➕ Increase item quantity */
  const increaseQuantity = (id) =>
    setCartItems((prev) =>
      prev.map((i) =>
        i.id === id ? { ...i, quantity: i.quantity + 1 } : i
      )
    );

  /** ➖ Decrease item quantity */
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

  /**
   * 🧾 Save cart to backend
   */
  const saveCartToBackend = async () => {
    const cartFromLocalStorage = JSON.parse(localStorage.getItem("cartItems") || "[]");
    const customer = JSON.parse(localStorage.getItem("customer") || "{}");
    const customerId = customer.customerId;
    const cartId = Number(localStorage.getItem("cartId")) || null;

    if (!customerId) {
      console.warn("No valid customerId found. User must be logged in.");
      return;
    }

    const items = cartFromLocalStorage.map((item) => ({
      productId: Number(item.id),
      quantity: item.quantity,
    }));

    try {
      if (cartId) {
        // 🧱 Update existing cart
        const updatePayload = {
          cartId,
          customerId,
          items,
        };
        const res = await api.put("/api/cart/update", updatePayload);
        console.log("Cart updated:", res.data);
      } else {
        // 🆕 Create new cart
        const createPayload = {
          customer: { customerId },
          items,
          checkedOut: false,
        };
        const res = await api.post("/api/cart/create", createPayload);
        console.log("Cart created:", res.data);
        if (res.data && res.data.cartId) {
          localStorage.setItem("cartId", res.data.cartId);
        }
      }
    } catch (err) {
      console.error("Cart save error:", err);
    }
  };

  // 🕒 Auto-save cart to backend (debounced effect)
  useEffect(() => {
    const timeout = setTimeout(() => {
      (async () => {
        try {
          const customerStr = localStorage.getItem("customer");
          if (!customerStr) {
            console.log("No customer logged in, skipping backend cart save");
            return;
          }

          const customer = JSON.parse(customerStr);
          const customerId = Number(customer.customerId);

          if (!customerId || isNaN(customerId)) {
            console.warn("Invalid customerId, skipping backend cart save");
            return;
          }

          if (cartItems.length === 0) {
            console.log("Cart is empty, skipping backend cart save");
            return;
          }

          await saveCartToBackend();
        } catch (error) {
          console.error("Auto-save cart failed:", error);
        }
      })();
    }, 1500); // wait 1.5 seconds after last change

    return () => clearTimeout(timeout);
  }, [cartItems]);

  // ✅ Return context provider
  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        increaseQuantity,
        decreaseQuantity,
        saveCartToBackend,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
