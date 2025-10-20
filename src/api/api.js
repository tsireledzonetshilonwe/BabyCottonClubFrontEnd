// javascript
import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8080",
    headers: {
        'Content-Type': 'application/json',
    },
  baseURL: "http://localhost:8080",
  headers: {
    'Content-Type': 'application/json',
  },

});

// Add request interceptor to automatically include JWT token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers = config.headers || {};
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor to handle 401/403 errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401 || error.response?.status === 403) {
            console.warn('⚠️ Authentication failed. Token may be invalid or expired.');

            // Check if this is not a login request
            const isLoginRequest = error.config?.url?.includes('/login');
            if (!isLoginRequest) {
                // Clear invalid token and admin data
                localStorage.removeItem('token');
                
                // Check if this was an admin request (admin routes typically include /admin/)
                const isAdminRequest = error.config?.url?.includes('/admin') || 
                                      window.location.pathname.includes('/admin');
                
                if (isAdminRequest) {
                    localStorage.removeItem('admin');
                    console.warn('🔐 Admin session expired. Redirecting to admin login...');
                    // Only redirect if we're on an admin page
                    if (window.location.pathname.includes('/admin') && 
                        !window.location.pathname.includes('/admin/login')) {
                        window.location.href = '/admin/login';
                    }
                }
            }
        }
        return Promise.reject(error);
    }
);

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
  // Admin-only: check for admin role
  const admin = JSON.parse(localStorage.getItem('admin') || '{}');
  if (!admin || !admin.adminId) {
    throw new Error('Admin authentication required');
  }
  const res = await api.post("/api/products/create", productData);
  return res.data;
};

export const updateProduct = async (productData) => {
  // Admin-only: check for admin role
  const admin = JSON.parse(localStorage.getItem('admin') || '{}');
  if (!admin || !admin.adminId) {
    throw new Error('Admin authentication required');
  }
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
  // Customer-only: check for customer role
  const customer = JSON.parse(localStorage.getItem('customer') || '{}');
  if (!customer || !customer.customerId) {
    throw new Error('Customer authentication required');
  }
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
    const res = await api.put("/api/order/update", dataWithId);
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
    // Backend expects unitPrice; accept either price or unitPrice from callers
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
    const res = await api.get(`/address/read/${addressId}`);
    return res.data;
};

// ----------------- REVIEWS -----------------
export const fetchAllReviews = async () => {
    const res = await api.get("/api/review/getall");
    return res.data;
};

export const createReview = async (reviewData) => {
  // Customer-only: check for customer role
  const customer = JSON.parse(localStorage.getItem('customer') || '{}');
  if (!customer || !customer.customerId) {
    throw new Error('Customer authentication required');
  }
  try {
    const res = await api.post("/api/review/create", reviewData);
    return res.data;
  } catch (err) {
    // Keep logging minimal and let the caller decide how to present errors to users
    console.error('createReview failed:', err?.message || err);
    throw err;
  }
};

// ----------------- CART PERSISTENCE -----------------
export const createCart = async (cartData) => {
  // Customer-only: check for customer role
  const customer = JSON.parse(localStorage.getItem('customer') || '{}');
  if (!customer || !customer.customerId) {
    throw new Error('Customer authentication required');
  }
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

// ----------------- ALERTS / SUBSCRIPTIONS -----------------
export const subscribeToAlerts = async (email) => {
    // Expects backend endpoint that accepts { email }
    const res = await api.post('/api/alerts/subscribe', { email });
    return res.data;
};


export default api;
