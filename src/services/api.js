import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000",
  withCredentials: true,

  headers: {
    Accept: "application/json",
  },
});

// 🔥 INI YANG SELAMA INI KURANG
API.interceptors.request.use((config) => {
  const token = document.cookie
    .split("; ")
    .find(row => row.startsWith("XSRF-TOKEN="))
    ?.split("=")[1];

  if (token) {
    config.headers["X-XSRF-TOKEN"] = decodeURIComponent(token);
  }

  return config;
});

export default API;