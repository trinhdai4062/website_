import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useEffect } from "react";
import { baseURL_ } from "../utils/env";
import { useSelector, useDispatch } from "react-redux";
import {  doLoginSuccess,authReducer } from "../redux/reducer/authReducer";
// console.log('baseURL_',baseURL_)
// Tạo một instance của axios
const api = axios.create({
  baseURL: baseURL_,
  withCredentials: true,
});

export const refreshAccessToken = async () => {
  try {
    const response = await axios.post(
      `${baseURL_}/auth/refresh`,
      {},
      { withCredentials: true }
    );
    const { accessToken } = response.data.newAccessToken;
    if (response.status === true) {
      localStorage.setItem('access_token', accessToken)
    }
    return accessToken;
  } catch (error) {
    console.error("Unable to refresh token", error.response?.data?.message);
    return null; 
  }
};

api.interceptors.request.use(
  async (config) => {
    const accessToken = localStorage.getItem('access_token');
    if (accessToken !== null) {
      const date = new Date();
      const exp = jwtDecode(accessToken);
      // if (exp.exp < date.getTime() / 1000) {
      //   const refreshToken = await refreshAccessToken();
      //   console.log("exp.exp", exp.exp);
      //   console.log("date:", date.getTime() / 1000);
      //   console.log("refreshToken:", refreshToken);
      // }
      config.headers["token"] = `Bearer ${accessToken}`;
    }
    console.log("config:", config);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    console.log("originalRequest", originalRequest);
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
