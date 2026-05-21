import { useState } from "react";
import Swal from "sweetalert2";
import API from "../../services/api";

function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email.trim()) {

            Swal.fire({
                icon: "warning",
                title: "Email wajib diisi",
            });
            return;
        }
        try {
            setLoading(true);
            await API.post("/api/forgot-password", { email });
            
            Swal.fire({
                icon: "success",
                title: "Berhasil",
                text: "Link reset password berhasil dikirim",
            });
            setEmail("");
        } catch (error) {

            Swal.fire({
                icon: "error",
                title: "Gagal",
                text: error.response?.data?.message || "Terjadi kesalahan",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#EEE8CC] flex items-center justify-center">
            <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
                <h1 className="text-2xl font-bold text-[#2F5231] mb-2">Lupa Password</h1>
                <p className="text-sm text-gray-500 mb-6">Masukkan email akun Anda untuk menerima link reset password.</p>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="email"
                        placeholder="Masukkan email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full border rounded-xl px-4 py-3 outline-none"
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#2F5231] text-white py-3 rounded-xl font-semibold disabled:opacity-50"
                    >
                        {loading ? "Mengirim..." : "Kirim Link Reset"}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default ForgotPassword;