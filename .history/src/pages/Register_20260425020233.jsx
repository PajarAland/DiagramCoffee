import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleRegister = (e) => {
        e.preventDefault();
        console.log({ email, password });
        // nanti connect ke Laravel API di sini
    };

    return (
        <div className="min-h-screen bg-[#EEE8CC] flex items-center justify-center">
        <div className="bg-[#FDFBF8] w-full max-w-sm rounded-2xl p-6 shadow-md text-center">
            
            {/* Avatar */}
            <div className="w-16 h-16 bg-[#EEE8CC] rounded-full mx-auto mb-3"></div>

            {/* Title */}
            <h2 className="text-[#2F5231] font-bold text-2xl mb-4">
            Register
            </h2>

            {/* Form */}
            <form onSubmit={handleRegister} className="space-y-3">
            
            <input
                type="text"
                placeholder="Masukkan Nama"
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

            {/* Button */}
            <button
                type="submit"
                className="w-10/12 bg-[#2F5231] text-sm text-white py-2 rounded-lg !mt-4"
            >
                Buat Akun
            </button>
            </form>

            {/* Footer */}
            {/* <p className="text-xs text-[#2F5231] font-medium mt-4">
            Belum punya akun?
            </p> */}

            <button
                onClick={() => navigate(-1)}
                className="text-sm text-[#2F5231] font-semibold mt-3 hover:underline"
            >
                Kembali
            </button>
        </div>
        </div>
    );
}

export default Register;