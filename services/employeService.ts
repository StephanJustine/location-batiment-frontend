import api from '../lib/api';

export type TypeEmploye = 'gardien' | 'femme_de_menage' | 'jardinier' | 'technicien' | 'agent_securite' | 'comptable' | 'autre';
export type StatutEmploye = 'actif' | 'conge' | 'arret_maladie' | 'absent' | 'termine';

export interface Employe {
  id: number;
  batiment_id: number;
  nom: string;
  prenom: string;
  cin?: string;
  date_naissance?: string;
  telephone: string;
  telephone_urgence?: string;
  email?: string;
  adresse?: string;
  type_employe: TypeEmploye;
  poste?: string;
  date_embauche: string;
  salaire_base: number;
  statut: StatutEmploye;
  is_active: boolean;
  created_at: string;
}

export const employeService = {
  async getByBatiment(batimentId: number): Promise<Employe[]> {
    const response = await api.get(`/employes?batiment_id=${batimentId}`);
    return response.data;
  },

  async create(data: Partial<Employe>): Promise<Employe> {
    const response = await api.post('/employes', data);
    return response.data;
  },

  async update(id: number, data: Partial<Employe>): Promise<Employe> {
    const response = await api.put(`/employes/${id}`, data);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/employes/${id}`);
  }
};