// import axios from 'axios';
// import Cookies from 'js-cookie';

// // FORCER l'URL dynamique basée sur l'IP du navigateur
// const getBackendURL = () => {
//   if (typeof window !== 'undefined') {
//     const hostname = window.location.hostname;
//     // Si on est sur localhost ou 127.0.0.1
//     if (hostname === 'localhost' || hostname === '127.0.0.1') {
//       return 'http://localhost:8000/api/v1';
//     }
//     // Sinon, utiliser la même IP que le frontend
//     return `http://${hostname}:8000/api/v1`;
//   }
//   return 'http://localhost:8000/api/v1';
// };

// const API_BASE_URL = getBackendURL();
// console.log('🎯 Backend URL:', API_BASE_URL);

// const api = axios.create({
//   baseURL: API_BASE_URL,
//   headers: {
//     'Content-Type': 'application/json',
//   },
//   timeout: 15000,
// });

// // Intercepteur simple et efficace
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem('access_token') || Cookies.get('access_token');
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   console.log(`📡 ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
//   return config;
// });

// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     console.error(`💥 ${error.message}`);
//     return Promise.reject(error);
//   }
// );

// export const authService = {
//   login: async (username: string, password: string) => {
//     const formData = new URLSearchParams();
//     formData.append('username', username);
//     formData.append('password', password);
    
//     console.log(`🔐 Login: ${username} → ${API_BASE_URL}/auth/login`);
    
//     const response = await api.post('/auth/login', formData, {
//       headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
//     });
    
//     if (response.data.access_token) {
//       localStorage.setItem('access_token', response.data.access_token);
//       Cookies.set('access_token', response.data.access_token, { expires: 1, path: '/' });
//       console.log('✅ Token stocké');
//     }
    
//     return response.data;
//   },
  
//   getCurrentUser: async () => {
//     const response = await api.get('/auth/me');
//     return response.data;
//   },
  
//   logout: async () => {
//     localStorage.removeItem('access_token');
//     localStorage.removeItem('refresh_token');
//     Cookies.remove('access_token');
//     Cookies.remove('refresh_token');
//     console.log('👋 Déconnecté');
//   },
// };

// export const dashboardService = {
//   getStats: async () => {
//     try { const r = await api.get('/dashboard/stats'); return r.data; } catch { return {}; }
//   },
//   getEvolution: async () => { try { const r = await api.get('/dashboard/evolution?mois=12'); return r.data; } catch { return []; } },
//   getPerformanceBatiments: async () => { try { const r = await api.get('/dashboard/performance/batiments'); return r.data; } catch { return []; } },
//   getTopLocataires: async () => { try { const r = await api.get('/dashboard/top-locataires?limit=10'); return r.data; } catch { return []; } },
//   getAlertes: async () => { try { const r = await api.get('/dashboard/alertes'); return r.data; } catch { return { urgent: [], moyen: [], faible: [] }; } },
// };

// export default api;





// lib/api.ts
import axios from 'axios';
import Cookies from 'js-cookie';

// D'abord vérifier les variables d'environnement, puis fallback
const getBackendURL = () => {
  // 1. PRIORITÉ à la variable d'environnement
  if (process.env.NEXT_PUBLIC_API_URL) {
    console.log('📡 Using API from .env:', process.env.NEXT_PUBLIC_API_URL);
    return process.env.NEXT_PUBLIC_API_URL;
  }
  
  // 2. Fallback à la détection dynamique
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'http://localhost:8000/api/v1';
    }
    return `http://${hostname}:8000/api/v1`;
  }
  
  return 'http://localhost:8000/api/v1';
};

const API_BASE_URL = getBackendURL();
console.log('🎯 Backend URL:', API_BASE_URL);
console.log('📝 Environment variable:', process.env.NEXT_PUBLIC_API_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // Augmenter le timeout à 30s
});

// Intercepteur pour les requêtes
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token') || Cookies.get('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log(`📡 ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
  return config;
});

// Intercepteur pour les réponses avec meilleure gestion d'erreur
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNABORTED') {
      console.error(`💥 Timeout de ${error.config?.timeout}ms - Le serveur ${API_BASE_URL} ne répond pas`);
      console.error('   Vérifiez que le backend FastAPI est démarré sur:', API_BASE_URL);
    } else if (error.response) {
      console.error(`❌ Erreur ${error.response.status}:`, error.response.data);
    } else if (error.request) {
      console.error('❌ Pas de réponse du serveur');
      console.error('   Backend URL:', API_BASE_URL);
    } else {
      console.error(`💥 ${error.message}`);
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: async (username: string, password: string) => {
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);
    
    console.log(`🔐 Login: ${username} → ${API_BASE_URL}/auth/login`);
    
    try {
      const response = await api.post('/auth/login', formData, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });
      
      if (response.data.access_token) {
        localStorage.setItem('access_token', response.data.access_token);
        Cookies.set('access_token', response.data.access_token, { expires: 1, path: '/' });
        console.log('✅ Token stocké');
      }
      
      return response.data;
    } catch (error) {
      console.error('❌ Login failed');
      throw error;
    }
  },
  
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
  
  logout: async () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    Cookies.remove('access_token');
    Cookies.remove('refresh_token');
    console.log('👋 Déconnecté');
  },
};

export const dashboardService = {
  getStats: async () => {
    try { const r = await api.get('/dashboard/stats'); return r.data; } catch { return {}; }
  },
  getEvolution: async () => { try { const r = await api.get('/dashboard/evolution?mois=12'); return r.data; } catch { return []; } },
  getPerformanceBatiments: async () => { try { const r = await api.get('/dashboard/performance/batiments'); return r.data; } catch { return []; } },
  getTopLocataires: async () => { try { const r = await api.get('/dashboard/top-locataires?limit=10'); return r.data; } catch { return []; } },
  getAlertes: async () => { try { const r = await api.get('/dashboard/alertes'); return r.data; } catch { return { urgent: [], moyen: [], faible: [] }; } },
};

export default api;