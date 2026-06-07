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
          console.log('✅ Utilisateur chargé:', userData);
          setUser(userData);
        } catch (error) {
          console.error('❌ Erreur chargement utilisateur:', error);
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          Cookies.remove('access_token');
          Cookies.remove('refresh_token');
        }
      }
      setIsLoading(false);
    };
    
    checkAuth();
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const response = await authService.login(username, password);
      console.log('✅ Login réussi, token stocké');
      
      // Récupérer l'utilisateur après login
      const userData = await authService.getCurrentUser();
      setUser(userData);
      
      // Vérifier que le token est bien stocké
      const storedToken = localStorage.getItem('access_token');
      console.log('🔍 Vérification token après login:', !!storedToken);
      
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