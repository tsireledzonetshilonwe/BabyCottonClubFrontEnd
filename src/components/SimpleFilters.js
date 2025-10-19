import React from 'react';

const SimpleFilters = ({ 
  searchTerm, 
  setSearchTerm, 
  priceRange, 
  setPriceRange, 
  sortBy, 
  setSortBy,
  categories = ['All'],
  selectedCategory = 'All',
  setSelectedCategory = () => {},
  variant = 'sidebar' // 'sidebar' | 'bar'
}) => {
  if (variant === 'bar') {
    return (
      <div style={{
        width: '100%',
        padding: '0.75rem 1rem',
        backgroundColor: 'white',
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        flexWrap: 'wrap',
        boxShadow: '0 2px 8px rgba(255, 182, 193, 0.08)'
      }}>
        {/* Search */}
        <input
          aria-label="Search products"
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            flex: '1 1 260px',
            minWidth: '220px',
            padding: '0.65rem 0.9rem',
            border: '2px solid #FFB6C1',
            borderRadius: '10px',
            fontSize: '0.9rem',
            outline: 'none'
          }}
        />

        {/* Price Range */}
        <select
          aria-label="Price range"
          value={priceRange}
          onChange={(e) => setPriceRange(e.target.value)}
          style={{
            flex: '0 0 180px',
            padding: '0.65rem 0.9rem',
            border: '2px solid #FFB6C1',
            borderRadius: '10px',
            background: 'white'
          }}
        >
          <option value="all">All Prices</option>
          <option value="under150">Under R150</option>
          <option value="150to400">R150 - R400</option>
          <option value="over400">Over R400</option>
        </select>

        {/* Sort By */}
        <select
          aria-label="Sort by"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          style={{
            flex: '0 0 180px',
            padding: '0.65rem 0.9rem',
            border: '2px solid #FFB6C1',
            borderRadius: '10px',
            background: 'white'
          }}
        >
          <option value="name">Name A-Z</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="rating">Rating</option>
        </select>

        {/* Category */}
        <select
          aria-label="Category"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          style={{
            flex: '0 0 180px',
            padding: '0.65rem 0.9rem',
            border: '2px solid #FFB6C1',
            borderRadius: '10px',
            background: 'white'
          }}
        >
          {(categories || ['All']).map((cat, idx) => (
            <option key={idx} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>
    );
  }

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
            Search
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
          <option value="under150">Under R150</option>
          <option value="150to400">R150 - R400</option>
          <option value="over400">Over R400</option>
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

      {/* Category Select */}
      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{ 
          display: 'block', 
          fontWeight: 'bold', 
          marginBottom: '0.5rem',
          color: '#374151'
        }}>
          Category
        </label>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
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
        >
          {(categories || ['All']).map((cat, idx) => (
            <option key={idx} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default SimpleFilters;