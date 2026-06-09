// src/services/locataireService.ts
import api from '@/lib/api';
import { Locataire, LocataireDetail, Garant, PieceJointe } from '@/types/models';

interface LocataireCreate {
  nom: string;
  prenom: string;
  date_naissance?: string | null;
  lieu_naissance?: string | null;
  nationalite?: string;
  cin?: string | null;
  passeport?: string | null;
  email?: string | null;
  telephone: string;
  telephone_secondaire?: string | null;
  adresse?: string | null;
  profession?: string | null;
  employeur?: string | null;
  revenu_mensuel?: number | null;
  situation_matrimoniale?: string | null;
  nombre_enfants?: number;
  pieces_jointes?: Array<Record<string, any>>;
  garants?: Array<{
    nom: string;
    prenom: string;
    telephone: string;
    email?: string | null;
    adresse?: string | null;
    profession?: string | null;
    revenu_mensuel?: number | null;
    piece_identite?: Record<string, any> | null;
  }>;
  notes?: string | null;
}

interface LocataireFilters {
  skip?: number;
  limit?: number;
  search?: string;
  statut?: string;
  is_active?: boolean;
}

export const locataireService = {
  // async getLocataires(filters?: LocataireFilters) {
  //   const { data } = await api.get<Locataire[]>('/locataires/', { params: filters });
  //   return data;
  // },

  // src/services/locataireService.ts
  async getLocataires(filters?: LocataireFilters) {
    const params: Record<string, any> = {};
    
    if (filters?.skip !== undefined) params.skip = filters.skip;
    if (filters?.limit !== undefined) params.limit = Math.min(filters.limit, 200); // 🔥 Max 200
    if (filters?.search) params.search = filters.search;
    if (filters?.statut) params.statut = filters.statut;
    if (filters?.is_active !== undefined) params.is_active = filters.is_active;
    
    const { data } = await api.get<Locataire[]>('/locataires/', { params });
    return data;
  },

  // 🔥 Nouvelle méthode pour les stats globales
  async getAllStats() {
    // Récupérer par statut (max 200 chacun)
    const [actifs, archives, blacklist] = await Promise.all([
      this.getLocataires({ skip: 0, limit: 200, statut: 'actif' }),
      this.getLocataires({ skip: 0, limit: 200, statut: 'archive' }),
      this.getLocataires({ skip: 0, limit: 200, statut: 'blacklist' })
    ]);
    
    return {
      total: actifs.length + archives.length + blacklist.length,
      actifs: actifs.length,
      archives: archives.length,
      blacklist: blacklist.length
    };
  },

  async getLocataireById(id: number) {
    const { data } = await api.get<LocataireDetail>(`/locataires/${id}`);
    return data;
  },

  // src/services/locataireService.ts - Méthode createLocataire

async createLocataire(formData: any) {
  // Formater la date
  const formatDate = (d: string | null | undefined): string | null => {
    if (!d) return null;
    if (d.includes('T')) return d;
    if (d.match(/^\d{4}-\d{2}-\d{2}$/)) return `${d}T00:00:00`;
    return d;
  };

  // Construire le payload
  const payload: Record<string, any> = {
    nom: formData.nom || '',
    prenom: formData.prenom || '',
    telephone: formData.telephone || '',
    nationalite: formData.nationalite || 'MALAGASY',
    nombre_enfants: formData.nombre_enfants ?? 0,
  };

  // Champs optionnels - n'ajouter que s'ils ont une valeur
  const optionalFields: Record<string, any> = {
    date_naissance: formatDate(formData.date_naissance),
    lieu_naissance: formData.lieu_naissance,
    cin: formData.cin,
    passeport: formData.passeport,
    email: formData.email,
    telephone_secondaire: formData.telephone_secondaire,
    adresse: formData.adresse,
    profession: formData.profession,
    employeur: formData.employeur,
    revenu_mensuel: formData.revenu_mensuel ? Number(formData.revenu_mensuel) : undefined,
    situation_matrimoniale: formData.situation_matrimoniale,
    notes: formData.notes,
  };

  // Ajouter seulement les champs non vides
  Object.entries(optionalFields).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      payload[key] = value;
    }
  });

  // Pièces jointes
  if (formData.pieces_jointes && formData.pieces_jointes.length > 0) {
    payload.pieces_jointes = formData.pieces_jointes.map((p: any) => ({
      type: p.type || 'autre',
      filename: p.filename || '',
      url: p.url || '',
      taille: p.taille || 0,
      uploaded_at: p.uploaded_at || new Date().toISOString()
    }));
  }

  // Garants
  if (formData.garants && formData.garants.length > 0) {
    payload.garants = formData.garants.map((g: any) => ({
      nom: g.nom || '',
      prenom: g.prenom || '',
      telephone: g.telephone || '',
      ...(g.email && { email: g.email }),
      ...(g.adresse && { adresse: g.adresse }),
      ...(g.profession && { profession: g.profession }),
      ...(g.revenu_mensuel && { revenu_mensuel: Number(g.revenu_mensuel) }),
      ...(g.piece_identite && { piece_identite: g.piece_identite })
    }));
  }

  console.log('📤 Payload:', JSON.stringify(payload, null, 2));
  
  try {
    const { data } = await api.post('/locataires/', payload);
    return data;
  } catch (error: any) {
    console.error('❌ Erreur création locataire:', error.response?.data);
    throw error;
  }
},

  async updateLocataire(id: number, formData: any) {
    const payload: Record<string, any> = {};

    // N'inclure que les champs modifiés
    const fields = ['nom','prenom','date_naissance','lieu_naissance','nationalite','cin','passeport',
      'email','telephone','telephone_secondaire','adresse','profession','employeur',
      'situation_matrimoniale','notes','statut','is_active'];

    fields.forEach(f => {
      if (formData[f] !== undefined) payload[f] = formData[f] || null;
    });

    if (formData.revenu_mensuel !== undefined) payload.revenu_mensuel = formData.revenu_mensuel ? Number(formData.revenu_mensuel) : null;
    if (formData.nombre_enfants !== undefined) payload.nombre_enfants = formData.nombre_enfants ?? 0;

    const { data } = await api.put<Locataire>(`/locataires/${id}`, payload);
    return data;
  },

  async deleteLocataire(id: number) {
    const { data } = await api.delete(`/locataires/${id}`);
    return data;
  },

  async blacklistLocataire(id: number, motif: string) {
    const { data } = await api.post(`/locataires/${id}/blacklist`, null, { params: { motif } });
    return data;
  },

  async activateLocataire(id: number) {
    const { data } = await api.post(`/locataires/${id}/activer`);
    return data;
  },

  async getGarants(id: number) {
    const { data } = await api.get(`/locataires/${id}/garants`);
    return data;
  },

  async addGarant(id: number, garant: any) {
    const { data } = await api.post<Garant>(`/locataires/${id}/garants`, {
      nom: garant.nom, prenom: garant.prenom, telephone: garant.telephone,
      email: garant.email || null, adresse: garant.adresse || null,
      profession: garant.profession || null,
      revenu_mensuel: garant.revenu_mensuel ? Number(garant.revenu_mensuel) : null,
      piece_identite: garant.piece_identite || null
    });
    return data;
  },

  async deleteGarant(locataireId: number, garantId: number) {
    const { data } = await api.delete(`/locataires/${locataireId}/garants/${garantId}`);
    return data;
  },

  async updateGarant(locataireId: number, garantId: number, garantData: any) {
    const { data } = await api.put(`/locataires/${locataireId}/garants/${garantId}`, garantData);
    return data;
  },

  async uploadPieceJointe(id: number, file: File, docType: string) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('doc_type', docType);
    const { data } = await api.post<PieceJointe>(`/locataires/${id}/documents`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return data;
  },

  async deletePieceJointe(locataireId: number, pieceId: number) {
    const { data } = await api.delete(`/locataires/${locataireId}/documents/${pieceId}`);
    return data;
  },

  async getBauxActifs(id: number) {
    const { data } = await api.get(`/locataires/${id}/baux-actifs`);
    return data;
  },

  async getHistoriqueLogements(id: number) {
    const { data } = await api.get(`/locataires/${id}/historique-logements`);
    return data;
  },

  async getStatsPaiements(id: number) {
    const { data } = await api.get(`/locataires/${id}/statistiques-paiements`);
    return data;
  },

  async getSolde(id: number) {
    const { data } = await api.get(`/locataires/${id}/solde`);
    return data;
  },

  async checkEligibility(id: number) {
    const { data } = await api.get(`/locataires/${id}/eligibility`);
    return data;
  },

  async exportLocataire(id: number, format: 'pdf' | 'excel' = 'pdf') {
    const { data } = await api.get(`/locataires/${id}/export`, {
      params: { format }, responseType: 'blob'
    });
    return data;
  },

  async sendSMS(id: number, message: string) {
    const { data } = await api.post(`/locataires/${id}/send-sms`, { message });
    return data;
  },

  async sendEmail(id: number, subject: string, body: string) {
    const { data } = await api.post(`/locataires/${id}/send-email`, { subject, body });
    return data;
  }
};