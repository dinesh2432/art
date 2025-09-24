const express = require('express')
const authController = require('../controllers/authController')
const { auth } = require('../middleware/auth')
const { validationRules, handleValidationErrors } = require('../middleware/validation')

const router = express.Router()

// Public routes
router.post('/signup', 
  validationRules.userSignup,
  handleValidationErrors,
  authController.signup
)

router.post('/login', 
  validationRules.userLogin,
  handleValidationErrors,
  authController.login
)

// Protected routes
router.get('/profile', auth, authController.getProfile)

router.put('/profile', 
  auth,
  authController.updateProfile
)

router.post('/set-user-type', 
  auth,
  authController.setUserType
)

router.post('/logout', auth, authController.logout)

router.post('/change-password', 
  auth,
  authController.changePassword
)

module.exports = router
