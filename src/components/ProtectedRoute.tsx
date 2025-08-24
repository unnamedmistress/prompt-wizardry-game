import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { session, loading } = useAuth();

  if (loading) {
    return null;
  }

  return session ? <>{children}</> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
