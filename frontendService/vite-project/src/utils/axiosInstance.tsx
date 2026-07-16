import axios from "axios";

// falls back to "/" so requests go through our own nginx, which proxies /api and /auth to the gateway
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/",
});

// Add JWT token to every request if available
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;