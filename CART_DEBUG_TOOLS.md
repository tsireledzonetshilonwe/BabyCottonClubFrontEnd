# 🔧 Cart Debugging Tools - Quick Reference

## Overview
Comprehensive debugging tools added to diagnose and fix 400 errors from the cart update endpoint.

## What Was Added

### 1. **Enhanced Console Logging** ✅
**Files Modified:**
- `src/context/CartContext.js`
- `src/screens/CartPage.js`

**What You'll See:**
```javascript
🔍 UPDATE CART PAYLOAD: { full JSON payload }
📊 Update details: { cartId, customerId, itemCount }
✅ Cart updated successfully
// OR
❌ Cart save error: { detailed error info }
```

**How to Use:**
1. Open browser DevTools (F12)
2. Go to Console tab
3. Add items to cart or checkout
4. Watch for the debug logs

### 2. **Payload Validation** ✅
**New File:** `src/utils/cartDebugger.js`

**Functions:**
- `validateUpdatePayload(payload)` - Validates PUT /api/cart/update payload
- `validateCreatePayload(payload)` - Validates POST /api/cart/create payload
- `debugCartItems(items)` - Shows detailed info about each cart item
- `debugCartSync()` - Compares localStorage with context state

**What It Checks:**
- ✅ cartId is a number (not string or null)
- ✅ customerId is a number
- ✅ items is an array
- ✅ Each item has valid productId (number)
- ✅ Each item has valid quantity (number)
- ✅ Size is a string (if present)

**Example Output:**
```
❌ INVALID UPDATE PAYLOAD:
❌ Missing or invalid cartId: null (type: object)
❌ Item 0: Invalid size type: number (should be string)
```

### 3. **Browser Console Tools** ✅
**New File:** `src/utils/cartInspector.js`

**Available Commands:**

#### `inspectCart()`
Shows complete cart state and validates the payload that would be sent.

```javascript
// In browser console:
inspectCart()

// Output:
🔍 CART STATE INSPECTION
  📦 LocalStorage
    cartId: "123" (type: string)  ⚠️ Should be number!
    customerId: 456 (type: number) ✅
    cartItems count: 2
  📤 Would Send This Payload
    {
      "cartId": 123,
      "customerId": 456,
      "items": [...]
    }
  ✅ Validation
    ✅ Payload looks valid!
```

#### `testCartUpdate()`
Manually tests the cart update API with current cart state.

```javascript
// In browser console:
testCartUpdate()

// Output:
🚀 Testing cart update with payload: {...}
✅ Success: { cart data }
// OR
❌ Test failed: { error details }
```

#### `fixCartTypes()`
Automatically fixes type issues in localStorage (converts strings to numbers).

```javascript
// In browser console:
fixCartTypes()

// Output:
🔧 Fixing cart data types...
✅ Fixed cartId: "123" → 123
✅ Fixed customerId: "456" → 456
✅ Fixed cart items types
✅ Type fixing complete. Reload the page to apply changes.
```

#### `clearCartDebug()`
Clears cart data to start fresh.

```javascript
// In browser console:
clearCartDebug()

// Output:
🗑️ Clearing cart data...
✅ Cart cleared. Add items again to test.
```

### 4. **Comprehensive Documentation** ✅
**New File:** `DEBUGGING_400_ERROR.md`

Complete troubleshooting guide covering:
- Quick diagnosis steps
- Common issues and solutions
- Network debugging
- Testing workflows
- Backend verification
- Manual testing examples

## How to Debug 400 Errors

### Step 1: Check Console Logs
1. Open DevTools (F12) → Console tab
2. Try adding an item to cart
3. Look for debug logs starting with 🔍

### Step 2: Inspect Cart State
Type in console:
```javascript
inspectCart()
```

Look for:
- ❌ Red error messages indicating issues
- ✅ Green checkmarks indicating everything is valid

### Step 3: Check for Common Issues

#### Issue: Missing cartId
```
❌ cartId is missing or 0
```
**Solution:** Cart hasn't been created yet. Log in and try again.

#### Issue: Wrong Type
```
❌ cartId is string, should be number
```
**Solution:** Run `fixCartTypes()` in console, then reload page.

#### Issue: Missing size
```
❌ Size is required for this product
```
**Solution:** Select a size before adding to cart.

### Step 4: Test API Call
Type in console:
```javascript
testCartUpdate()
```

This sends the actual API request and shows you the exact error response.

