import axios from "axios";

const api = axios.create({
  baseURL: "http://172.252.13.97:8020",
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔑 attach token
api.interceptors.request.use((config) => {
  const auth = JSON.parse(localStorage.getItem("auth"));
  if (auth?.access) {
    config.headers.Authorization = `Bearer ${auth.access}`;
  }
  return config;
});

// 🚪 auto logout on 401
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      localStorage.removeItem("auth");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export default api;
