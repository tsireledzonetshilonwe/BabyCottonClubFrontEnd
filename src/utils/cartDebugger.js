/**
 * Cart Payload Debugger & Validator
 * Validates that cart payloads match backend CartUpdateRequest DTO
 */

/**
 * Validate cart update payload structure
 * Backend expects: { cartId: int, customerId: int, items: [{productId, quantity, size}] }
 */
export function validateUpdatePayload(payload) {
  const errors = [];
  
  // Check required fields
  if (!payload) {
    errors.push("❌ Payload is null or undefined");
    return { valid: false, errors };
  }
  
  if (!payload.cartId || typeof payload.cartId !== 'number') {
    errors.push(`❌ Missing or invalid cartId: ${payload.cartId} (type: ${typeof payload.cartId})`);
  }
  
  if (!payload.customerId || typeof payload.customerId !== 'number') {
    errors.push(`❌ Missing or invalid customerId: ${payload.customerId} (type: ${typeof payload.customerId})`);
  }
  
  if (!payload.items || !Array.isArray(payload.items)) {
    errors.push(`❌ Missing or invalid items array: ${payload.items}`);
    return { valid: false, errors };
  }
  
  // Check each item
  payload.items.forEach((item, index) => {
    if (!item.productId || typeof item.productId !== 'number') {
      errors.push(`❌ Item ${index}: Missing or invalid productId: ${item.productId}`);
    }
    
    if (!item.quantity || typeof item.quantity !== 'number') {
      errors.push(`❌ Item ${index}: Missing or invalid quantity: ${item.quantity}`);
    }
    
    if (item.size && typeof item.size !== 'string') {
      errors.push(`❌ Item ${index}: Invalid size type: ${typeof item.size} (should be string)`);
    }
  });
  
  return {
    valid: errors.length === 0,
    errors,
    payload
  };
}

/**
 * Validate cart create payload structure
 * Backend expects: { customer: {customerId}, items: [{productId, quantity, size}], checkedOut: boolean }
 */
export function validateCreatePayload(payload) {
  const errors = [];
  
  if (!payload) {
    errors.push("❌ Payload is null or undefined");
    return { valid: false, errors };
  }
  
  if (!payload.customer || !payload.customer.customerId) {
    errors.push(`❌ Missing customer.customerId: ${JSON.stringify(payload.customer)}`);
  }
  
  if (!payload.items || !Array.isArray(payload.items)) {
    errors.push(`❌ Missing or invalid items array`);
    return { valid: false, errors };
  }
  
  if (typeof payload.checkedOut !== 'boolean') {
    errors.push(`❌ Missing or invalid checkedOut: ${payload.checkedOut}`);
  }
  
  // Check each item
  payload.items.forEach((item, index) => {
    if (!item.productId || typeof item.productId !== 'number') {
      errors.push(`❌ Item ${index}: Missing or invalid productId: ${item.productId}`);
    }
    
    if (!item.quantity || typeof item.quantity !== 'number') {
      errors.push(`❌ Item ${index}: Missing or invalid quantity: ${item.quantity}`);
    }
    
    if (item.size && typeof item.size !== 'string') {
      errors.push(`❌ Item ${index}: Invalid size type: ${typeof item.size}`);
    }
  });
  
  return {
    valid: errors.length === 0,
    errors,
    payload
  };
}

/**
 * Debug cart items - check for common issues
 */
export function debugCartItems(cartItems) {
  console.group("🔍 Cart Items Debug");
  
  cartItems.forEach((item, index) => {
    console.log(`Item ${index}:`, {
      id: item.id,
      idType: typeof item.id,
      quantity: item.quantity,
      quantityType: typeof item.quantity,
      size: item.size,
      sizeType: typeof item.size,
      rawItem: item
    });
  });
  
  console.groupEnd();
}

/**
 * Compare localStorage cart with context cart
 */
export function debugCartSync() {
  const localCart = localStorage.getItem('cartItems');
  const cartId = localStorage.getItem('cartId');
  const customerId = localStorage.getItem('customerId');
  
  console.group("🔍 Cart Sync Debug");
  console.log("LocalStorage cartId:", cartId, typeof cartId);
  console.log("LocalStorage customerId:", customerId, typeof customerId);
  
  if (localCart) {
    try {
      const parsed = JSON.parse(localCart);
      console.log("LocalStorage cart items:", parsed);
      debugCartItems(parsed);
    } catch (e) {
      console.error("Failed to parse localStorage cart:", e);
    }
  } else {
    console.log("No cart items in localStorage");
  }
  
  console.groupEnd();
}
