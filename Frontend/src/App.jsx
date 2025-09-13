import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import LandingPage from './pages/Landingpage.jsx'
import Login from './pages/Login'
import Signup from './pages/Signup'
import AdminDashboard from './pages/AdminDashboard.jsx'
import InventoryDashboard from './pages/InventoryDashboard.jsx'
import ManagerDashboard from './pages/ManagerDashboard.jsx'
import CashierDashboard from './pages/CashierDashboard.jsx'
import ProtectedRoute from './components/ProtectedRoute'
import Chatbot from './components/Chatbot.jsx'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />

        {/* Login can take ?role=Admin or ?role=Cashier */}
        <Route path="/login" element={<Login />} />

        {/* Only Admins can access signup */}
        <Route
          path="/signup"
          element={
            <ProtectedRoute requiredRole="Admin">
              <Signup />
            </ProtectedRoute>
          }
        />

        {/* Admin dashboard */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole="Admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Inventory dashboard - only Inventory Manager */}
        <Route
          path="/inventory"
          element={
            <ProtectedRoute requiredRole={["Inventory Manager", "Admin","Manager"]}>
              <InventoryDashboard />
            </ProtectedRoute>
          }
        />

        {/* Manager dashboard - only Manager */}
        <Route
          path="/manager"
          element={
            <ProtectedRoute requiredRole={["Manager", "Admin"]}>
              <ManagerDashboard />
            </ProtectedRoute>
          }
        />

        {/* Cashier dashboard - allow both Cashier and Admin */}
        <Route
          path="/cashier"
          element={
            <ProtectedRoute requiredRole={["Cashier", "Admin"]}>
              <CashierDashboard />
            </ProtectedRoute>
          }
        />

        {/* fallback for unauthorized users */}
        <Route path="/unauthorized" element={<h1>🚫 Access Denied</h1>} />
      </Routes>
      <Chatbot />
    </Router>
  )
}

export default App
