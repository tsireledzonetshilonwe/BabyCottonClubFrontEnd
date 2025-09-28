import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import "./SupplierSearch.css";
import { fetchProducts } from "../api/api";

export default function SupplierSearch() {
    const { addToCart } = useCart();
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [notification, setNotification] = useState(""); // For toast

    const handleSearch = async () => {
        if (!query.trim()) {
            setResults([]);
            return;
        }
        try {
            const allProducts = await fetchProducts();
            const filtered = allProducts.filter((p) =>
                (p.productName || p.name || "").toLowerCase().includes(query.trim().toLowerCase())
            );
            setResults(filtered);
        } catch (err) {
            setResults([]);
        }
    };

    const handleAdd = (product) => {
        const cartItem = {
            id: product.productId,
            name: product.productName,
            price: product.price,
            image: product.imageUrl
        };
        addToCart(cartItem);
        setNotification(`${product.productName} added to cart!`);
        setTimeout(() => setNotification(""), 2000); // disappears after 2s
    };

    return (
        <div style={{ maxWidth: "1000px", margin: "2rem auto", textAlign: "center" }}>
            <h2 style={{ marginBottom: "1rem", color: "#0077b6" }}>
                Search Products
            </h2>

            <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem" }}>
                <input
                    type="text"
                    placeholder="Search for a product..."
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
                    <h3>Search results for "{query}"</h3>
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
                query && <p>No products found for "{query}"</p>
            )}

            {/* Toast notification */}
            {notification && <div className="toast-message">{notification}</div>}
        </div>
    );
}
