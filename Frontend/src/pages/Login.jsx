import React, { useState } from 'react'
import axios from 'axios'
import { useLocation } from 'react-router-dom'

// Enhanced modern theme
const THEME = {
  primary: '#2563eb',
  secondary: '#3b82f6',
  accent: '#6366f1',
  bgLight: '#f8fafc',
  bgDark: '#e2e8f0',
  white: '#ffffff',
  border: '#cbd5e1',
  shadow: 'rgba(37, 99, 235, 0.15)',
  icon: '#2563eb',
  muted: '#64748b',
}

const VALID_ROLES = ["Admin", "Manager", "Cashier", "Inventory Manager"]

const Login = () => {
  const selectedRole = localStorage.getItem("selectedRole") || ""
  const [userData, setData] = useState({ username:'', password:'' })
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const location = useLocation()

  const handleEdit = (e) => {
    setData({
      ...userData,
      [e.target.name]: e.target.value,
    })
    if (error) setError("") // Clear error when user starts typing
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)
  
    const trimmedData = {
      username: userData.username.trim(),
      password: userData.password.trim(),
    }
  
          if (trimmedData.password.length < 2) {
        setError("Password must be at least 2 characters")
        setIsLoading(false)
        return
      }
  
    try {
      const res = await axios.post('http://127.0.0.1:8000/users/login/', trimmedData)
  
            console.log('Server response:', res.data)
      console.log('Expected role:', localStorage.getItem("selectedRole"))
      console.log('Received role:', res.data.role)
      console.log('Role type:', typeof res.data.role)
      console.log('Role length:', res.data.role ? res.data.role.length : 'undefined')
      
      if (!VALID_ROLES.includes(res.data.role)) {
        setError(`Invalid role received from server: ${res.data.role}`)
        setIsLoading(false)
        return
      }

      const selectedRole = localStorage.getItem("selectedRole")
      if (selectedRole && res.data.role !== selectedRole) {
        setError(`Please enter ${selectedRole} credentials. You logged in as ${res.data.role}`)
        setIsLoading(false)
        return
      }
  
      localStorage.setItem("authToken", res.data.access)
      localStorage.setItem("refreshToken", res.data.refresh)
      localStorage.setItem("userRole", res.data.role)
      localStorage.setItem("fullName", res.data.full_name)
      localStorage.setItem("username", res.data.username)
      
      console.log('Stored in localStorage:', {
        authToken: !!res.data.access,
        userRole: res.data.role,
        fullName: res.data.full_name,
        username: res.data.username
      })
  
      if (res.data.role === "Admin") window.location.href = "/admin"
      else if (res.data.role === "Manager") window.location.href = "/manager"
      else if (res.data.role === "Cashier") window.location.href = "/cashier"
      else if (res.data.role === "Inventory Manager") window.location.href = "/inventory"
      else window.location.href = "/"
  
      setData({ username:'', password:'' })
    } catch (err) {
      console.error('Login error:', err)
      if (err.response) {
        // Server responded with error
        if (err.response.status === 401) {
          setError("Invalid username or password")
        } else if (err.response.status === 400) {
          setError(err.response.data.message || "Invalid request")
        } else {
          setError(`Server error: ${err.response.status}`)
        }
      } else if (err.request) {
        // Network error
        setError("Network error. Please check your connection.")
      } else {
        // Other error
        setError("An unexpected error occurred")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-4 sm:py-8 relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse delay-1000"></div>
        <div className="absolute -bottom-32 left-20 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse delay-2000"></div>
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 opacity-50" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%234f46e5' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}></div>

      {/* Back Button */}
      <div className="absolute top-8 left-8 z-20">
        <button
          onClick={() => window.history.back()}
          className="group flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm border border-white/30 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-slate-600 hover:text-slate-800"
        >
          <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/>
          </svg>
          <span className="font-semibold">Back</span>
        </button>
      </div>

      {/* Login card */}
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white/80 backdrop-blur-md shadow-2xl rounded-3xl p-8 border border-white/30 relative overflow-hidden">
          {/* Card Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-blue-50/50 rounded-3xl"></div>
          
          <div className="relative z-10">
            {/* Header */}
            <div className="flex flex-col items-center mb-8">
              <div className="relative mb-4">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur opacity-30"></div>
                <div className="relative bg-white rounded-2xl p-4 shadow-lg">
                  <img
                    alt="Store Management System Logo"
                    src="/logo.svg"
                    className="h-12 w-auto"
                  />
                </div>
              </div>
              
              <div className="text-center">
                <h3 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-blue-600 mb-2">
                  {selectedRole ? `Welcome, ${selectedRole}` : "Welcome Back"}
                </h3>
                <p className="text-slate-600 font-medium">
                  {selectedRole ? `Sign in to your ${selectedRole} dashboard` : "Sign in to your account"}
                </p>
              </div>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit} autoComplete="off">
              <div className="space-y-4">
                <div className="relative">
                  <label htmlFor="username" className="block text-sm font-bold mb-2 text-slate-700">
                    Username
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                      </svg>
                    </div>
                    <input
                      id="username"
                      name="username"
                      type="text"
                      required
                      autoComplete="username"
                      value={userData.username}
                      onChange={handleEdit}
                      placeholder="Enter your username"
                      className="block w-full pl-10 pr-4 py-3 text-slate-900 placeholder-slate-400 border border-slate-200 rounded-xl bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 shadow-sm hover:shadow-md"
                    />
                  </div>
                </div>

                <div className="relative">
                  <label htmlFor="password" className="block text-sm font-bold mb-2 text-slate-700">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                      </svg>
                    </div>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      autoComplete="current-password"
                      value={userData.password}
                      onChange={handleEdit}
                      placeholder="Enter your password"
                      className="block w-full pl-10 pr-4 py-3 text-slate-900 placeholder-slate-400 border border-slate-200 rounded-xl bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 shadow-sm hover:shadow-md"
                    />
                  </div>
                  <div className="flex justify-end mt-2">
                    <a href="#" className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors duration-300">
                      Forgot password?
                    </a>
                  </div>
                </div>
              </div>

              {error && (
                <div className="flex items-center p-4 bg-red-50 border border-red-200 rounded-xl">
                  <svg className="w-5 h-5 text-red-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  <p className="text-sm font-semibold text-red-700">{error}</p>
                </div>
              )}

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="group relative w-full flex justify-center items-center px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative flex items-center">
                    {isLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Signing in...
                      </>
                    ) : (
                      <>
                        Sign in
                        <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                        </svg>
                      </>
                    )}
                  </span>
                </button>
              </div>
            </form>

            <div className="mt-8 text-center">
              <p className="text-sm text-slate-500 font-medium">
                Secure authentication powered by{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 font-bold">
                  StoreMax
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-1/4 left-8 w-2 h-2 bg-blue-400 rounded-full animate-ping"></div>
      <div className="absolute top-1/3 right-12 w-3 h-3 bg-purple-400 rounded-full animate-ping delay-1000"></div>
      <div className="absolute bottom-1/4 left-1/4 w-1 h-1 bg-pink-400 rounded-full animate-ping delay-2000"></div>
    </div>
  )
}

export default Login
