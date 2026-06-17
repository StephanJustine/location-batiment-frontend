// services/employeService.ts
import api from '@/lib/api';
import { Employe, TypeEmploye, StatutEmploye } from '@/types/employe';

export interface EmployeFilters {
  batiment_id?: number;
  type_employe?: TypeEmploye;
  statut?: StatutEmploye;
  search?: string;
  limit?: number;
  skip?: number;
}

class EmployeService {
  /**
   * Récupérer tous les employés
   */
  async getAll(params?: EmployeFilters): Promise<Employe[]> {
    try {
      const urlParams = new URLSearchParams();
      if (params?.batiment_id) urlParams.append('batiment_id', params.batiment_id.toString());
      if (params?.type_employe) urlParams.append('type_employe', params.type_employe);
      if (params?.statut) urlParams.append('statut', params.statut);
      if (params?.search) urlParams.append('search', params.search);
      if (params?.limit) urlParams.append('limit', params.limit.toString());
      if (params?.skip) urlParams.append('skip', params.skip.toString());
      
      const url = `/employes${urlParams.toString() ? `?${urlParams.toString()}` : ''}`;
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Erreur récupération employés:', error);
      return [];
    }
  }

  /**
   * Récupérer un employé par son ID
   */
  async getById(id: number): Promise<Employe | null> {
    try {
      const response = await api.get(`/employes/${id}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) return null;
      console.error('Erreur récupération employé:', error);
      throw error;
    }
  }

  /**
   * Créer un employé
   */
  async create(data: Partial<Employe>): Promise<Employe> {
    try {
      const response = await api.post('/employes', data);
      return response.data;
    } catch (error) {
      console.error('Erreur création employé:', error);
      throw error;
    }
  }

  /**
   * Mettre à jour un employé
   */
  async update(id: number, data: Partial<Employe>): Promise<Employe> {
    try {
      const response = await api.put(`/employes/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Erreur mise à jour employé:', error);
      throw error;
    }
  }

  /**
   * Supprimer un employé
   */
  async delete(id: number): Promise<boolean> {
    try {
      await api.delete(`/employes/${id}`);
      return true;
    } catch (error) {
      console.error('Erreur suppression employé:', error);
      throw error;
    }
  }

  /**
   * Récupérer les absences d'un employé
   */
  async getAbsences(employeId: number, enCours?: boolean): Promise<any[]> {
    try {
      const url = `/employes/${employeId}/absences${enCours ? '?en_cours=true' : ''}`;
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Erreur récupération absences:', error);
      return [];
    }
  }

  /**
   * Récupérer les paies d'un employé
   */
  async getPaies(employeId: number, annee?: number): Promise<any[]> {
    try {
      const url = `/employes/${employeId}/paies${annee ? `?annee=${annee}` : ''}`;
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Erreur récupération paies:', error);
      return [];
    }
  }

  /**
   * Récupérer les interventions d'un employé
   */
  async getInterventions(employeId: number): Promise<any[]> {
    try {
      const response = await api.get(`/employes/${employeId}/interventions`);
      return response.data;
    } catch (error) {
      console.error('Erreur récupération interventions:', error);
      return [];
    }
  }

  /**
   * Récupérer les statistiques des employés
   */
  async getStats(batimentId?: number): Promise<any> {
    try {
      const url = `/employes/statistiques/general${batimentId ? `?batiment_id=${batimentId}` : ''}`;
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Erreur récupération statistiques:', error);
      return null;
    }
  }
}

export const employeService = new EmployeService();
