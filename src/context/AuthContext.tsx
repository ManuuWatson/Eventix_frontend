import React, { useEffect, useState, createContext, useContext, ReactNode } from 'react';
// import { useNavigate } from 'react-router-dom'; // Removed useNavigate from context

interface User {
  email: string;
  name: string; // Note: 'name' seems redundant with 'full_name' in your register function, but kept for type match.
  full_name: string;
  id: string | number;
  user_type: 'user' | 'host';
  // token is no longer part of the User object itself, but stored separately
}

interface AuthContextType {
  user: User | null;
  authToken: string | null; // Renamed from 'token' to 'authToken' for consistency
  login: (email: string, password: string) => Promise<void>;
  register: (full_name: string, email: string, password: string, user_type: 'user' | 'host') => Promise<void>;
  logout: () => void;
  isLoading: boolean; // For tracking login/register action status
  isAuthLoading: boolean; // For initial auth check status
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null); // Renamed state variable
  const [isLoading, setIsLoading] = useState(false); // Action loading (login/register)
  const [isAuthLoading, setIsAuthLoading] = useState(true); // Initial authentication loading
  const [error, setError] = useState<string | null>(null);
  // const navigate = useNavigate(); // Removed useNavigate from context

  useEffect(() => {
    const initializeAuth = () => {
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('token');
        if (storedUser && storedToken) {
            setUser(JSON.parse(storedUser));
            setAuthToken(storedToken); // Use authToken state
        }
        setIsAuthLoading(false); // Set loading false after check
    };
    initializeAuth();
  }, []);

  // LOGIN
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:8000/api/users/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Invalid email or password');
      }

      setUser(data.user);
      setAuthToken(data.token); // Use authToken state
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('token', data.token);

      // Navigation should be handled in LoginPage.tsx after calling login().

    } catch (err: any) {
      console.error('Login failed:', err);
      setError(err.message || 'Login failed');
      throw err; // Re-throw so LoginPage can catch and handle navigation fallback
    } finally {
      setIsLoading(false);
    }
  };

  // REGISTER
  const register = async (full_name: string, email: string, password: string, user_type: 'user' | 'host') => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:8000/api/users/register/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ full_name, email, password, user_type }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Registration failed');
      }

      // Should be handled by RegisterPage after successful call
    } catch (err: any) {
      console.error('Registration failed:', err);
      setError(err.message || 'Registration failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // LOGOUT
  const logout = () => {
    setUser(null);
    setAuthToken(null); // Use authToken state
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    // Navigation should be handled by Header/Logout component
  };

  return (
    <AuthContext.Provider value={{ user, authToken, login, register, logout, isLoading, isAuthLoading, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
