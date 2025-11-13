// src/components/auth/ProtectedRoute.tsx
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
// Ensure you have a LoadingSpinner component
import LoadingSpinner from "../layout/LoadingSpinner"; 

interface ProtectedRouteProps {
  children: React.ReactNode;
  role?: "user" | "host";
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, role }) => {
  const { user, isAuthLoading } = useAuth();
  const location = useLocation();

  // 🕓 Wait until AuthContext finishes loading
  if (isAuthLoading) {
    // This blocks rendering until the async check is done.
    return <LoadingSpinner text="Checking authentication..." />;
  }

  // 🚪 If no user after loading, redirect to login
  if (!user) {
    // Redirect to login, storing the current location in state
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // ⚙️ Role-based restriction
  if (role && user.user_type !== role) {
    // Determine the correct dashboard path based on their *actual* role
    const redirectPath = user.user_type === "host" ? "/host/dashboard" : "/user/dashboard";
    
    // Redirect to their assigned dashboard if they try to access the wrong role's page
    return <Navigate to={redirectPath} replace />;
  }

  // ✅ Access granted: render the children components
  return <>{children}</>;
};

export default ProtectedRoute;
