import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import Swal from "sweetalert2";
import { useAuth } from "../context/useAuth";
import Navbar from "../components/ui/NavBar.jsx";
import arrowIconWhite from "../assets/mdi--arrow-right-thin-circle-outline-white.svg";
import emailVariantGrey from "../assets/mdi--email-variant-grey.svg";

function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [remember, setRemember] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            await API.get("/sanctum/csrf-cookie");

            const response = await API.post("/api/login", {
                email,
                password,
            });

            if (response.data.success) {
                login(response.data.data); // 

                // setTimeout(() => {
                //     refreshUser();
                // }, 100);
                
                navigate("/home");
            }

        } catch (error) {
            console.error(error);

            if (error.response?.data?.errors) {
                Swal.fire({
                    icon: "error",
                    title: "Validasi Gagal",
                    html: Object.values(error.response.data.errors).join("<br>"),
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: error.response?.data?.message,
                });
            }
        }
    };

    return (
        <div className="min-h-screen bg-[#EEE8CC] flex items-center justify-center">
            <div className="bg-[#FDFBF8] w-full max-w-sm rounded-2xl p-6 shadow-md text-center">

                <h2 className="text-[#2F5231] font-bold text-2xl mb-4">
                    Login
                </h2>

                <form onSubmit={handleLogin} className="space-y-3">

                    <div className="relative">
                        <img
                            src={emailVariantGrey}
                            alt="icon email"
                            className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 opacity-60"
                        />

                        <input
                            type="email"
                            placeholder="Masukkan Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full border rounded-lg pl-10 pr-3 py-3 text-sm outline-none"
                        />
                    </div>

                    <input
                        type="password"
                        placeholder="Masukkan Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full border rounded-lg px-3 py-3 text-sm outline-none"
                    />

                    {/* <button
                        type="submit"
                        className="w-10/12 bg-[#2F5231] text-white py-2 rounded-lg mt-2"
                    >
                        Masuk
                    </button> */}

                    <div className="flex items-center justify-between text-xs mt-1">
                        <label className="flex items-center gap-2 text-[#446346]">
                            <input
                                type="checkbox"
                                checked={remember}
                                onChange={(e) => setRemember(e.target.checked)}
                                className="accent-[#2bdf34]"
                            />
                            Ingat saya
                        </label>

                        <Link
                            to="/forgot-password"
                            className="text-[#2F5231] hover:underline font-medium"
                        >
                            Lupa password
                        </Link>
                    </div>

                    <button
                        type="submit"
                        className="w-10/12 mx-auto bg-[#2F5231] text-white py-2 rounded-lg relative flex items-center justify-center mt-2"
                        >
                        <span className="text-center">Masuk</span>

                        <img
                            src={arrowIconWhite}
                            alt="arrow"
                            className="w-6 h-6 absolute right-4"
                        />
                    </button>
                </form>

                <p className="text-xs text-[#446346] font-medium mt-4">
                    Belum punya akun?
                </p>

                <div className="text-sm text-[#2F5231] mt-1 flex items-center justify-center gap-1">
                    <Link to="/register" className="font-semibold hover:underline">
                        Buat akun
                    </Link>
                    <span>atau</span>
                    <Link to="/homeGuest" className="font-semibold hover:underline">
                        Masuk sebagai tamu
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Login;