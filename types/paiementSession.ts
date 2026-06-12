// src/types/paiementSession.ts
export interface PaiementSession {
  id: number;
  bail_id: number;
  mois: number;
  annee: number;
  montant_loyer: number;
  montant_charges: number;
  montant_total: number;
  date_echeance: string;
  date_paiement?: string;
  montant_paye?: number;
  statut: 'en_attente' | 'partiel' | 'paye' | 'en_retard';
  mode_paiement?: string;
  reference_paiement?: string;
  quittance_generer: boolean;
  quittance_url?: string;
  penalites: number;
  notes?: string;
  created_at: string;
  updated_at?: string;
}

export interface PaiementSessionStats {
  total_mois: number;
  mois_payes: number;
  mois_impayes: number;
  mois_attente: number;
  total_du: number;
  total_paye: number;
  total_impaye: number;
  taux_paiement: number;
}

export interface PaiementPayRequest {
  montant: number;
  mode_paiement: string;
  reference_paiement?: string;
  date_paiement?: string;
}

export interface GenerateEcheancesRequest {
  mois: number;
  force: boolean;
}