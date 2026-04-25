import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function Home() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const testAPI = async () => {
      try {
        const res = await API.get("/api/user");
        console.log("SUCCESS:", res.data);
        setUser(res.data.data); // ⚠️ FIX struktur response kamu
      } catch (err) {
        console.error("ERROR:", err.response);
      }
    };

    testAPI();
  }, []);

  const handleLogout = async () => {
    try {
      await API.post("/api/logout");

      // optional: bersihkan state
      setUser(null);

      // redirect ke login
      navigate("/login");

    } catch (err) {
      console.error("Logout error:", err.response);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <h1>Home Page</h1>

      {user && (
        <>
          <span className="text-green-600 font-semibold">
            - {user.name}
          </span>

          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-3 py-1 rounded"
          >
            Logout
          </button>
        </>
      )}
    </div>
  );
}

export default Home;