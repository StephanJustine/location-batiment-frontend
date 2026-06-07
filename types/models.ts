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

export interface Bail {
  id: number;
  numero_contrat: string;
  logement_id: number;
  locataire_id: number;
  date_debut: string;
  date_fin: string;
  date_signature: string;
  loyer_mensuel: number;
  charges_mensuelles: number;
  caution_montant: number;
  type_bail: string;
  statut: string;
  jour_paiement: number;
  is_active: boolean;
  logement?: Logement;
  locataire?: Locataire;
  paiements?: Paiement[];
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