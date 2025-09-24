const express = require('express')
const { initializeFirebase } = require('./services/firebaseService')

const app = express()

// Initialize Firebase
initializeFirebase()

// Routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/products', require('./routes/products'))
app.use('/api/sellers', require('./routes/sellers'))
app.use('/api/orders', require('./routes/orders'))
app.use('/api/upload', require('./routes/upload'))
app.use('/api/collaborators', require('./routes/collaborators'))
app.use('/api/suppliers', require('./routes/suppliers'))

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  })
})

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err)
  
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  })
})

module.exports = app
