import api from '@/lib/api';

export interface Logement {
  id: number;
  batiment_id: number;
  numero: string;
  etage: number;
  porte: string;
  surface: number;
  type: string;
  nb_pieces: number;
  nb_chambres: number;
  nb_sdb: number;
  nb_wc: number;
  statut: string;
  equipements: string[];
  description: string;
  loyer_base: number;
  charges_mensuelles: number;
  caution_mois: number;
  photos: string[];
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
}

class LogementService {
  async getByBatiment(batimentId: number): Promise<Logement[]> {
    const response = await api.get(`/logements/batiment/${batimentId}`);
    return response.data;
  }

  async getDisponibles(): Promise<Logement[]> {
    const response = await api.get('/logements/search/disponibles');
    return response.data;
  }

  async getById(id: number): Promise<Logement> {
    const response = await api.get(`/logements/${id}`);
    return response.data;
  }

  async create(data: Partial<Logement>): Promise<Logement> {
    const response = await api.post('/logements', data);
    return response.data;
  }

  async update(id: number, data: Partial<Logement>): Promise<Logement> {
    const response = await api.put(`/logements/${id}`, data);
    return response.data;
  }

  async delete(id: number): Promise<void> {
    await api.delete(`/logements/${id}`);
  }

  async updateStatut(id: number, statut: string): Promise<void> {
    await api.patch(`/logements/${id}/statut`, { statut });
  }

  async getTravaux(id: number): Promise<Travaux[]> {
    const response = await api.get(`/logements/${id}/travaux`);
    return response.data;
  }

  async createTravaux(logementId: number, data: Partial<Travaux>): Promise<Travaux> {
    const response = await api.post('/logements/travaux', { ...data, logement_id: logementId });
    return response.data;
  }

  async updateTravaux(travauxId: number, data: Partial<Travaux>): Promise<Travaux> {
    const response = await api.put(`/logements/travaux/${travauxId}`, data);
    return response.data;
  }

  async deleteTravaux(travauxId: number): Promise<void> {
    await api.delete(`/logements/travaux/${travauxId}`);
  }
}

export const logementService = new LogementService();