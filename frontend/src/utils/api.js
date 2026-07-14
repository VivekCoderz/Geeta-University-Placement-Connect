import axios from "axios";

const api = axios.create({
  //   baseURL: 'http://localhost:5000',
  baseURL: "https://placement-connect-backend.onrender.com",
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
