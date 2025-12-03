import axios, { InternalAxiosRequestConfig } from "axios";

// Base URL from environment variables or default
const API_BASE_URL =
  (import.meta as any).env.VITE_API_BASE_URL ||
  "https://eventix-backend2.onrender.com/api";

console.log("🌐 Axios Base URL:", API_BASE_URL);

// Create Axios instance
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to handle token and FormData
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    try {
      const token = localStorage.getItem("eventix_token");

      // Ensure headers object exists
      config.headers = config.headers || {};

      // Add Authorization header if token exists
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log("✅ Token added to request");
      }

      // Remove Content-Type for FormData to allow browser to set boundary
      if (config.data instanceof FormData) {
        delete (config.headers as any)["Content-Type"];
        console.log("📝 Content-Type removed for FormData request");
      }

      return config;
    } catch (err) {
      console.error("🚨 Axios Request Interceptor Error:", err);
      return Promise.reject(err);
    }
  },
  (error) => {
    console.error("🚨 Axios Request Error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor for logging and error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error(
      "🚨 Axios Response Error:",
      error.response?.status,
      error.response?.data || error.message
    );
    return Promise.reject(error);
  }
);

export default axiosInstance;
