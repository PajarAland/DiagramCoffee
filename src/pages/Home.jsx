import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Home() {
  const { user, logout, initialized } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout(); // dari context
      navigate("/login");
    } catch (err) {
      console.error("Logout error:", err.response);
    }
  };

  if (!initialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

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