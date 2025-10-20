/**
 * Cart State Inspector
 * Run these functions in browser console to debug cart issues
 */

// Only load in development mode and don't show startup message
if (process.env.NODE_ENV === 'development') {
  // Make functions available globally for console access
  window.inspectCart = function() {
  console.group("🔍 CART STATE INSPECTION");
  
  // Check localStorage
  console.group("📦 LocalStorage");
  const cartId = localStorage.getItem('cartId');
  const customerId = localStorage.getItem('customerId');
  const customer = localStorage.getItem('customer');
  const cartItems = localStorage.getItem('cartItems');
  
  console.log("cartId:", cartId, `(type: ${typeof cartId})`);
  console.log("customerId:", customerId, `(type: ${typeof customerId})`);
  
  if (customer) {
    try {
      console.log("customer:", JSON.parse(customer));
    } catch (e) {
      console.error("Failed to parse customer:", e);
    }
  }
  
  if (cartItems) {
    try {
      const items = JSON.parse(cartItems);
      console.log("cartItems count:", items.length);
      console.table(items.map(item => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        size: item.size || 'N/A',
        price: item.price
      })));
    } catch (e) {
      console.error("Failed to parse cartItems:", e);
    }
  }
  console.groupEnd();
  
  // Build update payload
  console.group("📤 Would Send This Payload");
  try {
    const items = cartItems ? JSON.parse(cartItems) : [];
    const cust = customer ? JSON.parse(customer) : {};
    
    const payload = {
      cartId: Number(cartId) || null,
      customerId: cust.customerId || Number(customerId) || null,
      items: items.map(item => ({
        productId: Number(item.id),
        quantity: item.quantity,
        ...(item.size && { size: item.size })
      }))
    };
    
    console.log(JSON.stringify(payload, null, 2));
    
    // Validate
    console.group("✅ Validation");
    const issues = [];
    
    if (!payload.cartId) issues.push("❌ cartId is missing or 0");
    else if (typeof payload.cartId !== 'number') issues.push(`❌ cartId is ${typeof payload.cartId}, should be number`);
    
    if (!payload.customerId) issues.push("❌ customerId is missing or 0");
    else if (typeof payload.customerId !== 'number') issues.push(`❌ customerId is ${typeof payload.customerId}, should be number`);
    
    if (!payload.items || payload.items.length === 0) issues.push("❌ items is empty");
    
    payload.items.forEach((item, idx) => {
      if (!item.productId) issues.push(`❌ Item ${idx}: productId missing`);
      if (typeof item.productId !== 'number') issues.push(`❌ Item ${idx}: productId is ${typeof item.productId}, should be number`);
      if (!item.quantity) issues.push(`❌ Item ${idx}: quantity missing`);
      if (typeof item.quantity !== 'number') issues.push(`❌ Item ${idx}: quantity is ${typeof item.quantity}, should be number`);
      if (item.size && typeof item.size !== 'string') issues.push(`❌ Item ${idx}: size is ${typeof item.size}, should be string`);
    });
    
    if (issues.length === 0) {
      console.log("✅ Payload looks valid!");
    } else {
      console.error("❌ Payload has issues:");
      issues.forEach(issue => console.error(issue));
    }
    console.groupEnd();
    
  } catch (e) {
    console.error("Failed to build payload:", e);
  }
  console.groupEnd();
  
  console.groupEnd();
};

window.testCartUpdate = async function() {
  const cartItems = localStorage.getItem('cartItems');
  const customer = localStorage.getItem('customer');
  const cartId = localStorage.getItem('cartId');
  
  if (!cartItems || !customer) {
    console.error("❌ Cart is empty or user not logged in");
    return;
  }
  
  try {
    const items = JSON.parse(cartItems);
    const cust = JSON.parse(customer);
    
    const payload = {
      cartId: Number(cartId) || null,
      customerId: cust.customerId,
      items: items.map(item => ({
        productId: Number(item.id),
        quantity: item.quantity,
        ...(item.size && { size: item.size })
      }))
    };
    
    console.log("🚀 Testing cart update with payload:", payload);
    
    // Assuming api is available
    if (typeof api !== 'undefined') {
      const response = await api.put('/api/cart/update', payload);
      console.log("✅ Success:", response.data);
    } else {
      console.error("❌ api object not available. Run this from the app context.");
    }
  } catch (error) {
    console.error("❌ Test failed:", {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message
    });
  }
};

