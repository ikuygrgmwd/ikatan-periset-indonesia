"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { type User, MOCK_USERS, MOCK_CREDENTIALS } from "@/lib/mock-data";

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Cek session dari localStorage
    try {
      const stored = localStorage.getItem("ipi_user");
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch {
      // ignore
    }
    setIsLoading(false);
  }, []);

  const login = async (
    email: string,
    password: string
  ): Promise<{ error?: string }> => {
    // Simulasi delay network
    await new Promise((res) => setTimeout(res, 800));

    if (
      email === MOCK_CREDENTIALS.email &&
      password === MOCK_CREDENTIALS.password
    ) {
      const loggedUser = MOCK_USERS.find((u) => u.email === email);
      if (loggedUser) {
        setUser(loggedUser);
        localStorage.setItem("ipi_user", JSON.stringify(loggedUser));
        return {};
      }
    }
    return { error: "Email atau password salah." };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("ipi_user");
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
