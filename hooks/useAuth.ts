// src/hooks/useAuth.ts
'use client';

import { createContext, useContext } from 'react';

export interface User {
  id: number;
  username: string;
  email: string;
  role: 'admin' | 'gestionnaire' | 'agent';
  nom?: string;
  prenom?: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  checkPermission: (roles: string[]) => boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth doit être utilisé à l\'intérieur d\'un AuthProvider');
  }
  return context;
}