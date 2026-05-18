import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export function AdminGuard() {
  const { role } = useAuth();

  if (role !== "admin") {
    // Redirect to login if not admin (includes not logged in)
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
