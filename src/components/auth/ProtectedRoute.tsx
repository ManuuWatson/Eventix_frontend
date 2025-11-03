import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
  role?: 'user' | 'host';
}

const ProtectedRoute = ({ children, role }: ProtectedRouteProps) => {
  // ✅ Use isAuthLoading from the context
  const { user, isAuthLoading } = useAuth(); 

  // ✅ Wait until authentication check is complete
  if (isAuthLoading) {
    return <p>Checking authentication...</p>; 
  }

  // If loading is done and there is no user, navigate to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check role if specified
  if (role && user.user_type !== role) {
    // If the role doesn't match, send them to the home page (EventsPage)
    return <Navigate to="/" replace />;
  }

  // Otherwise, render the children (HostDashboard or UserDashboard)
  return <>{children}</>;
};

export default ProtectedRoute;
