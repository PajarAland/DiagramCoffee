import { createContext, useContext, useEffect, useState } from "react";
import API from "../services/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [initialized, setInitialized] = useState(false); // penting

  // ambil user sekali saat app start (background)
  const fetchUser = async () => {
    try {
      const res = await API.get("/api/user");
      setUser(res.data.data);
    } catch {
      setUser(null);
    } finally {
      setInitialized(true);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const refreshUser = async () => {
  try {
    const res = await API.get("/api/user");
    setUser(res.data.data);
  } catch {
    setUser(null);
  } finally {
    setInitialized(true);
  }
};

  const login = (userData) => {
    setUser(userData);
  };

  const logout = async () => {
    await API.post("/api/logout");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        login,
        logout,
        initialized, // status auth selesai dicek
        refreshUser, // fungsi untuk refresh data user
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);