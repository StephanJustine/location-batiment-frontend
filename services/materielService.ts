import api from '../lib/api';

export type CategorieMateriel = 'ampoule' | 'robinetterie' | 'chasse_eau' | 'joint' | 'flexible' | 'prise' | 'interrupteur' | 'poignee' | 'vitre' | 'carrelage' | 'peinture' | 'autre';
export type UniteMateriel = 'piece' | 'metre' | 'metre_carre' | 'kilogramme' | 'litre' | 'rouleau' | 'boite';

export interface MaterielStock {
  id: number;
  batiment_id: number;
  code: string;
  nom: string;
  categorie: CategorieMateriel;
  unite: UniteMateriel;
  quantite_stock: number;
  quantite_minimale: number;
  prix_unitaire_achat?: number;
  is_active: boolean;
}

export const materielService = {
  async getByBatiment(batimentId: number): Promise<MaterielStock[]> {
    const response = await api.get(`/materiel/stock?batiment_id=${batimentId}`);
    return response.data;
  },

  async create(data: Partial<MaterielStock>): Promise<MaterielStock> {
    const response = await api.post('/materiel/stock', data);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/materiel/stock/${id}`);
  }
};