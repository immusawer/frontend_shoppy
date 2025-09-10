// lib/api.ts
import axios from 'axios';
const API_URL = process.env.NEXT_PUBLIC_API_URL!;

// Create axios instance
export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // This is crucial for cookies
});

// Request interceptor to add headers
api.interceptors.request.use((config) => {
  // You don't need to manually add JWT for cookie-based auth
  return config;
});

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear any existing tokens
      localStorage.removeItem('access_token');
      document.cookie = 'access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      
      // Redirect to login page
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;