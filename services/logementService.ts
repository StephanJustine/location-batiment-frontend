// import api from '@/lib/api';

// export interface Logement {
//   [x: string]: any;
//   id: number;
//   batiment_id: number;
//   batiment_nom?: string;
//   numero: string;
//   etage: number;
//   porte: string;
//   surface: number;
//   surface_balcon: number;
//   type: string;
//   nb_pieces: number;
//   nb_chambres: number;
//   nb_sdb: number;
//   nb_wc: number;
//   statut: string;
//   equipements: string[];
//   description: string;
//   plan_url?: string | null;
//   photos: string[];
//   loyer_base: number;
//   charges_mensuelles: number;
//   caution_mois: number;
//   index_eau_initial: number;
//   index_elec_initial: number;
//   notes: string;
//   is_active: boolean;
//   created_at: string;
// }

// export interface Travaux {
//   id: number;
//   logement_id: number;
//   type_travaux: string;
//   description: string;
//   date_debut: string;
//   date_fin: string;
//   cout_estime: number;
//   cout_reel: number;
//   prestataire: string;
//   statut: string;
//   created_at: string;
// }

// class LogementService {
//   // Récupérer les logements d'un bâtiment
//   async getByBatiment(batimentId: number, statut?: string): Promise<Logement[]> {
//     const url = statut 
//       ? `/logements/batiment/${batimentId}?statut=${statut}`
//       : `/logements/batiment/${batimentId}`;
//     const response = await api.get(url);
//     return response.data;
//   }

//   // Récupérer les logements disponibles
//   async getDisponibles(): Promise<Logement[]> {
//     const response = await api.get('/logements/search/disponibles');
//     return response.data;
//   }

//   // Récupérer un logement par son ID
//   async getById(id: number): Promise<Logement | null> {
//     try {
//       console.log(`📦 Chargement du logement ${id}...`);
//       const response = await api.get(`/logements/${id}`);
//       console.log('✅ Logement chargé:', response.data);
//       return response.data;
//     } catch (error: any) {
//       console.error('❌ Erreur chargement logement:', error.message);
//       if (error.response?.status === 404) {
//         console.log('Logement non trouvé');
//         return null;
//       }
//       throw error;
//     }
//   }

//   // Créer un logement
//   async create(data: Partial<Logement>): Promise<Logement | null> {
//     try {
//       const response = await api.post('/logements', data);
//       return response.data;
//     } catch (error) {
//       console.error('Erreur création:', error);
//       return null;
//     }
//   }

//   // Mettre à jour un logement
//   async update(id: number, data: Partial<Logement>): Promise<Logement | null> {
//     try {
//       const response = await api.put(`/logements/${id}`, data);
//       return response.data;
//     } catch (error) {
//       console.error('Erreur mise à jour:', error);
//       return null;
//     }
//   }

//   // Supprimer un logement
//   async delete(id: number): Promise<boolean> {
//     try {
//       await api.delete(`/logements/${id}`);
//       return true;
//     } catch (error) {
//       console.error('Erreur suppression:', error);
//       return false;
//     }
//   }

//   // Mettre à jour le statut
//   async updateStatut(id: number, statut: string): Promise<boolean> {
//     try {
//       await api.patch(`/logements/${id}/statut?statut=${statut}`);
//       return true;
//     } catch (error) {
//       console.error('Erreur mise à jour statut:', error);
//       return false;
//     }
//   }

//   // Récupérer les travaux
//   async getTravaux(id: number): Promise<Travaux[]> {
//     try {
//       const response = await api.get(`/logements/${id}/travaux`);
//       return response.data;
//     } catch (error) {
//       console.error('Erreur chargement travaux:', error);
//       return [];
//     }
//   }

//   // Récupérer l'historique des locataires
//   async getHistorique(id: number): Promise<any[]> {
//     try {
//       const response = await api.get(`/logements/${id}/historique-locataires`);
//       return response.data;
//     } catch (error) {
//       console.error('Erreur chargement historique:', error);
//       return [];
//     }
//   }

//   // Récupérer les statistiques
//   async getStats(id: number): Promise<any> {
//     try {
//       const response = await api.get(`/logements/${id}/stats`);
//       return response.data;
//     } catch (error) {
//       console.error('Erreur chargement stats:', error);
//       return null;
//     }
//   }


