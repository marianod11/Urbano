import axios from 'axios';

import authService from './AuthService';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000',
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const { token } = await authService.refresh();
        return axiosInstance({
          ...originalRequest,
          baseURL: 'http://localhost:5000',
          headers: {
            ...originalRequest.headers,
            Authorization: `Bearer ${token}`,
          },
        });
      } catch (err) {
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  },
);

console.log(axiosInstance.defaults.baseURL);

export default axiosInstance;
