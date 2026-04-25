import { useState } from "react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    console.log({ email, password });
    // nanti connect ke Laravel API di sini
  };

  return (
    <div className="min-h-screen bg-[#dcd6b8] flex items-center justify-center">
      <div className="bg-white w-full max-w-sm rounded-2xl p-6 shadow-md text-center">
        
        {/* Avatar */}
        <div className="w-16 h-16 bg-green-800 rounded-full mx-auto mb-3"></div>

        {/* Title */}
        <h2 className="text-green-800 font-semibold text-lg mb-4">
          Login
        </h2>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-3">
          
          <input
            type="text"
            placeholder="Masukkan Nama"
            className="w-full border rounded-lg px-3 py-2 text-sm outline-none"
          />

          <input
            type="email"
            placeholder="Masukkan Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-sm outline-none"
          />

          <input
            type="password"
            placeholder="************"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-sm outline-none"
          />

          {/* Button */}
          <button
            type="submit"
            className="w-full bg-green-800 text-white py-2 rounded-full mt-2"
          >
            Masuk →
          </button>
        </form>

        {/* Footer */}
        <p className="text-xs text-gray-500 mt-4">
          Belum punya akun?
        </p>

        <div className="text-sm text-green-800 font-medium">
          Buat akun atau Masuk Sebagai Tamu
        </div>
      </div>
    </div>
  );
}

export default Login;