window.fixCartTypes = function() {
  console.log("🔧 Fixing cart data types...");
  
  // Fix cartId
  const cartId = localStorage.getItem('cartId');
  if (cartId && typeof cartId === 'string') {
    const numId = Number(cartId);
    if (!isNaN(numId)) {
      localStorage.setItem('cartId', numId);
      console.log("✅ Fixed cartId:", cartId, "→", numId);
    }
  }
  
  // Fix customerId
  const customerId = localStorage.getItem('customerId');
  if (customerId && typeof customerId === 'string') {
    const numId = Number(customerId);
    if (!isNaN(numId)) {
      localStorage.setItem('customerId', numId);
      console.log("✅ Fixed customerId:", customerId, "→", numId);
    }
  }
  
  // Fix cart items
  const cartItems = localStorage.getItem('cartItems');
  if (cartItems) {
    try {
      const items = JSON.parse(cartItems);
      const fixed = items.map(item => ({
        ...item,
        id: Number(item.id),
        quantity: Number(item.quantity),
        price: Number(item.price),
        ...(item.size && { size: String(item.size) })
      }));
      localStorage.setItem('cartItems', JSON.stringify(fixed));
      console.log("✅ Fixed cart items types");
    } catch (e) {
      console.error("❌ Failed to fix cart items:", e);
    }
  }
  
  console.log("✅ Type fixing complete. Reload the page to apply changes.");
};

window.clearCartDebug = function() {
  console.log("🗑️ Clearing cart data...");
  localStorage.removeItem('cartItems');
  localStorage.removeItem('cartId');
  console.log("✅ Cart cleared. Add items again to test.");
};

window.fixCart404 = function() {
  console.log("🔧 Fixing 404 cart not found error...");
  
  const cartId = localStorage.getItem('cartId');
  
  if (cartId) {
    console.log(`⚠️ Removing invalid cartId: ${cartId}`);
    localStorage.removeItem('cartId');
    console.log("✅ Invalid cartId removed");
  } else {
    console.log("ℹ️ No cartId found in localStorage");
  }
  
  const cartItems = localStorage.getItem('cartItems');
  if (cartItems) {
    try {
      const items = JSON.parse(cartItems);
      console.log(`📦 Cart items will be preserved (${items.length} items)`);
      console.log("✅ Next add to cart operation will create a new cart");
    } catch (e) {
      console.error("❌ Cart items corrupted:", e);
    }
  }
  
  console.log("✅ Cart fixed! Try adding an item to cart now.");
};

window.checkBackendData = function() {
  console.group("🔍 Backend Data Check");
  
  const customer = localStorage.getItem('customer');
  const cartItems = localStorage.getItem('cartItems');
  
  if (customer) {
    try {
      const cust = JSON.parse(customer);
      console.log("👤 Current Customer:");
      console.log("   ID:", cust.customerId);
      console.log("   Name:", cust.name || cust.firstName + " " + cust.lastName);
      console.log("   Email:", cust.email);
      console.warn("⚠️ CHECK: Does this customer exist in backend database?");
      console.log(`   Run this SQL: SELECT * FROM customers WHERE customer_id = ${cust.customerId};`);
    } catch (e) {
      console.error("❌ Failed to parse customer:", e);
    }
  } else {
    console.error("❌ No customer logged in");
  }
  
  if (cartItems) {
    try {
      const items = JSON.parse(cartItems);
      console.log("\n� Cart Items:");
      items.forEach((item, idx) => {
        console.log(`   Item ${idx + 1}:`);
        console.log(`      Product ID: ${item.id}`);
        console.log(`      Name: ${item.name}`);
        console.log(`      Quantity: ${item.quantity}`);
        console.log(`      Size: ${item.size || 'N/A'}`);
        console.warn(`      ⚠️ CHECK: Does product ${item.id} exist in database?`);
      });
      console.log(`\n   Run this SQL: SELECT * FROM products WHERE product_id IN (${items.map(i => i.id).join(', ')});`);
    } catch (e) {
      console.error("❌ Failed to parse cart items:", e);
    }
  }
  
  console.groupEnd();
  
  console.log("\n💡 If any of these IDs don't exist in the backend database,");
  console.log("   that's why you're getting 500 errors!");
};

// Only show the debug message in development, and only once
if (!window.__cartInspectorLoaded) {
  window.__cartInspectorLoaded = true;
  console.log('🔍 Cart Debug Tools: Type inspectCart() in console');
}

} // Close the if (process.env.NODE_ENV === 'development') block
