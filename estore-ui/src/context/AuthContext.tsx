import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import type { User } from "@/types";
import { api } from "@/services/api";

type UserRole = "admin" | "customer" | null;

interface AuthContextType {
  role: UserRole;
  user: User | null;
  login: (role: UserRole, user?: User) => void;
  updateUser: (updates: Partial<User>) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<UserRole>(() => localStorage.getItem("user_role") as UserRole);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      api.auth
        .me()
        .then((res) => setUser(res.user))
        .catch(() => setUser(null));
    }
  }, [role]);

  const login = (newRole: UserRole, userData?: User) => {
    localStorage.setItem("user_role", newRole || "");
    setRole(newRole);
    if (userData) setUser(userData);
  };

  const updateUser = (updates: Partial<User>) => {
    setUser((prev) => (prev ? { ...prev, ...updates } : prev));
  };

  const logout = () => {
    localStorage.removeItem("user_role");
    localStorage.removeItem("token");
    setRole(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ role, user, login, updateUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
