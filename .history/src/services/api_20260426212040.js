import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000",
  withCredentials: true,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

// Let Axios handle CSRF automatically
API.defaults.xsrfCookieName = "XSRF-TOKEN";
API.defaults.xsrfHeaderName = "X-XSRF-TOKEN";

API.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error.response?.status;

        // expected auth state → ignore silently
        if (status === 401) {
            return Promise.reject(error);
        }

        console.error(error);
        return Promise.reject(error);
    }
);

export default API;