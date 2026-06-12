// src/services/paiementGroupService.ts
import api from '@/lib/api';
import { PaiementMensuel, PaiementGlobalStats, MoisStats } from '@/types/paiementGroup';

export const paiementGroupService = {
  // ==================== ROUTES PAR BAIL ====================
  
  // ✅ GET /api/v1/paiements/baux/{bail_id}/paiements/grouped-by-month
  async getGroupedByMonthForBail(bailId: number, annee?: number): Promise<PaiementMensuel[]> {
    const params = annee ? { annee } : {};
    console.log(`📡 Appel API: /paiements/baux/${bailId}/paiements/grouped-by-month`, params);
    const response = await api.get(`/paiements/baux/${bailId}/paiements/grouped-by-month`, { params });
    console.log(`📦 Réponse groupée:`, response.data);
    return response.data;
  },

  // ✅ GET /api/v1/paiements/baux/{bail_id}/paiements/global-stats
  async getGlobalStatsForBail(bailId: number): Promise<PaiementGlobalStats> {
    console.log(`📡 Appel API: /paiements/baux/${bailId}/paiements/global-stats`);
    const response = await api.get(`/paiements/baux/${bailId}/paiements/global-stats`);
    console.log(`📦 Stats globales:`, response.data);
    return response.data;
  },

  // ✅ POST /api/v1/paiements/baux/{bail_id}/paiements/generate-reference
  async generateReference(bailId: number): Promise<string> {
    console.log(`📡 Génération référence pour bail ${bailId}`);
    const response = await api.post(`/paiements/baux/${bailId}/paiements/generate-reference`);
    return response.data.reference;
  },

  // ✅ GET /api/v1/paiements/baux/{bail_id}/paiements/month/{mois}/{annee}
  async getMonthDetailsForBail(bailId: number, mois: number, annee: number): Promise<PaiementMensuel> {
    console.log(`📡 Détails mois ${mois}/${annee} pour bail ${bailId}`);
    const response = await api.get(`/paiements/baux/${bailId}/paiements/month/${mois}/${annee}`);
    return response.data;
  },

  // ✅ GET /api/v1/paiements/baux/{bail_id}/paiements/impayes
  async getImpayesForBail(bailId: number): Promise<PaiementMensuel[]> {
    console.log(`📡 Impayés pour bail ${bailId}`);
    const response = await api.get(`/paiements/baux/${bailId}/paiements/impayes`);
    return response.data;
  },

  // ✅ GET /api/v1/paiements/baux/{bail_id}/paiements/stats/mois
  async getMoisStatsForBail(bailId: number, annee: number): Promise<MoisStats[]> {
    console.log(`📡 Statistiques mensuelles bail ${bailId} pour ${annee}`);
    const response = await api.get(`/paiements/baux/${bailId}/paiements/stats/mois`, { params: { annee } });
    return response.data;
  },

  // ✅ GET /api/v1/paiements/baux/{bail_id}/paiements/month/{mois}/{annee}/export
  async exportMonthForBail(bailId: number, mois: number, annee: number, format: string = 'excel'): Promise<Blob> {
    console.log(`📡 Export bail ${bailId} - mois: ${mois}/${annee}`);
    const response = await api.get(`/paiements/baux/${bailId}/paiements/month/${mois}/${annee}/export`, {
      params: { format },
      responseType: 'blob'
    });
    return response.data;
  },

  // ✅ POST /api/v1/paiements/baux/{bail_id}/paiements/month/{mois}/{annee}/relance
  async sendRelanceForBail(bailId: number, mois: number, annee: number, type: 'email' | 'sms' | 'both'): Promise<void> {
    console.log(`📡 Relance bail ${bailId} - ${mois}/${annee} - type: ${type}`);
    await api.post(`/paiements/baux/${bailId}/paiements/month/${mois}/${annee}/relance`, { type });
  },

  // ==================== ROUTES GLOBALES (TOUS BAUX) ====================
  
  // ✅ GET /api/v1/paiements/grouped-by-month
  async getGroupedByMonth(annee?: number): Promise<PaiementMensuel[]> {
    const params = annee ? { annee } : {};
    console.log(`📡 Appel API: /paiements/grouped-by-month`, params);
    const response = await api.get('/paiements/grouped-by-month', { params });
    console.log(`📦 Réponse groupée globale:`, response.data);
    return response.data;
  },

  // ✅ GET /api/v1/paiements/global-stats
  async getGlobalStats(): Promise<PaiementGlobalStats> {
    console.log(`📡 Appel API: /paiements/global-stats`);
    const response = await api.get('/paiements/global-stats');
    console.log(`📦 Stats globales:`, response.data);
    return response.data;
  },

  // ✅ GET /api/v1/paiements/impayes
  async getImpayes(): Promise<any[]> {
    console.log(`📡 Récupération des impayés`);
    const response = await api.get('/paiements/impayes');
    return response.data;
  },

  // ✅ GET /api/v1/paiements/month/{mois}/{annee}
  async getMonthDetails(mois: number, annee: number): Promise<PaiementMensuel> {
    console.log(`📡 Détails du mois ${mois}/${annee}`);
    const response = await api.get(`/paiements/month/${mois}/${annee}`);
    console.log(`📦 Détails du mois:`, response.data);
    return response.data;
  },

  // ✅ GET /api/v1/paiements/month/{mois}/{annee}/export
  async exportMonth(mois: number, annee: number, format: string = 'excel'): Promise<Blob> {
    console.log(`📡 Export mois: ${mois}/${annee} en ${format}`);
    const response = await api.get(`/paiements/month/${mois}/${annee}/export`, {
      params: { format },
      responseType: 'blob'
    });
    return response.data;
  },

  // ✅ POST /api/v1/paiements/month/{mois}/{annee}/relance
  async sendRelance(mois: number, annee: number, type: 'email' | 'sms' | 'both'): Promise<void> {
    console.log(`📡 Relance pour ${mois}/${annee} - type: ${type}`);
    await api.post(`/paiements/month/${mois}/${annee}/relance`, { type });
  },

  // ==================== STATISTIQUES ====================
  
  // ✅ GET /api/v1/paiements/statistiques
  async getStatistiques(): Promise<any> {
    console.log(`📡 Statistiques générales`);
    const response = await api.get('/paiements/statistiques');
    return response.data;
  },

  // ✅ GET /api/v1/paiements/statistiques/mensuelles
  async getStatistiquesMensuelles(annee: number): Promise<any> {
    console.log(`📡 Statistiques mensuelles pour ${annee}`);
    const response = await api.get('/paiements/statistiques/mensuelles', { params: { annee } });
    return response.data;
  },

  // ✅ GET /api/v1/paiements/statistiques/par-mode
  async getStatistiquesParMode(): Promise<any> {
    console.log(`📡 Statistiques par mode de paiement`);
    const response = await api.get('/paiements/statistiques/par-mode');
    return response.data;
  },

  // ✅ GET /api/v1/paiements/previsions
  async getPrevisions(mois: number = 3): Promise<any> {
    console.log(`📡 Prévisions pour ${mois} mois`);
    const response = await api.get('/paiements/previsions', { params: { mois } });
    return response.data;
  },

  // ✅ GET /api/v1/paiements/stats/mois
  async getMoisStats(annee: number): Promise<MoisStats[]> {
    console.log(`📡 Statistiques mensuelles pour ${annee}`);
    const response = await api.get('/paiements/stats/mois', { params: { annee } });
    return response.data;
  },

  // ==================== TABLEAU DE BORD ====================
  
  // ✅ GET /api/v1/paiements/dashboard
  async getDashboardStats(): Promise<any> {
    console.log(`📡 Dashboard paiements`);
    const response = await api.get('/paiements/dashboard');
    return response.data;
  },

  // ✅ GET /api/v1/paiements/dashboard-executif
  async getDashboardExecutif(): Promise<any> {
    console.log(`📡 Dashboard exécutif`);
    const response = await api.get('/paiements/dashboard-executif');
    return response.data;
  },

  // ==================== QUITTANCES ====================
  
  // ✅ GET /api/v1/paiements/{paiement_id}/quittance
  async getQuittance(paiementId: number): Promise<any> {
    console.log(`📡 Récupération quittance pour paiement ${paiementId}`);
    const response = await api.get(`/paiements/${paiementId}/quittance`);
    return response.data;
  },

  // ✅ GET /api/v1/paiements/{paiement_id}/quittance/pdf
  async generateQuittance(paiementId: number): Promise<Blob> {
    console.log(`📡 Génération PDF quittance pour paiement ${paiementId}`);
    const response = await api.get(`/paiements/${paiementId}/quittance/pdf`, {
      responseType: 'blob'
    });
    return response.data;
  },

  // ✅ POST /api/v1/paiements/{paiement_id}/quittance/email
  async sendQuittanceEmail(paiementId: number, email?: string): Promise<void> {
    console.log(`📡 Envoi quittance email pour paiement ${paiementId}`);
    await api.post(`/paiements/${paiementId}/quittance/email`, null, { params: { email } });
  },

  // ✅ POST /api/v1/paiements/{paiement_id}/quittance/sms
  async sendQuittanceSMS(paiementId: number, telephone?: string): Promise<void> {
    console.log(`📡 Envoi quittance SMS pour paiement ${paiementId}`);
    await api.post(`/paiements/${paiementId}/quittance/sms`, null, { params: { telephone } });
  },

  // ==================== CAUTIONS ====================
  
  // ✅ POST /api/v1/paiements/caution/encaisser
  async encaisserCaution(bailId: number, montant: number): Promise<any> {
    console.log(`📡 Encaissement caution bail ${bailId} - ${montant} Ar`);
    const response = await api.post('/paiements/caution/encaisser', null, {
      params: { bail_id: bailId, montant }
    });
    return response.data;
  },

  // ✅ POST /api/v1/paiements/caution/restituer
  async restituerCaution(bailId: number, montant: number, retenues: number = 0, motif: string = ''): Promise<any> {
    console.log(`📡 Restitution caution bail ${bailId} - ${montant} Ar`);
    const response = await api.post('/paiements/caution/restituer', null, {
      params: { bail_id: bailId, montant, retenues, motif }
    });
    return response.data;
  },

  // ==================== RELANCES AUTO ====================
  
  // ✅ POST /api/v1/paiements/relances/generer
  async genererRelancesAuto(): Promise<any> {
    console.log(`📡 Génération automatique des relances`);
    const response = await api.post('/paiements/relances/generer');
    return response.data;
  },

  // ✅ POST /api/v1/paiements/relances/generer-et-envoyer
  async genererEtEnvoyerRelances(): Promise<any> {
    console.log(`📡 Génération et envoi des relances`);
    const response = await api.post('/paiements/relances/generer-et-envoyer');
    return response.data;
  },

  // ==================== RELEVÉS ET SOLDES ====================
  
  // ✅ GET /api/v1/paiements/locataire/{locataire_id}/releve
  async getReleveCompte(locataireId: number, fromDate?: string, toDate?: string): Promise<any> {
    const params: any = {};
    if (fromDate) params.from_date = fromDate;
    if (toDate) params.to_date = toDate;
    console.log(`📡 Relevé compte locataire ${locataireId}`);
    const response = await api.get(`/paiements/locataire/${locataireId}/releve`, { params });
    return response.data;
  },

  // ✅ GET /api/v1/paiements/bail/{bail_id}/solde
  async getSoldeBail(bailId: number): Promise<any> {
    console.log(`📡 Solde bail ${bailId}`);
    const response = await api.get(`/paiements/bail/${bailId}/solde`);
    return response.data;
  },

  // ==================== OPÉRATIONS DE MASSE ====================
  
  // ✅ POST /api/v1/paiements/mise-a-jour/masse
  async miseAJourMasse(paiementsIds: number[], action: string, valeur: any): Promise<any> {
    console.log(`📡 Mise à jour masse de ${paiementsIds.length} paiements`);
    const response = await api.post('/paiements/mise-a-jour/masse', {
      paiements_ids: paiementsIds,
      action,
      valeur
    });
    return response.data;
  },

  // ==================== EXPORTS ====================
  
  // ✅ GET /api/v1/paiements/export/complet
  async exportComplet(format: string = 'excel', dateDebut?: string, dateFin?: string): Promise<Blob> {
    const params: any = { format };
    if (dateDebut) params.date_debut = dateDebut;
    if (dateFin) params.date_fin = dateFin;
    console.log(`📡 Export complet en ${format}`);
    const response = await api.get('/paiements/export/complet', { params, responseType: 'blob' });
    return response.data;
  }
};