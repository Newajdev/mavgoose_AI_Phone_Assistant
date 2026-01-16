import axios from "axios";
import { getToken, removeAllTokens } from "../utils/cookies";

const api = axios.create({
  baseURL: "http://172.252.13.97:8020",
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔑 attach token from cookie
api.interceptors.request.use((config) => {
  const token = getToken('access');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 🚪 auto logout on 401
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      removeAllTokens();
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export default api;
