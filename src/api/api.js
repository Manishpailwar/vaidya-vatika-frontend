import axios from 'axios'

// ── BASE URL ──────────────────────────────────────────────
const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1'

const api = axios.create({
  baseURL: BASE,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
})

// ── REQUEST INTERCEPTOR ───────────────────────────────────
api.interceptors.request.use(config => {
  const adminToken = sessionStorage.getItem('vv_admin_token')
  const userToken  = localStorage.getItem('vv_token')
  const token = adminToken || userToken
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`
  }
  return config
})

// ── RESPONSE INTERCEPTOR ─────────────────────────────────
// If token expires or is invalid (401/403), clear session and
// redirect to login with a message so user knows what happened.
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401 || err.response?.status === 403) {
      const wasLoggedIn = !!localStorage.getItem('vv_current_user')
      const wasAdmin    = !!sessionStorage.getItem('vv_admin')

      // Clear all session data
      localStorage.removeItem('vv_token')
      localStorage.removeItem('vv_current_user')
      sessionStorage.removeItem('vv_admin')
      sessionStorage.removeItem('vv_admin_token')

      // Notify navbar to update
      window.dispatchEvent(new Event('userUpdated'))

      // Redirect with message — only if it was an authenticated session
      if (wasAdmin && !window.location.pathname.includes('/admin/login')) {
        window.location.href = '/admin/login?reason=expired'
      } else if (wasLoggedIn && !window.location.pathname.includes('/login')) {
        window.location.href = '/login?reason=expired'
      }
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
export const getMyOrders       = ()           => api.get('/orders/my')
export const getOrdersByEmail  = ()           => api.get('/orders/my')
export const getOrderById      = (id)         => api.get(`/orders/${id}`)
export const cancelOrder       = (id)         => api.put(`/orders/${id}/cancel`)
export const updateOrderStatus = (id, status) => api.put(`/orders/${id}/status`, { status })

// ── USERS ─────────────────────────────────────────────────
export const registerUser       = (data)       => api.post('/users/register', data)
export const loginUser          = (data)       => api.post('/users/login', data)
export const getUser            = (id)         => api.get(`/users/${id}`)
export const updateUser         = (id, data)   => api.put(`/users/${id}`, data)
export const resendVerification = (email)      => api.post('/users/resend-verification', { email })
export const forgotPassword     = (email)      => api.post('/users/forgot-password', { email })
export const resetPassword      = (token, newPassword) => api.post('/users/reset-password', { token, newPassword })

// ── COUPONS ───────────────────────────────────────────
export const validateCoupon   = (code, orderAmount) => api.post('/coupons/validate', { code, orderAmount })
export const getAdminCoupons  = ()                  => api.get('/coupons')
export const createCoupon     = (data)              => api.post('/coupons', data)
export const toggleCoupon     = (id)                => api.put(`/coupons/${id}/toggle`)
export const deleteCoupon     = (id)                => api.delete(`/coupons/${id}`)

// ── REVIEWS ───────────────────────────────────────────
export const getReviews       = (productId)         => api.get(`/reviews/product/${productId}`)
export const getReviewSummary = (productId)         => api.get(`/reviews/product/${productId}/summary`)
export const addReview        = (productId, data)   => api.post(`/reviews/product/${productId}`, data)
export const deleteReview     = (id)                => api.delete(`/reviews/${id}`)

// ── ADMIN ─────────────────────────────────────────────────
export const getAdminStats     = ()           => api.get('/admin/stats')
export const verifyAdmin       = (password)   => api.post('/admin/verify', { password })
export const verifyAdminToken  = ()           => api.get('/admin/verify-token')

export default api