//   // Upload de plan
// async uploadPlan(id: number, file: File): Promise<string> {
//   const formData = new FormData();
//   formData.append('file', file);
//   const response = await api.post(`/logements/${id}/plan`, formData, {
//     headers: { 'Content-Type': 'multipart/form-data' }
//   });
//   return response.data.plan_url;
// }

// // Upload de photos
// async uploadPhotos(id: number, files: File[]): Promise<string[]> {
//   const formData = new FormData();
//   files.forEach(file => formData.append('files', file));
//   const response = await api.post(`/logements/${id}/photos`, formData, {
//     headers: { 'Content-Type': 'multipart/form-data' }
//   });
//   return response.data.photos;
// }

// // Supprimer une photo
// async deletePhoto(logementId: number, photoUrl: string): Promise<boolean> {
//   try {
//     await api.delete(`/logements/${logementId}/photos?photo_url=${encodeURIComponent(photoUrl)}`);
//     return true;
//   } catch (error) {
//     console.error('Erreur suppression photo:', error);
//     return false;
//   }
// }
// }

// export const logementService = new LogementService();


import api from '@/lib/api';

export interface Logement {
  [x: string]: any;
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
  updated_at?: string;
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

export interface ApiError {
  response?: {
    data?: {
      detail?: string;
      message?: string;
    };
    status?: number;
  };
  message: string;
}

class LogementService {
  // Récupérer les logements d'un bâtiment
  async getByBatiment(batimentId: number, statut?: string): Promise<Logement[]> {
    try {
      const url = statut 
        ? `/logements/batiment/${batimentId}?statut=${statut}`
        : `/logements/batiment/${batimentId}`;
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Erreur récupération logements par bâtiment:', error);
      throw this.handleError(error);
    }
  }

  // Récupérer les logements disponibles
  async getDisponibles(filters?: {
    batiment_id?: number;
    type?: string;
    surface_min?: number;
    loyer_max?: number;
  }): Promise<Logement[]> {
    try {
      let url = '/logements/search/disponibles';
      if (filters) {
        const params = new URLSearchParams();
        if (filters.batiment_id) params.append('batiment_id', filters.batiment_id.toString());
        if (filters.type) params.append('type_logement', filters.type);
        if (filters.surface_min) params.append('surface_min', filters.surface_min.toString());
        if (filters.loyer_max) params.append('loyer_max', filters.loyer_max.toString());
        if (params.toString()) url += `?${params.toString()}`;
      }
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Erreur récupération logements disponibles:', error);
      throw this.handleError(error);
    }
  }

  // Récupérer tous les logements
  async getAll(): Promise<Logement[]> {
    try {
      const response = await api.get('/logements/');
      return response.data;
    } catch (error) {
      console.error('Erreur récupération logements:', error);
      throw this.handleError(error);
    }
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
      throw this.handleError(error);
    }
  }

  // Créer un logement
  async create(data: Partial<Logement>): Promise<Logement> {
    try {
      // Ne pas envoyer batiment_nom dans la requête
      const { batiment_nom, ...cleanData } = data;
      const response = await api.post('/logements/', cleanData);
      return response.data;
    } catch (error) {
      console.error('Erreur création:', error);
      throw this.handleError(error);
    }
  }

  // Mettre à jour un logement
  async update(id: number, data: Partial<Logement>): Promise<Logement> {
    try {
      // Ne pas envoyer batiment_nom dans la requête
      const { batiment_nom, ...cleanData } = data;
      const response = await api.put(`/logements/${id}`, cleanData);
      return response.data;
    } catch (error) {
      console.error('Erreur mise à jour:', error);
      throw this.handleError(error);
    }
  }

  // Supprimer un logement
  async delete(id: number): Promise<boolean> {
    try {
      await api.delete(`/logements/${id}`);
      return true;
    } catch (error) {
      console.error('Erreur suppression:', error);
      throw this.handleError(error);
    }
  }

