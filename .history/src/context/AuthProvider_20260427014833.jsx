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
                const res = await API.get("/api/user");
                setUser(res.data.data ?? null);
            } catch (error) {
                if (error.response?.status !== 401) {
                    console.error("Auth check failed:", error);
                }
                setUser(null);
            } finally {
                setInitialized(true);
            }
        };

        initAuth();
    }, []);

    const refreshUser = async () => {
        try {
            const res = await API.get("/user");
            setUser(res.data.data ?? null);
        } catch (error) {
            if (error.response?.status !== 401) {
                console.error("Refresh user failed:", error);
            }
            setUser(null);
        }
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