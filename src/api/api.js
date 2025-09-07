// Create a new order
export const createOrder = async (orderData) => {
  const res = await api.post("/api/order/create", orderData);
  return res.data;
};
// Create a new payment
export const createPayment = async (paymentData) => {
  const res = await api.post("/payment/create", paymentData);
  return res.data;
};

// Fetch order line details by orderLineId
export const fetchOrderLineDetails = async (orderLineId) => {
  const res = await api.get(`/api/orderline/read/${orderLineId}`);
  return res.data;
};
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080" // Java Spring Boot backend
});

// Customer sign up (create)
export const createCustomer = async (customerData) => {
  const res = await api.post("/api/customer/create", customerData);
  return res.data;
};

// Customer login
export const loginCustomer = async (email, password) => {
  const res = await api.post("/api/customer/login", { email, password });
  return res.data;
};

// Fetch all orders for a specific customer (by email or userId)
export const fetchOrdersByCustomer = async (email) => {
  // Adjust endpoint as per your backend (e.g., /api/orders/customer/{email})
  const res = await api.get(`/api/orders/customer/${encodeURIComponent(email)}`);
  return res.data;
};

// Fetch order details by orderId
export const fetchOrderDetails = async (orderId) => {
  // Adjust endpoint as per your backend (e.g., /api/orders/${orderId})
  const res = await api.get(`/api/order/${orderId}`);
  return res.data;
};

// Fetch all reviews
export const fetchAllReviews = async () => {
  const res = await api.get("/review/getall");
  return res.data;
};



// Create a new review
export const createReview = async (reviewData) => {
  const res = await api.post("/review/create", reviewData);
  return res.data;
};

export const fetchProducts = async () => {
 const res = await fetch("http://localhost:8080/api/products", {
  method: "GET",
  headers: { "Content-Type": "application/json" },
 });

 if (!res.ok) throw new Error("Failed to fetch products");
 return res.json();
};


// Create new product
export const createProduct = async (productData) => {
 const res = await fetch("http://localhost:8080/product/create", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(productData),
 });

 if (!res.ok) throw new Error("Failed to create product");
 return res.json();
};

// Read single product by id
export const fetchProductById = async (productId) => {
 const res = await fetch(`http://localhost:8080/product/read/${productId}`, {
  method: "GET",
  headers: { "Content-Type": "application/json" },
 });

 if (!res.ok) throw new Error("Failed to fetch product");
 return res.json();
};

// Update product
export const updateProduct = async (productData) => {
 const res = await fetch("http://localhost:8080/product/update", {
  method: "PUT",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(productData),
 });

 if (!res.ok) throw new Error("Failed to update product");
 return res.json();
};

export default api;
