import { useEffect, useState } from "react";
import API from "../services/api";
import AuthContext from "./AuthContext";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [initialized, setInitialized] = useState(false);

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
    }
  };

  const login = (userData) => setUser(userData);

  const logout = async () => {
    await API.post("/api/logout");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, initialized, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}