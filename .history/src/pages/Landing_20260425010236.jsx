import { useNavigate } from "react-router-dom";

function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F7F3EF] flex flex-col items-center justify-center px-5">
      
      <h1 className="text-3xl font-bold text-[#2F5D34] mb-6">
        Diagram
      </h1>

      <div className="bg-white rounded-2xl p-6 w-full max-w-md text-center border border-[#DDD6CE]">
        <div className="w-20 h-20 bg-[#E8E1D9] rounded-full mx-auto mb-4"></div>

        <button className="text-[#2F5D34] text-lg font-semibold">
          Lanjut sebagai tamu
        </button>

        <p className="text-gray-500 text-sm mt-2">
          Jelajahi menu terlebih dahulu tanpa login
        </p>
      </div>

      <button onClick={() => navigate("/login")} className="mt-6 w-full max-w-md bg-[#2F5D34] text-white py-3 rounded-xl">
        Saya punya akun
      </button>

      <button onClick={() => navigate("/register")} className="mt-3 w-full max-w-md bg-[#446D48] text-white py-3 rounded-xl">
        Buat Akun
      </button>
    </div>
  );
}

export default Landing;