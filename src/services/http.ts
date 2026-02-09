import axios, { type AxiosInstance } from 'axios';

export const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const http: AxiosInstance = axios.create({
  baseURL: BASE_URL,
});

// Attach Bearer token to every request if available
http.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
