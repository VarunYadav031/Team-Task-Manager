import axios from "axios";

const DEFAULT_API_URL = import.meta.env.PROD ? "/api" : "http://localhost:8000/api";
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || DEFAULT_API_URL,
});

api.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default api;