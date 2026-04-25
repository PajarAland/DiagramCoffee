import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const { user } = useAuth();

  // kalau belum tahu user, langsung render dulu
  return user ? children : <Navigate to="/login" replace />;
}

export default ProtectedRoute;