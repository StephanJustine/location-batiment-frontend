
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

export interface LogementList {
  id: number;
  batiment_id: number;
  batiment_nom?: string;
  numero: string;
  etage?: number;
  porte?: string;
  surface: number;
  surface_balcon: number;
  type: string;
  nb_pieces: number;
  nb_chambres: number;
  nb_sdb: number;
  nb_wc: number;
  statut: string;
  equipements: string[];
  description?: string;
  plan_url?: string;
  photos: string[];
  loyer_base: number;
  charges_mensuelles: number;
  caution_mois: number;
  index_eau_initial: number;
  index_elec_initial: number;
  notes?: string;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

export interface LogementSimple {
  id: number;
  numero: string;
  type: string;
  surface: number;
  statut: string;
  batiment_nom?: string;
  batiment_id: number;
}

export interface LogementOccupe {
  id: number;
  numero: string;
  etage: number | null;
  surface: number;
  type: string;
  batiment_nom: string;
  batiment_id: number;
  statut: string;
  loyer_base: number;
  occupant_nom: string | null;
  occupant_id: number | null;
  date_debut_bail: string | null;
  date_fin_bail: string | null;
}

export interface OccupeFilters {
  batiment_id?: number;
  type_logement?: string;
  search?: string;
}


// Types pour les travaux
export interface Travaux {
  batiment_nom: string;
  logement_numero: string;
  id: number;
  logement_id: number;
  type_travaux: string;
  description: string;
  date_debut?: string;
  date_fin?: string;
  cout_estime?: number;
  cout_reel?: number;
  prestataire?: string;
  statut: string;
  documents: string[];
  created_at: string;
  updated_at?: string;
  created_by?: number;
}

interface TravauxCreateData {
  logement_id: number;
  type_travaux: string;
  description: string;
  statut: string;
  date_debut?: string;
  date_fin?: string;
  cout_estime?: number;
  cout_reel?: number;
  prestataire?: string;
}

export interface TravauxUpdate {
  type_travaux?: string;
  description?: string;
  date_debut?: string;
  date_fin?: string;
  cout_estime?: number;
  cout_reel?: number;
  prestataire?: string;
  statut?: string;
}

export interface TravauxWithLogement {
  id: number;
  logement_id: number;
  logement_numero?: string;
  logement_type?: string;
  logement_surface?: number;
  logement_statut?: string;
  batiment_id?: number;
  batiment_nom?: string;
  type_travaux: string;
  description: string;
  date_debut?: string;
  date_fin?: string;
  cout_estime?: number;
  cout_reel?: number;
  prestataire?: string;
  statut: string;
  documents: string[];
  created_at: string;
  updated_at?: string;
  created_by?: number;
}


class LogementService {
    getLogementsByBatiment(batimentId: number): Logement[] | PromiseLike<Logement[]> {
        throw new Error('Method not implemented.');
    }
    getLogementsDisponibles(): Logement[] | PromiseLike<Logement[]> {
        throw new Error('Method not implemented.');
    }
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
  // async getAll(p0: { limit: number; }): Promise<Logement[]> {
  //   try {
  //     const response = await api.get('/logements/');
  //     return response.data;
  //   } catch (error) {
  //     console.error('Erreur récupération logements:', error);
  //     throw this.handleError(error);
  //   }
  // }

  // Récupérer tous les logements avec paramètres optionnels
  async getAllLogements(params?: {
    statut?: string;
    type_logement?: string;
    batiment_id?: number;
    search?: string;
    limit?: number;
    skip?: number;
  }): Promise<LogementList[]> {
    try {
      const urlParams = new URLSearchParams();
      if (params?.statut) urlParams.append('statut', params.statut);
      if (params?.type_logement) urlParams.append('type_logement', params.type_logement);
      if (params?.batiment_id) urlParams.append('batiment_id', params.batiment_id.toString());
      if (params?.search) urlParams.append('search', params.search);
      if (params?.limit) urlParams.append('limit', params.limit.toString());
      if (params?.skip) urlParams.append('skip', params.skip.toString());
      
      const url = `/logements/all${urlParams.toString() ? `?${urlParams.toString()}` : ''}`;
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Erreur récupération logements:', error);
      return [];
    }
  }

  /**
   * Récupérer tous les logements en format simple (pour dropdowns)
   * GET /api/v1/logements/all/simple
   */
  async getAllLogementsSimple(): Promise<LogementSimple[]> {
    try {
      const response = await api.get('/logements/all/simple');
      return response.data;
    } catch (error) {
      console.error('Erreur récupération logements simples:', error);
      return [];
    }
  }

