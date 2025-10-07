import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import "./CreateOrder.css";

const mockProducts = [
  { productSKU: "BB-001", productName: "Baby Blanket", price: 50.0 },
  { productSKU: "CO-002", productName: "Cotton Onesie", price: 30.0 },
  { productSKU: "BH-003", productName: "Baby Hat", price: 20.0 }
];

// Currency formatter for ZAR
const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    minimumFractionDigits: 2,
  }).format(amount);

function CreateOrder() {
  const [customerName, setCustomerName] = useState("");
  const [orderLines, setOrderLines] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();

  const addOrderLine = () => {
    const product = mockProducts.find(p => p.productSKU === selectedProduct);
    if (!product || quantity < 1) return;
    setOrderLines([
      ...orderLines,
      {
        ...product,
        quantity: Number(quantity)
      }
    ]);
    setSelectedProduct("");
    setQuantity(1);
  };

  const handleSubmit = e => {
    e.preventDefault();
    // Here you would send the order to the backend
    alert("Order created! (mock)");
    navigate("/orders");
  };

  return (
    <div>
      <h2>Create New Order</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: 32 }}>
        <div style={{ marginBottom: 16 }}>
          <label>Customer Name: </label>
          <input
            value={customerName}
            onChange={e => setCustomerName(e.target.value)}
            required
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label>Product: </label>
          <select
            value={selectedProduct}
            onChange={e => setSelectedProduct(e.target.value)}
            required
          >
            <option value="">Select product</option>
            {mockProducts.map(p => (
              <option key={p.productSKU} value={p.productSKU}>
                {p.productName} ({formatCurrency(p.price)})
              </option>
            ))}
          </select>
          <label style={{ marginLeft: 12 }}>Quantity: </label>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={e => setQuantity(e.target.value)}
            style={{ width: 60 }}
          />
          <button type="button" onClick={addOrderLine} style={{ marginLeft: 12 }}>
            Add Item
          </button>
        </div>
        <div>
          <h4>Order Items</h4>
          <table border="1" cellPadding="10">
            <thead>
              <tr>
                <th>Product</th>
                <th>SKU</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {orderLines.map((line, idx) => (
                <tr key={idx}>
                  <td>{line.productName}</td>
                  <td>{line.productSKU}</td>
                  <td>{line.quantity}</td>
                  <td>{formatCurrency(line.price)}</td>
                  <td>{formatCurrency(line.price * line.quantity)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button type="submit" style={{ marginTop: 16 }}>Create Order</button>
      </form>
      <Link to="/orders">Back to Orders</Link>
    </div>
  );
}

export default CreateOrder;
