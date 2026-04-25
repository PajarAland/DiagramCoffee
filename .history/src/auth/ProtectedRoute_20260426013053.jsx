import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import API from "../services/api";
import Swal from "sweetalert2";

function ProtectedRoute({ children }) {
  const [isAuth, setIsAuth] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await API.get("/api/user");
        setIsAuth(true);
      } catch {
        setIsAuth(false);

        Swal.fire({
          icon: "warning",
          title: "Akses Ditolak",
          text: "Silakan login terlebih dahulu.",
        });
      }
    };

    checkAuth();
  }, []);

  if (isAuth === null) {
    return <div>Loading...</div>;
  }

  return isAuth ? children : <Navigate to="/login" />;
}

export default ProtectedRoute;