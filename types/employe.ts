// types/employe.ts
export enum TypeEmploye {
  GARDIEN = 'gardien',
  FEMME_MENAGE = 'femme_de_menage',
  JARDINIER = 'jardinier',
  TECHNICIEN = 'technicien',
  AGENT_SECURITE = 'agent_securite',
  COMPTABLE = 'comptable',
  AUTRE = 'autre'
}

export enum StatutEmploye {
  ACTIF = 'actif',
  CONGE = 'conge',
  ARRET_MALADIE = 'arret_maladie',
  ABSENT = 'absent',
  TERMINE = 'termine'
}

export interface Employe {
  notes: string;
  id: number;
  batiment_id: number;
  batiment_nom?: string;
  nom: string;
  prenom: string;
  cin?: string;
  date_naissance?: string;
  telephone: string;
  telephone_urgence?: string;
  email?: string;
  adresse?: string;
  type_employe: TypeEmploye;
  poste?: string;
  date_embauche: string;
  salaire_base: number;
  statut: StatutEmploye;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}