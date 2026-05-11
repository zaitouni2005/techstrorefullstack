import { Navigate, Outlet } from "react-router-dom";

export function AdminGuard() {
  // Mock check: in a real app, this would be a check against an auth context or token
  const isAdmin = localStorage.getItem("is_admin") === "true";

  if (!isAdmin) {
    // Redirect to login if not admin
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
