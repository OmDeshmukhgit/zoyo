import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { loginUser, registerUser, getProfile } from "../services/api";

type User = {
  id: string;
  name: string;
  email: string;
};

interface AuthContextValue {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const TOKEN_KEY = "zomato_token";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(!!token);

  const fetchProfile = useCallback(async () => {
    if (!token) return;
    try {
      const profile = await getProfile();
      setUser(profile);
    } catch (error) {
      console.error("Failed to load profile", error);
      logout();
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchProfile();
    } else {
      setIsLoading(false);
    }
  }, [token, fetchProfile]);

  const login = async (email: string, password: string) => {
    const { token: newToken, user: profile } = await loginUser({ email, password });
    setToken(newToken);
    setUser(profile);
    localStorage.setItem(TOKEN_KEY, newToken);
  };

  const register = async (name: string, email: string, password: string) => {
    const { token: newToken, user: profile } = await registerUser({ name, email, password });
    setToken(newToken);
    setUser(profile);
    localStorage.setItem(TOKEN_KEY, newToken);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem(TOKEN_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};


