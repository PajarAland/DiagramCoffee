import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import arrowIconWhite from "../assets/mdi--arrow-right-thin-circle-outline-white.svg";
import accountAddWhite from "../assets/mdi--account-add-white.svg";

function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F5F1E5] flex flex-col items-center justify-center px-5">
      
      <h1 className="text-3xl font-bold text-[#2F5D34] mb-6">
        Diagram
      </h1>

      <div className="bg-white rounded-2xl p-6 w-full max-w-lg text-center border border-[#DDD6CE]">
        <div className="w-20 h-20 bg-[#E8E1D9] rounded-full mx-auto mb-4"></div>

        <Link to="/homeGuest" className="text-[#2F5D34] text-lg font-semibold hover:underline">
          Lanjut sebagai tamu
        </Link>

        <p className="text-gray-500 text-sm mt-2">
          Jelajahi menu terlebih dahulu tanpa login
        </p>
      </div>

      {/* <button onClick={() => navigate("/login")} className="mt-6 w-full max-w-md bg-[#2F5D34] text-white py-3 rounded-xl">
        Saya punya akun
      </button> */}

      <button
        onClick={() => navigate("/login")}
        className="mt-6 w-10/12 max-w-sm bg-[#2F5D34] text-white py-3 rounded-xl relative flex items-center justify-center"
      >
        <span className="text-center">Saya punya akun</span>

        <img
          src={arrowIconWhite}
          alt="arrow"
          className="w-6 h-6 absolute right-4"
        />
      </button>

      {/* <button onClick={() => navigate("/register")} className="mt-3 w-full max-w-md bg-[#446D48] text-white py-3 rounded-xl">
        Buat Akun
      </button> */}

      <button
        onClick={() => navigate("/register")}
        className="mt-6 w-10/12 max-w-sm bg-[#2F5D34] text-white py-3 rounded-xl relative flex items-center justify-center"
      >
        <span className="text-center">Buat Akun</span>

        <img
          src={accountAddWhite}
          alt="account add"
          className="w-6 h-6 absolute right-4"
        />
      </button>
    </div>
  );
}

export default Landing;