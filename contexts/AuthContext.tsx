'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '@/lib/api';
import Cookies from 'js-cookie';

interface User {
  id: number;
  email: string;
  username: string;
  nom: string;
  prenom: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('access_token') || Cookies.get('access_token');
      console.log('🔍 Vérification auth - Token présent:', !!token);
      
      if (token) {
        try {
          const userData = await authService.getCurrentUser();
          console.log('✅ Utilisateur chargé:', userData?.email);
          setUser(userData);
        } catch (error: any) {
          // Si erreur 401, token invalide
          if (error.response?.status === 401) {
            console.log('❌ Token invalide, nettoyage');
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            Cookies.remove('access_token');
            Cookies.remove('refresh_token');
          } else {
            console.error('❌ Erreur chargement utilisateur:', error);
          }
        }
      }
      setIsLoading(false);
    };
    
    checkAuth();
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const response = await authService.login(username, password);
      console.log('✅ Login réussi');
      
      const userData = await authService.getCurrentUser();
      setUser(userData);
      
    } catch (error) {
      console.error('❌ Login failed:', error);
      throw error;
    }
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};