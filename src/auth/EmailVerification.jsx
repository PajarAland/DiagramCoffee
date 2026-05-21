import Swal from "sweetalert2";
import API from "../services/api";
import emailIcon from "../assets/mdi--email-variant-grey.svg"

function EmailVerification() {
    const handleResend =
        async () => {
            try {
                await API.post("/api/email/resend");
                
                Swal.fire({
                    icon: "success",
                    title: "Email berhasil dikirim",                       
                    text: "Silakan cek inbox atau folder spam Anda.",                        
                    confirmButtonColor: "#2F5231",                      
                });

            } catch (err) {

                Swal.fire({
                    icon: "error",
                    title: "Gagal mengirim email",                      
                    text: err.response?.data?.message || "Terjadi kesalahan.",  
                    confirmButtonColor: "#2F5231",                       
                });
            }
        };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#F7F3EF] px-4">
            <div className="bg-white w-full max-w-md rounded-3xl shadow-lg p-8 text-center">
                <div className="w-20 h-20 mx-auto rounded-full bg-[#2F5231]/10 flex items-center justify-center mb-6">
                    <img 
                        src={emailIcon}
                        alt="email"
                        className="w-10 h-10"
                    />
                </div>

                <h1 className=" text-3xl font-bold text-gray-800">
                    Verifikasi Email
                </h1>

                <p className="text-gray-500 mt-4 leading-relaxed">
                    Untuk melanjutkan, silakan verifikasi email akun Anda terlebih dahulu.
                </p>

                <button
                    onClick={handleResend}
                    className="mt-8 w-full bg-[#2F5231] hover:bg-[#244126] text-white font-semibold py-4 rounded-2xl transition duration-200"    
                >
                    Kirim Ulang Email
                </button>
            </div>
        </div>
    );
}

export default EmailVerification;