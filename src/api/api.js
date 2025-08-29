// Fetch all products
export const fetchProducts = async () => {
  const res = await api.get("/product/getall");
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

// Fetch all orders for a specific customer (by email or userId)
export const fetchOrdersByCustomer = async (email) => {
  // Adjust endpoint as per your backend (e.g., /api/orders/customer/{email})
  const res = await api.get(`/api/orders/customer/${encodeURIComponent(email)}`);
  return res.data;
};

// Fetch order details by orderId
export const fetchOrderDetails = async (orderId) => {
  // Adjust endpoint as per your backend (e.g., /api/orders/{orderId})
  const res = await api.get(`/api/orders/${orderId}`);
  return res.data;
};

export default api;
