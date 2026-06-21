import axios from 'axios';

// Env-aware base URL:
//   - Development: Vite proxy forwards /api → localhost:5000 (from vite.config.js)
//   - Production:  Use VITE_API_URL env variable pointing to your deployed backend
//   - Fallback:    /api (works when frontend + backend are on the same domain)
const baseURL = import.meta.env.VITE_API_URL ?? '/api';

const api = axios.create({
  baseURL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

// Attach session ID to every request (anonymous auth)
api.interceptors.request.use((config) => {
  let sessionId = localStorage.getItem('medsave_session');
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem('medsave_session', sessionId);
  }
  config.headers['X-Session-Id'] = sessionId;
  return config;
});

// Global response error handler
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.code === 'ECONNABORTED') {
      err.message = 'Request timed out. Please try again.';
    } else if (!err.response) {
      err.message = 'Could not reach server. Check your connection.';
    }
    return Promise.reject(err);
  }
);

export default api;
