import { useEffect, useState } from "react";
import API from "../services/api";
import AuthContext from "./AuthContext";

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [initialized, setInitialized] = useState(false);

    useEffect(() => {
    const initAuth = async () => {
        try {
            await API.get("/sanctum/csrf-cookie");

            const res = await API.get("/api/bootstrap");

            setUser(res.data.user ?? null);
        } catch (error) {
            console.error("Bootstrap failed:", error);
            setUser(null);
        } finally {
            setInitialized(true);
        }
    };

    initAuth();
}, []);

    const refreshUser = async () => {
    const res = await API.get("/api/bootstrap");
    setUser(res.data.user ?? null);
};

    const login = (userData) => {
        setUser(userData);
    };

    const logout = async () => {
        try {
            await API.post("/api/logout");
        } finally {
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                setUser,
                login,
                logout,
                initialized,
                refreshUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}