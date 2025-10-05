import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080",
  headers: {
    'Content-Type': 'application/json',
  },
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

export const createProduct = async (productData) => {
  const res = await api.post("/api/products/create", productData);
  return res.data;
};

export const updateProduct = async (productData) => {
  const res = await api.put(`/api/products/update/${productData.productId}`, productData);
  return res.data;
};

export const deleteProduct = async (productId) => {
  const res = await api.delete(`/api/products/delete/${productId}`);
  return res.data;
};

// ----------------- PAYMENTS -----------------
export const createPayment = async (paymentData) => {
  const res = await api.post("/api/payment/create", paymentData);
  return res.data;
};

// ----------------- CUSTOMERS -----------------
export const createCustomer = async (customerData) => {
  const res = await api.post("/api/customer/create", customerData);
  return res.data;
};

export const loginCustomer = async (email, password) => {
  // Backend controller uses @RequestParam String email, @RequestParam String password
  const res = await api.post(`/api/customer/login?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`);
  return res.data;
};

export const fetchAllCustomers = async () => {
  const res = await api.get("/api/customer/findAll");
  return res.data;
};

export const fetchCustomerById = async (customerId) => {
  const res = await api.get(`/api/customer/read/${customerId}`);
  return res.data;
};

// ----------------- ORDERS -----------------
export const createOrder = async (orderData) => {
  const res = await api.post("/api/order/create", orderData);
  return res.data;
};

export const fetchAllOrders = async () => {
  const res = await api.get("/api/order/getall");
  return res.data;
};

export const fetchOrdersByCustomer = async (email) => {
  const res = await api.get(`/api/orders/customer/${encodeURIComponent(email)}`);
  return res.data;
};

export const fetchOrderDetails = async (orderId) => {
  // Guard against invalid orderId values (undefined, 'undefined', null, non-numeric)
  if (!orderId) return null;
  const id = Number(orderId);
  if (!Number.isFinite(id) || id <= 0) return null;

  const res = await api.get(`/api/order/read/${id}`);
  return res.data;
};

export const updateOrder = async (orderId, orderData) => {
  // Include the orderId in the data payload since backend expects it in the body
  const dataWithId = { ...orderData, orderId };
  const res = await api.put(`/api/order/update`, dataWithId);
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

// ----------------- ADMINS -----------------
export const loginAdmin = async (email, password) => {
  // Admin controller might also use @RequestParam now
  const res = await api.post(`/api/admin/login?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`);
  return res.data;
};

// ----------------- ADDRESSES -----------------
export const createAddress = async (addressData) => {
  const res = await api.post("/address/create", addressData);
  return res.data;
};

export const fetchAddressById = async (addressId) => {
  const res = await api.get(`/address/${addressId}`);
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
