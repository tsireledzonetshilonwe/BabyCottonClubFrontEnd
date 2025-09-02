import React, { useState } from "react";
import axios from "axios";

const AddProduct = () => {
 const [product, setProduct] = useState({
  name: "",
  brand: "",
  description: "",
  price: "",
  category: "",
  stockQuantity: "",
  releaseDate: "",
  productAvailable: false,
 });

 const [image, setImage] = useState(null);

 // Handle input fields
 const handleInputChange = (e) => {
  const { name, value } = e.target;
  setProduct({ ...product, [name]: value });
 };

 // Handle checkbox
 const handleCheckboxChange = (e) => {
  setProduct({ ...product, productAvailable: e.target.checked });
 };

 // Handle image
 const handleImageChange = (e) => {
  setImage(e.target.files[0]);
 };

 // Submit product + image
 const handleSubmit = async (e) => {
  e.preventDefault();

  const formData = new FormData();
  // append all product fields
  Object.keys(product).forEach((key) => {
   formData.append(key, product[key]);
  });
  // append image
  if (image) {
   formData.append("file", image);
  }

  try {
   await axios.post("http://localhost:8080/api/product", formData, {
    headers: { "Content-Type": "multipart/form-data" },
   });
   alert("Product added successfully!");
   setProduct({
    name: "",
    brand: "",
    description: "",
    price: "",
    category: "",
    stockQuantity: "",
    releaseDate: "",
    productAvailable: false,
   });
   setImage(null);
  } catch (error) {
   console.error("Error uploading product:", error);
   alert("Failed to add product. Check console for details.");
  }
 };

 return (
  <div className="add-product">
   <h2>Add Product</h2>
   <form onSubmit={handleSubmit}>
    <input type="text" name="name" placeholder="Product Name" value={product.name} onChange={handleInputChange} required />
    <input type="text" name="brand" placeholder="Brand" value={product.brand} onChange={handleInputChange} required />
    <textarea name="description" placeholder="Description" value={product.description} onChange={handleInputChange}></textarea>
    <input type="number" name="price" placeholder="Price" value={product.price} onChange={handleInputChange} required />
    <input type="text" name="category" placeholder="Category" value={product.category} onChange={handleInputChange} required />
    <input type="number" name="stockQuantity" placeholder="Stock Quantity" value={product.stockQuantity} onChange={handleInputChange} />
    <input type="date" name="releaseDate" value={product.releaseDate} onChange={handleInputChange} />
    <label>
     Available:
     <input type="checkbox" checked={product.productAvailable} onChange={handleCheckboxChange} />
    </label>
    <input type="file" accept="image/*" onChange={handleImageChange} />
    <button type="submit">Add Product</button>
   </form>
  </div>
 );
};

export default AddProduct;
