import axios from 'axios'

// ── BASE URL ──────────────────────────────────────────────
const BASE = 'http://localhost:8080/api/v1'

const api = axios.create({
  baseURL: BASE,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
})

// ── REQUEST INTERCEPTOR ───────────────────────────────────
// Automatically attach JWT token to every request
api.interceptors.request.use(config => {
  // Admin token takes priority (for admin panel requests)
  const adminToken = sessionStorage.getItem('vv_admin_token')
  const userToken  = localStorage.getItem('vv_token')
  const token = adminToken || userToken
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`
  }
  return config
})

// ── RESPONSE INTERCEPTOR ─────────────────────────────────
// Auto logout if token is expired/invalid
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401 || err.response?.status === 403) {
      // Clear tokens and redirect to login if unauthorized
      localStorage.removeItem('vv_token')
      localStorage.removeItem('vv_current_user')
      sessionStorage.removeItem('vv_admin')
      sessionStorage.removeItem('vv_admin_token')
    }
    return Promise.reject(err)
  }
)

// ── PRODUCTS ──────────────────────────────────────────────
export const getProducts       = ()           => api.get('/products')
export const getProductsByCat  = (category)   => api.get(`/products?category=${category}`)
export const searchProducts    = (query)      => api.get(`/products?search=${query}`)
export const getProduct        = (id)         => api.get(`/products/${id}`)
export const addProduct        = (data)       => api.post('/products', data)
export const updateProduct     = (id, data)   => api.put(`/products/${id}`, data)
export const deleteProduct     = (id)         => api.delete(`/products/${id}`)
export const getLowStock       = ()           => api.get('/products/low-stock')

// ── ORDERS ────────────────────────────────────────────────
export const placeOrder        = (order)      => api.post('/orders', order)
export const getAllOrders       = ()           => api.get('/orders')
export const getOrdersByEmail  = (email)      => api.get(`/orders/my?email=${encodeURIComponent(email)}`)
export const getOrderById      = (id)         => api.get(`/orders/${id}`)
export const cancelOrder       = (id)         => api.put(`/orders/${id}/cancel`)
export const updateOrderStatus = (id, status) => api.put(`/orders/${id}/status`, { status })

// ── USERS ─────────────────────────────────────────────────
export const registerUser      = (data)       => api.post('/users/register', data)
export const loginUser         = (data)       => api.post('/users/login', data)
export const getUser           = (id)         => api.get(`/users/${id}`)
export const updateUser        = (id, data)   => api.put(`/users/${id}`, data)

// ── ADMIN ─────────────────────────────────────────────────
export const getAdminStats     = ()           => api.get('/admin/stats')
export const verifyAdmin       = (password)   => api.post('/admin/verify', { password })

export default api