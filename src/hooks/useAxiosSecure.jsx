import axios from "axios";
import { useNavigate } from "react-router-dom";
import useAuth from "./useAuth";
import { getToken } from "../utils/cookies";

const AxiosSecure = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // 🔥 REQUIRED
});

const useAxiosSecure = () => {
  const navigate = useNavigate();
  const { logOutUser } = useAuth();

  AxiosSecure.interceptors.response.use(
    (response) => response,
    async (error) => {
      const status = error?.response?.status;
      if (status === 401 || status === 403) {
        await logOutUser();
        navigate("/login");
      }
      return Promise.reject(error);
    }
  );

  return AxiosSecure;
};

export default useAxiosSecure;
