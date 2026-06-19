// services/userService.ts
import api from '@/lib/api';
import { User, UserCreate, UserUpdate, UserRole, UserStatus } from '@/types/user';

interface UserFilters {
  role?: UserRole;
  status?: UserStatus;
  search?: string;
  limit?: number;
  skip?: number;
}

class UserService {
  /**
   * Récupérer tous les utilisateurs
   */
  async getAll(params?: UserFilters): Promise<User[]> {
    try {
      const urlParams = new URLSearchParams();
      if (params?.role) urlParams.append('role', params.role);
      if (params?.status) urlParams.append('status', params.status);
      if (params?.search) urlParams.append('search', params.search);
      if (params?.limit) urlParams.append('limit', params.limit.toString());
      if (params?.skip) urlParams.append('skip', params.skip.toString());
      
      const url = `/users${urlParams.toString() ? `?${urlParams.toString()}` : ''}`;
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Erreur récupération utilisateurs:', error);
      return [];
    }
  }

  /**
   * Récupérer un utilisateur par son ID
   */
    async getById(id: number): Promise<User | null> {
    try {
        const response = await api.get(`/users/${id}`);
        // ✅ Retourner exactement le même type que User
        return response.data;
    } catch (error: any) {
        if (error.response?.status === 404) return null;
        console.error('Erreur récupération utilisateur:', error);
        throw error;
    }
    }

  /**
   * Créer un utilisateur
   */
  async create(data: UserCreate): Promise<User> {
    try {
      // ✅ Utiliser le bon chemin avec slash à la fin
      const response = await api.post('/users/', data);
      return response.data;
    } catch (error) {
      console.error('Erreur création utilisateur:', error);
      throw error;
    }
  }

  /**
   * Mettre à jour un utilisateur
   */
    async update(id: number, data: UserUpdate): Promise<User> {
    try {
        const response = await api.put(`/users/${id}`, data);
        const user = response.data;
        // ✅ Retourner exactement le même type que User (telephone?: string)
        return user;  // Pas de transformation
    } catch (error) {
        console.error('Erreur mise à jour utilisateur:', error);
        throw error;
    }
    }

  /**
   * Supprimer un utilisateur
   */
  async delete(id: number): Promise<boolean> {
    try {
      await api.delete(`/users/${id}`);
      return true;
    } catch (error) {
      console.error('Erreur suppression utilisateur:', error);
      throw error;
    }
  }

  /**
   * Activer un utilisateur
   */
  async activate(id: number): Promise<boolean> {
    try {
      await api.post(`/users/${id}/activate`);
      return true;
    } catch (error) {
      console.error('Erreur activation utilisateur:', error);
      throw error;
    }
  }

  /**
   * Suspendre un utilisateur
   */
  async suspend(id: number): Promise<boolean> {
    try {
      await api.post(`/users/${id}/suspend`);
      return true;
    } catch (error) {
      console.error('Erreur suspension utilisateur:', error);
      throw error;
    }
  }

  /**
   * Réinitialiser le mot de passe (admin)
   */
  async resetPassword(id: number): Promise<{ temporary_password: string }> {
    try {
      const response = await api.post(`/users/${id}/reset-password`);
      return response.data;
    } catch (error) {
      console.error('Erreur réinitialisation mot de passe:', error);
      throw error;
    }
  }
}

export const userService = new UserService();