import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080", 
});

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
  const res = await api.post("/payment/create", paymentData);
  return res.data;
};

// ----------------- PRODUCTS -----------------
export const fetchProducts = async () => {
  const res = await api.get("/api/products/getall");
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

export default api;
