
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080",
});

// ----------------- PRODUCTS -----------------
export const fetchProducts = async () => {
  const res = await api.get("/api/products/getall");
  return res.data;
};

export const fetchProductsByName = async (name) => {
  const res = await api.get(`/api/products/search?name=${encodeURIComponent(name)}`);
  return res.data;
};

// ----------------- ORDERS -----------------
export const createOrder = async (orderData) => {
  const res = await api.post("/api/order/create", orderData);
  return res.data;
};

export const fetchOrdersByCustomer = async (email) => {
  const res = await api.get(`/api/orders/customer/${encodeURIComponent(email)}`);
  return res.data;
};

export const fetchOrderDetails = async (orderId) => {
  const res = await api.get(`/api/order/${orderId}`);
  return res.data;
};

export const fetchOrderLineDetails = async (orderLineId) => {
  const res = await api.get(`/api/orderline/read/${orderLineId}`);
  return res.data;
};

// ----------------- ORDER LINES -----------------
export const createOrderLine = async (orderLineData) => {
  const res = await api.post("/api/orderline/create", orderLineData);
  return res.data;
};
// ----------------- ADDRESSES -----------------
export const createAddress = async (addressData) => {
  const res = await api.post("/api/address/create", addressData);
  return res.data;
};

export const fetchAddressById = async (addressId) => {
  const res = await api.get(`/api/address/${addressId}`);
  return res.data;
};

// ----------------- PAYMENTS -----------------
export const createPayment = async (paymentData) => {
  const res = await api.post("/payment/create", paymentData); // no /api if backend doesn’t have it
  return res.data;
};

// ----------------- CUSTOMERS -----------------
export const createCustomer = async (customerData) => {
  const res = await api.post("/api/customer/create", customerData);
  return res.data;
};

export const loginCustomer = async (email, password) => {
  const res = await api.post("/api/customer/login", { email, password });
  return res.data;
};

// ----------------- REVIEWS -----------------
export const fetchAllReviews = async () => {
  const res = await api.get("/review/getall"); 
  return res.data;
};

export const createReview = async (reviewData) => {
  const res = await api.post("/review/create", reviewData);
  return res.data;
};
// ----------------- ADMINS -----------------
export const createAdmin = async (adminData) => {
  const res = await api.post("/api/admin/create", adminData);
  return res.data;
};

export const loginAdmin = async (email, password) => {
  const res = await api.post("/api/admin/login", { email, password });
  return res.data;
};

// ----------------- CART PERSISTENCE -----------------
export const createCart = async (cartData) => {
  const res = await api.post("/api/cart/create", cartData);
  return res.data;
};

export const getCartFromBackend = async (customerId) => {
  const res = await api.get(`/api/cart/${customerId}`);
  return res.data;
};

export const updateCart = async (cartData) => {
  const res = await api.put("/api/cart/update", cartData);
  return res.data;
};

export const clearCartFromBackend = async (customerId) => {
  const res = await api.delete(`/api/cart/${customerId}`);
  return res.data;
};

export default api;
