import axios from 'axios';
import Cookies from 'js-cookie';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Intercepteur pour ajouter le token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token') || Cookies.get('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error(`❌ Erreur ${error.response?.status}:`, error.response?.data);
    return Promise.reject(error);
  }
);

// Services d'authentification
export const authService = {
  login: async (username: string, password: string) => {
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);
    
    const response = await api.post('/auth/login', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    
    if (response.data.access_token) {
      localStorage.setItem('access_token', response.data.access_token);
      Cookies.set('access_token', response.data.access_token, { expires: 1, path: '/' });
    }
    if (response.data.refresh_token) {
      localStorage.setItem('refresh_token', response.data.refresh_token);
      Cookies.set('refresh_token', response.data.refresh_token, { expires: 7, path: '/' });
    }
    
    return response.data;
  },
  
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
  
  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      Cookies.remove('access_token');
      Cookies.remove('refresh_token');
    }
  },
};

// Dashboard Service
export const dashboardService = {
  getStats: async () => {
    const response = await api.get('/dashboard/stats');
    return response.data;
  },
  
  getEvolution: async (mois: number = 12) => {
    const response = await api.get(`/dashboard/evolution?mois=${mois}`);
    return response.data;
  },
  
  getPerformanceBatiments: async () => {
    const response = await api.get('/dashboard/performance/batiments');
    return response.data;
  },
  
  getTopLocataires: async (limit: number = 10) => {
    const response = await api.get(`/dashboard/top-locataires?limit=${limit}`);
    return response.data;
  },
  
  getAlertes: async () => {
    const response = await api.get('/dashboard/alertes');
    return response.data;
  },
};

export default api;