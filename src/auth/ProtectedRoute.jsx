import { useAuth } from "../context/useAuth";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, allowedRoles }) {
  const { user, initialized } = useAuth();

  if (!initialized) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#F8F5F0]">          
            <div className="w-10 h-10 border-4 border-[#2F5231]/20 border-t-[#2F5231] rounded-full animate-spin"/>                    
        </div>
    );
  }

  // Jika belum login
  if (!user) {
    return (
      <Navigate
          to="/login"
          replace
          state={{
              from: location.pathname,
          }}
      />
    );
  }

  // Cek role user kalo include
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/home" replace />;
  }
  return children;
}

export default ProtectedRoute;