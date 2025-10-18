import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080",
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // ensure cookies are included for session-based auth
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',
});

// Attach Authorization header automatically when a token is available
api.interceptors.request.use((config) => {
  try {
    const token = getToken();
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (e) {
    // ignore errors reading token
  }
  return config;
}, (error) => Promise.reject(error));

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
  try {
    // If productData is FormData (file upload), let axios/browser set the Content-Type
    if (typeof FormData !== 'undefined' && productData instanceof FormData) {
      const res = await api.post('/api/products/create', productData, {
        withCredentials: true,
        headers: {
          // let axios set multipart boundary
        }
      });
      return res.data;
    }

    // Otherwise send JSON
    const res = await api.post('/api/products/create', productData, {
      withCredentials: true,
      headers: { 'Content-Type': 'application/json' }
    });
    return res.data;
  } catch (err) {
    const status = err?.response?.status;
    // If server returns 403, attempt admin-scoped endpoint as a fallback
    if (status === 403) {
      try {
        if (typeof FormData !== 'undefined' && productData instanceof FormData) {
          const res2 = await api.post('/api/admin/products/create', productData, { withCredentials: true });
          return res2.data;
        } else {
          const res2 = await api.post('/api/admin/products/create', productData, { withCredentials: true, headers: { 'Content-Type': 'application/json' } });
          return res2.data;
        }
      } catch (err2) {
        // fall through to throw original error below
        console.error('Fallback to /api/admin/products/create failed', err2?.response?.status, err2?.response?.data);
      }
    }

    // Re-throw a cleaner error with status if available
    let message = err?.message || 'Create product failed';
    const data = err?.response?.data;
    if (data) {
      if (typeof data === 'string') message = data;
      else if (data.message) message = data.message;
      else message = JSON.stringify(data);
    }
    const e = new Error(message + (status ? ` (status ${status})` : ''));
    e.status = status;
    throw e;
  }
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
export const updateCustomer = async (customerData) => {
  const res = await api.put("/api/customer/update", customerData);
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

export const fetchOrdersByCustomerId = async (customerId) => {
  const res = await api.get("/api/order/getall");
  return res.data.filter(order => order.customer?.customerId === customerId);
};

export const fetchOrderDetails = async (orderId) => {
  const res = await api.get(`/api/order/read/${orderId}`);
  return res.data;
};

export const updateOrder = async (orderId, orderData) => {
  // Include the orderId in the data payload since backend expects it in the body
  const dataWithId = { ...orderData, orderId };
  const res = await api.put(`/api/order/update`, dataWithId);
  return res.data;
};

// Update only the status of an order (admin endpoint)
export const updateOrderStatus = async (orderId, status) => {
  const res = await api.patch(`/api/order/status/${orderId}`, { status });
  return res.data;
};

export const fetchOrderLineDetails = async (orderLineId) => {
  const res = await api.get(`/api/orderline/read/${orderLineId}`);
  return res.data;
};

// ----------------- ORDER LINES -----------------
export const createOrderLine = async (orderLineData) => {
  // Backend expects unitPrice; accept either `price` or `unitPrice` from callers
  const payload = { ...orderLineData };
  if (payload.unitPrice == null && payload.price != null) {
    payload.unitPrice = payload.price;
    delete payload.price; // avoid sending ambiguous field
  }
  const res = await api.post("/api/orderline/create", payload);
  return res.data;
};

// ----------------- ADMINS -----------------
export const loginAdmin = async (email, password) => {
  try {
    const res = await api.post(`/api/admin/login`, { email, password }, { withCredentials: true });
    return res.data;
  } catch (err) {
    // fallback to legacy query-param form
    try {
      const res2 = await api.post(`/api/admin/login?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`, null, { withCredentials: true });
      return res2.data;
    } catch (err2) {
      throw err2;
    }
  }
};

// ----------------- ADDRESSES -----------------
export const createAddress = async (addressData) => {
  const res = await api.post("/address/create", addressData);
  return res.data;
};

export const fetchAddressById = async (addressId) => {
  const res = await api.get(`/address/read/${addressId}`);
  return res.data;
};

// ----------------- REVIEWS -----------------
export const fetchAllReviews = async () => {
  const res = await api.get("/api/review/getall"); 
  return res.data;
};

export const createReview = async (reviewData) => {
  try {
    const res = await api.post("/api/review/create", reviewData);
    return res.data;
  } catch (err) {
    // Log helpful details for debugging (avoid leaking full payloads in production)
    const status = err?.response?.status;
    const data = err?.response?.data;
    const payloadSummary = Object.fromEntries(Object.entries(reviewData || {}).map(([k, v]) => [k, (v && (typeof v === 'object')) ? '[object]' : v]));
    console.error('createReview failed', { status, message: err?.message, payloadSummary });
    if (status === 500) {
      // include server response body for 500 errors to speed debugging (safe in dev)
      console.error('createReview server response (500):', data);
    } else {
      console.error('createReview response data:', data);
    }
    throw err;
  }
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
