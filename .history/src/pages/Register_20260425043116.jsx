import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function Register() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");

    const handleRegister = async (e) => {
        e.preventDefault();

        try {
            const response = await API.post("/register", {
                name,
                email,
                password,
            });

            const data = response.data;
            console.log(data);

            if (data.success) {
                // simpan token
                localStorage.setItem("token", data.data.access_token);

                // simpan user
                localStorage.setItem("user", JSON.stringify(data.data.user));

                // redirect ke home
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
            Register
            </h2>

            {/* Form */}
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

            {/* Button */}
            <button
                type="submit"
                className="w-10/12 bg-[#2F5231] text-sm text-white py-2 rounded-lg mt-4 shadow-[0_4px_10px_rgba(0,0,0,0.25)]"
            >
                Buat Akun
            </button>
            </form>

            {/* Footer */}
            {/* <p className="text-xs text-[#2F5231] font-medium mt-4">
            Belum punya akun?
            </p> */}

            <button
                onClick={() => {
                    if (window.history.length > 1) {
                        navigate(-1);
                    } else {
                        navigate("/");
                    }
                }}

                className="text-sm text-[#2F5231] font-semibold mt-3 hover:underline"
            >
                Kembali
            </button>
        </div>
        </div>
    );
}

export default Register;