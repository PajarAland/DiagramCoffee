import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  // hanya block kalau belum selesai & tidak ada user
  if (loading) return null;

  return user ? children : <Navigate to="/login" replace />;
}

export default ProtectedRoute;