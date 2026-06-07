import api from '@/lib/api';

export interface DashboardStats {
  total_batiments: number;
  total_logements: number;
  logements_occupes: number;
  logements_libres: number;
  logements_maintenance: number;
  taux_occupation: number;
  total_locataires: number;
  nouveaux_locataires_mois: number;
  locataires_blacklist: number;
  chiffre_affaires_mois: number;
  chiffre_affaires_annee: number;
  impayes_total: number;
  taux_recouvrement: number;
  loyer_moyen: number;
  baux_actifs: number;
  baux_expirant_30j: number;
  baux_resilies_mois: number;
  alertes_urgentes: number;
  alertes_moyennes: number;
  relances_impayes: number;
}

export interface EvolutionData {
  mois: string;
  annee: number;
  mois_num: number;
  ca: number;
  impayes: number;
  taux_occupation: number;
  nb_nouveaux_contrats: number;
}

export interface PerformanceBatiment {
  batiment_id: number;
  batiment_nom: string;
  nb_logements: number;
  nb_occupes: number;
  taux_occupation: number;
  revenus_mensuels: number;
  impayes: number;
}

export interface TopLocataire {
  locataire_id: number;
  nom: string;
  telephone: string;
  total_paye: number;
}

export interface Alerte {
  type: string;
  niveau: 'urgent' | 'moyen' | 'faible';
  message: string;
  date?: string;
  montant?: number;
  locataire_nom?: string;
  bail_numero?: string;
}

class DashboardService {
  async getStats(): Promise<DashboardStats> {
    const response = await api.get('/dashboard/stats');
    return response.data;
  }

  async getEvolution(mois: number = 12): Promise<EvolutionData[]> {
    const response = await api.get(`/dashboard/evolution?mois=${mois}`);
    return response.data;
  }

  async getPerformanceBatiments(): Promise<PerformanceBatiment[]> {
    const response = await api.get('/dashboard/performance/batiments');
    return response.data;
  }

//   async getTopLocataires(limit: number = 10): Promise<TopLocataire[]> {
//     const response = await api.get(`/dashboard/top-locataires?limit=${limit}`);
//     return response.data;
//   }

  async getTopLocataires(limit: number = 10): Promise<TopLocataire[]> {
    const response = await api.get(`/dashboard/top-locataires?limit=${limit}`);
    // Gérer différents formats de réponse
    if (Array.isArray(response.data)) {
        return response.data;
    }
    if (response.data && Array.isArray(response.data.data)) {
        return response.data.data;
    }
    if (response.data && Array.isArray(response.data.items)) {
        return response.data.items;
    }
    // Si la réponse est directement le tableau
    if (Array.isArray(response)) {
        return response;
    }
    // Fallback: retourner un tableau vide
    console.warn('Format inattendu pour top-locataires:', response);
    return [];
    }

  async getAlertes(): Promise<{ urgent: Alerte[]; moyen: Alerte[]; faible: Alerte[]; total: number }> {
    const response = await api.get('/dashboard/alertes');
    return response.data;
  }

  async getDashboardComplet(): Promise<any> {
    const response = await api.get('/dashboard/complet');
    return response.data;
  }
}

export const dashboardService = new DashboardService();