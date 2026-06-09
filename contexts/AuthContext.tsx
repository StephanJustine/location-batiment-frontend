// // src/contexts/AuthContext.tsx
// 'use client';

// import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
// import { useRouter } from 'next/navigation';
// import api from '@/lib/axios';
// import Cookies from 'js-cookie';

// // Types
// export interface User {
//   id: number;
//   email: string;
//   username: string;
//   nom?: string;
//   prenom?: string;
//   role: 'admin' | 'gestionnaire' | 'agent';
// }

// export interface AuthContextType {
//   user: User | null;
//   isLoading: boolean;
//   isAuthenticated: boolean;
//   login: (username: string, password: string) => Promise<void>;
//   logout: () => Promise<void>;
//   checkPermission: (roles: string[]) => boolean;
//   refreshUser: () => Promise<void>;
// }

// // Création du contexte
// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// // Hook personnalisé
// export const useAuth = (): AuthContextType => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth doit être utilisé à l\'intérieur d\'un AuthProvider');
//   }
//   return context;
// };

// // Provider
// export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const router = useRouter();

//   // Fonction pour récupérer l'utilisateur courant
//   const refreshUser = useCallback(async () => {
//     try {
//       const token = localStorage.getItem('access_token') || Cookies.get('access_token');
      
//       if (token) {
//         const response = await api.get('/auth/me');
//         setUser(response.data);
//         return response.data;
//       }
//       return null;
//     } catch (error: any) {
//       console.error('Erreur récupération utilisateur:', error);
//       if (error.response?.status === 401) {
//         // Token invalide, nettoyage
//         localStorage.removeItem('access_token');
//         localStorage.removeItem('refresh_token');
//         Cookies.remove('access_token');
//         Cookies.remove('refresh_token');
//         setUser(null);
//       }
//       return null;
//     }
//   }, []);

//   // Vérification initiale de l'authentification
//   useEffect(() => {
//     const checkAuth = async () => {
//       const token = localStorage.getItem('access_token') || Cookies.get('access_token');
      
//       if (token) {
//         await refreshUser();
//       }
      
//       setIsLoading(false);
//     };
    
//     checkAuth();
//   }, [refreshUser]);

//   // Fonction de connexion
//   const login = useCallback(async (username: string, password: string) => {
//     try {
//       setIsLoading(true);
      
//       const response = await api.post('/auth/login', {
//         username,
//         password
//       });

//       const { access_token, refresh_token } = response.data;

//       // Stocker les tokens
//       if (access_token) {
//         localStorage.setItem('access_token', access_token);
//         Cookies.set('access_token', access_token, { expires: 7, secure: true, sameSite: 'strict' });
//       }
      
//       if (refresh_token) {
//         localStorage.setItem('refresh_token', refresh_token);
//         Cookies.set('refresh_token', refresh_token, { expires: 30, secure: true, sameSite: 'strict' });
//       }

//       // Récupérer les informations utilisateur
//       const userData = await refreshUser();
      
//       if (!userData) {
//         throw new Error('Impossible de récupérer les informations utilisateur');
//       }

//       // Rediriger vers le dashboard
//       router.push('/');
      
//     } catch (error: any) {
//       console.error('Erreur de connexion:', error);
//       throw new Error(
//         error.response?.data?.detail || 
//         error.message || 
//         'Erreur lors de la connexion'
//       );
//     } finally {
//       setIsLoading(false);
//     }
//   }, [refreshUser, router]);

//   // Fonction de déconnexion
//   const logout = useCallback(async () => {
//     try {
//       // Appeler l'API de déconnexion (optionnel)
//       try {
//         await api.post('/auth/logout');
//       } catch {
//         // Ignorer les erreurs de l'API de logout
//       }
//     } finally {
//       // Nettoyer les tokens
//       localStorage.removeItem('access_token');
//       localStorage.removeItem('refresh_token');
//       localStorage.removeItem('user');
      
//       Cookies.remove('access_token');
//       Cookies.remove('refresh_token');
      
//       setUser(null);
      
