import { useEffect, useState } from "react";
import API from "../services/api";

function Home() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const testAPI = async () => {
      try {
        const res = await API.get("/user");
        console.log("SUCCESS:", res.data);
        setUser(res.data);
      } catch (err) {
        console.error("ERROR:", err.response);
      }
    };

    testAPI();
  }, []);

  return (
    <div className="flex items-center gap-2">
      <h1>Home Page</h1>

      {user && (
        <span className="text-green-600 font-semibold">
          - {user.name}
        </span>
      )}
    </div>
  );
}

export default Home;