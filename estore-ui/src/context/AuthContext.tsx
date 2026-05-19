import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import type { User } from "@/types";
import { api } from "@/services/api";

type UserRole = "admin" | "customer" | null;

interface AuthContextType {
  role: UserRole;
  user: User | null;
  isReady: boolean;
  login: (role: UserRole, user?: User) => void;
  updateUser: (updates: Partial<User>) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<UserRole>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedRole = localStorage.getItem("user_role") as UserRole;
    if (token && savedRole) {
      setRole(savedRole);
      api.auth
        .me()
        .then((res) => setUser(res.user))
        .catch(() => {
          localStorage.removeItem("token");
          localStorage.removeItem("user_role");
          setRole(null);
          setUser(null);
        })
        .finally(() => setIsReady(true));
    } else {
      setIsReady(true);
    }
  }, []);

  const login = useCallback((newRole: UserRole, userData?: User) => {
    localStorage.setItem("user_role", newRole || "");
    setRole(newRole);
    if (userData) setUser(userData);
  }, []);

  const updateUser = useCallback((updates: Partial<User>) => {
    setUser((prev) => (prev ? { ...prev, ...updates } : prev));
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("user_role");
    localStorage.removeItem("token");
    setRole(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ role, user, isReady, login, updateUser, logout }}>
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
