import { useEffect } from "react";
import API from "../services/api";

function Home() {

  useEffect(() => {
    const testAPI = async () => {
      try {
        const res = await API.get("/user");
        console.log("SUCCESS:", res.data);
      } catch (err) {
        console.error("ERROR:", err.response);
      }
    };

    testAPI();
  }, []);

  return <h1>Home Page</h1>;
}

export default Home;