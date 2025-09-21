import React from "react";

function AdminDashboard() {
  return (
    <div className="admin-dashboard" style={{ maxWidth: 900, margin: '2rem auto', padding: '2rem', background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
      <h2 style={{ color: '#d32f2f', marginBottom: '2rem' }}>Admin Dashboard</h2>
      <section style={{ marginBottom: '2rem' }}>
        <h3 style={{ color: '#0077b6' }}>Product Management</h3>
        <form className="admin-product-form" style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
          <input type="text" placeholder="Product Name" style={{ flex: 1, padding: '0.5rem' }} />
          <input type="number" placeholder="Price" style={{ width: 120, padding: '0.5rem' }} />
          <input type="number" placeholder="Stock" style={{ width: 100, padding: '0.5rem' }} />
          <input type="file" accept="image/*" style={{ width: 180, padding: '0.5rem' }} />
          <input type="text" placeholder="Description" style={{ flex: 2, padding: '0.5rem' }} />
          <select style={{ width: 160, padding: '0.5rem' }}>
            <option value="">Select Category</option>
            <option value="Newborn">Newborn</option>
            <option value="Baby Boys">Baby Boys</option>
            <option value="Baby Girls">Baby Girls</option>
          </select>
          <input type="number" min="1" max="5" placeholder="Rating (1-5)" style={{ width: 100, padding: '0.5rem' }} />
          <button type="submit" style={{ background: '#d32f2f', color: '#fff', fontWeight: 600, border: 'none', borderRadius: 4, padding: '0.5rem 1rem' }}>Add Product</button>
        </form>
        <div className="admin-product-list" style={{ background: '#f7f8fa', borderRadius: 8, padding: '1rem' }}>
          <p style={{ color: '#888' }}>[Product list will appear here]</p>
        </div>
      </section>
      <section>
        <h3 style={{ color: '#0077b6' }}>Order Tracking</h3>
        <div className="admin-order-list" style={{ background: '#f7f8fa', borderRadius: 8, padding: '1rem' }}>
          <p style={{ color: '#888' }}>[Order tracking table will appear here]</p>
        </div>
      </section>
    </div>
  );
}

export default AdminDashboard;
