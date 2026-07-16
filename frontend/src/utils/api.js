import axios from "axios";

const api = axios.create({
  baseURL: typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")
    ? "http://localhost:5000"
    : "https://placement-connect-backend.onrender.com",
  withCredentials: true, // Crucial for cookie-parser authentication to work!
});

// Fallback: Attach token in headers if cached in localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default api;
