import axios from 'axios';

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// Attach the JWT to every request once the user is logged in
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Normalize error responses so components can just read err.message
axiosClient.interceptors.response.use(
  (res) => res,
  (err) => {
    const message = err.response?.data?.error?.message || 'Something went wrong';
    const details = err.response?.data?.error?.details || null;
    return Promise.reject({ message, details, status: err.response?.status });
  }
);

export default axiosClient;
