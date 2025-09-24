import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './contexts/AuthContext'

// Import pages
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import UserTypePage from './pages/UserTypePage'
import CustomerDashboard from './pages/CustomerDashboard'
import SellerRegistration from './pages/SellerRegistration'
import SellerKYC from './pages/SellerKYC'
import SellerDashboard from './pages/SellerDashboard'
import ProductDetail from './pages/ProductDetail'
import LandingPage from './pages/LandingPage'

function App() {
  return (
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/user-type" element={<UserTypePage />} />
            <Route path="/customer/dashboard" element={<CustomerDashboard />} />
            <Route path="/seller/register" element={<SellerRegistration />} />
            <Route path="/seller/kyc" element={<SellerKYC />} />
            <Route path="/seller/dashboard" element={<SellerDashboard />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/landing" element={<LandingPage />} />
          </Routes>
        </div>
        <Toaster position="top-right" />
      </AuthProvider>
    </Router>
  )
}

export default App
