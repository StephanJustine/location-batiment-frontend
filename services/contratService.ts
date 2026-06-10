// src/services/contratService.ts - Complet
import api from '@/lib/axios';

export interface ContratModele {
  id: number;
  nom: string;
  type_contrat: string;
  description?: string;
  template_html: string;
  variables: string[];
  clauses_par_defaut: any;
  est_par_defaut: boolean;
  est_actif: boolean;
  created_at: string;
}

export interface ContratSigne {
  id: number;
  bail_id: number;
  modele_id?: number;
  numero_contrat: string;
  version: number;
  date_signature?: string;
  date_expiration?: string;
  pdf_url: string;
  doc_url?: string;
  annexes: string[];
  legalise: boolean;
  date_legalisation?: string;
  legalise_par?: string;
  numero_enregistrement?: string;
  hash_document?: string;
  est_archive: boolean;
  created_at: string;
}

export const contratService = {
  // ==================== MODÈLES ====================
  getModeles: async (type?: string) => {
    const { data } = await api.get<ContratModele[]>('/contrats/modeles', { params: type ? { type_contrat: type } : {} });
    return data;
  },

  createModele: async (modele: any) => {
    const { data } = await api.post<ContratModele>('/contrats/modeles', modele);
    return data;
  },

  updateModele: async (id: number, modele: any) => {
    const { data } = await api.put<ContratModele>(`/contrats/modeles/${id}`, modele);
    return data;
  },

  deleteModele: async (id: number) => {
    const { data } = await api.delete(`/contrats/modeles/${id}`);
    return data;
  },

  // ==================== GÉNÉRATION ====================
  generer: async (bailId: number, modeleId?: number, variables?: any) => {
    const { data } = await api.post<ContratSigne>('/contrats/generer', {
      bail_id: bailId,
      modele_id: modeleId || null,
      variables: variables || {}
    });
    return data;
  },

  // ==================== CONTRATS SIGNÉS ====================
  getByBail: async (bailId: number) => {
    const { data } = await api.get<ContratSigne[]>(`/contrats/bail/${bailId}`);
    return data;
  },

  getById: async (contratId: number) => {
    const { data } = await api.get<ContratSigne>(`/contrats/signes/${contratId}`);
    return data;
  },

  getPdfUrl: async (contratId: number) => {
    const { data } = await api.get(`/contrats/${contratId}/pdf`);
    return data.pdf_url;
  },

  signer: async (contratId: number) => {
    const { data } = await api.post(`/contrats/${contratId}/signer`);
    return data;
  },

  legaliser: async (contratId: number, data: { numero_enregistrement: string; legalise_par: string; date_legalisation: string }) => {
    const { data: res } = await api.post(`/contrats/${contratId}/legaliser`, data);
    return res;
  },

  archiver: async (contratId: number, motif?: string) => {
    const { data } = await api.post(`/contrats/${contratId}/archiver`, null, { params: { motif } });
    return data;
  }
};