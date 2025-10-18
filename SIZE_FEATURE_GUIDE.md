# Size Selection Feature - User Guide

## For Users

### How to Add Products with Sizes to Cart

#### On Product Listing Page:
1. Browse products as usual
2. If a product has multiple sizes, you'll see size buttons (e.g., "3-6M", "6-12M", "12-18M")
3. **Click a size button** to select your preferred size
4. The selected size will be highlighted in pink
5. Click "Add to Cart" - item will be added with your selected size
6. If you forget to select a size, you'll see an error message

#### On Product Details Page:
1. View product information
2. See available sizes displayed prominently
3. **Select a size** from the options
4. Click "Add to Cart"
5. You'll see a confirmation: "Product Name (Size: 3-6M) has been added to your cart"

#### In Shopping Cart:
- Each size of a product appears as a separate line item
- Example: If you add the same onesie in "3-6M" and "6-12M", you'll see two separate entries
- Size is clearly displayed under each item
- Adjust quantity independently for each size

### Products Without Size Selection

For products that only come in one size (like blankets or certain accessories):
- No size selector will appear
- Click "Add to Cart" directly
- Works exactly as before - no changes needed!

## For Developers

### Quick Integration Guide

#### 1. Product Component Integration

```jsx
import SizeSelector from './components/SizeSelector';

const ProductCard = ({ product }) => {
  const [selectedSize, setSelectedSize] = useState(null);
  const [sizeError, setSizeError] = useState(null);
  
  const hasSizes = product.sizes?.length > 0 && 
    !(product.sizes.length === 1 && product.sizes[0] === 'One Size');

  const handleAddToCart = () => {
    if (hasSizes && !selectedSize) {
      setSizeError('Please select a size');
      return;
    }
    
    const cartItem = { 
      ...product, 
      ...(selectedSize && { size: selectedSize }) 
    };
    addToCart(cartItem);
  };

  return (
    <div>
      {hasSizes && (
        <SizeSelector
          sizes={product.sizes}
          selectedSize={selectedSize}
          onSizeChange={setSelectedSize}
          required={true}
          error={sizeError}
        />
      )}
      <button onClick={handleAddToCart}>Add to Cart</button>
    </div>
  );
};
```

#### 2. Cart Context Usage

```jsx
// Adding with size
addToCart({ id: 123, name: 'Onesie', price: 299, size: '3-6M' });

// Removing with size
removeFromCart(123, '3-6M');

// Updating quantity with size
increaseQuantity(123, '3-6M');
decreaseQuantity(123, '3-6M');
```

#### 3. Backend Payload Format

```javascript
// When saving cart or creating order
const items = cartItems.map(item => ({
  productId: item.id,
  quantity: item.quantity,
  ...(item.size && { size: item.size })  // Include size if present
}));
```

### API Payload Examples

#### Creating Cart:
```json
POST /api/cart/create
{
  "customer": { "customerId": 1 },
  "items": [
    { "productId": 5, "quantity": 1, "size": "3-6M" },
    { "productId": 5, "quantity": 2, "size": "6-12M" },
    { "productId": 8, "quantity": 1 }
  ],
  "checkedOut": false
}
```

#### Updating Cart:
```json
PUT /api/cart/update
{
  "cartId": 12,
  "customerId": 1,
  "items": [
    { "productId": 5, "quantity": 2, "size": "6-12M" }
  ]
}
```

### Error Handling

```javascript
import { handleCartError, validateCartItem } from '../utils/cartErrorHandler';

// Validate before adding
const validation = validateCartItem(item, product.sizes);
if (!validation.valid) {
  console.error(validation.errors);
  return;
}

// Handle API errors
try {
  await api.post('/api/cart/create', payload);
} catch (error) {
  handleCartError(error, toast);
}
```

## Testing Scenarios

### Test Case 1: Product with Multiple Sizes
- **Given**: A product with sizes ["3-6M", "6-12M", "12-18M"]
- **When**: User tries to add without selecting
- **Then**: Error message appears "Please select a size"
- **When**: User selects "6-12M" and clicks Add to Cart
- **Then**: Item appears in cart with size "6-12M"

### Test Case 2: Same Product, Different Sizes
- **Given**: User adds Onesie in "3-6M" (qty: 1)
- **When**: User adds same Onesie in "6-12M" (qty: 1)
- **Then**: Cart shows 2 separate line items

### Test Case 3: Product with One Size
- **Given**: A product with sizes ["One Size"]
- **Then**: No size selector appears
- **When**: User clicks Add to Cart
- **Then**: Item added immediately without size validation

### Test Case 4: Checkout with Sizes
- **Given**: Cart has items with sizes
- **When**: User proceeds to checkout
- **Then**: Backend receives sizes in orderLines
- **Then**: Order confirmation shows sizes

## Accessibility

The size selector includes:
- ✅ ARIA labels for screen readers
- ✅ Keyboard navigation (Tab to navigate, Space/Enter to select)
- ✅ Focus indicators
- ✅ Error announcements
- ✅ Required field indicators

## Browser Compatibility

Tested and working on:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Performance

- Size selection is instant (no API calls)
- Validation happens client-side before API calls
- Cart operations are optimized with memoization
- No performance impact on products without sizes