//       // Rediriger vers la page de connexion
//       router.push('/login');
//     }
//   }, [router]);

//   // Vérifier les permissions
//   const checkPermission = useCallback((roles: string[]) => {
//     if (!user) return false;
//     return roles.includes(user.role);
//   }, [user]);

//   // Valeur du contexte
//   const value: AuthContextType = {
//     user,
//     isLoading,
//     isAuthenticated: Boolean(user),
//     login,
//     logout,
//     checkPermission,
//     refreshUser
//   };

//   return (
//     <AuthContext.Provider value={value}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export default AuthContext;



// src/contexts/AuthContext.tsx - Correction du login
'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
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
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  checkPermission: (roles: string[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé à l\'intérieur d\'un AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const refreshUser = useCallback(async () => {
    try {
      const token = localStorage.getItem('access_token') || Cookies.get('access_token');
      
      if (token) {
        const userData = await authService.getCurrentUser();
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        return userData;
      }
      return null;
    } catch (error: any) {
      console.error('Erreur refresh user:', error?.response?.status);
      
      if (error.response?.status === 401) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        Cookies.remove('access_token');
        Cookies.remove('refresh_token');
        setUser(null);
      }
      return null;
    }
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('access_token') || Cookies.get('access_token');
      
      if (token) {
        await refreshUser();
      }
      
      setIsLoading(false);
    };
    
    checkAuth();
  }, [refreshUser]);

  // 🔥 CORRECTION : Meilleure gestion des erreurs
  const login = useCallback(async (username: string, password: string) => {
    setIsLoading(true);
    
    try {
      console.log('🔐 Tentative de connexion pour:', username);
      
      // Appeler le service de login
      const response = await authService.login(username, password);
      console.log('✅ Réponse login reçue:', response);
      
      // Stocker les tokens
      if (response.access_token) {
        localStorage.setItem('access_token', response.access_token);
        Cookies.set('access_token', response.access_token, { 
          expires: 7, 
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict' 
        });
      }
      
      if (response.refresh_token) {
        localStorage.setItem('refresh_token', response.refresh_token);
        Cookies.set('refresh_token', response.refresh_token, { 
          expires: 30,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict'
        });
      }
      
      // Récupérer les informations utilisateur
      const userData = await authService.getCurrentUser();
      
      if (userData) {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        console.log('👤 Utilisateur connecté:', userData.email);
      }
      
      // Rediriger vers le dashboard
      router.push('/');
      
    } catch (error: any) {
      console.error('❌ Erreur login complète:', error);
      console.error('Status:', error.response?.status);
      console.error('Data:', JSON.stringify(error.response?.data));
      console.error('Message:', error.message);
      
      // 🔥 CORRECTION : Extraire le message d'erreur correctement
      let errorMessage = 'Erreur de connexion';
      
      if (error.response?.data) {
        const data = error.response.data;
        
        // Cas 1: Le backend renvoie { detail: "message" }
        if (typeof data.detail === 'string') {
          errorMessage = data.detail;
        }
        // Cas 2: Le backend renvoie { detail: [{ msg: "message" }] }
        else if (Array.isArray(data.detail)) {
          errorMessage = data.detail.map((e: any) => e.msg || JSON.stringify(e)).join(', ');
        }
        // Cas 3: Le backend renvoie { message: "message" }
        else if (data.message) {
          errorMessage = data.message;
        }
        // Cas 4: Erreur 422 validation
        else if (error.response.status === 422) {
          errorMessage = 'Erreur de validation. Vérifiez les champs.';
        }
        // Cas 5: Erreur 401
        else if (error.response.status === 401) {
          errorMessage = 'Nom d\'utilisateur ou mot de passe incorrect';
        }
      }
      
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [refreshUser, router]);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Erreur logout:', error);
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      Cookies.remove('access_token');
      Cookies.remove('refresh_token');
      setUser(null);
      router.push('/login');
    }
  }, [router]);

  const checkPermission = useCallback((roles: string[]) => {
    if (!user) return false;
    return roles.includes(user.role);
  }, [user]);

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    refreshUser,
    checkPermission
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;