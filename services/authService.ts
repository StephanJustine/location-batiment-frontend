// src/services/authService.ts ou src/lib/api.ts
import api from '@/lib/axios';

export const authService = {
  login: async (username: string, password: string) => {
    // Utiliser FormData ou JSON selon ce que le backend attend
    const response = await api.post('/auth/login', {
      username: username,
      password: password
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  },

  // Alternative si le backend utilise form-data
  loginFormData: async (username: string, password: string) => {
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);
    
    const response = await api.post('/auth/login', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // Ignorer les erreurs
    }
  }
};