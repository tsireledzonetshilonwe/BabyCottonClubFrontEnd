import React from 'react';

const SimpleFilters = ({ 
  searchTerm, 
  setSearchTerm, 
  priceRange, 
  setPriceRange, 
  sortBy, 
  setSortBy 
}) => {
  return (
    <div style={{ 
      width: '300px', 
      padding: '1rem', 
      backgroundColor: 'white', 
      border: '1px solid #e5e7eb', 
      borderRadius: '8px',
      marginBottom: '2rem'
    }}>
      {/* Search */}
      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{ 
          display: 'block', 
          fontWeight: 'bold', 
          marginBottom: '0.5rem',
          color: '#374151'
        }}>
          Search Products
        </label>
        <div style={{ position: 'relative' }}>
          <div style={{
            position: 'absolute',
            left: '0.75rem',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#FFB6C1',
            fontSize: '1.1rem',
            pointerEvents: 'none'
          }}>
            🔍
          </div>
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem 0.75rem 0.75rem 2.5rem',
              border: '2px solid #FFB6C1',
              borderRadius: '12px',
              fontSize: '0.875rem',
              outline: 'none',
              transition: 'all 0.2s ease',
              boxShadow: '0 2px 8px rgba(255, 182, 193, 0.1)'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#ff9bb3';
              e.target.style.boxShadow = '0 4px 12px rgba(255, 182, 193, 0.2)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#FFB6C1';
              e.target.style.boxShadow = '0 2px 8px rgba(255, 182, 193, 0.1)';
            }}
          />
        </div>
      </div>

      {/* Price Range */}
      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{ 
          display: 'block', 
          fontWeight: 'bold', 
          marginBottom: '0.5rem',
          color: '#374151'
        }}>
          Price Range
        </label>
        <select
          value={priceRange}
          onChange={(e) => setPriceRange(e.target.value)}
          style={{
            width: '100%',
            padding: '0.75rem',
            border: '2px solid #FFB6C1',
            borderRadius: '12px',
            fontSize: '0.875rem',
            backgroundColor: 'white',
            outline: 'none',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: '0 2px 8px rgba(255, 182, 193, 0.1)'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = '#ff9bb3';
            e.target.style.boxShadow = '0 4px 12px rgba(255, 182, 193, 0.2)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = '#FFB6C1';
            e.target.style.boxShadow = '0 2px 8px rgba(255, 182, 193, 0.1)';
          }}
        >
          <option value="all">All Prices</option>
          <option value="under25">Under R25</option>
          <option value="25to40">R25 - R40</option>
          <option value="over40">Over R40</option>
        </select>
      </div>

      {/* Sort By */}
      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{ 
          display: 'block', 
          fontWeight: 'bold', 
          marginBottom: '0.5rem',
          color: '#374151'
        }}>
          Sort By
        </label>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          style={{
            width: '100%',
            padding: '0.75rem',
            border: '2px solid #FFB6C1',
            borderRadius: '12px',
            fontSize: '0.875rem',
            backgroundColor: 'white',
            outline: 'none',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: '0 2px 8px rgba(255, 182, 193, 0.1)'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = '#ff9bb3';
            e.target.style.boxShadow = '0 4px 12px rgba(255, 182, 193, 0.2)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = '#FFB6C1';
            e.target.style.boxShadow = '0 2px 8px rgba(255, 182, 193, 0.1)';
          }}
        >
          <option value="name">Name A-Z</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="rating">Rating</option>
        </select>
      </div>
    </div>
  );
};

export default SimpleFilters;