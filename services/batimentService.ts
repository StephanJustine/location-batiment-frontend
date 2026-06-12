// import api from '@/lib/api';

// export interface Batiment {
//   id: number;
//   nom: string;
//   adresse: string;
//   ville: string;
//   commune: string;
//   code_postal: string;
//   latitude: number;
//   longitude: number;
//   surface_totale: number;
//   surface_terrain: number;
//   nb_etages: number;
//   annee_construction: number;
//   type_batiment: string;
//   description: string;
//   photos: string[];
//   statut: string;
//   is_active: boolean;
//   created_at: string;
// }

// class BatimentService {
//   async getAll(): Promise<Batiment[]> {
//     try {
//       const response = await api.get('/batiments');
//       return response.data || [];
//     } catch (error) {
//       console.warn('Impossible de charger les bâtiments, retour d\'un tableau vide');
//       return [];
//     }
//   }

//   async getById(id: number): Promise<Batiment | null> {
//     try {
//       const response = await api.get(`/batiments/${id}`);
//       return response.data;
//     } catch (error) {
//       console.warn(`Bâtiment ${id} non trouvé`);
//       return null;
//     }
//   }

//   async create(data: Partial<Batiment>): Promise<Batiment | null> {
//     try {
//       const response = await api.post('/batiments', data);
//       return response.data;
//     } catch (error) {
//       console.error('Erreur création:', error);
//       return null;
//     }
//   }

//   async update(id: number, data: Partial<Batiment>): Promise<Batiment | null> {
//     try {
//       const response = await api.put(`/batiments/${id}`, data);
//       return response.data;
//     } catch (error) {
//       console.error('Erreur mise à jour:', error);
//       return null;
//     }
//   }

//   async delete(id: number): Promise<boolean> {
//     try {
//       await api.delete(`/batiments/${id}`);
//       return true;
//     } catch (error) {
//       console.error('Erreur suppression:', error);
//       return false;
//     }
//   }

//   async getStats(id: number): Promise<any> {
//     try {
//       const response = await api.get(`/batiments/${id}/stats`);
//       return response.data;
//     } catch {
//       return null;
//     }
//   }
// }


// export const batimentService = new BatimentService();


import api from '@/lib/api';

export interface Batiment {
  capacite: string;
  nb_logements_total: any;
  nb_logements_occupes: any;
  nb_logements: number;
  nb_ascenseurs: number;
  nb_parkings: number;
  nb_sanitaires: number;
  equipements: boolean;
  surveillance: any;
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

class BatimentService {
  async getAll(): Promise<Batiment[]> {
    try {
      const response = await api.get('/batiments');
      return response.data || [];
    } catch (error) {
      console.warn('Impossible de charger les bâtiments, retour d\'un tableau vide');
      return [];
    }
  }

  async getById(id: number): Promise<Batiment | null> {
    try {
      const response = await api.get(`/batiments/${id}`);
      return response.data;
    } catch (error) {
      console.warn(`Bâtiment ${id} non trouvé`);
      return null;
    }
  }

  async create(data: Partial<Batiment>): Promise<Batiment | null> {
    try {
      const response = await api.post('/batiments', data);
      return response.data;
    } catch (error) {
      console.error('Erreur création:', error);
      return null;
    }
  }

  async update(id: number, data: Partial<Batiment>): Promise<Batiment | null> {
    try {
      const response = await api.put(`/batiments/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Erreur mise à jour:', error);
      return null;
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      await api.delete(`/batiments/${id}`);
      return true;
    } catch (error) {
      console.error('Erreur suppression:', error);
      return false;
    }
  }

  async getStats(id: number): Promise<any> {
    try {
      const response = await api.get(`/batiments/${id}/stats`);
      return response.data;
    } catch {
      return null;
    }
  }

  async uploadPhotos(id: number, files: File[]): Promise<string[]> {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    
    const response = await api.post(`/batiments/${id}/photos`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data.photos;
  }

  async getPhotos(id: number): Promise<string[]> {
    const response = await api.get(`/batiments/${id}/photos`);
    return response.data.photos;
  }

  async deletePhoto(batimentId: number, photoUrl: string): Promise<void> {
    await api.delete(`/batiments/${batimentId}/photos?photo_url=${encodeURIComponent(photoUrl)}`);
  }
}

export const batimentService = new BatimentService();