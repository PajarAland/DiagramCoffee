import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import API from "../services/api";

function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            // 🔥 ambil CSRF cookie dulu
            await API.get("/sanctum/csrf-cookie");

            // 🔥 baru login
            const response = await API.post("/api/login", {
                email,
                password,
            });

            const data = response.data;
            console.log(data);

            if (data.success) {
                navigate("/home");
            }

        } catch (error) {
            console.error(error);

            if (error.response) {
                alert(error.response.data.message);
            } else {
                alert("Server error");
            }
        }
    };

    return (
        <div className="min-h-screen bg-[#EEE8CC] flex items-center justify-center">
        <div className="bg-[#FDFBF8] w-full max-w-sm rounded-2xl p-6 shadow-md text-center">
            
            {/* Avatar */}
            <div className="w-16 h-16 bg-[#EEE8CC] rounded-full mx-auto mb-3"></div>

            {/* Title */}
            <h2 className="text-[#2F5231] font-bold text-2xl mb-4">
            Login
            </h2>

            {/* Form */}
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

            {/* Button */}
            <button
                type="submit"
                className="w-10/12 bg-[#2F5231] text-white py-2 rounded-lg mt-2"
            >
                Masuk
            </button>
            </form>

            {/* Footer */}
            <p className="text-xs text-[#2F5231] font-medium mt-4">
            Belum punya akun?
            </p>

            <div className="text-sm text-[#2F5231] mt-1 flex items-center justify-center gap-1">
                <Link to="/register" className="font-semibold hover:underline">
                    Buat akun
                </Link>
                <span className="font-normal">atau</span>
                <Link to="/homeGuest" className="font-semibold hover:underline">
                    Masuk sebagai tamu
                </Link>
            </div>
        </div>
        </div>
    );
}

export default Login;