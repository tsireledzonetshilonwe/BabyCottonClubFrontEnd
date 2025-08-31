// Currency formatter for ZAR
const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    minimumFractionDigits: 2,
  }).format(amount);
import React, { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
// import api from "../api/api";

const productImages = {
  "Baby Blanket": "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80",
  "Cotton Onesie": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
  "Baby Hat": "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80"
};

const categories = [
  { name: "Women", sub: ["Jeans", "Tops", "Activewear", "Sale"] },
  { name: "Men", sub: ["Jeans", "Tops", "Activewear", "Sale"] },
  { name: "Kids", sub: ["T-Shirts", "Shorts", "Sale"] },
  { name: "Baby", sub: ["Essentials", "New Arrivals", "Sale"] },
];

function OrderLines({ isAuthenticated }) {
  const [orderLines, setOrderLines] = useState([]);
  const { addToCart } = useCart();
  const [orderIdFilter, setOrderIdFilter] = useState("");
  const [search, setSearch] = useState("");
  const [showPrompt, setShowPrompt] = useState(false);
  const [category, setCategory] = useState("");
  const [type, setType] = useState("");

  useEffect(() => {
    // Mock data for frontend-only use
    const mockOrderLines = [
      {
        orderLineId: 1,
        orderId: 1,
        productName: "Baby Blanket",
        productSKU: "BB-001",
        quantity: 2,
        price: 50.0
      },
      {
        orderLineId: 2,
        orderId: 1,
        productName: "Cotton Onesie",
        productSKU: "CO-002",
        quantity: 3,
        price: 30.0
      },
      {
        orderLineId: 3,
        orderId: 2,
        productName: "Baby Hat",
        productSKU: "BH-003",
        quantity: 1,
        price: 20.0
      }
    ];
    setOrderLines(mockOrderLines);
  }, []);

  // Filtering logic
  const filteredLines = orderLines.filter(line => {
    const matchesOrder = orderIdFilter ? String(line.orderId) === orderIdFilter : true;
    const matchesSearch = search
      ? line.productName.toLowerCase().includes(search.toLowerCase()) ||
        line.productSKU.toLowerCase().includes(search.toLowerCase())
      : true;
    const matchesCategory = category ? line.productName.toLowerCase().includes(category.toLowerCase()) : true;
    const matchesType = type ? line.productName.toLowerCase().includes(type.toLowerCase()) : true;
    return matchesOrder && matchesSearch && matchesCategory && matchesType;
  });

  const total = filteredLines.reduce((sum, line) => sum + line.price * line.quantity, 0);

  return (
    <div className="products-page">
      <h2 className="products-title">Shop Our Baby Cotton Collection</h2>
      {/* Filter Bar */}
      <div className="products-search-bar" style={{ marginBottom: "1.5rem", display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center" }}>
        <select value={category} onChange={e => { setCategory(e.target.value); setType(""); }} style={{ padding: "0.7rem 1rem", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: "1.1rem" }}>
          <option value="">All Categories</option>
          {categories.map(cat => <option key={cat.name} value={cat.name}>{cat.name}</option>)}
        </select>
        <select value={type} onChange={e => setType(e.target.value)} style={{ padding: "0.7rem 1rem", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: "1.1rem" }} disabled={!category}>
          <option value="">All Types</option>
          {category && categories.find(cat => cat.name === category)?.sub.map(sub => <option key={sub} value={sub}>{sub}</option>)}
        </select>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search for clothes (name or SKU)"
          style={{ padding: "0.7rem 1rem", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: "1.1rem", minWidth: 220 }}
        />
      </div>
      {/* Product Grid */}
      <div className="products-grid">
        {filteredLines.map(line => (
          <div className="product-card" key={line.orderLineId} style={{ boxShadow: "0 4px 24px rgba(211,47,47,0.08)", border: "2px solid #ffeaea" }}>
            <img
              src={productImages[line.productName] || 'https://via.placeholder.com/200x200?text=No+Image'}
              alt={line.productName}
              className="product-image"
              style={{ border: "2px solid #d32f2f" }}
            />
            <div className="product-info">
              <h3 className="product-name" style={{ color: "#d32f2f" }}>{line.productName}</h3>
              <div className="product-sku">SKU: {line.productSKU}</div>
              <div className="product-price">{formatCurrency(line.price)}</div>
            </div>
            <button
              className="auth-btn product-buy-btn"
              onClick={() => {
                addToCart({
                  id: line.orderLineId,
                  name: line.productName,
                  price: line.price,
                  sku: line.productSKU,
                  image: productImages[line.productName] || 'https://via.placeholder.com/200x200?text=No+Image',
                });
              }}
            >
              Add to Cart
            </button>
            {isAuthenticated ? (
              <button className="auth-btn product-buy-btn" onClick={() => alert('Buying...')}>Buy</button>
            ) : (
              <button className="auth-btn product-buy-btn" onClick={() => setShowPrompt(true)}>Buy</button>
            )}
          </div>
        ))}
      </div>
      {filteredLines.length === 0 && (
        <div className="products-empty">No products found.</div>
      )}
      {showPrompt && (
        <div className="products-login-prompt">
          Please <a href="/login">log in</a> or <a href="/signup">sign up</a> to buy clothes.
          <button className="products-close-btn" onClick={()=>setShowPrompt(false)}>Close</button>
        </div>
      )}
    </div>
  );
}

export default OrderLines;