### Step 5: Check Network Tab
1. DevTools → Network tab
2. Filter by "cart"
3. Click on failed request
4. Check:
   - **Request Payload**: What was sent
   - **Response**: What the server returned

### Step 6: Fix and Verify
After fixing issues:
1. Clear cart: `clearCartDebug()`
2. Reload page
3. Add items again
4. Check console for ✅ success messages

## Common Fixes

### Fix 1: Type Mismatch
```javascript
// Run in console:
fixCartTypes()
// Then reload page
```

### Fix 2: Missing Authentication
```javascript
// Check if logged in:
localStorage.getItem('customer')
// If null, log in again
```

### Fix 3: Corrupted Cart Data
```javascript
// Clear and start fresh:
clearCartDebug()
// Then reload and add items again
```

### Fix 4: Backend Issues
If frontend looks correct but still failing:
1. Check backend logs for validation errors
2. Verify CartUpdateRequest DTO matches frontend payload
3. Ensure backend has size field in DTO
4. Check database constraints (cartId must exist)

## Testing Checklist

### Frontend Validation ✅
- [ ] Open console and run `inspectCart()`
- [ ] All fields show green ✅ checkmarks
- [ ] No red ❌ validation errors
- [ ] cartId and customerId are numbers
- [ ] All productIds are numbers
- [ ] Size is string (if present)

### API Request ✅
- [ ] Console shows `🔍 UPDATE CART PAYLOAD`
- [ ] Payload structure matches backend DTO
- [ ] Network tab shows the request
- [ ] No CORS errors

### Backend Response ✅
- [ ] Console shows `✅ Cart updated successfully`
- [ ] Network tab shows 200 OK
- [ ] Response contains updated cart data
- [ ] No validation errors from backend

## Quick Commands Reference

| Command | Purpose |
|---------|---------|
| `inspectCart()` | View cart state and validate payload |
| `testCartUpdate()` | Test cart update API call |
| `fixCartTypes()` | Fix type issues (string → number) |
| `clearCartDebug()` | Clear cart and start fresh |

## Files Modified

### Core Files
- ✅ `src/context/CartContext.js` - Added validation & debug logging
- ✅ `src/screens/CartPage.js` - Added debug logging to all cart updates

### New Utilities
- ✅ `src/utils/cartDebugger.js` - Payload validation functions
- ✅ `src/utils/cartInspector.js` - Browser console debugging tools

### Documentation
- ✅ `DEBUGGING_400_ERROR.md` - Comprehensive troubleshooting guide
- ✅ `CART_DEBUG_TOOLS.md` - This file

## Next Steps

1. **Run the app in development mode:**
   ```bash
   npm start
   ```

2. **Open browser console and check:**
   ```javascript
   // You should see:
   🔍 Cart Debug Tools Loaded!
   Available commands in console:
   - inspectCart()
   - testCartUpdate()
   - fixCartTypes()
   - clearCartDebug()
   ```

3. **Try adding items to cart:**
   - Watch console for debug logs
   - Look for validation errors
   - Check Network tab for API calls

4. **If you see 400 errors:**
   - Run `inspectCart()` to diagnose
   - Check the validation errors
   - Apply fixes as needed
   - Refer to `DEBUGGING_400_ERROR.md` for detailed solutions

## Development vs Production

The cart inspector tools only load in development mode:
```javascript
if (process.env.NODE_ENV === 'development') {
  import('./utils/cartInspector');
}
```

In production:
- Inspector tools won't load
- Debug logs will still show in console
- Validation still runs (prevents bad requests)

To disable debug logs in production, set an environment variable:
```javascript
const DEBUG = process.env.NODE_ENV === 'development';
if (DEBUG) console.log(...);
```

## Support

If you're still experiencing 400 errors after following these steps:

1. **Capture the error:**
   - Run `inspectCart()` - screenshot the output
   - Check Network tab - screenshot Request & Response
   - Copy all console error messages

2. **Verify backend:**
   - Check backend logs for validation errors
   - Verify CartUpdateRequest DTO structure
   - Test endpoint with Postman/curl

3. **Compare working vs failing:**
   - If cart create works but update doesn't, compare payloads
   - Check if cartId exists in database
   - Verify authentication token is valid

## Summary

You now have:
- ✅ Automatic payload validation
- ✅ Detailed debug logging
- ✅ Browser console tools for manual testing
- ✅ Type conversion and fixing utilities
- ✅ Comprehensive documentation

**All tools are ready to use! Just open the browser console and start debugging.** 🎉
