import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000', // or your live server URL
 
});

export default axiosInstance;
