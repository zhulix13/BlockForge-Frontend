import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor to handle common errors (e.g., 401 Unauthorized)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle deactivation or expired session
      // This could trigger a logout or redirect to banned screen if the message matches
      if (error.response.data?.message === 'Account is deactivated.') {
         window.location.href = '/banned';
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
