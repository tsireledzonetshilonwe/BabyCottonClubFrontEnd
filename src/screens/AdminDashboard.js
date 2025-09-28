import React, { useState, useEffect } from "react";
import axios from "axios";

function AdminDashboard() {
    // Supplier Management states
    const [suppliers, setSuppliers] = useState([]);
    const [supplierName, setSupplierName] = useState("");
    const [supplierContact, setSupplierContact] = useState("");

    // Product Management states
    const [productName, setProductName] = useState("");
    const [price, setPrice] = useState("");
    const [stock, setStock] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [rating, setRating] = useState("");
    const [selectedSupplier, setSelectedSupplier] = useState("");

    // Fetch suppliers from database
    useEffect(() => {
        fetchSuppliers();
    }, []);

    const fetchSuppliers = async () => {
        try {
            const res = await axios.get("http://localhost:8080/supplier/getall");
            setSuppliers(res.data);
        } catch (err) {
            console.error("Failed to fetch suppliers:", err);
        }
    };

    // Handle Supplier Form Submission
    const handleSupplierSubmit = async (e) => {
        e.preventDefault();
        const supplierData = { name: supplierName, contactDetails: supplierContact };

        try {
            await axios.post("http://localhost:8080/supplier/create", supplierData);
            setSupplierName("");
            setSupplierContact("");
            fetchSuppliers();
        } catch (err) {
            console.error("Failed to add supplier:", err);
        }
    };

    // Handle Product Form Submission
    const handleProductSubmit = async (e) => {
        e.preventDefault();
        const productData = {
            name: productName,
            price,
            stock,
            description,
            category,
            rating,
            supplierId: selectedSupplier // Link product to supplier
        };

        try {
            await axios.post("http://localhost:8080/product/create", productData);
            setProductName("");
            setPrice("");
            setStock("");
            setDescription("");
            setCategory("");
            setRating("");
            setSelectedSupplier("");
            alert("Product added successfully!");
        } catch (err) {
            console.error("Failed to add product:", err);
        }
    };

    return (
        <div className="admin-dashboard" style={{ maxWidth: 900, margin: "2rem auto", padding: "2rem", background: "#fff", borderRadius: 12, boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}>
            <h2 style={{ color: "#d32f2f", marginBottom: "2rem" }}>Admin Dashboard</h2>

            {/* Product Management */}
            <section style={{ marginBottom: "2rem" }}>
                <h3 style={{ color: "#0077b6" }}>Product Management</h3>
                <form onSubmit={handleProductSubmit} style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "1rem" }}>
                    <input type="text" placeholder="Product Name" value={productName} onChange={(e) => setProductName(e.target.value)} style={{ flex: 1, padding: "0.5rem" }} required />
                    <input type="number" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} style={{ width: 120, padding: "0.5rem" }} required />
                    <input type="number" placeholder="Stock" value={stock} onChange={(e) => setStock(e.target.value)} style={{ width: 100, padding: "0.5rem" }} required />
                    <input type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} style={{ flex: 2, padding: "0.5rem" }} />
                    <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ width: 160, padding: "0.5rem" }} required>
                        <option value="">Select Category</option>
                        <option value="Newborn">Newborn</option>
                        <option value="Baby Boys">Baby Boys</option>
                        <option value="Baby Girls">Baby Girls</option>
                    </select>
                    <input type="number" min="1" max="5" placeholder="Rating (1-5)" value={rating} onChange={(e) => setRating(e.target.value)} style={{ width: 100, padding: "0.5rem" }} />
                    <select value={selectedSupplier} onChange={(e) => setSelectedSupplier(e.target.value)} style={{ width: 160, padding: "0.5rem" }} required>
                        <option value="">Select Supplier</option>
                        {suppliers.map((s) => (
                            <option key={s.supplierId} value={s.supplierId}>{s.name}</option>
                        ))}
                    </select>
                    <button type="submit" style={{ background: "#d32f2f", color: "#fff", fontWeight: 600, border: "none", borderRadius: 4, padding: "0.5rem 1rem" }}>Add Product</button>
                </form>
            </section>

            {/* Supplier Management */}
            <section style={{ marginBottom: "2rem" }}>
                <h3 style={{ color: "#0077b6" }}>Supplier Management</h3>
                <form onSubmit={handleSupplierSubmit} style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "1rem" }}>
                    <input type="text" placeholder="Supplier Name" value={supplierName} onChange={(e) => setSupplierName(e.target.value)} style={{ flex: 1, padding: "0.5rem" }} required />
                    <input type="text" placeholder="Contact Details" value={supplierContact} onChange={(e) => setSupplierContact(e.target.value)} style={{ flex: 1, padding: "0.5rem" }} required />
                    <button type="submit" style={{ background: "#d32f2f", color: "#fff", fontWeight: 600, border: "none", borderRadius: 4, padding: "0.5rem 1rem" }}>Add Supplier</button>
                </form>

                <div style={{ background: "#f7f8fa", borderRadius: 8, padding: "1rem" }}>
                    {suppliers.length === 0 ? (
                        <p style={{ color: "#888" }}>No suppliers yet.</p>
                    ) : (
                        <ul>
                            {suppliers.map((sup) => (
                                <li key={sup.supplierId} style={{ marginBottom: "0.5rem" }}>
                                    {sup.name} - {sup.contactDetails}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </section>

            {/* Order Tracking */}
            <section>
                <h3 style={{ color: "#0077b6" }}>Order Tracking</h3>
                <div style={{ background: "#f7f8fa", borderRadius: 8, padding: "1rem" }}>
                    <p style={{ color: "#888" }}>[Order tracking table will appear here]</p>
                </div>
            </section>
        </div>
    );
}

export default AdminDashboard;
