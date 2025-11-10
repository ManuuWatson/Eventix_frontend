// src/context/AuthContext.tsx - UPDATED

import React, { useEffect, useState, createContext, useContext, ReactNode } from 'react';

// Define the User interface
interface User {
  email: string;
  name?: string; // Made optional as it might not be used consistently with full_name
  full_name: string;
  id: string | number;
  user_type: 'user' | 'host';
}

interface AuthContextType {
  user: User | null;
  authToken: string | null;
  // Change the login function signature: 
  // It now accepts the already-parsed 'userData' and the 'token'
  login: (userData: User, token: string) => void; 
  // Keep register signature for the register page
  register: (full_name: string, email: string, password: string, user_type: 'user' | 'host') => Promise<void>;
  logout: () => void;
  isLoading: boolean; // For tracking register action status
  isAuthLoading: boolean; // For initial auth check status
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false); // Only used for register now
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // ... (Your existing useEffect logic is fine here) ...
    const initializeAuth = () => {
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('token');
        if (storedUser && storedToken) {
            setUser(JSON.parse(storedUser));
            setAuthToken(storedToken); 
        }
        setIsAuthLoading(false); 
    };
    initializeAuth();
  }, []);

  // LOGIN Function (Simplified: just saves data to state/localStorage)
  // The API call logic is removed from here and put in LoginPage.tsx
  const login = (userData: User, token: string) => {
    setUser(userData);
    setAuthToken(token);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);
  };

  // REGISTER Function (Kept as is, still handles API call internally)
  const register = async (full_name: string, email: string, password: string, user_type: 'user' | 'host') => {
    // ... (Your existing register logic) ...
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
    // ... (Your existing logout logic) ...
    setUser(null);
    setAuthToken(null); 
    localStorage.removeItem('user');
    localStorage.removeItem('token');
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
