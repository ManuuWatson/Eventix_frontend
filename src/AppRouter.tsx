import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import App from "./App";
import ProtectedRoute from "./components/auth/ProtectedRoute";

/* Public pages */
import EventsPage from "./pages/EventsPage";
import EventDetailsPage from "./pages/EventDetailsPage";
import CheckoutPage from "./pages/CheckoutPage";
import TicketConfirmationPage from "./pages/TicketConfirmationPage";

/* Auth pages */
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";

/* Dashboards */
import UserDashboard from "./pages/user/UserDashboard";
import HostDashboard from "./pages/host/HostDashboard";

export function AppRouter() {
  return (
    <Routes>
      {/* Home */}
      <Route path="/" element={<App />} />

      {/* Public routes */}
      <Route path="/events" element={<EventsPage />} />
      <Route path="/event/:id" element={<EventDetailsPage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/confirmation" element={<TicketConfirmationPage />} />

      {/* Auth routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Protected routes */}
      <Route
        path="/user-dashboard"
        element={
          <ProtectedRoute role="user">
            <UserDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/host-dashboard/*"
        element={
          <ProtectedRoute role="host">
            <HostDashboard />
          </ProtectedRoute>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRouter;
