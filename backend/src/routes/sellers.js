const express = require('express')
const sellerController = require('../controllers/sellerController')
const { auth, requireSeller } = require('../middleware/auth')
const { uploadSingle } = require('../middleware/upload')
const { validationRules, handleValidationErrors } = require('../middleware/validation')

const router = express.Router()

// Public routes
router.get('/', sellerController.getSellers)
router.get('/:id', sellerController.getSeller)

// Protected routes
router.post('/register',
  auth,
  uploadSingle('image'),
  validationRules.sellerRegistration,
  handleValidationErrors,
  sellerController.registerSeller
)

router.post('/verify-aadhar',
  auth,
  validationRules.aadharVerification,
  handleValidationErrors,
  sellerController.verifyAadhar
)

router.post('/verify-otp',
  auth,
  validationRules.otpVerification,
  handleValidationErrors,
  sellerController.verifyOTP
)

router.put('/profile',
  auth,
  requireSeller,
  uploadSingle('image'),
  sellerController.updateSellerProfile
)

router.get('/dashboard/stats',
  auth,
  requireSeller,
  sellerController.getDashboardStats
)

module.exports = router
