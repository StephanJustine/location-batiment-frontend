// types/travaux.ts
export enum TypeTravaux {
  MAINTENANCE = 'maintenance',
  RENOVATION = 'renovation',
  URGENCE = 'urgence',
  ELECTRIQUE = 'electrique',
  PLOMBERIE = 'plomberie',
  PEINTURE = 'peinture',
  AUTRE = 'autre'
}

export enum StatutTravaux {
  PLANIFIE = 'planifie',
  EN_COURS = 'en_cours',
  TERMINE = 'termine',
  ANNULE = 'annule'
}

export interface Travaux {
  id: number;
  logement_id: number;
  logement_numero?: string;
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
  created_by_name?: string;
}

export interface TravauxCreate {
  logement_id: number;
  type_travaux: string;
  description: string;
  date_debut?: string;
  date_fin?: string;
  cout_estime?: number;
  cout_reel?: number;
  prestataire?: string;
  statut?: string;
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

export interface TravauxStats {
  total: number;
  par_statut: {
    [key in StatutTravaux]?: number;
  };
  par_type: {
    [key in TypeTravaux]?: number;
  };
  cout_total_estime: number;
  cout_total_reel: number;
  en_cours: number;
  termines: number;
  annules: number;
}