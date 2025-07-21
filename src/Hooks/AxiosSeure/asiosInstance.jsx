import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://server-two-ashen.vercel.app', // or your live server URL
 
});

export default axiosInstance;
