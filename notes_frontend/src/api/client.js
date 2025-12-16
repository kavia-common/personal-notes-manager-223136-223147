import axios from 'axios';

/**
 * API client configured with base URL and JWT auth.
 * Base URL is read from REACT_APP_API_BASE_URL or defaults to http://localhost:3001
 */
const baseURL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json'
  },
  // withCredentials can be enabled if backend sets cookies.
  withCredentials: false
});

// Attach Authorization header if a token is present.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('notesapp_token');
  if (token) {
    // eslint-disable-next-line no-param-reassign
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 responses globally by clearing session and redirecting to login.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      try {
        localStorage.removeItem('notesapp_token');
      } catch (e) {
        // ignore
      }
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
export { baseURL };
