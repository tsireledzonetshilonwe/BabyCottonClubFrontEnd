import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import "./CreateOrder.css";


import { fetchProducts } from "../api/api";
import { createOrder } from "../api/api";

// Remove mockProducts, use real products from backend

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
  const [selectedSize, setSelectedSize] = useState("");
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts().then(setProducts).catch(() => setProducts([]));
  }, []);

  // Example sizes, you can customize or make dynamic per product
  const sizeOptions = ["0-3M", "3-6M", "6-9M", "9-12M", "12-18M", "18-24M", "2-3 years", "3-4 years", "4-5 years", "5-6 years"];

  const addOrderLine = () => {
    const product = products.find(p => String(p.productId) === selectedProduct);
    if (!product || quantity < 1 || !selectedSize) return;
    setOrderLines([
      ...orderLines,
      {
        productId: product.productId,
        productName: product.productName,
        productSKU: product.productSKU,
        price: product.price,
        quantity: Number(quantity),
        size: selectedSize
      }
    ]);
    setSelectedProduct("");
    setQuantity(1);
    setSelectedSize("");
  };

  const handleSubmit = async e => {
    e.preventDefault();
    // Build payload matching backend expectations
    const payload = {
      customerId: 1, // TODO: Replace with actual customer ID logic if needed
      orderDate: new Date().toISOString().slice(0, 10),
      totalAmount: orderLines.reduce((sum, line) => sum + (line.price * line.quantity), 0),
      status: "NEW",
      orderLines: orderLines.map(line => ({
        productId: line.productId,
        quantity: line.quantity,
        unitPrice: line.price,
        subTotal: line.price * line.quantity,
        size: line.size
      }))
    };

    try {
      await createOrder(payload);
      navigate("/orders");
    } catch (err) {
      alert("Error creating order: " + (err.response?.data?.message || err.message));
    }
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
            {products.map(p => (
              <option key={p.productId} value={p.productId}>
                {p.productName} ({formatCurrency(p.price)})
              </option>
            ))}
          </select>
          <label style={{ marginLeft: 12 }}>Size: </label>
          <select
            value={selectedSize}
            onChange={e => setSelectedSize(e.target.value)}
            required
            style={{ marginLeft: 4 }}
          >
            <option value="">Select size</option>
            {sizeOptions.map(size => (
              <option key={size} value={size}>{size}</option>
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
                <th>Size</th>
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
                  <td>{line.size || '-'}</td>
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
