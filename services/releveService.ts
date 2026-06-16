import api from '@/lib/api';
import { Releve, ReleveDetail, TarifService, DecompteCharges, TypeReleve, StatutReleve } from '@/types/releve';

export const releveService = {
  // ==================== RELEVÉS ====================
  
  async getAll(params?: {
    logement_id?: number;
    type_releve?: TypeReleve;
    mois?: number;
    annee?: number;
    skip?: number;
    limit?: number;
  }): Promise<Releve[]> {
    const response = await api.get('/releves', { params });
    return response.data;
  },

  async getById(id: number): Promise<ReleveDetail> {
    const response = await api.get(`/releves/${id}`);
    return response.data;
  },

  async create(data: {
    logement_id: number;
    type_releve: TypeReleve;
    index_ancien: number;
    index_nouveau: number;
    mois: number;
    annee: number;
    date_releve: string;
    notes?: string;
    photo_url?: string;
  }): Promise<Releve> {
    const response = await api.post('/releves', data);
    return response.data;
  },

  async update(id: number, data: {
    index_nouveau?: number;
    tarif_unitaire?: number;
    statut?: StatutReleve;
    notes?: string;
    photo_url?: string;
    est_facture?: boolean;
  }): Promise<Releve> {
    const response = await api.put(`/releves/${id}`, data);
    return response.data;
  },

  async calculerConsommation(id: number): Promise<{ consommation: number; montant: number }> {
    const response = await api.post(`/releves/${id}/calculer`);
    return response.data.data;
  },

  // src/services/releveService.ts - Ajouter cette méthode

  async deleteReleve(id: number): Promise<void> {
    try {
      await api.delete(`/releves/${id}`);
    } catch (error) {
      console.error('Erreur suppression relevé:', error);
      // throw this.handleError(error);
    }
  },
  // ==================== TARIFS ====================

  async getTarifs(type_service?: TypeReleve): Promise<TarifService[]> {
    const params = type_service ? { type_service } : {};
    const response = await api.get('/releves/tarifs', { params });
    return response.data;
  },

  async createTarif(data: {
    type_service: TypeReleve;
    tarif: number;
    date_debut: string;
    date_fin?: string;
    tranche_min?: number;
    tranche_max?: number;
  }): Promise<TarifService> {
    const response = await api.post('/releves/tarifs', data);
    return response.data;
  },

  // ==================== CHARGES COMMUNES ====================

  async calculerChargesCommunes(batiment_id: number, mois: number, annee: number): Promise<any> {
    const response = await api.post('/releves/charges-communes/calculer', null, {
      params: { batiment_id, mois, annee }
    });
    return response.data.data;
  },

  async integrerChargesFacture(logement_id: number, mois: number, annee: number): Promise<any> {
    const response = await api.post('/releves/integrer-facture', null, {
      params: { logement_id, mois, annee }
    });
    return response.data.data;
  },

  // ==================== DÉCOMPTE ANNUEL ====================

  async genererDecompteAnnuel(logement_id: number, annee: number): Promise<DecompteCharges> {
    const response = await api.post('/releves/decompte-annuel', null, {
      params: { logement_id, annee }
    });
    return response.data;
  },

  // ==================== STATISTIQUES ====================

  async getHistoriqueConsommation(logement_id: number, type_releve: TypeReleve, mois: number = 12): Promise<any[]> {
    const response = await api.get(`/releves/statistiques/logement/${logement_id}`, {
      params: { type_releve, mois }
    });
    return response.data.data;
  },

  async getStatistiquesBatiment(batiment_id: number, annee?: number): Promise<any> {
    const params = annee ? { annee } : {};
    const response = await api.get(`/releves/statistiques/batiment/${batiment_id}`, { params });
    return response.data.data;
  }
};