import { useState } from "react";
import Swal from "sweetalert2";
import API from "../../services/api";
import { useAuth } from "../../context/useAuth";
import emailVariantGrey from "../../assets/mdi--email-variant-grey.svg";
import userEditGrey from "../../assets/mdi--user-edit-grey.svg";

function Profile() {
    const { user, refreshUser } = useAuth();
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const displayName = name || user?.name || "";

    const handleResendVerification = async () => {
        try {
            await API.post("/api/email/resend");

            Swal.fire({
                icon: "success",
                title:
                    "Email terkirim",
                text:
                    "Silakan cek inbox Anda",
            });
        } catch (error) {
            console.error(error);

            Swal.fire({ 
                icon: "error", 
                title: "Error", 
                text: error.response?.data?.message || "Gagal mengirim email" 
            });
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        const trimmedName = displayName.trim();
        if (!trimmedName) {
            
            Swal.fire({ 
                icon: "warning", 
                title: "Nama wajib diisi" 
            });
            return;
        }

        try {
            setLoading(true);
            await API.put("/api/user/profile", { name: trimmedName });
            await refreshUser();

            Swal.fire({ icon: "success", 
                title: "Berhasil", 
                text: "Profil berhasil diperbarui", 
                timer: 1500, 
                showConfirmButton: false 
            });
        } catch (error) {
            console.error(error);

            Swal.fire({ 
                icon: "error", 
                title: "Error", 
                text: error.response?.data?.message || "Terjadi kesalahan" 
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 md:px-8">
            <div className="bg-[#FDFBF8] w-full max-w-md rounded-3xl p-6 md:p-8 shadow-sm border border-[#ECE6DC]">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-[#2F5231]">Profile</h1>
                    <p className="text-sm text-gray-500 mt-2">Kelola informasi akun Anda</p>
                </div>

                <form onSubmit={handleUpdateProfile} className="space-y-5">
                    {/* NAME */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Nama</label>
                        <div className="relative">
                            <img src={userEditGrey} alt="icon-user" className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 opacity-60" />
                            <input
                                type="text"
                                placeholder="Masukkan Nama"
                                value={displayName}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full border border-[#ECE6DC] rounded-2xl pl-10 pr-4 py-3 text-sm outline-none focus:border-[#2F5231] transition-all bg-white"
                            />
                        </div>
                    </div>

                    {/* EMAIL */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                        <div className="relative">
                            <img src={emailVariantGrey} alt="icon-email" className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 opacity-60" />
                            <input
                                type="email"
                                value={user?.email || ""}
                                readOnly
                                className="w-full border border-[#ECE6DC] rounded-2xl pl-10 pr-4 py-3 text-sm bg-gray-100 text-gray-500 cursor-not-allowed"
                            />
                        </div>
                        <p className="text-xs text-gray-400 mt-2">Email belum dapat diubah</p>
                        {!user?.email_verified_at && (
                            <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 mt-3">
                                <p className="text-sm font-semibold text-yellow-700">Email belum diverifikasi</p>
                                <button type="button" onClick={handleResendVerification} className="mt-3 text-sm text-[#2F5231] font-semibold">Kirim ulang email</button>
                            </div>
                        )}
                    </div>

                    {/* LOYALTY */}
                    {user?.role === "customer" && (
                        <div className="bg-[#F8F5F0] rounded-2xl p-4">
                            <p className="text-xs text-gray-500 mb-1">Loyalty Points</p>
                            <p className="font-bold text-2xl text-[#2F5231]">{user?.loyalty_points || 0}</p>
                        </div>
                    )}

                    <button type="submit" disabled={loading} className="w-full bg-[#2F5231] text-white py-3 rounded-2xl font-medium transition-all hover:bg-[#1e3a20] disabled:opacity-50 disabled:cursor-not-allowed">
                        {loading ? "Menyimpan..." : "Simpan Perubahan"}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Profile;