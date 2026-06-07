export interface User {
  id: number;
  email: string;
  username: string;
  nom: string;
  prenom: string;
  telephone: string;
  role: 'admin' | 'gestionnaire' | 'locataire';
  status: 'actif' | 'inactif' | 'suspendu';
  is_active: boolean;
  created_at: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  user: User;
}

export interface DashboardStats {
  total_batiments: number;
  total_logements: number;
  logements_occupes: number;
  logements_libres: number;
  logements_maintenance: number;
  taux_occupation: number;
  total_locataires: number;
  nouveaux_locataires_mois: number;
  locataires_blacklist: number;
  chiffre_affaires_mois: number;
  chiffre_affaires_annee: number;
  impayes_total: number;
  taux_recouvrement: number;
  loyer_moyen: number;
  baux_actifs: number;
  baux_expirant_30j: number;
  baux_resilies_mois: number;
  alertes_urgentes: number;
  alertes_moyennes: number;
  relances_impayes: number;
}

export interface EvolutionData {
  mois: string;
  annee: number;
  mois_num: number;
  ca: number;
  impayes: number;
  taux_occupation: number;
  nb_nouveaux_contrats: number;
}

export interface PerformanceBatiment {
  batiment_id: number;
  batiment_nom: string;
  nb_logements: number;
  nb_occupes: number;
  taux_occupation: number;
  revenus_mensuels: number;
  impayes: number;
}

export interface Alerte {
  type: string;
  niveau: 'urgent' | 'moyen' | 'faible';
  message: string;
  date?: string;
  montant?: number;
  locataire_nom?: string;
  bail_numero?: string;
}