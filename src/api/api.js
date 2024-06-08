import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

// Tạo một instance của axios
const api = axios.create({
  baseURL: 'http://192.168.10.110:6969/v1'
});
export const checkTokenExpiration = (token) => {
    if (!token) return true;
    const { exp } = jwtDecode(token);
    if (!exp) return true;
    return (Date.now() >= exp * 1000);
  };

  export const refreshAccessToken = async () => {
    try {
      const response = await axios.post(`${api.defaults.baseURL}/auth/refresh`);
      const { accessToken } = response.data.newAccessToken;
      if(response.status===true){
        localStorage.setItem('accessToken', response.data.newAccessToken);
      }
      console.log('refreshToken',response)
      return accessToken;
    } catch (error) {
      console.error("Unable to refresh token", error);
      return null;
    }
  };

// Thêm một interceptor vào request để thêm access token vào header
api.interceptors.request.use(
  async (config) => {
    const accessToken = localStorage.getItem('accessToken');
    if (checkTokenExpiration(accessToken)) {
        accessToken = await refreshAccessToken();
      }
    if (accessToken) {
      config.headers['token'] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Thêm một interceptor vào response để xử lý làm mới token
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const newAccessToken = await refreshAccessToken();
      if (newAccessToken) {
        // axios.defaults.headers.common['token'] = `Bearer ${newAccessToken}`;
        originalRequest.headers['token'] = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
