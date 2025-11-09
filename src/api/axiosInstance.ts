import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://eventix-booking.onrender.com/api/",
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Add Authorization header automatically if token exists
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Token ${token}`; 
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
