// src/context/AuthContext.tsx
import React, { createContext, useContext, useState, ReactNode } from "react";

interface User {
  id: number;
  email: string;
  full_name: string;
  user_type: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthLoading: boolean;
  login: (userData: User, token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem("eventix_user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem("eventix_token");
  });

  const [isAuthLoading, setIsAuthLoading] = useState(false);

  // Sync token to axios on mount/change is handled by axios interceptor reading localStorage,
  // implies we must keep localStorage up to date.

  const login = (userData: User, jwtToken: string) => {
    setUser(userData);
    setToken(jwtToken);
    localStorage.setItem("eventix_user", JSON.stringify(userData));
    localStorage.setItem("eventix_token", jwtToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("eventix_user");
    localStorage.removeItem("eventix_token");
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
