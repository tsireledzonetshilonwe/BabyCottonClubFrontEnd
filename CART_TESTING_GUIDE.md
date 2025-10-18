# 🧪 Cart Testing Guide

## Setup Complete ✅
- ✅ Development server running at http://localhost:3000
- ✅ All debugging tools loaded
- ✅ Console tools available

## Testing Instructions

### Step 1: Open Browser Console
1. Press **F12** (or Cmd+Option+I on Mac)
2. Click on the **Console** tab
3. You should see:
   ```
   🔍 Cart Debug Tools Loaded!
   Available commands in console:
   - inspectCart()
   - testCartUpdate()
   - fixCartTypes()
   - clearCartDebug()
   ```

### Step 2: Log In
Before testing the cart, you need to be logged in:

1. Click **"Login"** or **"Sign Up"** in the navigation
2. Use your credentials to log in
3. In console, verify login:
   ```javascript
   // Type this in console:
   JSON.parse(localStorage.getItem('customer'))
   // Should show: { customerId: <number>, ... }
   ```

### Step 3: Test Adding Products WITHOUT Sizes

#### Test 3a: Products that don't require sizes
1. **Go to Products page** or **Home page**
2. **Find a product without sizes** (e.g., bedding, duvet)
3. **Click "Add to Cart"**
4. **Check console** - you should see:
   ```
   🔍 UPDATE CART PAYLOAD: {
     "cartId": null,  // or a number if cart exists
     "customerId": 123,
     "items": [
       {
         "productId": 1,
         "quantity": 1
         // NO size field
       }
     ]
   }
   ✅ Cart updated successfully
   ```

**Expected Result:**
- ✅ Success message appears
- ✅ Cart icon updates with item count
- ✅ No errors in console

### Step 4: Test Adding Products WITH Sizes

#### Test 4a: Products that require sizes
1. **Find a product with sizes** (e.g., clothing items)
2. **Try clicking "Add to Cart" WITHOUT selecting a size**
3. **Check behavior:**
   - ❌ Should show error: "Please select a size"
   - ❌ Item should NOT be added to cart

4. **Now SELECT a size** (e.g., "M", "L", "XL")
5. **Click "Add to Cart"**
6. **Check console:**
   ```
   🔍 UPDATE CART PAYLOAD: {
     "cartId": 1,
     "customerId": 123,
     "items": [
       {
         "productId": 2,
         "quantity": 1,
         "size": "M"  // ✅ Size included
       }
     ]
   }
   ✅ Cart updated successfully
   ```

**Expected Result:**
- ✅ Success message appears
- ✅ Cart icon updates
- ✅ Size is included in payload

### Step 5: Test Cart Inspection

#### Test 5a: Inspect current cart state
In console, type:
```javascript
inspectCart()
```

**Check the output:**
- ✅ cartId should be a **number** (not string, not null)
- ✅ customerId should be a **number**
- ✅ items should show all cart items with correct data
- ✅ Validation section should show "✅ Payload looks valid!"

**If you see errors:**
```
❌ cartId is missing or 0
```
→ Run `fixCartTypes()` then reload page

### Step 6: Test Adding Same Product with Different Sizes

#### Test 6a: Multiple sizes of same product
1. **Add product with size "S"**
2. **Add same product with size "M"**
3. **Go to Cart page**
4. **Verify:**
   - ✅ Two separate cart entries appear
   - ✅ One shows "Size: S"
   - ✅ One shows "Size: M"
   - ✅ Each can be updated independently

### Step 7: Test Cart Page Operations

#### Test 7a: View cart
1. **Click cart icon** or **go to /cart**
2. **Verify all items are displayed:**
   - ✅ Product name
   - ✅ Price
   - ✅ Quantity
   - ✅ Size (if applicable)
   - ✅ Total price

#### Test 7b: Increase quantity
1. **Click the "+" button** on any item
2. **Check console:**
   ```
   🔍 SAVECARTTODB PAYLOAD: {...}
   ✅ Cart updated successfully
   ```
3. **Verify:**
   - ✅ Quantity increases
   - ✅ Total price updates
   - ✅ No errors

#### Test 7c: Decrease quantity
1. **Click the "-" button**
2. **Check console for success message**
3. **Verify:**
   - ✅ Quantity decreases
   - ✅ If quantity reaches 0, item is removed

#### Test 7d: Remove item
1. **Click "Remove" button**
2. **Check console**
3. **Verify:**
   - ✅ Item disappears from cart
   - ✅ Total updates
   - ✅ Cart count updates

### Step 8: Test Checkout Flow

#### Test 8a: Proceed to checkout
1. **Add multiple items to cart**
2. **Click "Proceed to Checkout"**
3. **Check console - should see 3 cart updates:**
   ```
   💾 Saving cart to database before checkout...
   🔍 CARTPAGE UPDATE PAYLOAD: {...}
   ✅ Cart saved to database (updated)
   
   ✓ Marking cart as checked out in database...
   🔍 CHECKOUT UPDATE PAYLOAD: {...}
   ✅ Cart marked as checked out in database
   ```
4. **Verify:**
   - ✅ All cart items are saved with sizes
   - ✅ No 400 errors
   - ✅ Order is created successfully

### Step 9: Test Error Scenarios

#### Test 9a: Invalid cart state
1. In console, corrupt the cart:
   ```javascript
   localStorage.setItem('cartId', 'invalid')
   ```
