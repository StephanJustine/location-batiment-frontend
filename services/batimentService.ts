import api from '@/lib/api';

export interface Batiment {
  id: number;
  nom: string;
  adresse: string;
  ville: string;
  commune: string;
  code_postal: string;
  latitude: number;
  longitude: number;
  surface_totale: number;
  surface_terrain: number;
  nb_etages: number;
  annee_construction: number;
  type_batiment: string;
  description: string;
  photos: string[];
  statut: string;
  is_active: boolean;
  created_at: string;
}

export interface ChargeCommune {
  id: number;
  batiment_id: number;
  type_charge: string;
  montant_total: number;
  mois: number;
  annee: number;
  methode_repartition: string;
}

class BatimentService {
  async getAll(): Promise<Batiment[]> {
    const response = await api.get('/batiments');
    return response.data;
  }

  async getById(id: number): Promise<Batiment> {
    const response = await api.get(`/batiments/${id}`);
    return response.data;
  }

  async create(data: Partial<Batiment>): Promise<Batiment> {
    const response = await api.post('/batiments', data);
    return response.data;
  }

  async update(id: number, data: Partial<Batiment>): Promise<Batiment> {
    const response = await api.put(`/batiments/${id}`, data);
    return response.data;
  }

  async delete(id: number): Promise<void> {
    await api.delete(`/batiments/${id}`);
  }

  async getStats(id: number): Promise<any> {
    const response = await api.get(`/batiments/${id}/stats`);
    return response.data;
  }

  async getCharges(id: number): Promise<ChargeCommune[]> {
    const response = await api.get(`/batiments/${id}/charges`);
    return response.data;
  }

  async addCharge(batimentId: number, data: Partial<ChargeCommune>): Promise<ChargeCommune> {
    const response = await api.post(`/batiments/${batimentId}/charges`, data);
    return response.data;
  }
}

export const batimentService = new BatimentService();