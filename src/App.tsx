// App.tsx
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import EventsPage from "./pages/EventsPage";
import EventDetailsPage from "./pages/EventDetailsPage";
import CheckoutPage from "./pages/CheckoutPage";
import TicketConfirmationPage from "./pages/TicketConfirmationPage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import HostDashboard from "./pages/host/HostDashboard";
import UserDashboard from "./pages/user/UserDashboard";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { EventProvider } from "./context/EventContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";

// Layout component wrapping standard pages
const AppLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow">
        <Outlet />
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
          {/* Standard pages with header/footer */}
          <Route path="/*" element={<AppLayout />}>
            {/* Landing / Events */}
            <Route index element={<EventsPage />} />
            <Route path="events" element={<EventsPage />} />

            {/* Event Details & Checkout */}
            <Route path="events/:eventId" element={<EventDetailsPage />} />
            <Route path="checkout/:eventId" element={<CheckoutPage />} />
            <Route
              path="confirmation/:ticketId"
              element={<TicketConfirmationPage />}
            />

            {/* Authentication */}
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />

            {/* 🏠 Host Dashboard */}
            <Route
              path="host/dashboard/*"
              element={
                <ProtectedRoute role="host">
                  <HostDashboard />
                </ProtectedRoute>
              }
            />

            {/* 👤 User Dashboard */}
            <Route
              path="user-dashboard"
              element={
                <ProtectedRoute role="user">
                  <UserDashboard />
                </ProtectedRoute>
              }
            />

            {/* 🚀 Redirect based on user role */}
            <Route
              path="dashboard"
              element={
                <ProtectedRoute>
                  <RedirectBasedOnRole />
                </ProtectedRoute>
              }
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </EventProvider>
    </AuthProvider>
  );
}

// Redirect users after login based on role
function RedirectBasedOnRole() {
  const { user } = useAuth();

  if (user?.user_type === "host") return <Navigate to="/host/dashboard" replace />;
  if (user?.user_type === "user") return <Navigate to="/user-dashboard" replace />;

  return <Navigate to="/" replace />;
}

export default App;
