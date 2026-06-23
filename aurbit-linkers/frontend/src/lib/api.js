import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach token from localStorage on every request, if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('aurbit_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Surface a clean error message for callers
export function getErrorMessage(err) {
  return (
    err?.response?.data?.message ||
    err?.message ||
    'Something went wrong. Please try again.'
  );
}

export default api;
