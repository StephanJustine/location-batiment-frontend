// export enum TypeReleve {
//   EAU = "eau",
//   ELECTRICITE = "electricite",
//   GAZ = "gaz",
//   AUTRE = "autre"
// }

// export enum StatutReleve {
//   BROUILLON = "brouillon",
//   VALIDE = "valide",
//   FACTURE = "facture",
//   CONTESTE = "conteste"
// }

// export interface Releve {
//   date_facturation: any;
//   id: number;
//   logement_id: number;
//   type_releve: TypeReleve;
//   index_ancien: number;
//   index_nouveau: number;
//   consommation: number;
//   mois: number;
//   annee: number;
//   date_releve: string;
//   tarif_unitaire?: number;
//   montant?: number;
//   statut: StatutReleve;
//   est_facture: boolean;
//   numero_facture?: string;
//   facture_pdf_url?: string;
//   notes?: string;
//   photo_url?: string;
//   created_at: string;
//   created_by?: number;
// }

// export interface ReleveDetail extends Releve {
//   logement_numero?: string;
//   logement_adresse?: string;
//   consommation_moyenne?: number;
//   evolution?: Array<{ periode: string; consommation: number; montant: number }>;
// }

// export interface TarifService {
//   id: number;
//   type_service: TypeReleve;
//   tarif: number;
//   date_debut: string;
//   date_fin?: string;
//   tranche_min?: number;
//   tranche_max?: number;
//   est_actif: boolean;
// }

// export interface DecompteCharges {
//   created_at: string | Date;
//   id: number;
//   logement_id: number;
//   annee: number;
//   total_eau: number;
//   total_electricite: number;
//   total_gaz: number;
//   total_charges_communes: number;
//   total_general: number;
//   nb_personnes: number; 
//   details?: Record<string, any>;
//   pdf_url?: string;
//   est_valide: boolean;
//   date_validation?: string;
// }

// src/types/releve.ts

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
  date_facturation?: string;
}

export interface ReleveDetail extends Releve {
  logement_numero?: string;
  logement_adresse?: string;
  consommation_moyenne?: number;
  nb_personnes?: number;                    // Nombre de personnes dans le logement
  montant_calcule?: number;                 // Montant calculé pour l'eau
  tarif_eau_par_personne?: number;          // Tarif par personne pour l'eau
  locataires?: Array<{                     // Liste des locataires avec leurs baux
    locataire: {
      id: number;
      nom: string;
      prenom: string;
      telephone?: string;
      email?: string;
      nombre_enfants?: number;
      profession?: string;
      is_active?: boolean;
      statut?: string;
    };
    bail: {
      id: number;
      date_debut: string;
      date_fin?: string;
      loyer: number;
      statut: string;
    } | null;
  }>;
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
  created_at?: string;
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
  nb_personnes: number;
  details?: Record<string, any>;
  pdf_url?: string;
  est_valide: boolean;
  date_validation?: string;
  created_at: string;
}

// Interface pour la réponse du backend avec les locataires
export interface ReleveWithLocataires extends ReleveDetail {
  releve: Releve;
  logement: {
    id: number;
    numero: string;
    batiment_nom?: string;
    adresse?: string;
  };
  nb_personnes: number;
  montant_calcule?: number;
  tarif_eau_par_personne: number;
  locataires: Array<{
    locataire: {
      id: number;
      nom: string;
      prenom: string;
      telephone?: string;
      email?: string;
      nombre_enfants?: number;
      profession?: string;
      is_active: boolean;
      statut: string;
    };
    bail: {
      id: number;
      date_debut: string;
      date_fin?: string;
      loyer: number;
      statut: string;
    } | null;
  }>;
}