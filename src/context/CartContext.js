import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../api/api";
import { handleCartError } from "../utils/cartErrorHandler";
import { validateUpdatePayload, validateCreatePayload, debugCartItems } from "../utils/cartDebugger";

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

  /** 🧩 Add to cart with size support */
  const addToCart = (product) => {
    setCartItems((prev) => {
      // Match by both id and size (if size is provided)
      const existing = prev.find((item) => 
        item.id === product.id && 
        (product.size ? item.size === product.size : !item.size)
      );
      
      if (existing) {
        return prev.map((item) =>
          item.id === product.id && 
          (product.size ? item.size === product.size : !item.size)
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prev, { ...product, quantity: 1 }];
      }
    });
  };

  /** 🗑️ Remove item (with size support) */
  const removeFromCart = (id, size = null) => {
    setCartItems((prev) => 
      prev.filter((item) => {
        // If size is provided, match both id and size
        if (size) {
          return !(item.id === id && item.size === size);
        }
        // Otherwise just match id
        return item.id !== id;
      })
    );
  };

  /** 🧼 Clear all items */
  const clearCart = () => setCartItems([]);

  /** ➕ Increase item quantity (with size support) */
  const increaseQuantity = (id, size = null) =>
    setCartItems((prev) =>
      prev.map((i) => {
        // If size is provided, match both id and size
        if (size) {
          return i.id === id && i.size === size 
            ? { ...i, quantity: i.quantity + 1 } 
            : i;
        }
        // Otherwise just match id
        return i.id === id ? { ...i, quantity: i.quantity + 1 } : i;
      })
    );

  /** ➖ Decrease item quantity (with size support) */
  const decreaseQuantity = (id, size = null) =>
    setCartItems((prev) =>
      prev
        .map((i) => {
          // If size is provided, match both id and size
          if (size) {
            return i.id === id && i.size === size && i.quantity > 1
              ? { ...i, quantity: i.quantity - 1 }
              : i;
          }
          // Otherwise just match id
          return i.id === id && i.quantity > 1
            ? { ...i, quantity: i.quantity - 1 }
            : i;
        })
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
      ...(item.size && { size: item.size }), // Include size if present
    }));

    try {
      if (cartId) {
        // 🧱 Update existing cart
        const updatePayload = {
          cartId,
          customerId,
          items,
        };
        
        // 🔍 VALIDATE: Check payload structure
        const validation = validateUpdatePayload(updatePayload);
        if (!validation.valid) {
          console.error("❌ INVALID UPDATE PAYLOAD:");
          validation.errors.forEach(err => console.error(err));
          throw new Error("Invalid cart update payload: " + validation.errors.join(", "));
        }
        
        // 🔍 DEBUG: Log the exact payload being sent
        console.log("🔍 UPDATE CART PAYLOAD:", JSON.stringify(updatePayload, null, 2));
        console.log("📊 Update details:", {
          cartId: cartId,
          customerId: customerId,
          itemCount: items.length,
          items: items
        });
        debugCartItems(cartFromLocalStorage);
        
        const res = await api.put("/api/cart/update", updatePayload);
        console.log("✅ Cart updated successfully:", res.data);
      } else {
        // 🆕 Create new cart
        const createPayload = {
          customer: { customerId },
          items,
          checkedOut: false,
        };
        
        // 🔍 VALIDATE: Check payload structure
        const validation = validateCreatePayload(createPayload);
        if (!validation.valid) {
          console.error("❌ INVALID CREATE PAYLOAD:");
          validation.errors.forEach(err => console.error(err));
          throw new Error("Invalid cart create payload: " + validation.errors.join(", "));
        }
        
        // 🔍 DEBUG: Log the exact payload being sent
        console.log("🔍 CREATE CART PAYLOAD:", JSON.stringify(createPayload, null, 2));
        debugCartItems(cartFromLocalStorage);
        
        const res = await api.post("/api/cart/create", createPayload);
        console.log("✅ Cart created successfully:", res.data);
        if (res.data && res.data.cartId) {
          localStorage.setItem("cartId", res.data.cartId);
        }
      }
    } catch (err) {
      // 🔍 DEBUG: Log the exact error response
      console.error("❌ Cart save error:", {
        status: err.response?.status,
        statusText: err.response?.statusText,
        data: err.response?.data,
        message: err.message,
        config: {
          url: err.config?.url,
          method: err.config?.method,
          data: err.config?.data
        }
      });
      
      // 🔄 If cart not found (404), create a new cart instead
      if (err.response?.status === 404 && cartId) {
        console.warn("⚠️ Cart not found in database. Creating new cart...");
        
        // Clear the invalid cartId
        localStorage.removeItem("cartId");
        
        // Create new cart
        try {
          const createPayload = {
            customer: { customerId },
            items,
            checkedOut: false,
          };
          
          console.log("🔍 CREATING NEW CART (after 404):", JSON.stringify(createPayload, null, 2));
          
          const res = await api.post("/api/cart/create", createPayload);
          console.log("✅ New cart created successfully:", res.data);
          
          if (res.data && res.data.cartId) {
            localStorage.setItem("cartId", res.data.cartId);
            console.log("✅ New cartId saved:", res.data.cartId);
          }
          
          return; // Success - don't show error to user
        } catch (createErr) {
          console.error("❌ Failed to create new cart:", createErr);
          handleCartError(createErr);
        }
      } else {
        // Handle other errors (validation, network, etc.)
        handleCartError(err);
      }
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
