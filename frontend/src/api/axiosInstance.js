import axios from 'axios';
import { ROUTES } from '../constants/messages';

const baseURL = import.meta.env.VITE_API_BASE_URL;
const basePath = (import.meta.env.BASE_URL || '/').replace(/\/$/, '');

if (!baseURL) {
  console.warn('VITE_API_BASE_URL is not set. API calls may fail.');
}

const axiosInstance = axios.create({
  baseURL: baseURL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message || error.message;

    if (status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      const loginPath = `${basePath}${ROUTES.LOGIN}`;
      const registerPath = `${basePath}${ROUTES.REGISTER}`;
      const pathname = window.location.pathname;
      if (!pathname.includes(ROUTES.LOGIN) && !pathname.includes(ROUTES.REGISTER)) {
        window.location.href = loginPath;
      }
    }

    return Promise.reject({ ...error, message });
  }
);

export default axiosInstance;
