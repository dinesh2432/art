const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { getFirestore } = require('../services/firebaseService')
const emailService = require('../services/emailService')

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  })
}

const authController = {
  // Register user
  signup: async (req, res) => {
    try {
      const { name, email, password } = req.body
      const db = getFirestore()

      // Check if user already exists
      const existingUser = await db.collection('users')
        .where('email', '==', email)
        .get()

      if (!existingUser.empty) {
        return res.status(400).json({
          success: false,
          message: 'User with this email already exists'
        })
      }

      // Hash password
      const saltRounds = 12
      const hashedPassword = await bcrypt.hash(password, saltRounds)

      // Create user document
      const userData = {
        name,
        email,
        password: hashedPassword,
        userType: null, // Will be set when user chooses type
        isActive: true,
        isEmailVerified: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      const userRef = await db.collection('users').add(userData)
      const token = generateToken(userRef.id)

      // Send welcome email
      await emailService.sendWelcomeEmail(email, name)

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
          user: {
            id: userRef.id,
            name,
            email,
            userType: null,
            isActive: true
          },
          token
        }
      })
    } catch (error) {
      console.error('Signup error:', error)
      res.status(500).json({
        success: false,
        message: 'Failed to register user'
      })
    }
  },

  // Login user
  login: async (req, res) => {
    try {
      const { email, password } = req.body
      const db = getFirestore()

      // Find user by email
      const userQuery = await db.collection('users')
        .where('email', '==', email)
        .get()

      if (userQuery.empty) {
        return res.status(400).json({
          success: false,
          message: 'Invalid email or password'
        })
      }

      const userDoc = userQuery.docs[0]
      const userData = userDoc.data()

      // Check password
      const isPasswordValid = await bcrypt.compare(password, userData.password)
      
      if (!isPasswordValid) {
        return res.status(400).json({
          success: false,
          message: 'Invalid email or password'
        })
      }

      // Check if account is active
      if (!userData.isActive) {
        return res.status(400).json({
          success: false,
          message: 'Account is deactivated. Please contact support.'
        })
      }

      // Generate token
      const token = generateToken(userDoc.id)

      // Update last login
      await userDoc.ref.update({
        lastLogin: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })

      res.json({
        success: true,
        message: 'Login successful',
        data: {
          user: {
            id: userDoc.id,
            name: userData.name,
            email: userData.email,
            userType: userData.userType,
            isActive: userData.isActive
          },
          token
        }
      })
    } catch (error) {
      console.error('Login error:', error)
      res.status(500).json({
        success: false,
        message: 'Failed to login'
      })
    }
  },
    // Get user profile
  getProfile: async (req, res) => {
    try {
      const db = getFirestore()
      const userDoc = await db.collection('users').doc(req.user.id).get()

      if (!userDoc.exists) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        })
      }

      const userData = userDoc.data()
      
      // Remove password from response
      const { password, ...userProfile } = userData

      res.json({
        success: true,
        data: {
          user: {
            id: userDoc.id,
            ...userProfile
          }
        }
      })
    } catch (error) {
      console.error('Get profile error:', error)
      res.status(500).json({
        success: false,
        message: 'Failed to get user profile'
      })
    }
  },

  // Update user profile
  updateProfile: async (req, res) => {
    try {
      const { name, phone, address } = req.body
      const db = getFirestore()

      const updateData = {
        ...(name && { name }),
        ...(phone && { phone }),
        ...(address && { address }),
        updatedAt: new Date().toISOString()
      }

      await db.collection('users').doc(req.user.id).update(updateData)

      res.json({
        success: true,
        message: 'Profile updated successfully',
        data: updateData
      })
    } catch (error) {
      console.error('Update profile error:', error)
      res.status(500).json({
        success: false,
        message: 'Failed to update profile'
      })
    }
  },

  // Set user type (customer/seller)
  setUserType: async (req, res) => {
    try {
      const { userType } = req.body
      const db = getFirestore()

      if (!['customer', 'seller'].includes(userType)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid user type'
        })
      }

      await db.collection('users').doc(req.user.id).update({
        userType,
        updatedAt: new Date().toISOString()
      })

      res.json({
        success: true,
        message: 'User type updated successfully',
        data: { userType }
      })
    } catch (error) {
      console.error('Set user type error:', error)
      res.status(500).json({
        success: false,
        message: 'Failed to update user type'
      })
    }
  },

  // Logout user
  logout: async (req, res) => {
    try {
      // In a production app, you might want to blacklist the token
      // For now, we'll just return success
      res.json({
        success: true,
        message: 'Logout successful'
      })
    } catch (error) {
      console.error('Logout error:', error)
      res.status(500).json({
        success: false,
        message: 'Failed to logout'
      })
    }
  },

  // Change password
  changePassword: async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body
      const db = getFirestore()

      const userDoc = await db.collection('users').doc(req.user.id).get()
      const userData = userDoc.data()

      // Verify current password
      const isCurrentPasswordValid = await bcrypt.compare(currentPassword, userData.password)
      
      if (!isCurrentPasswordValid) {
        return res.status(400).json({
          success: false,
          message: 'Current password is incorrect'
        })
      }

      // Hash new password
      const saltRounds = 12
      const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds)

      // Update password
      await userDoc.ref.update({
        password: hashedNewPassword,
        updatedAt: new Date().toISOString()
      })

      res.json({
        success: true,
        message: 'Password changed successfully'
      })
    } catch (error) {
      console.error('Change password error:', error)
      res.status(500).json({
        success: false,
        message: 'Failed to change password'
      })
    }
  }
}

module.exports = authController
