// src/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

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
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    console.log("🔑 AuthProvider mounted — restoring user from localStorage...");
    const timer = setTimeout(() => {
      try {
        const storedUser = localStorage.getItem("eventix_user");
        const storedToken = localStorage.getItem("eventix_token");
        if (storedUser && storedToken) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          setToken(storedToken);
          console.log("✅ Restored user from localStorage:", parsedUser);
        } else {
          console.log("ℹ️ No stored credentials found.");
        }
      } catch (error) {
        console.error("❌ Error loading stored credentials:", error);
      } finally {
        setIsAuthLoading(false);
        console.log("🕓 Auth loading complete");
      }
    }, 300); // small delay ensures smoother load

    return () => clearTimeout(timer);
  }, []);

  const login = (userData: User, token: string) => {
    console.log("🔐 Logging in user:", userData);
    setUser(userData);
    setToken(token);
    localStorage.setItem("eventix_user", JSON.stringify(userData));
    localStorage.setItem("eventix_token", token);
  };

  const logout = () => {
    console.log("🚪 Logging out...");
    setUser(null);
    setToken(null);
    localStorage.removeItem("eventix_user");
    localStorage.removeItem("eventix_token");
  };

  console.log("👀 AuthContext state:", { user, token, isAuthLoading });

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
