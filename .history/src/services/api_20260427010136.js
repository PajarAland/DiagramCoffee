import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000",
  withCredentials: true,

  // 🔥 pindahkan ke sini
  xsrfCookieName: "XSRF-TOKEN",
  xsrfHeaderName: "X-XSRF-TOKEN",

  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      return Promise.reject(error);
    }

    console.error(error);
    return Promise.reject(error);
  }
);

await API.get("/sanctum/csrf-cookie").then(res => {
    console.log("CSRF OK");
});

export default API;