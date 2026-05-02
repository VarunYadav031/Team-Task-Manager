import axios from "axios";

// Production deployment always uses relative path (/api)
// Local development uses localhost or VITE_API_URL
let baseURL;

// Check if we're in production mode (build-time flag)
if (import.meta.env.PROD) {
  // Always use relative path for production deployment
  baseURL = "/api";
} else {
  // For local development
  baseURL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";
}

const api = axios.create({
  baseURL: baseURL,
});

// Add request interceptor for authentication
api.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default api;