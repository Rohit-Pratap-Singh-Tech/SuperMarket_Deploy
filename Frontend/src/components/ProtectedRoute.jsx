import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, requiredRole }) => {
  const authToken = localStorage.getItem("authToken");
  const userRole = localStorage.getItem("userRole");

  console.log("ProtectedRoute Debug:", {
    authToken: !!authToken,
    userRole,
    requiredRole,
    type: typeof requiredRole,
    userRoleType: typeof userRole,
    localStorage: {
      authToken: localStorage.getItem("authToken") ? "exists" : "missing",
      userRole: localStorage.getItem("userRole"),
      selectedRole: localStorage.getItem("selectedRole"),
      fullName: localStorage.getItem("fullName"),
      username: localStorage.getItem("username")
    }
  });

  if (!authToken) {
    console.log("No auth token, redirecting to home");
    return <Navigate to="/" replace />;
  }

  if (!userRole) {
    console.log("No user role found, redirecting to unauthorized");
    return <Navigate to="/unauthorized" replace />;
  }

  if (requiredRole) {
    let hasAccess = false;
    
    if (Array.isArray(requiredRole)) {
      // If requiredRole is an array, check if userRole is in the array
      hasAccess = requiredRole.includes(userRole);
      console.log(`Checking array access: ${userRole} in [${requiredRole.join(', ')}] = ${hasAccess}`);
    } else {
      // If requiredRole is a string, check exact match
      hasAccess = userRole === requiredRole;
      console.log(`Checking string access: ${userRole} === ${requiredRole} = ${hasAccess}`);
    }

    if (!hasAccess) {
      console.log(`Access denied: ${userRole} cannot access ${requiredRole}`);
      return <Navigate to="/unauthorized" replace />;
    }
  }

  console.log("Access granted, rendering component");
  return children;
};

export default ProtectedRoute;
