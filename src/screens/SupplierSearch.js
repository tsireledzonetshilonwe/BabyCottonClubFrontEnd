import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import img_1 from "../assets/img_1.png";
import img from "../assets/img.png";
import onesie from "../assets/onesie.webp";
import img_2 from "../assets/img_2.png";
import img_3 from "../assets/img_3.png";
import img_4 from "../assets/img_4.png";
import "./SupplierSearch.css";

// Example product data
const products = [
    { id: 1, name: "Baby Cotton Onesie", supplier: "Cotton Suppliers SA", price: "R 199", image: onesie },
    { id: 2, name: "Soft Cotton Blanket", supplier: "Cozy Fabrics Ltd", price: "R 250", image: img },
    { id: 3, name: "Baby Booties", supplier: "Cotton Suppliers SA", price: "R 120", image: img_1 },
    { id: 4, name: "Baby Dress", supplier: "Cotton Suppliers SA", price: "R 250", image: img_2 },
    { id: 5, name: "Baby Princess Dress", supplier: "Cozy Fabrics Ltd", price: "R 450", image: img_4 },
    { id: 6, name: "Baby Long sleeve top", supplier: "Cozy Fabrics Ltd", price: "R 299", image: img_3 },
];

export default function SupplierSearch() {
    const { addToCart } = useCart();
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [notification, setNotification] = useState(""); // For toast

    const handleSearch = () => {
        if (!query.trim()) {
            setResults([]);
            return;
        }
        const filtered = products.filter((p) =>
            p.supplier.toLowerCase().includes(query.toLowerCase().trim())
        );
        setResults(filtered);
    };

    const handleAdd = (product) => {
        addToCart(product);
        setNotification(`${product.name} added to cart!`);
        setTimeout(() => setNotification(""), 2000); // disappears after 2s
    };

    return (
        <div style={{ maxWidth: "1000px", margin: "2rem auto", textAlign: "center" }}>
            <h2 style={{ marginBottom: "1rem", color: "#0077b6" }}>
                Search by Supplier
            </h2>

            <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem" }}>
                <input
                    type="text"
                    placeholder="Enter supplier name..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                    style={{
                        flex: 1,
                        padding: "0.7rem",
                        borderRadius: "8px",
                        border: "1px solid #ccc",
                    }}
                />
                <button
                    onClick={handleSearch}
                    style={{
                        background: "#87cefa",
                        color: "white",
                        border: "none",
                        padding: "0.7rem 1.2rem",
                        borderRadius: "8px",
                        cursor: "pointer",
                    }}
                >
                    Search
                </button>
            </div>

            {results.length > 0 ? (
                <div>
                    <h3>Products from "{query}"</h3>
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                            gap: "1rem",
                            marginTop: "1rem",
                        }}
                    >
                        {results.map((product) => (
                            <div
                                key={product.id}
                                style={{
                                    background: "#fff",
                                    border: "1px solid #eee",
                                    padding: "1rem",
                                    borderRadius: "12px",
                                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                                    textAlign: "center",
                                }}
                            >
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    style={{
                                        width: "100%",
                                        height: "180px",
                                        objectFit: "cover",
                                        borderRadius: "8px",
                                        marginBottom: "0.8rem",
                                    }}
                                />
                                <h4 style={{ margin: "0.5rem 0", color: "#333" }}>{product.name}</h4>
                                <p style={{ margin: "0.2rem 0", fontWeight: "bold", color: "#0077b6" }}>
                                    {product.price}
                                </p>
                                <small style={{ color: "#666" }}>Supplier: {product.supplier}</small>
                                <br />
                                <button
                                    style={{
                                        marginTop: "0.5rem",
                                        background: "#ffb6c1",
                                        color: "#fff",
                                        border: "none",
                                        padding: "0.5rem 1rem",
                                        borderRadius: "8px",
                                        cursor: "pointer",
                                    }}
                                    onClick={() => handleAdd(product)} // ✅ now safe
                                >
                                    Add to Cart
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                query && <p>No products found for supplier "{query}"</p>
            )}

            {/* Toast notification */}
            {notification && <div className="toast-message">{notification}</div>}
        </div>
    );
}
