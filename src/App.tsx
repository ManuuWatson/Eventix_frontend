import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import EventsPage from "./pages/EventsPage";
import EventDetailsPage from "./pages/EventDetailsPage";
import CheckoutPage from "./pages/CheckoutPage";
import TicketConfirmationPage from "./pages/TicketConfirmationPage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import HostDashboard from "./pages/host/HostDashboard";
import HostEventsList from "./pages/host/HostEventsList";
import HostEventForm from "./pages/host/HostEventForm";
import UserDashboard from "./pages/user/UserDashboard";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { EventProvider } from "./context/EventContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";

export function App() {
  return (
    <AuthProvider>
      <EventProvider>
        <div className="flex flex-col min-h-screen bg-gray-50">
          <Header />
          <main className="flex-grow">
            <Routes>
              {/* 🌟 Landing Page — Public Events */}
              <Route path="/" element={<EventsPage />} />

              {/* 🎫 Public Event Details and Ticketing */}
              <Route path="/events/:eventId" element={<EventDetailsPage />} />
              <Route path="/checkout/:eventId" element={<CheckoutPage />} />
              <Route
                path="/confirmation/:ticketId"
                element={<TicketConfirmationPage />}
              />

              {/* 🔐 Authentication */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* 🏠 Host Dashboard (Main Entry) */}
              <Route
                path="/host-dashboard/*"
                element={
                  <ProtectedRoute role="host">
                    <HostDashboard />
                  </ProtectedRoute>
                }
              />

              {/* 🎟️ Host Event Management */}
              <Route
                path="/host-dashboard/events"
                element={
                  <ProtectedRoute role="host">
                    <HostEventsList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/host-dashboard/events/new"
                element={
                  <ProtectedRoute role="host">
                    <HostEventForm />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/host-dashboard/events/edit/:eventId"
                element={
                  <ProtectedRoute role="host">
                    <HostEventForm />
                  </ProtectedRoute>
                }
              />
              {/* If you later add a “view event details” for hosts, add here */}

              {/* 👤 User Dashboard */}
              <Route
                path="/user-dashboard"
                element={
                  <ProtectedRoute role="user">
                    <UserDashboard />
                  </ProtectedRoute>
                }
              />

              {/* 🚀 Redirect User Based on Role */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <RedirectBasedOnRole />
                  </ProtectedRoute>
                }
              />

              {/* 🧭 Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </EventProvider>
    </AuthProvider>
  );
}

function RedirectBasedOnRole() {
  const { user } = useAuth();

  if (user?.user_type === "host")
    return <Navigate to="/host-dashboard/events" replace />;
  if (user?.user_type === "user")
    return <Navigate to="/user-dashboard" replace />;

  return <Navigate to="/" replace />;
}

export default App;
