import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://127.0.0.1:8000/api/",
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// ✅ Add Authorization header automatically if token exists
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      // 🚀 FIXED: Reverted to 'Token' because the backend uses TokenAuthentication
      config.headers.Authorization = `Token ${token}`; 
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
