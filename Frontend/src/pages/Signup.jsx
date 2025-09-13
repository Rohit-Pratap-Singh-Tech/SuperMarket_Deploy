import React, { useState, useEffect } from 'react'
import axios from 'axios'

const THEME = {
  primary: '#3B5BA5',
  secondary: '#6C8BC7',
  accent: '#4F46E5',
  bgLight: '#F6F8FB',
  bgDark: '#E3EAF6',
  white: '#FFFFFF',
  border: '#D1D9E6',
  shadow: 'rgba(60, 90, 150, 0.10)',
  icon: '#3B5BA5',
  muted: '#7B8CA7',
}

const Signup = () => {
  const [userData, setUserData] = useState({
    full_name: '',
    username: '',
    role: '',
    password: '',
    confirm_password: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Admin-only guard
  useEffect(() => {
    const token = localStorage.getItem("authToken")
    const role = localStorage.getItem("userRole")
    if (!token || role !== "Admin") {
      window.location.href = "/login"
    }
  }, [])

  const handleChange = (e) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value,
    })
    setError('')
    setSuccess('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    // Trim all values before sending
    const trimmedData = {
      ...userData,
      full_name: userData.full_name.trim(),
      username: userData.username.trim(),
      role: userData.role.trim(),
      password: userData.password.trim(),
      confirm_password: userData.confirm_password.trim()
    }

    if (trimmedData.password !== trimmedData.confirm_password) {
      setError("Passwords do not match.")
      return
    }

    // Optional: enforce minimum password length
    if (trimmedData.password.length < 8) {
      setError("Password must be at least 8 characters long.")
      return
    }

    if (!trimmedData.role) {
      setError("Please select a role.")
      return
    }

    setLoading(true)

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/users/register/",
        trimmedData
      )
      setSuccess("Account created successfully! 🎉")
      setUserData({
        full_name: '',
        username: '',
        role: '',
        password: '',
        confirm_password: ''
      })
      console.log("Server response:", response.data)

    } catch (err) {
      if (err.response) {
        setError(`Error ${err.response.status}: ${err.response.data?.message || 'Server error'}`)
      } else if (err.request) {
        setError("No response from server. Is it running?")
      } else {
        setError(`Error: ${err.message}`)
      }
    }

    setLoading(false)
  }

  return (
    <div
      className="min-h-screen w-full flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-4 sm:py-8 relative overflow-hidden"
      style={{
        fontSize: '1.08rem',
        background: `linear-gradient(120deg, ${THEME.bgLight} 0%, ${THEME.white} 60%, ${THEME.bgDark} 100%)`,
        minHeight: '100vh',
      }}
    >
      <div className="w-full max-w-sm sm:max-w-md shadow-2xl rounded-2xl p-6 sm:p-8 border backdrop-blur-md"
        style={{
          background: `linear-gradient(120deg, ${THEME.white} 80%, ${THEME.bgLight} 100%)`,
          borderColor: THEME.border,
          boxShadow: `0 8px 32px 0 ${THEME.shadow}`,
        }}>
        <div className="flex flex-col items-center">
          <img alt="Store Management System Logo" src="/logo.svg" className="h-16 sm:h-20 w-auto mb-3"
            style={{ filter: `drop-shadow(0 4px 16px ${THEME.accent}33)` }} />
          <h3 className="text-base sm:text-lg font-bold tracking-tight text-center mb-2"
            style={{ color: THEME.primary, letterSpacing: '0.01em' }}>
            Create Staff Account
          </h3>
          <span className="text-xs font-medium px-3 py-1 rounded-full mb-4 shadow-sm"
            style={{
              color: THEME.primary,
              background: THEME.bgLight,
              border: `1px solid ${THEME.border}`,
              letterSpacing: '0.03em'
            }}>
            Admin Only
          </span>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit} autoComplete="off">
          {/* Full Name */}
          <div>
            <label htmlFor="full_name" className="block text-xs font-semibold mb-1" style={{ color: THEME.primary }}>
              Full Name
            </label>
            <input
              id="full_name"
              name="full_name"
              type="text"
              required
              value={userData.full_name}
              onChange={handleChange}
              placeholder="Enter your full name"
              className="block w-full rounded-lg px-3 py-2 text-sm sm:text-base placeholder-gray-400 transition"
              style={{
                border: `1.5px solid ${THEME.border}`,
                background: THEME.white,
                color: THEME.primary,
                boxShadow: `0 1px 4px 0 ${THEME.shadow}`,
                outline: 'none'
              }}
            />
          </div>

          {/* Username */}
          <div>
            <label htmlFor="username" className="block text-xs font-semibold mb-1" style={{ color: THEME.primary }}>
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              required
              value={userData.username}
              onChange={handleChange}
              placeholder="Choose a username"
              className="block w-full rounded-lg px-3 py-2 text-sm sm:text-base placeholder-gray-400 transition"
              style={{
                border: `1.5px solid ${THEME.border}`,
                background: THEME.white,
                color: THEME.primary,
                boxShadow: `0 1px 4px 0 ${THEME.shadow}`,
                outline: 'none'
              }}
            />
          </div>

          {/* Role */}
          <div>
            <label htmlFor="role" className="block text-xs font-semibold mb-1" style={{ color: THEME.primary }}>
              Role
            </label>
            <select
              id="role"
              name="role"
              required
              value={userData.role}
              onChange={handleChange}
              className="block w-full rounded-lg px-3 py-2 text-sm sm:text-base transition"
              style={{
                border: `1.5px solid ${THEME.border}`,
                background: THEME.white,
                color: THEME.primary,
                boxShadow: `0 1px 4px 0 ${THEME.shadow}`,
                outline: 'none'
              }}
            >
              <option value="">Select a role</option>
              <option value="Manager">Manager</option>
              <option value="Cashier">Cashier</option>
              <option value="Inventory Manager">Inventory Manager</option>
            </select>
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-xs font-semibold mb-1" style={{ color: THEME.primary }}>
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={userData.password}
              onChange={handleChange}
              placeholder="Create a password"
              className="block w-full rounded-lg px-3 py-2 text-sm sm:text-base placeholder-gray-400 transition"
              style={{
                border: `1.5px solid ${THEME.border}`,
                background: THEME.white,
                color: THEME.primary,
                boxShadow: `0 1px 4px 0 ${THEME.shadow}`,
                outline: 'none'
              }}
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirm_password" className="block text-xs font-semibold mb-1" style={{ color: THEME.primary }}>
              Confirm Password
            </label>
            <input
              id="confirm_password"
              name="confirm_password"
              type="password"
              required
              value={userData.confirm_password}
              onChange={handleChange}
              placeholder="Re-enter your password"
              className="block w-full rounded-lg px-3 py-2 text-sm sm:text-base placeholder-gray-400 transition"
              style={{
                border: `1.5px solid ${THEME.border}`,
                background: THEME.white,
                color: THEME.primary,
                boxShadow: `0 1px 4px 0 ${THEME.shadow}`,
                outline: 'none'
              }}
            />
          </div>

          {/* Error/Success */}
          {error && (
            <div className="rounded-lg px-3 py-2 text-xs sm:text-sm text-center"
              style={{ background: '#FEE2E2', border: '1px solid #FCA5A5', color: '#B91C1C' }}>
              {error}
            </div>
          )}
          {success && (
            <div className="rounded-lg px-3 py-2 text-xs sm:text-sm text-center"
              style={{ background: '#D1FAE5', border: '1px solid #6EE7B7', color: '#047857' }}>
              {success}
            </div>
          )}

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className="flex w-full justify-center rounded-lg px-3 py-2 text-sm sm:text-base font-semibold text-white shadow-lg transition"
              style={{
                background: `linear-gradient(90deg, ${THEME.primary} 0%, ${THEME.secondary} 100%)`,
                opacity: loading ? 0.6 : 1,
                cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: `0 2px 8px 0 ${THEME.shadow}`,
                border: 'none'
              }}
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Signup
