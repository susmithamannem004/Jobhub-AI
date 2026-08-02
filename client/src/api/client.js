import axios from 'axios';

// In production on Vercel, frontend and API share the same domain.
// In development, Vite proxy forwards /api -> localhost:5000.
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 15000
});

// Response interceptor for unified error formatting
API.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || error.message || 'An unexpected error occurred';
    return Promise.reject(new Error(message));
  }
);

export default API;