  // Mettre à jour le statut
  async updateStatut(id: number, statut: string): Promise<boolean> {
    try {
      await api.patch(`/logements/${id}/statut?statut=${statut}`);
      return true;
    } catch (error) {
      console.error('Erreur mise à jour statut:', error);
      throw this.handleError(error);
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
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await api.post(`/logements/${id}/plan`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data.plan_url;
    } catch (error) {
      console.error('Erreur upload plan:', error);
      throw this.handleError(error);
    }
  }

  // Upload d'une seule photo (alias pour compatibilité)
  async uploadPhoto(logementId: number, file: File): Promise<string> {
    return this.uploadPhotos(logementId, [file]).then(urls => urls[0]);
  }

  // Upload de plusieurs photos
  async uploadPhotos(logementId: number, files: File[]): Promise<string[]> {
    try {
      const formData = new FormData();
      files.forEach(file => formData.append('files', file));
      const response = await api.post(`/logements/${logementId}/photos`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data.photos;
    } catch (error) {
      console.error('Erreur upload photos:', error);
      throw this.handleError(error);
    }
  }

  // Supprimer une photo
  async deletePhoto(logementId: number, photoUrl: string): Promise<boolean> {
    try {
      // Extraire le chemin relatif de l'URL si nécessaire
      const cleanUrl = photoUrl.startsWith('/') ? photoUrl : `/${photoUrl}`;
      await api.delete(`/logements/${logementId}/photos?photo_url=${encodeURIComponent(cleanUrl)}`);
      return true;
    } catch (error) {
      console.error('Erreur suppression photo:', error);
      throw this.handleError(error);
    }
  }

  // Supprimer plusieurs photos
  async deletePhotos(logementId: number, photoUrls: string[]): Promise<boolean> {
    try {
      const promises = photoUrls.map(url => this.deletePhoto(logementId, url));
      await Promise.all(promises);
      return true;
    } catch (error) {
      console.error('Erreur suppression multiples photos:', error);
      throw this.handleError(error);
    }
  }

  // Mettre à jour les photos (remplacement complet)
  async updatePhotos(logementId: number, existingPhotos: string[], newPhotos: File[], photosToDelete: string[]): Promise<string[]> {
    try {
      // Supprimer les photos marquées
      if (photosToDelete.length > 0) {
        await this.deletePhotos(logementId, photosToDelete);
      }
      
      // Uploader les nouvelles photos
      let uploadedPhotos: string[] = [];
      if (newPhotos.length > 0) {
        uploadedPhotos = await this.uploadPhotos(logementId, newPhotos);
      }
      
      // Retourner la liste finale des photos
      const remainingPhotos = existingPhotos.filter(photo => !photosToDelete.includes(photo));
      return [...remainingPhotos, ...uploadedPhotos];
    } catch (error) {
      console.error('Erreur mise à jour photos:', error);
      throw this.handleError(error);
    }
  }

  // Rechercher des logements
  async search(query: string): Promise<Logement[]> {
    try {
      const response = await api.get(`/logements/search?q=${encodeURIComponent(query)}`);
      return response.data;
    } catch (error) {
      console.error('Erreur recherche:', error);
      return [];
    }
  }

  // Obtenir les logements par statut
  async getByStatut(statut: string): Promise<Logement[]> {
    try {
      const response = await api.get(`/logements?statut=${statut}`);
      return response.data;
    } catch (error) {
      console.error('Erreur récupération par statut:', error);
      return [];
    }
  }

  // Vérifier si un numéro de logement existe déjà dans un bâtiment
  async checkNumeroExists(batimentId: number, numero: string, excludeId?: number): Promise<boolean> {
    try {
      const logements = await this.getByBatiment(batimentId);
      return logements.some(logement => 
        logement.numero === numero && (!excludeId || logement.id !== excludeId)
      );
    } catch (error) {
      console.error('Erreur vérification numéro:', error);
      return false;
    }
  }

  // Gestionnaire d'erreurs unifié
  private handleError(error: any): Error {
    if (error.response?.data?.detail) {
      return new Error(error.response.data.detail);
    }
    if (error.response?.data?.message) {
      return new Error(error.response.data.message);
    }
    if (error.message) {
      return new Error(error.message);
    }
    return new Error('Une erreur inattendue est survenue');
  }
}

export const logementService = new LogementService();