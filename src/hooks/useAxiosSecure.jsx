
import axios from "axios";

import { useNavigate } from "react-router-dom";

import useAuth from "./useAuth";
import { getToken } from "../utils/cookies";


const AxiosSecure = axios.create({
    baseURL: import.meta.env.VITE_API_URL
})

const useAxiosSecure = () => {

    const navigate = useNavigate()
    const { logout } = useAuth()

    AxiosSecure.interceptors.request.use(function (config) {
        const token = getToken('access')
        if (token) {
            config.headers.authorization = `Bearer ${token}`
        }
        return config;

    }, function (error) {
        return Promise.reject(error)
    })

    AxiosSecure.interceptors.response.use(function (response) {
        return response;
    }, async function (error) {

        const status = error.response?.status;
        if (status === 401 || status === 403) {
            logout();
            navigate('/login')

        }


        return Promise.reject(error);
    });
    return AxiosSecure;
};

export default useAxiosSecure;
