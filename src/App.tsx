import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import EventsPage from './pages/EventsPage';
import EventDetailsPage from './pages/EventDetailsPage';
import CheckoutPage from './pages/CheckoutPage';
import TicketConfirmationPage from './pages/TicketConfirmationPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import HostDashboard from './pages/host/HostDashboard';
import HostEventsList from './pages/host/HostEventsList';
import UserDashboard from './pages/user/UserDashboard';
import { AuthProvider, useAuth } from './context/AuthContext';
import { EventProvider } from './context/EventContext';
import ProtectedRoute from './components/auth/ProtectedRoute';

export function App() {
  return (
    <AuthProvider>
      <EventProvider>
        <div className="flex flex-col min-h-screen bg-gray-50">
          <Header />
          <main className="flex-grow">
            <Routes>
              {/* 🌟 Landing Page — EventsPage */}
              <Route path="/" element={<EventsPage />} />

              {/* 🎫 Public Pages */}
              <Route path="/events/:eventId" element={<EventDetailsPage />} />
              <Route path="/checkout/:eventId" element={<CheckoutPage />} />
              <Route path="/confirmation/:ticketId" element={<TicketConfirmationPage />} />

              {/* 🔐 Authentication */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* 🏠 Dashboards */}
              <Route
                path="/host-dashboard/*"
                element={
                  <ProtectedRoute role="host">
                    <HostDashboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/user-dashboard/*"
                element={
                  <ProtectedRoute role="user">
                    <UserDashboard />
                  </ProtectedRoute>
                }
              />

              {/* 📅 Host Events List */}
              <Route
                path="/host/events"
                element={
                  <ProtectedRoute role="host">
                    <HostEventsList />
                  </ProtectedRoute>
                }
              />

              {/* 🚀 Auto Redirect Based on Role */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <RedirectBasedOnRole />
                  </ProtectedRoute>
                }
              />

              {/* 🧭 Fallback */}
              <Route path="*" element={<Navigate to="/" />} />
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

  if (!user) return <Navigate to="/login" replace />;

  if (user.user_type === 'host') return <Navigate to="/host-dashboard" replace />;
  if (user.user_type === 'user') return <Navigate to="/user-dashboard" replace />;

  return <Navigate to="/" replace />;
}

export default App;
