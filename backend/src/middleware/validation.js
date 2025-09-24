const { body, param, query, validationResult } = require('express-validator')

// Handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req)
  
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().reduce((acc, error) => {
        acc[error.path] = error.msg
        return acc
      }, {})
    })
  }
  
  next()
}

// Common validation rules
const validationRules = {
  // User validation
  userSignup: [
    body('name')
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('Name must be between 2 and 50 characters'),
    
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email'),
    
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long'),
  ],

  userLogin: [
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email'),
    
    body('password')
      .notEmpty()
      .withMessage('Password is required'),
  ],

  // Seller validation
  sellerRegistration: [
    body('name')
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('Name must be between 2 and 50 characters'),
    
    body('age')
      .isInt({ min: 18, max: 100 })
      .withMessage('Age must be between 18 and 100'),
    
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email'),
    
    body('phoneNumber')
      .matches(/^\d{10}$/)
      .withMessage('Phone number must be 10 digits'),
    
    body('alternatePhoneNumber')
      .optional()
      .matches(/^\d{10}$/)
      .withMessage('Alternate phone number must be 10 digits'),
    
    body('address')
      .trim()
      .isLength({ min: 10, max: 200 })
      .withMessage('Address must be between 10 and 200 characters'),
    
    body('city')
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('City must be between 2 and 50 characters'),
    
    body('state')
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('State must be between 2 and 50 characters'),
    
    body('pincode')
      .matches(/^\d{6}$/)
      .withMessage('Pincode must be 6 digits'),
    
    body('productType')
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage('Product type must be between 2 and 100 characters'),
    
    body('experience')
      .trim()
      .isLength({ min: 1, max: 50 })
      .withMessage('Experience is required'),
  ],

  // Product validation
  productCreate: [
    body('name')
      .trim()
      .isLength({ min: 3, max: 100 })
      .withMessage('Product name must be between 3 and 100 characters'),
    
    body('description')
      .trim()
      .isLength({ min: 10, max: 1000 })
      .withMessage('Description must be between 10 and 1000 characters'),
    
    body('price')
      .isFloat({ min: 0.01 })
      .withMessage('Price must be a positive number'),
    
    body('category')
      .isIn(['pottery', 'woodwork', 'textiles', 'jewelry', 'metalwork', 'leather', 'glass', 'painting', 'sculpture'])
      .withMessage('Please select a valid category'),
    
    body('stockCount')
      .isInt({ min: 0 })
      .withMessage('Stock count must be a non-negative integer'),
  ],

  // Order validation
  orderCreate: [
    body('items')
      .isArray({ min: 1 })
      .withMessage('Order must contain at least one item'),
    
    body('items.*.productId')
      .notEmpty()
      .withMessage('Product ID is required'),
    
    body('items.*.quantity')
      .isInt({ min: 1 })
      .withMessage('Quantity must be at least 1'),
    
    body('shippingAddress.address')
      .trim()
      .isLength({ min: 10, max: 200 })
      .withMessage('Shipping address is required'),
    
    body('shippingAddress.city')
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('City is required'),
    
    body('shippingAddress.state')
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('State is required'),
    
    body('shippingAddress.pincode')
      .matches(/^\d{6}$/)
      .withMessage('Pincode must be 6 digits'),
  ],

  // Review validation
  reviewCreate: [
    body('rating')
      .isInt({ min: 1, max: 5 })
      .withMessage('Rating must be between 1 and 5'),
    
    body('comment')
      .trim()
      .isLength({ min: 5, max: 500 })
      .withMessage('Review comment must be between 5 and 500 characters'),
  ],

  // Aadhar validation
  aadharVerification: [
    body('aadharNumber')
      .matches(/^\d{12}$/)
      .withMessage('Aadhar number must be 12 digits'),
  ],

  // OTP validation
  otpVerification: [
    body('otp')
      .matches(/^\d{6}$/)
      .withMessage('OTP must be 6 digits'),
  ],

  // ID parameter validation
  mongoId: [
    param('id')
      .isLength({ min: 1 })
      .withMessage('Valid ID is required'),
  ],

  // Query validation
  paginationQuery: [
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page must be a positive integer'),
    
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit must be between 1 and 100'),
  ],

  searchQuery: [
    query('q')
      .optional()
      .trim()
      .isLength({ min: 1, max: 100 })
      .withMessage('Search query must be between 1 and 100 characters'),
  ],
}

module.exports = {
  validationRules,
  handleValidationErrors
}
