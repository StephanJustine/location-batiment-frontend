// src/types/paiementStats.ts
export interface StatistiquesMensuelles {
  annee: number;
  mois: number;
  total_paye: number;
  nombre_paiements: number;
  nombre_locataires: number;
}

export interface RelanceRequest {
  type: 'email' | 'sms' | 'both';
  destinataires?: string[];
  message?: string;
}