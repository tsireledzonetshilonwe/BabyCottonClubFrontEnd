import React from 'react';
import { Badge } from './ui/badge';

/**
 * SizeSelector component for selecting product sizes
 * @param {Object} props
 * @param {Array<string>} props.sizes - Available sizes
 * @param {string} props.selectedSize - Currently selected size
 * @param {Function} props.onSizeChange - Callback when size is selected
 * @param {boolean} props.required - Whether size selection is required
 * @param {string} props.error - Error message to display
 */
const SizeSelector = ({ sizes, selectedSize, onSizeChange, required = false, error = null }) => {
  // Don't show selector if no sizes or only "One Size"
  if (!sizes || sizes.length === 0 || (sizes.length === 1 && sizes[0] === 'One Size')) {
    return null;
  }

  return (
    <div className="space-y-2" role="group" aria-labelledby="size-selector-label">
      <label 
        id="size-selector-label" 
        className="text-sm font-medium flex items-center gap-2"
      >
        Select Size
        {required && <span className="text-red-500" aria-label="required">*</span>}
      </label>
      
      <div className="flex flex-wrap gap-1.5" role="radiogroup" aria-required={required}>
        {sizes.map((size) => (
          <button
            key={size}
            type="button"
            role="radio"
            aria-checked={selectedSize === size}
            onClick={() => onSizeChange(size)}
            style={{
              padding: '0.375rem 0.75rem',
              border: selectedSize === size ? '1.5px solid #FFB6C1' : '1.5px solid #e5e7eb',
              borderRadius: '6px',
              backgroundColor: selectedSize === size ? '#FFB6C1' : '#ffffff',
              color: selectedSize === size ? '#ffffff' : '#5D5D5D',
              fontWeight: selectedSize === size ? '600' : '500',
              fontSize: '0.8125rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease-in-out',
              boxShadow: selectedSize === size ? '0 1px 4px rgba(255, 182, 193, 0.25)' : 'none',
              minWidth: '50px',
            }}
            onMouseEnter={(e) => {
              if (selectedSize !== size) {
                e.currentTarget.style.backgroundColor = '#FFF0F5';
                e.currentTarget.style.borderColor = '#FFB6C1';
                e.currentTarget.style.boxShadow = '0 1px 3px rgba(255, 182, 193, 0.2)';
              }
            }}
            onMouseLeave={(e) => {
              if (selectedSize !== size) {
                e.currentTarget.style.backgroundColor = '#ffffff';
                e.currentTarget.style.borderColor = '#e5e7eb';
                e.currentTarget.style.boxShadow = 'none';
              }
            }}
            onFocus={(e) => {
              e.currentTarget.style.outline = 'none';
              e.currentTarget.style.boxShadow = selectedSize === size 
                ? '0 0 0 2px rgba(255, 182, 193, 0.4)' 
                : '0 0 0 2px rgba(255, 182, 193, 0.3)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.boxShadow = selectedSize === size 
                ? '0 1px 4px rgba(255, 182, 193, 0.25)' 
                : 'none';
            }}
          >
            {size}
          </button>
        ))}
      </div>
      
      {error && (
        <p className="text-sm text-red-500" role="alert" aria-live="polite">
          {error}
        </p>
      )}
      
      {selectedSize && (
        <p className="text-sm text-muted-foreground" aria-live="polite">
          Selected: <strong>{selectedSize}</strong>
        </p>
      )}
    </div>
  );
};

export default SizeSelector;
