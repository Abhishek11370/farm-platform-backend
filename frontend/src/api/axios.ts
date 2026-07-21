import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5003/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add JWT token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle auth errors globally and unwrap backend payloads
api.interceptors.response.use(
  (response) => {
    // Check if the backend sent its standard envelope: { success, message, data }
    const resData = response.data;
    if (resData && typeof resData === 'object' && ('success' in resData || 'data' in resData)) {
      // Some endpoints might return paginated responses with a meta field.
      // To prevent breaking things, if 'data' exists, we extract it. 
      // But we must be careful: some endpoints might just return the raw array.
      // Usually the TransformInterceptor always runs.
      if (resData.data !== undefined) {
        response.data = resData.data;
      }
    }
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Remove invalid token and allow AuthContext to handle redirect
      localStorage.removeItem('token');
    }
    return Promise.reject(error);
  }
);

export default api;
