import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Shield, CheckCircle } from 'lucide-react'

const SellerKYC = () => {
  const [aadharNumber, setAadharNumber] = useState('')
  const [otp, setOtp] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [otpTimer, setOtpTimer] = useState(0)
  
  const navigate = useNavigate()

  React.useEffect(() => {
    let interval = null
    if (otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer(timer => timer - 1)
      }, 1000)
    } else if (otpTimer === 0) {
      clearInterval(interval)
    }
    return () => clearInterval(interval)
  }, [otpTimer])

  const validateAadhar = (number) => {
    // Remove spaces and validate 12 digits
    const cleanNumber = number.replace(/\s/g, '')
    return /^\d{12}$/.test(cleanNumber)
  }

  const handleAadharChange = (e) => {
    let value = e.target.value.replace(/\D/g, '') // Remove non-digits
    
    // Limit to 12 digits
    if (value.length > 12) value = value.slice(0, 12)
    
    // Add spaces every 4 digits for display
    if (value.length > 0) {
      value = value.match(/.{1,4}/g)?.join(' ') || value
    }
    
    setAadharNumber(value)
    setError('')
  }

  const sendOTP = async () => {
    if (!validateAadhar(aadharNumber)) {
      setError('Please enter a valid 12-digit Aadhar number')
      return
    }

    setLoading(true)
    setError('')

    try {
      // Simulate API call to send OTP
      // In real implementation, this would call Aadhar verification API
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      setOtpSent(true)
      setOtpTimer(60) // 60 seconds countdown
    } catch (error) {
      setError('Failed to send OTP. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const verifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP')
      return
    }

    setLoading(true)
    setError('')

    try {
      // Simulate OTP verification
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // For demo purposes, accept any 6-digit OTP
      if (otp.length === 6) {
        navigate('/seller/dashboard')
      } else {
        setError('Invalid OTP. Please try again.')
      }
    } catch (error) {
      setError('Verification failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const resendOTP = () => {
    setOtp('')
    setOtpTimer(60)
    sendOTP()
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="mb-8">
          <button
            onClick={() => navigate('/seller/register')}
            className="flex items-center text-primary-600 hover:text-primary-700 mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </button>
          
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-4">
              <Shield className="w-8 h-8 text-primary-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Aadhar Verification</h1>
            <p className="text-gray-600">
              We need to verify your identity to ensure secure transactions
            </p>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          {!otpSent ? (
            /* Aadhar Number Input */
            <div className="space-y-4">
              <div>
                <label htmlFor="aadhar" className="block text-sm font-medium text-gray-700 mb-1">
                  Aadhar Number
                </label>
                <input
                  type="text"
                  id="aadhar"
                  value={aadharNumber}
                  onChange={handleAadharChange}
                  placeholder="XXXX XXXX XXXX"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-center text-lg tracking-wider"
                  maxLength="14" // 12 digits + 2 spaces
                />
                <p className="text-xs text-gray-500 mt-1">
                  Enter your 12-digit Aadhar number
                </p>
              </div>

              <div className="bg-blue-50 p-4 rounded-md">
                <div className="flex items-start">
                  <Shield className="w-5 h-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                  <div className="text-sm text-blue-800">
                    <p className="font-semibold mb-1">Your Privacy is Protected</p>
                    <ul className="space-y-1 text-xs">
                      <li>• We use secure encryption for all data transmission</li>
                      <li>• Your Aadhar details are only used for verification</li>
                      <li>• No personal information is stored permanently</li>
                    </ul>
                  </div>
                </div>
              </div>

              <button
                onClick={sendOTP}
                disabled={loading || !validateAadhar(aadharNumber)}
                className="w-full py-3 px-4 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
              >
                {loading ? 'Sending OTP...' : 'Send OTP'}
              </button>
            </div>
          ) : (
            /* OTP Verification */
            <div className="space-y-4">
              <div className="text-center mb-6">
                <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">
                  OTP sent to mobile number linked with Aadhar
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Aadhar: {aadharNumber}
                </p>
              </div>

              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">
                  Enter OTP
                </label>
                <input
                  type="text"
                  id="otp"
                  value={otp}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 6)
                    setOtp(value)
                    setError('')
                  }}
                  placeholder="XXXXXX"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-center text-lg tracking-wider"
                  maxLength="6"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Enter the 6-digit OTP sent to your mobile
                </p>
              </div>

              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">
                  {otpTimer > 0 ? `Resend OTP in ${otpTimer}s` : 'Didn\'t receive OTP?'}
                </span>
                {otpTimer === 0 && (
                  <button
                    onClick={resendOTP}
                    className="text-primary-600 hover:text-primary-700 font-medium"
                  >
                    Resend OTP
                  </button>
                )}
              </div>

              <button
                onClick={verifyOTP}
                disabled={loading || otp.length !== 6}
                className="w-full py-3 px-4 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
              >
                {loading ? 'Verifying...' : 'Verify & Complete Registration'}
              </button>

              <button
                onClick={() => {
                  setOtpSent(false)
                  setOtp('')
                  setError('')
                }}
                className="w-full py-2 px-4 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                Change Aadhar Number
              </button>
            </div>
          )}

          <div className="mt-6 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              By proceeding, you agree to our Terms of Service and Privacy Policy.
              This verification is required for secure transactions.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SellerKYC
