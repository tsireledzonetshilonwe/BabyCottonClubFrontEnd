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
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            padding: '0.75rem',
            border: '1px solid #d1d5db',
            borderRadius: '4px',
            fontSize: '0.875rem'
          }}
        />
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
            border: '1px solid #d1d5db',
            borderRadius: '4px',
            fontSize: '0.875rem',
            backgroundColor: 'white'
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
            border: '1px solid #d1d5db',
            borderRadius: '4px',
            fontSize: '0.875rem',
            backgroundColor: 'white'
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