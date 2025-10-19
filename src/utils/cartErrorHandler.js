/**
 * Handle cart-related API errors and provide user-friendly messages
 * @param {Error} error - The error object from the API call
 * @param {Function} toast - Toast notification function
 * @returns {string} User-friendly error message
 */
export const handleCartError = (error, toast = null) => {
  let errorMessage = 'An unexpected error occurred';
  
  // Check for server response errors
  if (error.response) {
    const { status, data } = error.response;
    
    switch (status) {
      case 400:
        // Bad request - likely validation error
        if (data.message) {
          if (data.message.includes('size') || data.message.includes('Size')) {
            errorMessage = 'Please select a size for this product';
          } else if (data.message.includes('invalid') || data.message.includes('Invalid')) {
            errorMessage = 'Invalid product selection. Please try again.';
          } else {
            errorMessage = data.message;
          }
        } else {
          errorMessage = 'Invalid request. Please check your selection.';
        }
        break;
        
      case 403:
        errorMessage = 'You must be logged in to perform this action';
        break;
        
      case 404:
        errorMessage = 'Product not found. It may have been removed.';
        break;
        
      case 409:
        errorMessage = 'This item is already in your cart with a different size';
        break;
        
      case 422:
        // Unprocessable entity - validation error
        if (data.errors) {
          const errors = Object.values(data.errors).flat();
          errorMessage = errors.join(', ');
        } else {
          errorMessage = data.message || 'Validation error. Please check your input.';
        }
        break;
        
      case 500:
        errorMessage = 'Server error. Please try again later.';
        break;
        
      default:
        errorMessage = data.message || `Error: ${status}`;
    }
  } else if (error.request) {
    // Request made but no response
    errorMessage = 'Unable to connect to server. Please check your connection.';
  } else {
    // Error in request setup
    errorMessage = error.message || 'Request failed';
  }
  
  // Show toast if provided
  if (toast) {
    toast({
      title: 'Error',
      description: errorMessage,
      variant: 'destructive',
    });
  }
  
  console.error('Cart error:', error);
  return errorMessage;
};

/**
 * Validate cart item before sending to backend
 * @param {Object} item - Cart item to validate
 * @param {Array<string>} availableSizes - Available sizes for the product
 * @returns {Object} { valid: boolean, errors: string[] }
 */
export const validateCartItem = (item, availableSizes = []) => {
  const errors = [];
  
  if (!item.id && !item.productId) {
    errors.push('Product ID is required');
  }
  
  if (!item.quantity || item.quantity < 1) {
    errors.push('Quantity must be at least 1');
  }
  
  // Check if product requires size selection
  const hasSizes = availableSizes && 
    Array.isArray(availableSizes) && 
    availableSizes.length > 0 &&
    !(availableSizes.length === 1 && availableSizes[0] === 'One Size');
  
  if (hasSizes && !item.size) {
    errors.push('Size selection is required for this product');
  }
  
  if (item.size && hasSizes && !availableSizes.includes(item.size)) {
    errors.push(`Invalid size: ${item.size}. Available sizes: ${availableSizes.join(', ')}`);
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
};
