export enum TypeReleve {
  EAU = "eau",
  ELECTRICITE = "electricite",
  GAZ = "gaz",
  AUTRE = "autre"
}

export enum StatutReleve {
  BROUILLON = "brouillon",
  VALIDE = "valide",
  FACTURE = "facture",
  CONTESTE = "conteste"
}

export interface Releve {
  date_facturation: any;
  id: number;
  logement_id: number;
  type_releve: TypeReleve;
  index_ancien: number;
  index_nouveau: number;
  consommation: number;
  mois: number;
  annee: number;
  date_releve: string;
  tarif_unitaire?: number;
  montant?: number;
  statut: StatutReleve;
  est_facture: boolean;
  numero_facture?: string;
  facture_pdf_url?: string;
  notes?: string;
  photo_url?: string;
  created_at: string;
  created_by?: number;
}

export interface ReleveDetail extends Releve {
  logement_numero?: string;
  logement_adresse?: string;
  consommation_moyenne?: number;
  evolution?: Array<{ periode: string; consommation: number; montant: number }>;
}

export interface TarifService {
  id: number;
  type_service: TypeReleve;
  tarif: number;
  date_debut: string;
  date_fin?: string;
  tranche_min?: number;
  tranche_max?: number;
  est_actif: boolean;
}

export interface DecompteCharges {
  id: number;
  logement_id: number;
  annee: number;
  total_eau: number;
  total_electricite: number;
  total_gaz: number;
  total_charges_communes: number;
  total_general: number;
  details?: Record<string, any>;
  pdf_url?: string;
  est_valide: boolean;
  date_validation?: string;
}