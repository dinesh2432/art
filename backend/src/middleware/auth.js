const jwt = require('jsonwebtoken')
const { getFirestore } = require('../services/firebaseService')

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    
    // Get user from Firestore
    const db = getFirestore()
    const userDoc = await db.collection('users').doc(decoded.userId).get()
    
    if (!userDoc.exists) {
      return res.status(401).json({
        success: false,
        message: 'Token is not valid.'
      })
    }

    req.user = {
      id: decoded.userId,
      ...userDoc.data()
    }
    
    next()
  } catch (error) {
    console.error('Auth middleware error:', error)
    res.status(401).json({
      success: false,
      message: 'Token is not valid.'
    })
  }
}

const optionalAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '')
    
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      const db = getFirestore()
      const userDoc = await db.collection('users').doc(decoded.userId).get()
      
      if (userDoc.exists) {
        req.user = {
          id: decoded.userId,
          ...userDoc.data()
        }
      }
    }
    
    next()
  } catch (error) {
    // Continue without user info if token is invalid
    next()
  }
}

const requireSeller = async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required.'
    })
  }

  if (req.user.userType !== 'seller') {
    return res.status(403).json({
      success: false,
      message: 'Seller access required.'
    })
  }

  next()
}

const requireCustomer = async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required.'
    })
  }

  if (req.user.userType !== 'customer') {
    return res.status(403).json({
      success: false,
      message: 'Customer access required.'
    })
  }

  next()
}

module.exports = {
  auth,
  optionalAuth,
  requireSeller,
  requireCustomer
}
