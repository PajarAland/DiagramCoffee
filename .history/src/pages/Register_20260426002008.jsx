import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function Register() {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");

    const handleRegister = async (e) => {
        e.preventDefault();

        try {
            // 🔥 ambil CSRF cookie
            await API.get("/api/register");

            // 🔥 register
            await API.post("/register", {
                name,
                email,
                password,
                password_confirmation: passwordConfirmation,
            });

            // 🔥 login otomatis setelah register
            await API.post("/login", {
                email,
                password,
            });

            navigate("/home");

        } catch (error) {
            console.error(error);

            if (error.response) {
                if (error.response.data.errors) {
                    alert(Object.values(error.response.data.errors).join("\n"));
                } else {
                    alert(error.response.data.message);
                }
            } else {
                alert("Server error");
            }
        }
    };

    return (
        <div className="min-h-screen bg-[#EEE8CC] flex items-center justify-center">
            <div className="bg-[#FDFBF8] w-full max-w-sm rounded-2xl p-6 shadow-md text-center">

                <h2 className="text-[#2F5231] font-bold text-2xl mb-4">
                    Register
                </h2>

                <form onSubmit={handleRegister} className="space-y-3">

                    <input
                        type="text"
                        placeholder="Masukkan Nama"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full border rounded-lg px-3 py-3 text-sm outline-none"
                    />

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

                    <input
                        type="password"
                        placeholder="Konfirmasi Password"
                        value={passwordConfirmation}
                        onChange={(e) => setPasswordConfirmation(e.target.value)}
                        className="w-full border rounded-lg px-3 py-3 text-sm outline-none"
                    />

                    <button
                        type="submit"
                        className="w-10/12 bg-[#2F5231] text-sm text-white py-2 rounded-lg mt-4"
                    >
                        Buat Akun
                    </button>
                </form>

                <button
                    onClick={() => navigate("/login")}
                    className="text-sm text-[#2F5231] font-semibold mt-3 hover:underline"
                >
                    Kembali ke Login
                </button>
            </div>
        </div>
    );
}

export default Register;