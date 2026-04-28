import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import API from "../services/api";
import accountAddWhite from "../assets/mdi--account-add-white.svg";
import formTextboxPasswordGrey from "../assets/mdi--form-textbox-password-grey.svg";
import emailVariantGrey from "../assets/mdi--email-variant-grey.svg";
import userEditGrey from "../assets/mdi--user-edit-grey.svg";




function Register() {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");

    // const handleRegister = async (e) => {
    //     e.preventDefault();

    //     try {
    //         await API.post("/api/register", {
    //             name,
    //             email,
    //             password,
    //             password_confirmation: passwordConfirmation,
    //         });

    //         navigate("/login");

    //     } catch (error) {
    //         console.error(error);

    //         if (error.response.data.errors) {
    //             Swal.fire({
    //                 icon: "error",
    //                 title: "Validasi Gagal",
    //                 html: Object.values(error.response.data.errors).join("<br>"),
    //             });
    //             } else {
    //             Swal.fire({
    //                 icon: "error",
    //                 title: "Error",
    //                 text: error.response.data.message,
    //             });
    //         }
    //     }
    // };

    const handleRegister = async (e) => {
        e.preventDefault();

        const trimmedName = name.trim();
        const trimmedEmail = email.trim();
        const trimmedPassword = password.trim();
        const trimmedPasswordConfirmation = passwordConfirmation.trim();

        // Empty-case validation
        if (!trimmedName || !trimmedEmail || !trimmedPassword || !trimmedPasswordConfirmation) {
            Swal.fire({
                icon: "warning",
                title: "Form belum lengkap",
                text: "Semua field wajib diisi",
            });
            return;
        }

        // Email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(trimmedEmail)) {
            Swal.fire({
                icon: "warning",
                title: "Email tidak valid",
                text: "Masukkan format email yang benar",
            });
            return;
        }

        // Password length validation
        if (trimmedPassword.length < 8) {
            Swal.fire({
                icon: "warning",
                title: "Password terlalu pendek",
                text: "Password minimal 8 karakter",
            });
            return;
        }

        // Password confirmation validation
        if (trimmedPassword !== trimmedPasswordConfirmation) {
            Swal.fire({
                icon: "warning",
                title: "Password tidak cocok",
                text: "Konfirmasi password harus sama",
            });
            return;
        }

        const ensureCSRF = async () => {
            const hasCookie = document.cookie.includes("XSRF-TOKEN");

            if (!hasCookie) {
                await API.get("/sanctum/csrf-cookie");
            }
        };

        try {

            await ensureCSRF();

            await API.post("/api/register", {
                name: trimmedName,
                email: trimmedEmail,
                password: trimmedPassword,
                password_confirmation: trimmedPasswordConfirmation,
            });

            Swal.fire({
                icon: "success",
                title: "Berhasil",
                text: "Akun berhasil dibuat",
                timer: 1500,
                showConfirmButton: false,
            });

            navigate("/login");

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
                    text: error.response?.data?.message || "Terjadi kesalahan",
                });
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
                    <div className="relative">
                        <img
                            src={userEditGrey}
                            alt="icon-user"
                            className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 opacity-60"
                        />

                        <input
                            type="text"
                            placeholder="Masukkan Nama"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full border rounded-lg pl-10 pr-3 py-3 text-sm outline-none"
                        />
                    </div>

                    <div className="relative">
                        <img
                            src={emailVariantGrey}
                            alt="icon-email"
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

                    <div className="relative">
                        <img
                            src={formTextboxPasswordGrey}
                            alt="icon-password"
                            className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 opacity-60"
                        />

                        <input
                            type="password"
                            placeholder="Masukkan Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full border rounded-lg pl-10 pr-3 py-3 text-sm outline-none"
                        />
                    </div>

                    {/* <input
                        type="password"
                        placeholder="Ulangi Password"
                        value={passwordConfirmation}
                        onChange={(e) => setPasswordConfirmation(e.target.value)}
                        className="w-full border rounded-lg px-3 py-3 text-sm outline-none"
                    /> */}

                    <div className="relative">
                        <img
                            src={formTextboxPasswordGrey}
                            alt="icon password"
                            className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 opacity-60"
                        />

                        <input
                            type="password"
                            placeholder="Konfirmasi Password"
                            value={passwordConfirmation}
                            onChange={(e) => setPasswordConfirmation(e.target.value)}
                            className="w-full border rounded-lg pl-10 pr-3 py-3 text-sm outline-none"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-10/12 mx-auto bg-[#2F5231] text-sm text-white py-2 rounded-lg mt-4 relative flex items-center justify-center"
                    >
                        <span className="text-center">Buat Akun</span>

                        <img
                            src={accountAddWhite}
                            alt="account add"
                            className="w-6 h-6 absolute right-4"
                        />
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