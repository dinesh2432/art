export const API_BASE_URL = 'https://art-1t0x.onrender.com' || 'http://localhost:5000/api'

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  USER_TYPE: '/user-type',
  CUSTOMER_DASHBOARD: '/customer/dashboard',
  SELLER_REGISTER: '/seller/register',
  SELLER_KYC: '/seller/kyc',
  SELLER_DASHBOARD: '/seller/dashboard',
  PRODUCT_DETAIL: '/product/:id'
}

export const USER_TYPES = {
  CUSTOMER: 'customer',
  SELLER: 'seller'
}

export const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled'
}

export const PRODUCT_CATEGORIES = [
  'all',
  'pottery',
  'woodwork',
  'textiles',
  'jewelry',
  'metalwork',
  'leather',
  'glass',
  'painting',
  'sculpture'
]

export const VALIDATION_RULES = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^\d{10}$/,
  PINCODE: /^\d{6}$/,
  AADHAR: /^\d{12}$/
}

export const FILE_TYPES = {
  IMAGES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  MAX_SIZE: 10 * 1024 * 1024 // 10MB
}

export const MESSAGES = {
  SUCCESS: {
    LOGIN: 'Login successful!',
    SIGNUP: 'Account created successfully!',
    PROFILE_UPDATE: 'Profile updated successfully!',
    PRODUCT_ADDED: 'Product added to cart!',
    ORDER_PLACED: 'Order placed successfully!'
  },
  ERROR: {
    GENERIC: 'Something went wrong. Please try again.',
    NETWORK: 'Network error. Please check your connection.',
    INVALID_CREDENTIALS: 'Invalid email or password.',
    EMAIL_EXISTS: 'An account with this email already exists.',
    REQUIRED_FIELD: 'This field is required.',
    INVALID_EMAIL: 'Please enter a valid email address.',
    INVALID_PHONE: 'Please enter a valid 10-digit phone number.',
    INVALID_PINCODE: 'Please enter a valid 6-digit pincode.',
    PASSWORD_MISMATCH: 'Passwords do not match.',
    FILE_SIZE: 'File size should be less than 10MB.',
    FILE_TYPE: 'Only image files are allowed.'
  }
}
