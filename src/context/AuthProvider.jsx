import { useEffect, useState } from "react";
import API from "../services/api";
import AuthContext from "./AuthContext";

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [initialized, setInitialized] = useState(false);

    useEffect(() => {
        const initAuth = async () => {
            try {
                const isLoggedIn =
                    localStorage.getItem("isLoggedIn") ||
                    sessionStorage.getItem("isLoggedIn");

                // kalau belum login → skip API
                if (!isLoggedIn) {
                    // setUser(null);
                    setInitialized(true);
                    return;
                }

                // kalau pernah login → cek ke backend
                // await API.get("/sanctum/csrf-cookie");
                const res = await API.get("/api/user");
                setUser(res.data.data ?? null);

            } catch (error) {
                if (error.response?.status !== 401) {
                    console.error("Auth check failed:", error);
                }

                // 🔥 kalau ternyata session invalid → clear flag
                localStorage.removeItem("isLoggedIn");
                sessionStorage.removeItem("isLoggedIn");
                setUser(null);
            } finally {
                setInitialized(true);
            }
        };

        initAuth();
    }, []);

    const refreshUser = async () => {
        try {
            const res = await API.get("/api/user");
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
            await API.get("/sanctum/csrf-cookie");
            await API.post("/api/logout");
        } catch (error) {
        console.error(
            "Logout failed:", error
        );
        } finally {
            setUser(null);
            localStorage.removeItem("isLoggedIn");
            localStorage.removeItem("selected_branch_id");
            sessionStorage.removeItem("isLoggedIn");
            window.location.href = "/login";
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