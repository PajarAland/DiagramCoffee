// import { useAuth } from "../context/useAuth";
// import { Navigate } from "react-router-dom";

// function ProtectedRoute({ children }) {
//   const { user, initialized } = useAuth();

//   // tunggu auth check selesai (tanpa blank freeze lama)
//   if (!initialized) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         Loading...
//       </div>
//     );
//   }

//   return user ? children : <Navigate to="/login" replace />;
// }

// export default ProtectedRoute;

import { useAuth } from "../context/useAuth";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, allowedRoles }) {
  const { user, initialized } = useAuth();

  // ⏳ tunggu auth selesai
  if (!initialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  // ❌ belum login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 🔥 cek role (kalau dikasih)
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/home" replace />;
  }

  return children;
}

export default ProtectedRoute;