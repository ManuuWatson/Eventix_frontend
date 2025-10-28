import React, { useEffect, useState, createContext, useContext, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

interface User {
  email: string;
  full_name: string;
  user_type: 'user' | 'host';
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (full_name: string, email: string, password: string, user_type: 'user' | 'host') => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }
  }, []);

  // ✅ LOGIN
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
      setToken(data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('token', data.token);

      // ✅ Redirect user based on role
      if (data.user.user_type === 'host') {
        navigate('/host-dashboard');
      } else {
        navigate('/user-dashboard');
      }
    } catch (err: any) {
      console.error('Login failed:', err);
      setError(err.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ REGISTER
  const register = async (full_name: string, email: string, password: string, user_type: 'user' | 'host') => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:8000/api/users/register/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ full_name, email, password, user_type }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      navigate('/login');
    } catch (err: any) {
      console.error('Registration failed:', err);
      setError(err.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ LOGOUT
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, isLoading, error }}>
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
