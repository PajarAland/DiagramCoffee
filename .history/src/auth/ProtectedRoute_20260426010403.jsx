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
      }
    };

    checkAuth();
  }, []);

  if (isAuth === null) {
    Swal.fire({
      icon: "error",
      title: "Validasi Gagal",
      text: "Silakan login terlebih dahulu untuk mengakses halaman ini.",
    });
  }

  return isAuth ? children : <Navigate to="/login" />;
}

export default ProtectedRoute;