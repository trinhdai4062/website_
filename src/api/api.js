import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useEffect } from 'react';
import { baseURL_ } from '../utils/env';

// console.log('baseURL_',baseURL_)
// Tạo một instance của axios
const api = axios.create({

  // baseURL: 'http://192.168.10.110:6969/v1',
  baseURL: baseURL_,
  // withCredentials: true,
});

const refreshAccessToken = async () => {
  try {
    const response = await axios.post(`${baseURL_}/auth/refresh`,{withCredentials:true});
    const { accessToken } = response.data.newAccessToken;
    console.log('newAccessToken',response)
    if(response.status===true){
      localStorage.setItem('accessToken', response.data.newAccessToken);
    }
    return accessToken;
  } catch (error) {
    console.error("Unable to refresh token", error.response.data.message);
    // return null;
  }
};

// Thêm một interceptor vào request để thêm access token vào header
api.interceptors.request.use(
  async (config) => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      const date=new Date();
      const exp  = jwtDecode(accessToken);
      if(exp.exp<date.getTime()/1000){
        const refreshToken =await refreshAccessToken()
        console.log('exp.exp',exp.exp)
        console.log('date:',date.getTime()/1000)
        console.log('refreshToken:',refreshToken)
      }
      config.headers['token'] = `Bearer ${accessToken}`;
    }
    // console.log('config:',config);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

let isRefreshing = false;

// Thêm một interceptor vào response để xử lý làm mới token
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    console.log('originalRequest',originalRequest)
    // if (error.response.status === 401 && !originalRequest._retry) {
    //   originalRequest._retry = true;

    //   if (!isRefreshing) {
    //     isRefreshing = true;
    //     const newAccessToken = await refreshAccessToken();
    //     isRefreshing = false;
        
    //     if (newAccessToken) {
    //       localStorage.setItem('accessToken', newAccessToken);
    //       originalRequest.headers['token'] = `Bearer ${newAccessToken}`;
    //       return api(originalRequest);
    //     } else {
    //       console.error('Failed to refresh token.');
    //     }
    //   }
    // }
    return Promise.reject(error);
  }
);

export default api;
