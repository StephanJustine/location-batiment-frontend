// // src/types/paiementGroup.ts
// export interface PaiementItem {
//   id: number;
//   bail_id?: number;
//   locataire_id?: number;
//   locataire_nom?: string | null;
//   locataire_prenom?: string | null;
//   logement_numero?: string | null;
//   numero_quittance: string | null;
//   date_paiement: string | null;
//   montant: number;
//   mode_paiement: string | null;
//   reference_paiement: string | null;
//   statut: 'paye' | 'en_attente' | 'en_retard' | string;
// }

// export interface PaiementMensuel {
//   montant_penalites: number;
//   montant_charges: number;
//   montant_loyer: number;
//   mois: number;
//   annee: number;
//   mois_nom: string;
//   montant_du: number;
//   montant_paye: number;
//   montant_restant: number;
//   est_complet: boolean;
//   statut: 'complet' | 'partiel' | 'impaye';
//   paiements: PaiementItem[];
//   nombre_paiements: number;
//   nombre_locataires: number;
// }

// export interface PaiementGlobalStats {
//   total_du: number;
//   total_paye: number;
//   total_restant: number;
//   mois_complets: number;
//   mois_partiels: number;
//   mois_impayes: number;
//   taux_paiement: number;
// }

// export interface MoisStats {
//   mois: number;
//   annee: number;
//   total_paye: number;
//   nombre_paiements: number;
//   nombre_locataires: number;
// }

export interface PaiementMensuel {
  mois: number;
  annee: number;
  mois_nom: string;
  montant_du: number;
  montant_paye: number;
  montant_restant: number;
  est_complet: boolean;
  statut: string;
  nombre_paiements: number;
  nombre_locataires: number;
  montant_loyer?: number;
  montant_charges?: number;
  montant_penalites?: number;
  paiements?: any[];
}

export interface PaiementGlobalStats {
  total_du: number;
  total_paye: number;
  total_restant: number;
  mois_complets: number;
  mois_partiels: number;
  mois_impayes: number;
  taux_paiement: number;
}

export interface PaiementParLocataire {
  locataire_id: number;
  locataire_nom: string;
  locataire_prenom: string;
  locataire_telephone?: string;
  locataire_email?: string;
  locataire_adresse?: string;
  logement_id: number;
  logement_numero: string;
  logement_type: string;
  bail_id: number;
  loyer_mensuel: number;
  charges_mensuelles: number;
  montant_total: number;
  montant_paye: number;
  mois_payes: number;
  mois_impayes: number;
}