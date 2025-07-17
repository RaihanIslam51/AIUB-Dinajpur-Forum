import React from 'react';
import axios from 'axios'

const useAxiosSesure = () => {

  const instance = axios.create({
  baseURL: `http://localhost:3000`
});
  return instance
    
  }
export default useAxiosSesure;