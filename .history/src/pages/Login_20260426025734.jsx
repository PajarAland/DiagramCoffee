import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import Swal from "sweetalert2";
import { useAuth } from "../context/AuthContext";

function Login() {
    const navigate = useNavigate();
    const { login, refreshUser } = useAuth(); // 🔥 FIX DI SINI

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            await API.get("/sanctum/csrf-cookie");

            const response = await API.post("/api/login", {
                email,
                password,
            });

            if (response.data.success) {
                login(response.data.data);   // update UI cepat
                await refreshUser();         // sync ke backend (anti bug A/B)
                navigate("/home");
            }

        } catch (error) {
            console.error(error);

            Swal.fire({
                icon: "error",
                title: "Error",
                text: error.response?.data?.message,
            });
        }
    };

    return (
        <div className="min-h-screen bg-[#EEE8CC] flex items-center justify-center">
            <div className="bg-[#FDFBF8] w-full max-w-sm rounded-2xl p-6 shadow-md text-center">

                <h2 className="text-[#2F5231] font-bold text-2xl mb-4">
                    Login
                </h2>

                <form onSubmit={handleLogin} className="space-y-3">

                    <input
                        type="email"
                        placeholder="Masukkan Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full border rounded-lg px-3 py-3 text-sm outline-none"
                    />

                    <input
                        type="password"
                        placeholder="Masukkan Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full border rounded-lg px-3 py-3 text-sm outline-none"
                    />

                    <button
                        type="submit"
                        className="w-10/12 bg-[#2F5231] text-white py-2 rounded-lg mt-2"
                    >
                        Masuk
                    </button>
                </form>

                <div className="text-sm text-[#2F5231] mt-4">
                    <Link to="/register">Buat akun</Link>
                </div>
            </div>
        </div>
    );
}

export default Login;