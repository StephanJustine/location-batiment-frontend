// src/services/paiementSessionService.ts
import api from '@/lib/api';
import { PaiementSession, PaiementSessionStats, PaiementPayRequest, GenerateEcheancesRequest } from '@/types/paiementSession';

export interface SessionMensuelle {
  mois: number;
  annee: number;
  mois_nom: string;
  montant_du: number;
  montant_paye: number;
  montant_restant: number;
  est_complet: boolean;
  statut: string;
  nombre_sessions: number;
  nombre_paye: number;
  nombre_partiel: number;
  nombre_attente: number;
  nombre_retard: number;
  sessions: PaiementSession[];
}

export interface SessionsGlobalStats {
  annee: number;
  total_sessions: number;
  total_baux: number;
  total_montant_du: number;
  total_montant_paye: number;
  total_montant_restant: number;
  taux_paiement: number;
  taux_sessions_payees: number;
  nb_paye: number;
  nb_partiel: number;
  nb_attente: number;
  nb_retard: number;
  par_statut: {s: any
    paye: number;
    partiel: number;
    en_attente: number;
    en_retard: number;
  };
}

export const paiementSessionService = {
  // Récupérer les sessions d'un bail
  async getByBail(bailId: number, params?: { annee?: number; mois?: number; statut?: string }): Promise<PaiementSession[]> {
    const response = await api.get(`/paiements/sessions/bail/${bailId}`, { params });
    return response.data;
  },

  // Récupérer une session spécifique
  async getById(id: number): Promise<PaiementSession> {
    const response = await api.get(`/paiements/sessions/${id}`);
    return response.data;
  },

  // Générer les échéances
  async generateEcheances(bailId: number, data: GenerateEcheancesRequest): Promise<PaiementSession[]> {
    const response = await api.post(`/paiements/sessions/bail/${bailId}/generate`, data);
    return response.data;
  },

  // Enregistrer un paiement (avec gestion du reste)
  async paySession(sessionId: number, data: PaiementPayRequest): Promise<PaiementSession> {
    const response = await api.post(`/paiements/sessions/${sessionId}/pay`, data);
    return response.data;
  },

  // Obtenir les statistiques
  async getStats(bailId: number): Promise<PaiementSessionStats> {
    const response = await api.get(`/paiements/sessions/bail/${bailId}/stats`);
    return response.data;
  },

  // Récupérer les impayés
  async getImpayes(bailId?: number): Promise<PaiementSession[]> {
    const params = bailId ? { bail_id: bailId } : {};
    const response = await api.get('/paiements/sessions/impayes', { params });
    return response.data;
  },

  // Générer la quittance
  async generateQuittance(sessionId: number): Promise<Blob> {
    const response = await api.post(`/paiements/sessions/${sessionId}/quittance`, {
      responseType: 'blob'
    });
    return response.data;
  },

  // Générer une référence automatique
  async generateReference(bailId: number): Promise<string> {
    try {
      const response = await api.post(`/paiements/sessions/baux/${bailId}/paiements/generate-reference`);
      return response.data.reference;
    } catch (error) {
      const now = new Date();
      return `REF-${bailId}-${now.getFullYear()}${(now.getMonth()+1).toString().padStart(2,'0')}${now.getDate().toString().padStart(2,'0')}-${Date.now().toString().slice(-6)}`;
    }
  },

  // Récupérer le solde restant d'une session
  async getSoldeRestant(sessionId: number): Promise<number> {
    const session = await this.getById(sessionId);
    return (session.montant_total || 0) - (session.montant_paye || 0);
  },

  // Récupérer les sessions groupées par mois pour un bail
  async getSessionsByMonth(bailId: number, annee: number): Promise<PaiementSession[]> {
    const response = await api.get(`/paiements/sessions/bail/${bailId}`, { 
      params: { annee }
    });
    return response.data;
  },

  // Récupérer toutes les sessions pour l'année (tous baux)
  async getAllSessionsForYear(annee: number): Promise<PaiementSession[]> {
    // Cette méthode nécessite un endpoint spécifique côté backend
    // Alternative: parcourir les baux actifs
    const response = await api.get('/paiements/sessions/all', { params: { annee } });
    return response.data;
  },


    // ==================== ROUTES GLOBALES ====================
  
  // Récupérer toutes les sessions (tous baux)
  async getAllSessions(params?: { annee?: number; mois?: number; statut?: string; bail_id?: number; skip?: number; limit?: number }): Promise<PaiementSession[]> {
    const response = await api.get('/paiements/sessions/all', { params });
    return response.data;
  },

  // Récupérer toutes les sessions groupées par mois
  async getSessionsGroupedByMonth(annee: number): Promise<SessionMensuelle[]> {
    const response = await api.get('/paiements/sessions/all/grouped-by-month', { params: { annee } });
    return response.data;
  },

  // Récupérer les statistiques globales
  async getGlobalStats(annee: number): Promise<SessionsGlobalStats> {
    const response = await api.get('/paiements/sessions/all/stats', { params: { annee } });
    return response.data;
  },

};

