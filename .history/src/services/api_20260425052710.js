import axios from "axios";

const API = axios.create({
  baseURL: "https://c35wz917-8000.asse.devtunnels.ms/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// otomatis kirim token kalau ada
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default API;