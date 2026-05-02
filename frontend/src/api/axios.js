import axios from "axios";

const baseURL = "https://affectionate-reverence-production-a566.up.railway.app/api";

const api = axios.create({
  baseURL,
});

api.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default api;