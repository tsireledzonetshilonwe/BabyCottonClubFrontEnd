import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchProducts } from "../api/api";

const ProductPage = () => {
 const [products, setProducts] = useState([]);
 const navigate = useNavigate();

 // Fetch all products
 const loadProducts = async () => {
  try {
   const data = await fetchProducts();
   setProducts(data);
  } catch (err) {
   console.error(err);
  }
 };

 useEffect(() => {
  loadProducts();
 }, []);

 // Helper: stock status display
 const getStockLabel = (status) => {
  if (!status) return { text: "Unknown", color: "#999" };
  const s = status.toLowerCase();
  if (s === "yes" || s === "available") return { text: "In Stock", color: "green" };
  if (s === "low") return { text: "Low Stock", color: "orange" };
  if (s === "preorder") return { text: "Pre-Order", color: "blue" };
  if (s === "out" || s === "no") return { text: "Out of Stock", color: "red" };
  return { text: status, color: "#666" };
 };

 return (
  <div style={{ padding: "20px" }}>
   <h1 style={{ textAlign: "center", marginBottom: "30px" }}>Products</h1>

   {/* Product List */}
   <div
    style={{
     display: "grid",
     gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
     gap: "20px",
    }}
   >
    {products.map((p) => {
     const stock = getStockLabel(p.inStock);
     return (
      <div
       key={p.productId}
       style={{
        border: "1px solid #ddd",
        borderRadius: "12px",
        padding: "15px",
        textAlign: "center",
        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
        backgroundColor: "#fff",
       }}
      >
       <img
        src={p.imageUrl}
        alt={p.productName}
        style={{
         width: "100%",
         maxWidth: "200px",
         height: "auto",
         objectFit: "contain",
         borderRadius: "8px",
         marginBottom: "10px",
        }}
        onError={(e) => (e.target.src = "https://via.placeholder.com/150?text=No+Image")}
       />
       <h3>{p.productName}</h3>
       <p>Color: {p.color}</p>
       <p>R{p.price}</p>
       <p style={{ color: stock.color }}>{stock.text}</p>

       {/* Add to Cart */}
       <button
        onClick={() => navigate("/cart")}
        disabled={stock.text === "Out of Stock"}
       >
        {stock.text === "Out of Stock" ? "Unavailable" : "Add to Cart"}
       </button>

       {/* Reviews */}
       <div style={{ marginTop: "10px", textAlign: "left" }}>
        {p.reviews && p.reviews.length > 0 ? (
         <>
          <h4 style={{ fontSize: "14px" }}>Reviews:</h4>
          <ul style={{ paddingLeft: "20px", fontSize: "13px", color: "#555" }}>
           {p.reviews.map((r, i) => (
            <li key={i}>
             {r.comment} <span style={{ fontStyle: "italic" }}>({r.rating}/5)</span>
            </li>
           ))}
          </ul>
         </>
        ) : (
         <p style={{ fontSize: "13px", color: "#aaa" }}>No reviews yet</p>
        )}
       </div>
      </div>
     );
    })}
   </div>
  </div>
 );
};

export default ProductPage;