    async getOccupes(filters?: OccupeFilters): Promise<LogementOccupe[]> {
    try {
      const urlParams = new URLSearchParams();
      if (filters?.batiment_id) urlParams.append('batiment_id', filters.batiment_id.toString());
      if (filters?.type_logement) urlParams.append('type_logement', filters.type_logement);
      if (filters?.search) urlParams.append('search', filters.search);
      
      const url = `/logements/occupes/liste${urlParams.toString() ? `?${urlParams.toString()}` : ''}`;
      console.log('📡 Récupération logements occupés:', url);
      
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('❌ Erreur récupération logements occupés:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Récupère les logements occupés avec alias pour compatibilité
   */
  async getLogementsOccupes(filters?: OccupeFilters): Promise<LogementOccupe[]> {
    return this.getOccupes(filters);
  }

  // ==================== LOGEMENTS DISPONIBLES ====================

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
// Récupérer les logements pour les relevés JIRAMA
  async getForReleves(params?: {
    skip: any; limit?: number 
}): Promise<Logement[]> {
    try {
      // 🔥 Utiliser le bon endpoint avec paramètres
      const queryParams = new URLSearchParams();
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.skip) queryParams.append('skip', params.skip.toString());
      
      const url = `/logements${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      console.log('📡 Appel API logements:', url);
      
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Erreur récupération logements pour relevés:', error);
      // Retourner un tableau vide en cas d'erreur
      return [];
    }
  }

// ==================== TRAVAUX ====================

/**
 * Créer des travaux
 */
async createTravaux(data: any): Promise<Travaux> {
  try {
    // Nettoyer les données avant l'envoi
    const cleanData: any = {
      logement_id: Number(data.logement_id),
      type_travaux: data.type_travaux,
      description: data.description,
      statut: data.statut || 'planifie'
    };

    // Formatage des dates au format ISO avec T
    if (data.date_debut) {
      cleanData.date_debut = data.date_debut;
    }
    if (data.date_fin) {
      cleanData.date_fin = data.date_fin;
    }
    if (data.cout_estime !== undefined && data.cout_estime !== null) {
      cleanData.cout_estime = Number(data.cout_estime);
    }
    if (data.cout_reel !== undefined && data.cout_reel !== null) {
      cleanData.cout_reel = Number(data.cout_reel);
    }
    if (data.prestataire) {
      cleanData.prestataire = data.prestataire;
    }

    console.log('📤 Envoi des données:', cleanData);
    
    const response = await api.post('/logements/travaux', cleanData);
    return response.data;
  } catch (error: unknown) {
    console.error('Erreur création travaux:', error);
    if (error && typeof error === 'object' && 'response' in error) {
      const err = error as { response?: { data?: { detail?: string } } };
      if (err.response?.data?.detail) {
        console.error('Détails de l\'erreur:', err.response.data.detail);
      }
    }
    throw this.handleError(error);
  }
}

/**
 * Récupérer tous les travaux (avec filtres)
 */
async getAllTravaux(params?: {
  logement_id?: number;
  statut?: string;
  type?: string;
  date_debut?: string;
  date_fin?: string;
  limit?: number;
  skip?: number;
}): Promise<Travaux[]> {
  try {
    const urlParams = new URLSearchParams();
    if (params?.logement_id) urlParams.append('logement_id', params.logement_id.toString());
    if (params?.statut) urlParams.append('statut', params.statut);
    if (params?.type) urlParams.append('type', params.type);
    if (params?.date_debut) urlParams.append('date_debut', params.date_debut);
    if (params?.date_fin) urlParams.append('date_fin', params.date_fin);
    if (params?.limit) urlParams.append('limit', params.limit.toString());
    if (params?.skip) urlParams.append('skip', params.skip.toString());
    
    const url = `/logements/travaux${urlParams.toString() ? `?${urlParams.toString()}` : ''}`;
    const response = await api.get(url);
    return response.data;
  } catch (error: unknown) {
    console.error('Erreur récupération travaux:', error);
    return [];
  }
}

/**
 * Récupérer tous les travaux avec les informations des logements
 */
async getAllTravauxWithLogement(params?: {
  statut?: string;
  type_travaux?: string;
  logement_id?: number;
  search?: string;
  date_debut?: string;
  date_fin?: string;
  limit?: number;
  skip?: number;
}): Promise<TravauxWithLogement[]> {
  try {
    const urlParams = new URLSearchParams();
    if (params?.statut) urlParams.append('statut', params.statut);
    if (params?.type_travaux) urlParams.append('type_travaux', params.type_travaux);
    if (params?.logement_id) urlParams.append('logement_id', params.logement_id.toString());
    if (params?.search) urlParams.append('search', params.search);
    if (params?.date_debut) urlParams.append('date_debut', params.date_debut);
    if (params?.date_fin) urlParams.append('date_fin', params.date_fin);
    if (params?.limit) urlParams.append('limit', params.limit.toString());
    if (params?.skip) urlParams.append('skip', params.skip.toString());
    
    const url = `/logements/travaux${urlParams.toString() ? `?${urlParams.toString()}` : ''}`;
    const response = await api.get(url);
    return response.data;
  } catch (error: unknown) {
    console.error('Erreur récupération tous les travaux:', error);
    return [];
  }
}

/**
 * Récupérer un travail par son ID avec les informations du logement
 */
async getTravauxWithLogementById(id: number): Promise<TravauxWithLogement | null> {
  try {
    const response = await api.get(`/logements/travaux/${id}`);
    return response.data;
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'response' in error) {
      const err = error as { response?: { status?: number } };
      if (err.response?.status === 404) {
        return null;
      }
    }
    console.error('Erreur récupération travail:', error);
    throw this.handleError(error);
  }
}

/**
 * Récupérer les travaux d'un logement
 */
async getTravauxByLogement(logementId: number): Promise<Travaux[]> {
  try {
    const response = await api.get(`/logements/${logementId}/travaux`);
    return response.data;
  } catch (error: unknown) {
    console.error('Erreur récupération travaux du logement:', error);
    return [];
  }
}

/**
 * Récupérer un travail par son ID
 */
async getTravauxById(id: number): Promise<Travaux | null> {
  try {
    const response = await api.get(`/travaux/${id}`);
    return response.data;
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'response' in error) {
      const err = error as { response?: { status?: number } };
      if (err.response?.status === 404) {
        return null;
      }
    }
    console.error('Erreur récupération travaux:', error);
    throw this.handleError(error);
  }
}

/**
 * Mettre à jour des travaux
 */
async updateTravaux(id: number, data: TravauxUpdate): Promise<Travaux> {
  try {
    const response = await api.put(`/logements/travaux/${id}`, data);
    return response.data;
  } catch (error: unknown) {
    console.error('Erreur mise à jour travaux:', error);
    throw this.handleError(error);
  }
}

/**
 * Supprimer des travaux
 */
async deleteTravaux(id: number): Promise<boolean> {
  try {
    await api.delete(`/logements/travaux/${id}`);
    return true;
  } catch (error: unknown) {
    console.error('Erreur suppression travaux:', error);
    throw this.handleError(error);
  }
}

/**
 * Upload de document pour les travaux
 */
async uploadTravauxDocument(travauxId: number, file: File): Promise<string> {
  try {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post(`/travaux/${travauxId}/documents`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data.document_url;
  } catch (error: unknown) {
    console.error('Erreur upload document:', error);
    throw this.handleError(error);
  }
}

/**
 * Supprimer un document des travaux
 */
async deleteTravauxDocument(travauxId: number, documentUrl: string): Promise<boolean> {
  try {
    await api.delete(`/travaux/${travauxId}/documents?document_url=${encodeURIComponent(documentUrl)}`);
    return true;
  } catch (error: unknown) {
    console.error('Erreur suppression document:', error);
    throw this.handleError(error);
  }
}

/**
 * Statistiques des travaux
 */
async getTravauxStats(params?: {
  date_debut?: string;
  date_fin?: string;
}): Promise<any> {
  try {
    const urlParams = new URLSearchParams();
    if (params?.date_debut) urlParams.append('date_debut', params.date_debut);
    if (params?.date_fin) urlParams.append('date_fin', params.date_fin);
    
    const url = `/travaux/stats${urlParams.toString() ? `?${urlParams.toString()}` : ''}`;
    const response = await api.get(url);
    return response.data;
  } catch (error: unknown) {
    console.error('Erreur récupération stats travaux:', error);
    return null;
  }
}

/**
 * Gestionnaire d'erreurs unifié
 */
private handleError(error: unknown): Error {
  // Vérifier si l'erreur a une réponse avec des données
  if (error && typeof error === 'object') {
    const err = error as { 
      response?: { 
        data?: { 
          detail?: string; 
          message?: string;
          [key: string]: any;
        };
        status?: number;
      };
      message?: string;
      request?: any;
    };
    
    // Vérifier les données de réponse
    if (err.response?.data?.detail) {
      return new Error(err.response.data.detail);
    }
    if (err.response?.data?.message) {
      return new Error(err.response.data.message);
    }
    
    // Vérifier si c'est une erreur Axios avec message
    if (err.message) {
      return new Error(err.message);
    }
    
    // Vérifier le statut HTTP
    if (err.response?.status === 404) {
      return new Error('Ressource non trouvée');
    }
    if (err.response?.status === 422) {
      return new Error('Données invalides - Vérifiez le format des champs');
    }
    if (err.response?.status === 401) {
      return new Error('Non autorisé - Veuillez vous reconnecter');
    }
    if (err.response?.status === 403) {
      return new Error('Accès interdit - Vous n\'avez pas les droits nécessaires');
    }
    if (err.response?.status === 500) {
      return new Error('Erreur serveur - Veuillez réessayer plus tard');
    }
    if (err.response?.status === 400) {
      return new Error('Requête invalide - Vérifiez les données envoyées');
    }
  }
  
  // Vérifier si c'est une instance d'Error
  if (error instanceof Error) {
    return error;
  }
  
  // Erreur générique
  return new Error('Une erreur inattendue est survenue');
}
}

export const logementService = new LogementService();