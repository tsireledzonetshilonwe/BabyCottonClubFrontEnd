# 🔍 Cart 400 Error - Debugging Guide

## Overview
This guide helps you debug 400 Bad Request errors when updating the cart through the `/api/cart/update` endpoint.

## Quick Diagnosis Steps

### 1. Open Browser Console
Open your browser's Developer Tools (F12) and go to the Console tab.

### 2. Look for Debug Logs
When you try to add/update items in the cart, you should see debug logs like:

```
🔍 UPDATE CART PAYLOAD: {
  "cartId": 123,
  "customerId": 456,
  "items": [
    {
      "productId": 789,
      "quantity": 2,
      "size": "M"
    }
  ]
}
```

### 3. Check for Validation Errors
Look for red error messages starting with `❌`:

```
❌ INVALID UPDATE PAYLOAD:
❌ Missing or invalid cartId: null (type: object)
```

## Common Issues & Solutions

### Issue 1: Missing cartId
**Symptom:**
```
❌ Missing or invalid cartId: null (type: object)
```

**Cause:** Cart has not been created yet, or cartId was lost from localStorage.

**Solution:**
- Check if `localStorage.getItem('cartId')` returns a number
- If null, the system should automatically create a new cart
- Make sure you're logged in (customerId must be present)

**Fix:**
```javascript
// In browser console, check:
localStorage.getItem('cartId')
localStorage.getItem('customerId')

// If cartId is missing, clear cart and start fresh:
localStorage.removeItem('cartItems')
localStorage.removeItem('cartId')
// Then add items again
```

### Issue 2: Invalid cartId Type
**Symptom:**
```
❌ Missing or invalid cartId: "123" (type: string)
```

**Cause:** cartId is stored as string instead of number.

**Solution:**
The code now uses `Number(localStorage.getItem("cartId"))` to convert strings to numbers.

**Fix:** If issue persists:
```javascript
// Convert cartId to number
localStorage.setItem('cartId', Number(localStorage.getItem('cartId')))
```

### Issue 3: Missing customerId
**Symptom:**
```
❌ Missing or invalid customerId: undefined (type: undefined)
```

**Cause:** User is not logged in, or customer data is missing.

**Solution:**
- Make sure user is logged in
- Check that customer object is in localStorage:
```javascript
// In browser console:
JSON.parse(localStorage.getItem('customer'))
// Should show: { customerId: 123, ... }
```

### Issue 4: Invalid Product IDs
**Symptom:**
```
❌ Item 0: Missing or invalid productId: "789" (type: string)
```

**Cause:** Product IDs are strings instead of numbers.

**Solution:**
The code now uses `Number(item.id)` to convert strings to numbers. If issue persists, check the product data source.

### Issue 5: Wrong Payload Structure
**Symptom:**
```
400 Bad Request
Response: "Invalid cart update request"
```

**Cause:** Payload doesn't match backend's CartUpdateRequest DTO.

**Backend expects:**
```java
{
  cartId: int,
  customerId: int,
  items: [
    {
      productId: int,
      quantity: int,
      size: string (optional)
    }
  ]
}
```

**Solution:**
Check the console logs for the exact payload being sent. Compare with the backend expectations.

### Issue 6: Size Field Issues
**Symptom:**
```
❌ Item 0: Invalid size type: number (should be string)
```

**Cause:** Size is being sent as a number instead of string.

**Solution:**
Make sure size is always a string:
```javascript
// Correct:
{ size: "M" }

// Wrong:
{ size: 1 }
```

## Network Debugging

### Check Request in Network Tab
1. Open DevTools → Network tab
2. Filter by "cart"
3. Click on the failed request
4. Check:
   - **Request URL**: Should be `/api/cart/update`
   - **Request Method**: Should be `PUT`
   - **Request Payload**: Check the actual JSON being sent
   - **Response**: Check the error message from backend

### Capture Full Error Details
When you see a 400 error, the console will show:
```
❌ Cart save error: {
  status: 400,
  statusText: "Bad Request",
  data: { message: "Invalid cart update request", details: [...] },
  config: {
    url: "/api/cart/update",
    method: "put",
    data: "{"cartId":null,...}"
  }
}
```

Look at:
- `data.message`: Backend error message
- `data.details`: Specific validation errors
- `config.data`: The exact JSON that was sent

## Testing Workflow

### Test 1: Add Product Without Size
1. Find a product without sizes (e.g., bedding)
2. Click "Add to Cart"
3. Check console - should see successful cart update
4. Payload should NOT include size field

### Test 2: Add Product With Size
1. Find a product with sizes (e.g., clothing)
2. Select a size
3. Click "Add to Cart"
4. Check console - should see successful cart update
5. Payload should include `"size": "M"` or similar

### Test 3: Checkout Flow
1. Add multiple items to cart
2. Go to Cart page
3. Click "Proceed to Checkout"
4. Check console for 3 cart update calls:
   - Save cart before checkout
   - Mark cart as checked out
   - Final cart save

## Backend Verification

If frontend looks correct but still getting 400 errors, check backend:

### Check Backend Logs
Look for validation error messages from Spring Boot:
```
Validation failed: Field 'cartId' must not be null
```

### Verify DTO Structure
Check `CartUpdateRequest.java`:
```java
public class CartUpdateRequest {
    private Integer cartId;     // Must be Integer, not Long
    private Integer customerId; // Must be Integer, not Long
    private List<CartItemRequest> items;
}

public class CartItemRequest {
    private Integer productId;
    private Integer quantity;
    private String size; // Optional
}
```

### Common Backend Issues:
1. **Field names mismatch**: Frontend sends `productId`, backend expects `product_id`
2. **Type mismatch**: Frontend sends Long, backend expects Integer
3. **Validation annotations**: Backend has `@NotNull` on optional fields
4. **Size field not supported**: Backend DTO doesn't have size field yet

## Manual Testing in Browser Console

```javascript
// Test cart update manually
const testPayload = {
  cartId: 1,
  customerId: 1,
  items: [
    {
      productId: 1,
      quantity: 2,
      size: "M"
    }
  ]
};

// Send request (assuming you have axios)
api.put('/api/cart/update', testPayload)
  .then(res => console.log('Success:', res.data))
  .catch(err => console.error('Error:', err.response?.data));
```

## Success Indicators

✅ You should see:
```
🔍 UPDATE CART PAYLOAD: { valid JSON }
📊 Update details: { correct types }
✅ Cart updated successfully: { cart data }
```

✅ Network tab shows:
- Status: 200 OK
- Response contains updated cart data

✅ No validation errors in console

## Still Having Issues?

1. **Clear all localStorage and start fresh:**
```javascript
localStorage.clear()
// Then log in and add items again
```

2. **Check backend logs** - The error message should tell you what's wrong

3. **Verify API endpoint** - Make sure `/api/cart/update` exists and accepts PUT requests

4. **Check authentication** - Make sure JWT token is being sent in headers

5. **Compare working requests** - If cart create works but update doesn't, compare the payloads

## Contact Developer

If none of these solutions work, provide:
1. Screenshot of console errors
2. Screenshot of Network tab (Request and Response)
3. Steps to reproduce
4. Expected vs actual behavior
