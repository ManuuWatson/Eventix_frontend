// Updated App.tsx
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
// Removed 'React' import as it's not explicitly used in JSX scope in modern React/TS setups
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import EventsPage from "./pages/EventsPage";
import EventDetailsPage from "./pages/EventDetailsPage";
import CheckoutPage from "./pages/CheckoutPage";
import TicketConfirmationPage from "./pages/TicketConfirmationPage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import HostDashboard from "./pages/host/HostDashboard";
// Removed 'HostEventsList' and 'HostEventForm' imports as they are now handled by the HostDashboard route
import UserDashboard from "./pages/user/UserDashboard";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { EventProvider } from "./context/EventContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";

// A Layout Component to wrap all routes that use the standard header/footer layout
const AppLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow">
        <Outlet /> {/* This is where the nested routes will render */}
      </main>
      <Footer />
    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <EventProvider>
        <Routes>
          {/* Use the AppLayout for all standard pages */}
          {/* We use a path of "/" and a * fallback inside the layout itself for nested routes */}
          <Route path="/*" element={<AppLayout />}> 
            {/* 🌟 Landing Page — Public Events */}
            <Route index element={<EventsPage />} /> {/* Renders at / */}
            <Route path="events" element={<EventsPage />} />

            {/* 🎫 Public Event Details and Ticketing */}
            <Route path="events/:eventId" element={<EventDetailsPage />} />
            <Route path="checkout/:eventId" element={<CheckoutPage />} />
            <Route
              path="confirmation/:ticketId"
              element={<TicketConfirmationPage />}
            />

            {/* 🔐 Authentication */}
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />

            {/* 🏠 Host Dashboard (Main Entry) */}
            <Route
              path="host-dashboard/*" 
              element={
                <ProtectedRoute role="host">
                  <HostDashboard />
                </ProtectedRoute>
              }
            />
            {/* The specific routes for HostEventsList and HostEventForm are assumed to now be handled internally within the HostDashboard component's routing */}

            {/* 👤 User Dashboard */}
            <Route
              path="user-dashboard"
              element={
                <ProtectedRoute role="user">
                  <UserDashboard />
                </ProtectedRoute>
              }
            />

            {/* 🚀 Redirect User Based on Role */}
            <Route
              path="dashboard"
              element={
                <ProtectedRoute>
                  <RedirectBasedOnRole />
                </ProtectedRoute>
              }
            />

            {/* 🧭 Fallback for any path not matched within the layout */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
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
