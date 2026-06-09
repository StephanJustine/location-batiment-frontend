// src/lib/constants.ts
export const STATUTS_LOCATAIRE = {
  ACTIF: 'actif',
  ARCHIVE: 'archive',
  BLACKLIST: 'blacklist'
} as const;

export const SITUATIONS_MATRIMONIALES = {
  CELIBATAIRE: 'celibataire',
  MARIE: 'marie',
  DIVORCE: 'divorce',
  VEUF: 'veuf'
} as const;

export const NATIONALITES = {
  MALAGASY: 'MALAGASY',
  FRANCAISE: 'FRANCAISE',
  COMORIENNE: 'COMORIENNE',
  AUTRE: 'AUTRE'
} as const;

export const TYPES_PIECES = {
  CIN: 'CIN',
  PASSEPORT: 'Passeport',
  PERMIS: 'Permis de conduire',
  CARTE_ETUDIANT: 'Carte étudiant',
  JUSTIFICATIF_DOMICILE: 'Justificatif de domicile',
  BULLETIN_SALAIRE: 'Bulletin de salaire',
  CONTRAT_TRAVAIL: 'Contrat de travail',
  ATTESTATION_EMPLOYEUR: 'Attestation employeur',
  AUTRE: 'Autre'
} as const;

export const LOCATAIRE_COLUMNS = [
  { id: 'nom', label: 'Nom', sortable: true },
  { id: 'prenom', label: 'Prénom', sortable: true },
  { id: 'cin', label: 'CIN', sortable: false },
  { id: 'telephone', label: 'Téléphone', sortable: false },
  { id: 'email', label: 'Email', sortable: false },
  { id: 'statut', label: 'Statut', sortable: true },
  { id: 'created_at', label: 'Date création', sortable: true }
] as const;

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 12,
  PAGE_SIZE_OPTIONS: [12, 24, 48, 96],
  MAX_PAGE_SIZE: 100
} as const;

export const UPLOAD = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ACCEPTED_TYPES: ['image/jpeg', 'image/png', 'application/pdf'],
  MAX_FILES: 10
} as const;