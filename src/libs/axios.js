import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔐 Attach access token automatically
api.interceptors.request.use(
  (config) => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      if (parsedUser?.access) {
        config.headers.Authorization = `Bearer ${parsedUser.access}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
