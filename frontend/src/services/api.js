import axios from 'axios';

// Local dev → Vite proxies /api to localhost:5000
// Production (Render) → call backend directly
const isLocal =
  window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1';

const BACKEND = isLocal ? '/api' : 'https://careerfit-backend.onrender.com/api';

const API = axios.create({
  baseURL: BACKEND,
  timeout: 60000, // 60s — Render free tier cold start can take 30-60s
});

// Ping the backend on startup so it's warm when the user submits a form
axios.get(`${BACKEND}/health`).catch(() => {});

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
