import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Swal from "sweetalert2";
import API from "../services/api";

function ResetPassword() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const email = searchParams.get("email");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {

            Swal.fire({
                icon: "warning",
                title: "Password tidak sama",
                text: "Konfirmasi password harus sama"
            });
            return;
        }

        try {
            setLoading(true);
            await API.post("/api/reset-password", {
                token,
                email,
                password,
                password_confirmation: confirmPassword,
            });

            Swal.fire({
                icon: "success",
                title: "Password berhasil direset",
                text: "Silakan login kembali",
                timer: 1800,
                showConfirmButton: false,
            });
            navigate("/login");
        } catch (error) {
            console.error(error);

            Swal.fire({
                icon: "error",
                title: "Error",
                text: error.response?.data?.message || "Gagal reset password"
            });

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F8F5F0] flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8">
                <div className=" text-center mb-8">
                    <h1 className=" text-3xl font-bold text-[#2F5231]">
                        Reset Password
                    </h1>

                    <p className="text-sm text-gray-500 mt-3">
                        Masukkan password baru untuk akun Anda
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className=" block text-sm font-semibold text-gray-700 mb-2">
                            Email
                        </label>

                        <input
                            type="email"
                            value={email || ""}
                            disabled
                            className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-gray-100 text-gray-500 cursor-not-allowed"
                        />
                    </div>

                    <div>
                        <label className=" block text-sm font-semibold text-gray-700 mb-2">
                            Password Baru
                        </label>

                        <input
                            type="password"
                            value={password}
                            onChange={(e) =>
                                setPassword(
                                    e.target.value
                                )
                            }
                            placeholder="Masukkan password baru"
                            required
                            className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2F5231]/20 focus:border-[#2F5231]"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Konfirmasi Password
                        </label>
                        
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) =>
                                setConfirmPassword(
                                    e.target.value
                                )
                            }
                            placeholder="Konfirmasi password baru"
                            required
                            className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2F5231]/20 focus:border-[#2F5231]"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 rounded-2xl bg-[#2F5231] text-white font-semibold hover:bg-[#1f3b22] transition-all disabled:opacity-50"
                    >
                        {loading ? "Loading..." : "Reset Password"}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default ResetPassword;