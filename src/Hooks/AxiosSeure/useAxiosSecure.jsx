import axios from 'axios';
import useAuth from './useAuth';

// Create an axios instance
const axiosSecure = axios.create({
  baseURL: 'https://server-two-ashen.vercel.app',
});



// Custom hook to set up interceptor
const useAxiosSecure = () => {
  const { UserData } = useAuth();
  // console.log("userrrr",UserData?.accessToken);
  
  // Attach the token to request headers
  axiosSecure.interceptors.request.use(
    (config) => {
      if (UserData?.accessToken) {
        config.headers.Authorization = `Bearer ${UserData.accessToken}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  return axiosSecure;
};

export default useAxiosSecure;
