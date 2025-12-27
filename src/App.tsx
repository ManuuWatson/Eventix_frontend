// src/App.tsx
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import EventsPage from "./pages/EventsPage";
import EventDetailsPage from "./pages/EventDetailsPage";
import CheckoutPage from "./pages/CheckoutPage";
import MpesaPaymentPage from "./pages/MpesaPaymentPage";
import TicketConfirmationPage from "./pages/TicketConfirmationPage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import HostDashboard from "./pages/host/HostDashboard";
import UserDashboard from "./pages/user/UserDashboard";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { EventProvider } from "./context/EventContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import LoadingSpinner from "./components/layout/LoadingSpinner";

import ScrollToTop from "./components/common/ScrollToTop";

// ✅ App Layout: Provides consistent header/footer wrapper for most pages
const AppLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <ScrollToTop />
      <Header />
      <main className="flex-grow">
        {/* Outlet renders the matched child route component */}
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

// ✅ Redirect based on role: Used when a user visits a generic protected path like /dashboard
function RedirectBasedOnRole() {
  const { user, isAuthLoading } = useAuth();

  if (isAuthLoading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.user_type === "host") {
    return <Navigate to="/host/dashboard" replace />;
  }

  if (user.user_type === "user") {
    return <Navigate to="/user/dashboard" replace />;
  }

  return <Navigate to="/" replace />;
}

// ✅ App Content (Routes): This component waits for the AuthContext to finish loading before rendering the router
function AppContent() {
  const { isAuthLoading } = useAuth();

  // ⏳ IMPORTANT FIX: Prevent route rendering until AuthProvider has finished restoring session.
  if (isAuthLoading) {
    return <LoadingSpinner text="Initializing application..." />;
  }

  return (
    <Routes>
      <Route element={<AppLayout />}>
        {/* Public Routes */}
        <Route path="/" element={<EventsPage />} />
        <Route path="events/:eventId" element={<EventDetailsPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />

        {/* Protected Routes */}
        <Route
          path="checkout/:eventId"
          element={
            <ProtectedRoute>
              <CheckoutPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="payment/mpesa"
          element={
            <ProtectedRoute>
              <MpesaPaymentPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="confirmation/:ticketId"
          element={
            <ProtectedRoute>
              <TicketConfirmationPage />
            </ProtectedRoute>
          }
        />

        {/* Role-specific Dashboards */}
        <Route
          path="host/dashboard/*"
          element={
            <ProtectedRoute role="host">
              <HostDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="user/dashboard/*"
          element={
            <ProtectedRoute role="user">
              <UserDashboard />
            </ProtectedRoute>
          }
        />

        {/* Generic Dashboard Redirect */}
        <Route
          path="dashboard"
          element={
            <ProtectedRoute>
              <RedirectBasedOnRole />
            </ProtectedRoute>
          }
        />

        {/* Catch-all route for paths that don't match anything above */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

// ✅ Main App Wrapper: Provides Contexts and renders the content
export function App() {
  return (
    <AuthProvider>
      <EventProvider>
        {/* AppContent (the router) now has full access to AuthContext */}
        <AppContent />
      </EventProvider>
    </AuthProvider>
  );
}

export default App;
