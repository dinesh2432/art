import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './contexts/AuthContext'
import Header from './components/common/Header'
import './styles/index.css'

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

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <main>
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
            </Routes>
          </main>
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
            }}
          />
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
