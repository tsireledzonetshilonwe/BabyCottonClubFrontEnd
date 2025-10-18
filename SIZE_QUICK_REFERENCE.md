# Size Selection - Quick Reference Card

## 🎯 What Changed?

Products can now have multiple sizes (e.g., "3-6M", "6-12M", "12-18M"). Users must select a size before adding to cart.

## 🔧 For Frontend Developers

### Using SizeSelector Component
```jsx
import SizeSelector from './components/SizeSelector';

<SizeSelector
  sizes={['3-6M', '6-12M', '12-18M']}
  selectedSize={selectedSize}
  onSizeChange={setSelectedSize}
  required={true}
  error={sizeError}
/>
```

### Adding to Cart with Size
```javascript
import { useCart } from '../context/CartContext';

const { addToCart } = useCart();

addToCart({
  id: product.id,
  name: product.name,
  price: product.price,
  size: '3-6M'  // Include size if product has sizes
});
```

### Cart Operations with Size
```javascript
// Remove specific size variant
removeFromCart(productId, '3-6M');

// Increase quantity of specific size
increaseQuantity(productId, '3-6M');

// Decrease quantity of specific size
decreaseQuantity(productId, '3-6M');
```

## 💾 For Backend Developers

### Expected Payloads

#### Cart Create/Update
```json
{
  "customer": { "customerId": 1 },
  "items": [
    {
      "productId": 5,
      "quantity": 1,
      "size": "3-6M"  // Optional - only present if product has sizes
    }
  ],
  "checkedOut": false
}
```

#### Order Creation
```json
{
  "customerId": 1,
  "orderLines": [
    {
      "productId": 5,
      "quantity": 1,
      "unitPrice": 299.99,
      "subTotal": 299.99,
      "size": "3-6M"  // Optional
    }
  ]
}
```

### Product Response Format
```json
{
  "productId": 5,
  "productName": "Cotton Onesie",
  "price": 299.99,
  "sizes": ["3-6M", "6-12M", "12-18M"],  // Required field
  "inStock": "available"
}
```

**Note:** If `sizes` is empty, `null`, or `["One Size"]`, frontend won't show size selector.

### Validation Rules
- ✅ `size` field is **optional** on cart/order items
- ✅ If product has sizes AND size is missing → return 400 error with message containing "size"
- ✅ If size is invalid → return 400 error with message containing "invalid size"

### Error Response Format
```json
{
  "status": 400,
  "message": "Size is required for this product",
  "errors": {
    "size": ["Size must be one of: 3-6M, 6-12M, 12-18M"]
  }
}
```

## 🧪 For QA Testers

### Test Scenarios

#### ✅ Happy Path
1. Product has sizes → Size selector appears
2. Select size → Size highlights in pink
3. Click "Add to Cart" → Item added with size
4. Check cart → Size displayed correctly
5. Checkout → Order includes size

#### ⚠️ Validation Errors
1. Try to add without selecting size → Error message appears
2. Backend rejects invalid size → User sees friendly error
3. Network error → User sees "Cannot connect" message

#### 🔄 Edge Cases
1. Same product, different sizes → Separate cart entries
2. Product with only "One Size" → No size selector
3. Change size after adding → New cart entry created
4. Increase quantity → Correct size variant updated

### What to Look For
- ❌ Can add to cart without selecting size (BUG!)
- ❌ Size not displayed in cart (BUG!)
- ❌ Size not sent to backend (BUG!)
- ❌ Error messages not user-friendly (BUG!)
- ✅ Size selector hidden for "One Size" products
- ✅ Keyboard navigation works
- ✅ Error messages are clear

## 📋 Common Issues & Solutions

### Issue: "Size selector not appearing"
**Check:**
- Does product have `sizes` array in backend response?
- Is `sizes` array NOT empty/null/["One Size"]?
- Check browser console for errors

### Issue: "Can't add to cart"
**Check:**
- Is size selected? (Should show "Selected: X")
- Check browser console for validation errors
- Verify backend is running

### Issue: "Size not saving to backend"
**Check:**
- Network tab: Does payload include `"size": "X"`?
- Backend logs: Is size field received?
- Check `cartItems` in localStorage

### Issue: "Multiple entries for same product"
**This is correct!** Same product with different sizes = different cart entries.

## 🎨 For UI/UX Designers

### Design Specifications

**Size Selector Buttons:**
- Default: White background, gray border
- Hover: Pink background (#FFB6C1)
- Selected: Pink background (#FFB6C1), pink text
- Focus: 2px pink ring
- Disabled: Gray, cursor not-allowed

**Error Messages:**
- Color: Red (#DC2626)
- Position: Below size selector
- Icon: Alert triangle
- Font size: 14px

**Accessibility:**
- Touch target: Minimum 44x44px
- Color contrast: WCAG AA compliant
- Focus visible: Always
- Labels: Clear and concise

## 📞 Support Contacts

- **Frontend Issues:** Check `SIZE_IMPLEMENTATION_SUMMARY.md`
- **Backend Integration:** Check API payload formats above
- **User Experience:** Check `SIZE_FEATURE_GUIDE.md`
- **Testing:** Check `SIZE_CHECKLIST.md`

## 🚨 Emergency Rollback

If critical issues occur:
1. Backend: Ignore `size` field (it's optional)
2. Frontend: Products without sizes work as before
3. Size selection still appears but won't break checkout

## 📈 Metrics to Monitor

- Size selection completion rate
- "Add to cart" success rate
- Cart abandonment rate
- Backend validation errors
- User support tickets about sizes

## ✨ Quick Tips

1. **Always include size in backend payloads:** Use spread operator `...(item.size && { size: item.size })`
2. **Test with multiple sizes:** Same product ID + different sizes = separate entries
3. **Check localStorage:** Key `cartItems` should include size field
4. **Monitor console logs:** Look for "💾 Saving cart" and "✅ Cart saved"
5. **Use error handler:** Import `handleCartError` for consistent error messages

---

**Last Updated:** October 18, 2025
**Version:** 1.0.0
