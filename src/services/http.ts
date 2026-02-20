import axios, { type AxiosInstance } from 'axios';

export const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const http: AxiosInstance = axios.create({
  baseURL: BASE_URL,
});

http.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Attach selected meter ID from URL path for multi-tenancy
  // Path format: /:meterId/page
  const segments = window.location.pathname.split('/');
  const meterId = segments[1];
  if (meterId && meterId !== 'login' && meterId !== 'register' && meterId !== 'verify-otp' && meterId !== 'onboarding' && meterId !== 'onboarding-success') {
    config.headers['x-meter-id'] = meterId;
  }

  return config;
});
