import axios from "axios";

// ✅ FINAL BASE URL (LOCAL + PRODUCTION)
const baseURL =
  import.meta.env.MODE === "development"
    ? "http://localhost:8000/api"
    : "https://affectionate-reverence-production-a566.up.railway.app/api";

// ✅ AXIOS INSTANCE
const api = axios.create({
  baseURL,
});

// ✅ TOKEN AUTOMATICALLY ADD (FOR PROTECTED ROUTES)
api.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

export default api;