// 'use client';

// import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
// import { useRouter } from 'next/navigation';
// import { authService } from '@/lib/api';
// import Cookies from 'js-cookie';

// interface User {
//     telephone: string;
//   id: number; email: string; username: string; nom: string; prenom: string; role: string;
// }

// interface AuthContextType {
//   user: User | null; isLoading: boolean; isAuthenticated: boolean;
//   login: (u: string, p: string) => Promise<void>;
//   logout: () => Promise<void>;
//   refreshUser: () => Promise<void>;
//   checkPermission: (roles: string[]) => boolean;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const useAuth = (): AuthContextType => {
//   const ctx = useContext(AuthContext);
//   if (!ctx) throw new Error('useAuth doit être utilisé dans AuthProvider');
//   return ctx;
// };

// export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [loading, setLoading] = useState(true);
//   const router = useRouter();

//   const clearAuth = () => {
//     localStorage.removeItem('access_token');
//     localStorage.removeItem('refresh_token');
//     localStorage.removeItem('user');
//     Cookies.remove('access_token');
//     Cookies.remove('refresh_token');
//     setUser(null);
//   };

//   const refreshUser = useCallback(async () => {
//     const token = localStorage.getItem('access_token') || Cookies.get('access_token');
//     if (!token) { setLoading(false); return null; }
//     try {
//       const data = await authService.getCurrentUser();
//       setUser(data);
//       localStorage.setItem('user', JSON.stringify(data));
//       return data;
//     } catch (e: any) {
//       if (e.response?.status === 401) clearAuth();
//       return null;
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => { refreshUser(); }, [refreshUser]);

// // src/contexts/AuthContext.tsx - Correction du login
//   const login = useCallback(async (username: string, password: string) => {
//     setLoading(true);
//     try {
//       console.log('🔐 AuthContext login:', username);
//       const res = await authService.login(username, password);
      
//       // Récupérer l'utilisateur
//       const userData = await authService.getCurrentUser();
//       setUser(userData);
//       localStorage.setItem('user', JSON.stringify(userData));
      
//       router.push('/');
//     } catch (e: any) {
//       console.error('❌ Login error:', e);
      
//       // Extraire le message d'erreur
//       let msg = 'Erreur de connexion';
//       const detail = e.response?.data?.detail;
      
//       if (typeof detail === 'string') {
//         msg = detail;
//       } else if (Array.isArray(detail)) {
//         msg = detail.map((d: any) => d.msg || '').filter(Boolean).join(', ');
//       }
      
//       throw new Error(msg || 'Erreur de connexion');
//     } finally {
//       setLoading(false);
//     }
//   }, [router]);

//   const logout = useCallback(async () => {
//     authService.logout();
//     clearAuth();
//     router.push('/login');
//   }, [router]);

//   const checkPermission = useCallback((roles: string[]) => user ? roles.includes(user.role) : false, [user]);

//   // contexts/AuthContext.tsx - Ajouter updateUser

//   const updateUser = (userData: User) => {
//     setUser(userData);
//     localStorage.setItem('user', JSON.stringify(userData));
//   };


//   return (
//     <AuthContext.Provider value={{ user, isLoading: loading, isAuthenticated: !!user, login, logout, updateUser, refreshUser, checkPermission }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export default AuthContext;

// contexts/AuthContext.tsx

'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/lib/api';
import Cookies from 'js-cookie';
import { User, UserRole } from '@/types/user';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  updateUser: (userData: User) => void;
  checkPermission: (roles: string[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth doit être utilisé dans AuthProvider');
  return ctx;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const clearAuth = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    Cookies.remove('access_token');
    Cookies.remove('refresh_token');
    setUser(null);
  };

  // ✅ refreshUser retourne Promise<void>
  const refreshUser = useCallback(async () => {
    const token = localStorage.getItem('access_token') || Cookies.get('access_token');
    if (!token) { 
      setLoading(false); 
      return; 
    }
    try {
      const data = await authService.getCurrentUser();
      const userData: User = {
        id: data.id,
        email: data.email,
        username: data.username,
        nom: data.nom,
        prenom: data.prenom,
        role: data.role,
        status: data.status,
        is_active: data.is_active,
        created_at: data.created_at,
        telephone: data.telephone,
        photo_url: data.photo_url,
        is_default: data.is_default,
        last_login: data.last_login,
        updated_at: data.updated_at
      };
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (e: any) {
      if (e.response?.status === 401) clearAuth();
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { 
    refreshUser(); 
  }, [refreshUser]);

  const login = useCallback(async (username: string, password: string) => {
    setLoading(true);
    try {
      console.log('🔐 AuthContext login:', username);
      await authService.login(username, password);
      
      const data = await authService.getCurrentUser();
      const userData: User = {
        id: data.id,
        email: data.email,
        username: data.username,
        nom: data.nom,
        prenom: data.prenom,
        role: data.role,
        status: data.status,
        is_active: data.is_active,
        created_at: data.created_at,
        telephone: data.telephone,
        photo_url: data.photo_url,
        is_default: data.is_default,
        last_login: data.last_login,
        updated_at: data.updated_at
      };
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      
      router.push('/');
    } catch (e: any) {
      console.error('❌ Login error:', e);
      
      let msg = 'Erreur de connexion';
      const detail = e.response?.data?.detail;
      
      if (typeof detail === 'string') {
        msg = detail;
      } else if (Array.isArray(detail)) {
        msg = detail.map((d: any) => d.msg || '').filter(Boolean).join(', ');
      }
      
      throw new Error(msg || 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  }, [router]);

  const logout = useCallback(async () => {
    authService.logout();
    clearAuth();
    router.push('/login');
  }, [router]);

  const checkPermission = useCallback((roles: string[]) => 
    user ? roles.includes(user.role) : false, 
    [user]
  );

  const updateUser = useCallback((userData: User) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  }, []);

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isLoading: loading, 
        isAuthenticated: !!user, 
        login, 
        logout, 
        updateUser,
        refreshUser, 
        checkPermission 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;