import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000",
  withCredentials: true, 
  headers: {
    'Accept': 'application/json',
    "Content-Type": "application/json",
  },
});

export default API;