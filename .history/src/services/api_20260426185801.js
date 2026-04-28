import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000",
  withCredentials: true,
  headers: {
    Accept: "application/json",
  },
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // jangan log apa pun
      return Promise.reject(error);
    }

    console.error(error);
    return Promise.reject(error);
  }
);

export default API;