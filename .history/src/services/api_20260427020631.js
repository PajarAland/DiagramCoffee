// import axios from "axios";

// const API = axios.create({
//   baseURL: "http://localhost:8000",
//   withCredentials: true,

//   // 🔥 pindahkan ke sini
//   xsrfCookieName: "XSRF-TOKEN",
//   xsrfHeaderName: "X-XSRF-TOKEN",

//   headers: {
//     Accept: "application/json",
//     "Content-Type": "application/json",
//   },
// });

// API.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       return Promise.reject(error);
//     }

//     console.error(error);
//     return Promise.reject(error);
//   }
// );

// export default API;

import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000",
  withCredentials: true,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

// ✅ FIX: attach CSRF token manually
API.interceptors.request.use((config) => {
  const token = document.cookie
    .split("; ")
    .find((row) => row.startsWith("XSRF-TOKEN="))
    ?.split("=")[1];

  if (token && !config.headers["X-XSRF-TOKEN"]) {
    config.headers["X-XSRF-TOKEN"] = decodeURIComponent(token);
  }

  return config;
});

// existing response interceptor
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // silent for auth check
      return Promise.reject(error);
    }

    console.error(error);
    return Promise.reject(error);
  }
);

export default API;