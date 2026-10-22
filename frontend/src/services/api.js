import axios from 'axios';

// Local dev → Vite proxies /api to localhost:5000
// Production (Render) → call backend directly
const isLocal =
  window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1';

const API = axios.create({
  baseURL: isLocal ? '/api' : 'https://careerfit-backend.onrender.com/api',
});

// Request interceptor to attach JWT token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('careerfit_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default API;
