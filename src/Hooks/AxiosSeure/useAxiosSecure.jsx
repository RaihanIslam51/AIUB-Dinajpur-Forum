import axios from "axios";
import { useEffect } from "react";
import useAuth from "./useAuth";

// Create a single axios instance
const axiosSecure = axios.create({
  baseURL: "http://localhost:3000",
});

const useAxiosSecure = () => {
  const { UserData } = useAuth();

  // console.log("token", UserData?.accessToken || localStorage.getItem("access-token") || "No token yet");

  useEffect(() => {
    const requestInterceptor = axiosSecure.interceptors.request.use(
      (config) => {
        // Use UserData token or fallback to localStorage
        const token = UserData?.accessToken || localStorage.getItem("access-token");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    return () => {
      axiosSecure.interceptors.request.eject(requestInterceptor);
    };
  }, [UserData]);

  return axiosSecure;
};

export default useAxiosSecure;
