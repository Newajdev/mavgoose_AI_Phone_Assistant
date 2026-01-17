import axios from "axios";
import { getToken, removeAllTokens } from "../utils/cookies";

const api = axios.create({
  baseURL: "http://172.252.13.97:8020",
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔑 attach access token from localStorage("user")
api.interceptors.request.use(
  (config) => {
    const savedAuth = JSON.parse(localStorage.getItem("auth"));

    if (savedAuth?.access) {
      config.headers.Authorization = `Bearer ${savedAuth.access}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);


// 🚪 auto logout if token invalid
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      localStorage.removeItem("auth");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export default api;
