import api from '@/lib/api';

export interface Logement {
  id: number;
  batiment_id: number;
  batiment_nom?: string;
  numero: string;
  etage: number;
  porte: string;
  surface: number;
  surface_balcon: number;
  type: string;
  nb_pieces: number;
  nb_chambres: number;
  nb_sdb: number;
  nb_wc: number;
  statut: string;
  equipements: string[];
  description: string;
  plan_url?: string | null;
  photos: string[];
  loyer_base: number;
  charges_mensuelles: number;
  caution_mois: number;
  index_eau_initial: number;
  index_elec_initial: number;
  notes: string;
  is_active: boolean;
  created_at: string;
}

export interface Travaux {
  id: number;
  logement_id: number;
  type_travaux: string;
  description: string;
  date_debut: string;
  date_fin: string;
  cout_estime: number;
  cout_reel: number;
  prestataire: string;
  statut: string;
  created_at: string;
}

class LogementService {
  // Récupérer les logements d'un bâtiment
  async getByBatiment(batimentId: number, statut?: string): Promise<Logement[]> {
    const url = statut 
      ? `/logements/batiment/${batimentId}?statut=${statut}`
      : `/logements/batiment/${batimentId}`;
    const response = await api.get(url);
    return response.data;
  }

  // Récupérer les logements disponibles
  async getDisponibles(): Promise<Logement[]> {
    const response = await api.get('/logements/search/disponibles');
    return response.data;
  }

  // Récupérer un logement par son ID
  async getById(id: number): Promise<Logement | null> {
    try {
      console.log(`📦 Chargement du logement ${id}...`);
      const response = await api.get(`/logements/${id}`);
      console.log('✅ Logement chargé:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Erreur chargement logement:', error.message);
      if (error.response?.status === 404) {
        console.log('Logement non trouvé');
        return null;
      }
      throw error;
    }
  }

  // Créer un logement
  async create(data: Partial<Logement>): Promise<Logement | null> {
    try {
      const response = await api.post('/logements', data);
      return response.data;
    } catch (error) {
      console.error('Erreur création:', error);
      return null;
    }
  }

  // Mettre à jour un logement
  async update(id: number, data: Partial<Logement>): Promise<Logement | null> {
    try {
      const response = await api.put(`/logements/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Erreur mise à jour:', error);
      return null;
    }
  }

  // Supprimer un logement
  async delete(id: number): Promise<boolean> {
    try {
      await api.delete(`/logements/${id}`);
      return true;
    } catch (error) {
      console.error('Erreur suppression:', error);
      return false;
    }
  }

  // Mettre à jour le statut
  async updateStatut(id: number, statut: string): Promise<boolean> {
    try {
      await api.patch(`/logements/${id}/statut?statut=${statut}`);
      return true;
    } catch (error) {
      console.error('Erreur mise à jour statut:', error);
      return false;
    }
  }

  // Récupérer les travaux
  async getTravaux(id: number): Promise<Travaux[]> {
    try {
      const response = await api.get(`/logements/${id}/travaux`);
      return response.data;
    } catch (error) {
      console.error('Erreur chargement travaux:', error);
      return [];
    }
  }

  // Récupérer l'historique des locataires
  async getHistorique(id: number): Promise<any[]> {
    try {
      const response = await api.get(`/logements/${id}/historique-locataires`);
      return response.data;
    } catch (error) {
      console.error('Erreur chargement historique:', error);
      return [];
    }
  }

  // Récupérer les statistiques
  async getStats(id: number): Promise<any> {
    try {
      const response = await api.get(`/logements/${id}/stats`);
      return response.data;
    } catch (error) {
      console.error('Erreur chargement stats:', error);
      return null;
    }
  }


  // Upload de plan
async uploadPlan(id: number, file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  const response = await api.post(`/logements/${id}/plan`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data.plan_url;
}

// Upload de photos
async uploadPhotos(id: number, files: File[]): Promise<string[]> {
  const formData = new FormData();
  files.forEach(file => formData.append('files', file));
  const response = await api.post(`/logements/${id}/photos`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data.photos;
}

// Supprimer une photo
async deletePhoto(logementId: number, photoUrl: string): Promise<boolean> {
  try {
    await api.delete(`/logements/${logementId}/photos?photo_url=${encodeURIComponent(photoUrl)}`);
    return true;
  } catch (error) {
    console.error('Erreur suppression photo:', error);
    return false;
  }
}
}

export const logementService = new LogementService();