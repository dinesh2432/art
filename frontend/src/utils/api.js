import axios from 'axios'
import toast from 'react-hot-toast'
import { API_BASE_URL, MESSAGES } from './constants'

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    // Show loading toast for non-GET requests
    if (config.method !== 'get') {
      config.metadata = { startTime: new Date() }
    }
    
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    const { response, request } = error
    
    if (!response) {
      // Network error
      toast.error(MESSAGES.ERROR.NETWORK)
    } else {
      // Server error
      const message = response.data?.message || MESSAGES.ERROR.GENERIC
      
      switch (response.status) {
        case 401:
          localStorage.removeItem('token')
          window.location.href = '/login'
          toast.error('Session expired. Please login again.')
          break
        case 403:
          toast.error('Access denied.')
          break
        case 404:
          toast.error('Resource not found.')
          break
        case 422:
          // Validation errors
          if (response.data?.errors) {
            const firstError = Object.values(response.data.errors)[0][0]
            toast.error(firstError)
          } else {
            toast.error(message)
          }
          break
        case 429:
          toast.error('Too many requests. Please try again later.')
          break
        case 500:
          toast.error('Server error. Please try again later.')
          break
        default:
          toast.error(message)
      }
    }
    
    return Promise.reject(error)
  }
)

// API methods
export const apiClient = {
  // Auth
  login: (credentials) => api.post('/auth/login', credentials),
  signup: (userData) => api.post('/auth/signup', userData),
  logout: () => api.post('/auth/logout'),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
  
  // Products
  getProducts: (params = {}) => api.get('/products', { params }),
  getProduct: (id) => api.get(`/products/${id}`),
  createProduct: (data) => api.post('/products', data),
  updateProduct: (id, data) => api.put(`/products/${id}`, data),
  deleteProduct: (id) => api.delete(`/products/${id}`),
  searchProducts: (query) => api.get(`/products/search?q=${query}`),
  
  // Sellers
  registerSeller: (data) => api.post('/sellers/register', data),
  updateSeller: (id, data) => api.put(`/sellers/${id}`, data),
  getSellers: (params = {}) => api.get('/sellers', { params }),
  getSeller: (id) => api.get(`/sellers/${id}`),
  verifyAadhar: (data) => api.post('/sellers/verify-aadhar', data),
  verifyOTP: (data) => api.post('/sellers/verify-otp', data),
  
  // Orders
  createOrder: (data) => api.post('/orders', data),
  getOrders: (params = {}) => api.get('/orders', { params }),
  getOrder: (id) => api.get(`/orders/${id}`),
  updateOrderStatus: (id, status) => api.put(`/orders/${id}/status`, { status }),
  
  // Collaborators
  getCollaborators: (params = {}) => api.get('/collaborators', { params }),
  connectCollaborator: (id) => api.post(`/collaborators/${id}/connect`),
  
  // Suppliers
  getSuppliers: (params = {}) => api.get('/suppliers', { params }),
  requestQuote: (data) => api.post('/suppliers/quote-request', data),
  
  // Reviews
  createReview: (productId, data) => api.post(`/products/${productId}/reviews`, data),
  getReviews: (productId) => api.get(`/products/${productId}/reviews`),
  
  // Wishlist
  addToWishlist: (productId) => api.post(`/wishlist/${productId}`),
  removeFromWishlist: (productId) => api.delete(`/wishlist/${productId}`),
  getWishlist: () => api.get('/wishlist'),
  
  // Cart
  addToCart: (data) => api.post('/cart', data),
  updateCartItem: (id, data) => api.put(`/cart/${id}`, data),
  removeFromCart: (id) => api.delete(`/cart/${id}`),
  getCart: () => api.get('/cart'),
  clearCart: () => api.delete('/cart'),
  
  // File upload
  uploadFile: (file, type = 'image') => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', type)
    
    return api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },
}

export default api