2. Try adding item to cart
3. **Check console:**
   ```
   ❌ INVALID UPDATE PAYLOAD:
   ❌ Missing or invalid cartId: NaN (type: number)
   ```
4. **Fix it:**
   ```javascript
   fixCartTypes()
   ```
5. Reload page and try again

#### Test 9b: Missing authentication
1. Log out
2. Try adding item to cart
3. **Should either:**
   - Redirect to login page, OR
   - Show error message about needing to log in

### Step 10: Test API Calls Manually

#### Test 10a: Manual cart update
In console, type:
```javascript
testCartUpdate()
```

**Check output:**
- ✅ Shows payload being sent
- ✅ Shows success response, OR
- ❌ Shows detailed error with status code

**If you get 400 error:**
1. Check the error details in console
2. Run `inspectCart()` to see validation issues
3. Check `DEBUGGING_400_ERROR.md` for solutions

## Common Issues & Quick Fixes

### Issue 1: "Please select a size" Error
**Cause:** Product requires size selection
**Fix:** Select a size before clicking "Add to Cart"

### Issue 2: 400 Bad Request Error
**Diagnosis:**
```javascript
inspectCart()  // Check for validation errors
```
**Fix:**
```javascript
fixCartTypes()  // Fix type mismatches
// Then reload page
```

### Issue 3: Cart Not Saving
**Check:**
```javascript
// Verify you're logged in:
localStorage.getItem('customerId')
// Should return a number

// Verify cart exists:
localStorage.getItem('cartId')
// Should return a number or null
```

### Issue 4: Size Not Showing in Cart
**Check console logs:**
- Look for size field in payload
- Verify backend accepts size field
- Check CartItem component displays size

### Issue 5: Console Errors
**Look for:**
- Network errors (CORS, 401, 403, 404, 500)
- Validation errors (❌ messages)
- JavaScript errors (red error messages)

## Success Indicators

### ✅ Everything Working Correctly:
```
Console shows:
🔍 UPDATE CART PAYLOAD: {...}
✅ Cart updated successfully

inspectCart() shows:
✅ Payload looks valid!

Network tab shows:
Status: 200 OK
```

### ❌ Something Wrong:
```
Console shows:
❌ Cart save error
❌ INVALID UPDATE PAYLOAD

inspectCart() shows:
❌ cartId is missing
❌ Item 0: Invalid productId

Network tab shows:
Status: 400 Bad Request
```

## Testing Checklist

### Basic Cart Operations
- [ ] Add product without size ✅
- [ ] Add product with size ✅
- [ ] Cannot add product with size if no size selected ✅
- [ ] View cart page ✅
- [ ] Increase quantity ✅
- [ ] Decrease quantity ✅
- [ ] Remove item ✅
- [ ] Cart icon shows correct count ✅

### Size Selection
- [ ] Size selector appears for products with sizes ✅
- [ ] Size selector hidden for products without sizes ✅
- [ ] Selected size is highlighted ✅
- [ ] Size validation works (error if not selected) ✅
- [ ] Size appears in cart item display ✅

### API Integration
- [ ] Cart create works (first item) ✅
- [ ] Cart update works (subsequent items) ✅
- [ ] Size field included in payload ✅
- [ ] No 400 errors ✅
- [ ] Checkout flow completes ✅

### Data Persistence
- [ ] Cart persists after page reload ✅
- [ ] Cart persists in localStorage ✅
- [ ] Cart syncs with backend ✅
- [ ] Sizes are saved correctly ✅

### Error Handling
- [ ] Validation errors show user-friendly messages ✅
- [ ] Network errors are handled gracefully ✅
- [ ] Console shows detailed debug info ✅
- [ ] No JavaScript errors ✅

## Next Steps After Testing

### If Everything Works ✅
1. Test on different browsers (Chrome, Firefox, Safari)
2. Test on mobile devices
3. Test with different products
4. Test checkout with multiple items
5. Verify order appears in admin dashboard

### If Issues Found ❌
1. **Capture error details:**
   - Run `inspectCart()`
   - Screenshot console errors
   - Screenshot Network tab
   
2. **Check documentation:**
   - `DEBUGGING_400_ERROR.md` for API errors
   - `CART_DEBUG_TOOLS.md` for tool usage
   
3. **Try fixes:**
   - Run `fixCartTypes()`
   - Run `clearCartDebug()` and start fresh
   - Check backend logs

4. **Report issue with:**
   - Steps to reproduce
   - Console error messages
   - Network request/response
   - Expected vs actual behavior

## Debug Commands Quick Reference

| Command | What It Does |
|---------|--------------|
| `inspectCart()` | Shows cart state and validates payload |
| `testCartUpdate()` | Tests API call with current cart |
| `fixCartTypes()` | Fixes type issues (string→number) |
| `clearCartDebug()` | Clears cart to start fresh |
| `debugCartSync()` | Compares localStorage vs context |

## Testing Complete! 🎉

Once you've completed all tests and everything is working:
- ✅ Cart functionality is fully operational
- ✅ Size selection is working
- ✅ API integration is successful
- ✅ Error handling is in place
- ✅ Ready for production deployment

## Questions?

Refer to:
- `CART_DEBUG_TOOLS.md` - Tool documentation
- `DEBUGGING_400_ERROR.md` - Troubleshooting guide
- Browser console - Real-time debugging
