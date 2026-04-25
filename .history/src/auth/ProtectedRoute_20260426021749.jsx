import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import API from "../services/api";

function ProtectedRoute({ children }) {
  const [isAuth, setIsAuth] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await API.get("/api/user");
        setIsAuth(true);
      } catch (error) {
        if (error.response?.status === 401) {
          setIsAuth(false);
        } else {
          setIsAuth(false);
        }
      }
    };

    checkAuth();
  }, []);

  if (isAuth === null) {
    return <div>Loading...</div>;
  }

  return isAuth ? children : <Navigate to="/login" replace />;
}

export default ProtectedRoute;