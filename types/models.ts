export interface Batiment {
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
  documents: string[];
  statut: 'actif' | 'inactif' | 'en_maintenance';
  is_active: boolean;
  created_at: string;
  updated_at: string;
  logements?: Logement[];
}

export interface Logement {
  id: number;
  batiment_id: number;
  numero: string;
  etage: number;
  porte: string;
  surface: number;
  type: string;
  nb_pieces: number;
  nb_chambres: number;
  nb_sdb: number;
  nb_wc: number;
  statut: 'libre' | 'occupe' | 'reserve' | 'en_maintenance';
  equipements: string[];
  description: string;
  loyer_base: number;
  charges_mensuelles: number;
  caution_mois: number;
  is_active: boolean;
  batiment?: Batiment;
  baux?: Bail[];
}

export interface Paiement {
  id: number;
  bail_id: number;
  locataire_id: number;
  montant: number;
  date_echeance: string;
  date_paiement: string;
  type_paiement: string;
  mode_paiement: string;
  statut: string;
  mois_paye: number;
  annee_paye: number;
  numero_quittance: string;
  penalites_appliquees: number;
  jours_retard: number;
  bail?: Bail;
  locataire?: Locataire;
}


// src/types/models.ts (ajouts)
export interface Garant {
  id?: number;
  nom: string;
  prenom: string;
  telephone: string;
  email?: string;
  adresse?: string;
  profession?: string;
  revenu_mensuel?: number;
  piece_identite?: {
    type: string;
    numero: string;
    fichier?: string;
  };
  created_at?: string;
}

export interface Locataire {
  paiements_total: number;
  paiements_impayes: any;
  id: number;
  nom: string;
  prenom: string;
  date_naissance?: string;
  lieu_naissance?: string;
  nationalite: string;
  cin?: string;
  passeport?: string;
  email?: string;
  telephone: string;
  telephone_secondaire?: string;
  adresse?: string;
  profession?: string;
  employeur?: string;
  revenu_mensuel?: number;
  situation_matrimoniale?: 'celibataire' | 'marie' | 'divorce' | 'veuf';
  nombre_enfants: number;
  pieces_jointes: PieceJointe[];
  garants: Garant[];
  notes?: string;
  statut: 'actif' | 'archive' | 'blacklist';
  is_active: boolean;
  created_at: string;
  updated_at?: string;
  created_by?: number;
}

export interface PieceJointe {
  id: number;
  type: string;
  filename: string;
  url: string;
  taille: number;
  uploaded_at: string;
}

export interface LocataireDetail extends Locataire {
  baux_actifs: BailActif[];
  historique_logements: HistoriqueLogement[];
  paiements_total: number;
  paiements_impayes: number;
  nombre_paiements: number;
}

export interface BailActif {
  id: number;
  numero_contrat: string;
  logement_id: number;
  logement_numero: string;
  date_debut: string;
  date_fin: string;
  loyer_mensuel: number;
  statut: string;
}

export interface HistoriqueLogement {
  id: number;
  logement_id: number;
  logement_numero: string;
  bail_id?: number;
  date_debut: string;
  date_fin?: string;
  loyer?: number;
  motif_depart?: string;
}


// src/types/models.ts - Ajouts pour les baux
export interface LogementInfo {
  photos: any;
  plan_url: any;
  id: number;
  numero?: string;
  surface?: number;
  etage?: number;
  loyer_base?: number;
  photo_url?: string;
  batiment_nom?: string;
  batiment_adresse?: string;
}

export interface LocataireInfo {
  id: number;
  nom: string;
  prenom: string;
  telephone?: string;
  email?: string;
  cin?: string;
  photo_url?: string;
  profession?: string;
} 

export interface Bail {
  batiment_nom: string | undefined;
  id: number;
  numero_contrat: string;
  logement_id: number;
  locataire_id: number;
  date_debut: string;
  date_fin: string;
  date_signature?: string;
  date_resiliation?: string;
  loyer_mensuel: number;
  charges_mensuelles: number;
  caution_montant: number;
  frais_agence: number;
  penalites_retard: number;
  type_bail: 'habitation' | 'commercial' | 'professionnel' | 'saisonnier';
  statut: 'brouillon' | 'actif' | 'resilie' | 'termine' | 'expired';
  jour_paiement: number;
  mode_paiement: string;
  indexation_annuelle: boolean;
  pourcentage_indexation: number;
  contrat_pdf_url?: string;
  clauses_specifiques?: string;
  conditions_resiliation?: string;
  renouvellement_auto: boolean;
  preavis_jours: number;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
  created_by?: number;
  signed_by?: number;
  // Relations
  logement?: LogementInfo;   // 🔥 Objet imbriqué
  locataire?: LocataireInfo; // 🔥 Objet imbriqué
  logement_numero?: string;
  logement_adresse?: string;
  locataire_nom?: string;
  locataire_prenom?: string;
  locataire_telephone?: string;
  paiements_effectues?: number;
  paiements_impayes?: number;
  total_paye?: number;
  jours_restants?: number;
}

export interface BailCreate {
  logement_id: number;
  locataire_id: number;
  date_debut: string;
  date_fin: string;
  loyer_mensuel: number;
  charges_mensuelles?: number;
  caution_montant: number;
  frais_agence?: number;
  penalites_retard?: number;
  type_bail?: string;
  jour_paiement?: number;
  mode_paiement?: string;
  indexation_annuelle?: boolean;
  pourcentage_indexation?: number;
  renouvellement_auto?: boolean;
  preavis_jours?: number;
  clauses_specifiques?: string;
  conditions_resiliation?: string;
}

export interface Avenant {
  id: number;
  bail_id: number;
  numero_avenant: number;
  date_avenant: string;
  type_modification: string;
  ancienne_valeur: any;
  nouvelle_valeur: any;
  date_effet: string;
  document_url?: string;
  signe: boolean;
  created_at: string;
}


// src/types/models.ts - Ajout des types baux manquants
export interface FinBailRequest {
  date_resiliation: string;
  motif: string;
  etat_des_lieux_sortie: any;
  retenues_caution: number;
  restitution_caution: number;
  appreciation_locataire?: string;
}

export interface RenouvellementRequest {
  nouvelle_date_fin: string;
  nouveau_loyer?: number;
  motif: string;
}

export interface Avenant {
  id: number;
  bail_id: number;
  numero_avenant: number;
  date_avenant: string;
  type_modification: string;
  ancienne_valeur: any;
  nouvelle_valeur: any;
  date_effet: string;
  document_url?: string;
  signe: boolean;
  created_at: string;
  created_by?: number;
}

export interface BailFilters {
  skip?: number;
  limit?: number;
  search?: string;
  statut?: string;
  type_bail?: string;
  logement_id?: number;
  locataire_id?: number;
}