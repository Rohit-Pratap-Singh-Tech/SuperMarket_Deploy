// src/utils/auth.js

export const logout = () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('userRole')
    localStorage.removeItem('selectedRole')
    localStorage.removeItem('fullName')
    localStorage.removeItem('username')
    window.location.href = '/'
  }
  