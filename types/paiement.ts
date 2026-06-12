// src/types/paiement.ts

export enum TypePaiement {
  LOYER = "loyer",
  CHARGE = "charge",
  CAUTION = "caution",
  PENALITE = "penalite",
  REGULARISATION = "regularisation",
  AUTRE = "autre"
}

export enum ModePaiement {
  VIREMENT = "virement",
  ESPECES = "especes",
  CHEQUE = "cheque",
  MVOLA = "mvola",
  ORANGE_MONEY = "orange_money",
  AIRTEL_MONEY = "airtel_money"
}

export enum StatutPaiement {
  EN_ATTENTE = "en_attente",
  PAYE = "paye",
  EN_RETARD = "en_retard",
  ANNULE = "annule",
  REMBOURSE = "rembourse"
}

export interface Paiement {
  id: number;
  bail_id: number;
  locataire_id: number;
  montant: number;
  montant_loyer?: number;
  montant_charges?: number;
  montant_penalites: number;
  date_echeance: string;
  date_paiement?: string;
  type_paiement: TypePaiement;
  mode_paiement: ModePaiement;
  statut: StatutPaiement;
  mois_concerne?: number;
  annee_concernee?: number;
  reference_paiement?: string;
  numero_quittance?: string;
  quittance_pdf_url?: string;
  jours_retard: number;
  penalites_appliquees: number;
  notes?: string;
  created_at: string;
}

export interface PaiementDetail extends Paiement {
  locataire_telephone: any;
  bail_numero?: string;
  locataire_nom?: string;
  locataire_prenom?: string;
  logement_adresse?: string;
}

export interface Quittance {
  id: number;
  paiement_id: number;
  numero_quittance: string;
  date_emission: string;
  mois?: number;
  annee?: number;
  pdf_url?: string;
  email_envoye: boolean;
  sms_envoye: boolean;
}

export interface StatistiquesPaiements {
  total_encaisse_mois: number;
  total_impayes: number;
  nombre_paiements_mois: number;
  taux_recouvrement: number;
}

export interface TableauBordFinancier {
  ca_mensuel: number;
  impayes_total: number;
  taux_occupation: number;
  paiements_par_mode: Array<{ mode: string; total: number }>;
}

export interface PaiementCreate {
  bail_id: number;
  montant: number;
  date_echeance: string;
  type_paiement: TypePaiement;
  mode_paiement: ModePaiement;
  mois_concerne?: number;
  annee_concernee?: number;
  reference_paiement?: string;
  notes?: string;
}
