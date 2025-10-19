/**
 * Cart Recovery Utilities
 * Helps recover from cart sync issues between frontend and backend
 */

/**
 * Check if a cart exists in the backend
 */
export async function checkCartExists(api, cartId) {
  if (!cartId) return false;
  
  try {
    const response = await api.get(`/api/cart/${cartId}`);
    return response.status === 200;
  } catch (error) {
    if (error.response?.status === 404) {
      return false;
    }
    // Other errors - assume cart might exist
    console.warn("Unable to verify cart existence:", error.message);
    return false;
  }
}

/**
 * Clean up invalid cart references
 */
export function cleanupInvalidCart() {
  const cartId = localStorage.getItem('cartId');
  
  if (cartId) {
    console.log("🧹 Cleaning up invalid cartId:", cartId);
    localStorage.removeItem('cartId');
    console.log("✅ Invalid cartId removed. New cart will be created on next save.");
  }
  
  return null;
}

/**
 * Recover cart state from localStorage
 */
export function recoverCartState() {
  console.group("🔄 Recovering Cart State");
  
  const cartId = localStorage.getItem('cartId');
  const customerId = localStorage.getItem('customerId');
  const customer = localStorage.getItem('customer');
  const cartItems = localStorage.getItem('cartItems');
  
  console.log("Current state:");
  console.log("- cartId:", cartId);
  console.log("- customerId:", customerId);
  console.log("- customer:", customer ? "present" : "missing");
  console.log("- cartItems:", cartItems ? JSON.parse(cartItems).length + " items" : "empty");
  
  // Check for issues
  const issues = [];
  
  if (cartId === "null" || cartId === "undefined") {
    issues.push("cartId is stored as string 'null' or 'undefined'");
    localStorage.removeItem('cartId');
  }
  
  if (!customer && customerId) {
    issues.push("customerId exists but customer object is missing");
  }
  
  if (!customerId && customer) {
    try {
      const cust = JSON.parse(customer);
      if (cust.customerId) {
        localStorage.setItem('customerId', cust.customerId);
        console.log("✅ Recovered customerId from customer object");
      }
    } catch (e) {
      issues.push("customer object is invalid JSON");
    }
  }
  
  if (issues.length > 0) {
    console.warn("⚠️ Issues found:");
    issues.forEach(issue => console.warn("- " + issue));
  } else {
    console.log("✅ No issues found");
  }
  
  console.groupEnd();
  
  return {
    cartId: cartId ? Number(cartId) : null,
    customerId: customerId ? Number(customerId) : null,
    hasItems: cartItems ? JSON.parse(cartItems).length > 0 : false,
    issues
  };
}

/**
 * Force create a new cart (useful when cart is corrupted)
 */
export async function forceCreateNewCart(api, cartItems) {
  console.log("🔄 Force creating new cart...");
  
  const customer = JSON.parse(localStorage.getItem('customer') || '{}');
  const customerId = customer.customerId;
  
  if (!customerId) {
    console.error("❌ Cannot create cart: User not logged in");
    return null;
  }
  
  // Clear old cart reference
  localStorage.removeItem('cartId');
  
  const items = cartItems.map(item => ({
    productId: Number(item.id),
    quantity: item.quantity,
    ...(item.size && { size: item.size })
  }));
  
  try {
    const createPayload = {
      customer: { customerId },
      items,
      checkedOut: false
    };
    
    console.log("🔍 Creating cart with payload:", createPayload);
    
    const response = await api.post('/api/cart/create', createPayload);
    
    if (response.data && response.data.cartId) {
      localStorage.setItem('cartId', response.data.cartId);
      console.log("✅ New cart created with ID:", response.data.cartId);
      return response.data;
    }
  } catch (error) {
    console.error("❌ Failed to create new cart:", error);
    return null;
  }
}

/**
 * Sync cart with backend (fetch and merge)
 */
export async function syncCartWithBackend(api) {
  console.log("🔄 Syncing cart with backend...");
  
  const customer = JSON.parse(localStorage.getItem('customer') || '{}');
  const customerId = customer.customerId;
  
  if (!customerId) {
    console.log("⚠️ User not logged in, cannot sync");
    return null;
  }
  
  try {
    // Try to fetch user's active cart
    const response = await api.get(`/api/cart/customer/${customerId}`);
    
    if (response.data && response.data.cartId) {
      console.log("✅ Found existing cart:", response.data.cartId);
      localStorage.setItem('cartId', response.data.cartId);
      return response.data;
    }
  } catch (error) {
    if (error.response?.status === 404) {
      console.log("ℹ️ No existing cart found for user");
      localStorage.removeItem('cartId');
    } else {
      console.error("❌ Error syncing cart:", error);
    }
  }
  
  return null;
}

// Make functions available globally for console debugging
if (typeof window !== 'undefined') {
  window.recoverCart = recoverCartState;
  window.cleanupCart = cleanupInvalidCart;
  window.forceNewCart = forceCreateNewCart;
}
