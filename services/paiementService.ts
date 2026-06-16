
// src/services/paiementService.ts
import api from '@/lib/api';
import { 
  Paiement, PaiementDetail, Quittance, 
  StatistiquesPaiements, TableauBordFinancier, 
  PaiementCreate 
} from '@/types/paiement';

export const paiementService = {
  // ==================== RÉFÉRENCES ====================
  
  // 🔥 Générer une référence automatique
  async generateReference(bailId: number): Promise<string> {
    try {
      const response = await api.post(`/paiements/baux/${bailId}/paiements/generate-reference`);
      return response.data.reference;
    } catch (error) {
      // Fallback local si l'API échoue
      const date = new Date();
      const ref = `PAY-${bailId}-${date.getFullYear()}${(date.getMonth()+1).toString().padStart(2,'0')}${date.getDate().toString().padStart(2,'0')}-${Date.now().toString().slice(-6)}`;
      return ref;
    }
  },

  // ==================== CRUD PAIEMENTS ====================

  // Enregistrer un paiement
  async create(data: PaiementCreate): Promise<Paiement> {
    const response = await api.post('/paiements/', data);
    return response.data;
  },

  // 🔥 Créer avec génération automatique de référence
  async createWithAutoReference(bailId: number, data: Partial<PaiementCreate>): Promise<Paiement> {
    const reference = await this.generateReference(bailId);
    const payload = {
      ...data,
      bail_id: bailId,
      reference_paiement: reference,
      numero_quittance: reference
    };
    const response = await api.post('/paiements/', payload);
    return response.data;
  },

  // Liste des paiements
  async getAll(params?: { skip?: number; limit?: number; bail_id?: number; statut?: string }): Promise<Paiement[]> {
    const safeParams = { ...params };
    if (safeParams.limit && safeParams.limit > 200) {
      safeParams.limit = 200;
    }
    const response = await api.get('/paiements/', { params: safeParams });
    return response.data;
  },

  // Détail d'un paiement
  async getById(id: number): Promise<PaiementDetail> {
    const response = await api.get(`/paiements/${id}`);
    return response.data;
  },

  // Paiements par bail
  async getByBail(bailId: number): Promise<Paiement[]> {
    const response = await api.get(`/paiements/bail/${bailId}`);
    return response.data;
  },

  // Mettre à jour un paiement
  async update(id: number, data: Partial<PaiementCreate>): Promise<Paiement> {
    const response = await api.put(`/paiements/${id}`, data);
    return response.data;
  },

  // Supprimer un paiement
  async delete(id: number): Promise<void> {
    await api.delete(`/paiements/${id}`);
  },

  // ==================== STATUTS ET IMPAYÉS ====================

  // Paiements impayés
  async getImpayes(bailId?: number): Promise<Paiement[]> {
    const params = bailId ? { bail_id: bailId } : {};
    const response = await api.get('/paiements/impayes', { params });
    return response.data;
  },

  // Marquer comme payé
  async markAsPaid(id: number, data?: { date_paiement?: string; reference_paiement?: string }): Promise<Paiement> {
    const response = await api.post(`/paiements/${id}/pay`, data);
    return response.data;
  },

  // Annuler un paiement
  async cancel(id: number, motif?: string): Promise<Paiement> {
    const response = await api.post(`/paiements/${id}/cancel`, { motif });
    return response.data;
  },

  // ==================== STATISTIQUES ====================

  // Statistiques générales
  async getStatistiques(): Promise<StatistiquesPaiements> {
    const response = await api.get('/paiements/statistiques');
    return response.data;
  },

  // Statistiques mensuelles
  async getStatistiquesMensuelles(annee: number): Promise<any> {
    const response = await api.get('/paiements/statistiques/mensuelles', { params: { annee } });
    return response.data;
  },

  // Statistiques par mode de paiement
  async getStatistiquesParMode(): Promise<any> {
    const response = await api.get('/paiements/statistiques/par-mode');
    return response.data;
  },

  // Prévisions
  async getPrevisions(mois: number = 3): Promise<any> {
    const response = await api.get('/paiements/previsions', { params: { mois } });
    return response.data;
  },

  // ==================== TABLEAUX DE BORD ====================

  // Tableau de bord financier
  async getTableauBord(): Promise<TableauBordFinancier> {
    const response = await api.get('/paiements/dashboard');
    return response.data;
  },

  // Dashboard exécutif
  async getDashboardExecutif(): Promise<any> {
    const response = await api.get('/paiements/dashboard-executif');
    return response.data;
  },

  // ==================== QUITTANCES ====================

  // Obtenir la quittance (JSON)
  async getQuittance(paiementId: number): Promise<Quittance> {
    const response = await api.get(`/paiements/${paiementId}/quittance`);
    return response.data;
  },

  // Télécharger la quittance PDF
  async getQuittancePDF(paiementId: number): Promise<Blob> {
    const response = await api.get(`/paiements/${paiementId}/quittance/pdf`, {
      responseType: 'blob'
    });
    return response.data;
  },

  // Envoyer quittance par email
  async envoyerQuittanceEmail(paiementId: number, email?: string): Promise<any> {
    const response = await api.post(`/paiements/${paiementId}/quittance/email`, null, { params: { email } });
    return response.data;
  },

  // Envoyer quittance par SMS
  async envoyerQuittanceSMS(paiementId: number, telephone?: string): Promise<any> {
    const response = await api.post(`/paiements/${paiementId}/quittance/sms`, null, { params: { telephone } });
    return response.data;
  },

  // ==================== CAUTIONS ====================

  // Encaisser caution
  async encaisserCaution(bailId: number, montant: number): Promise<Paiement> {
    const response = await api.post('/paiements/caution/encaisser', null, {
      params: { bail_id: bailId, montant }
    });
    return response.data;
  },

  // Restituer caution
  async restituerCaution(bailId: number, montant: number, retenues: number = 0, motif: string = ''): Promise<Paiement> {
    const response = await api.post('/paiements/caution/restituer', null, {
      params: { bail_id: bailId, montant, retenues, motif }
    });
    return response.data;
  },

  // ==================== RELANCES ====================

  // Générer relances automatiques
  async genererRelances(): Promise<any> {
    const response = await api.post('/paiements/relances/generer');
    return response.data;
  },

  // Générer et envoyer relances
  async genererEtEnvoyerRelances(): Promise<any> {
    const response = await api.post('/paiements/relances/generer-et-envoyer');
    return response.data;
  },

  // ==================== RELEVÉS ET SOLDES ====================

  // Relevé de compte par locataire
  async getReleveCompte(locataireId: number, fromDate?: string, toDate?: string): Promise<any> {
    const params: any = {};
    if (fromDate) params.from_date = fromDate;
    if (toDate) params.to_date = toDate;
    const response = await api.get(`/paiements/locataire/${locataireId}/releve`, { params });
    return response.data;
  },

  // Solde d'un bail
  async getSoldeBail(bailId: number): Promise<any> {
    const response = await api.get(`/paiements/bail/${bailId}/solde`);
    return response.data;
  },

  // ==================== EXPORTS ====================

  // Export complet
  async exportComplet(format: string = 'excel', dateDebut?: string, dateFin?: string): Promise<Blob> {
    const params: any = { format };
    if (dateDebut) params.date_debut = dateDebut;
    if (dateFin) params.date_fin = dateFin;
    const response = await api.get('/paiements/export/complet', { params, responseType: 'blob' });
    return response.data;
  },

  // Export des impayés
  async exportImpayes(format: string = 'excel'): Promise<Blob> {
    const response = await api.get('/paiements/export/impayes', { params: { format }, responseType: 'blob' });
    return response.data;
  },

  // ==================== OPÉRATIONS DE MASSE ====================

  // Mise à jour en masse
  async miseAJourMasse(paiementsIds: number[], action: string, valeur: any): Promise<any> {
    const response = await api.post('/paiements/mise-a-jour/masse', { 
      paiements_ids: paiementsIds, 
      action, 
      valeur 
    });
    return response.data;
  },

  // Suppression en masse
  async suppressionMasse(paiementsIds: number[]): Promise<any> {
    const response = await api.post('/paiements/suppression/masse', { paiements_ids: paiementsIds });
    return response.data;
  },

  // ==================== GRAPHIQUES ====================

  // Données pour graphique d'évolution
  async getEvolutionData(annee?: number): Promise<any> {
    const params = annee ? { annee } : {};
    const response = await api.get('/paiements/evolution', { params });
    return response.data;
  },

  // Répartition par type
  async getRepartitionParType(): Promise<any> {
    const response = await api.get('/paiements/repartition/type');
    return response.data;
  },

  // ==================== VALIDATION ====================

  // Valider un paiement
  async validate(id: number): Promise<Paiement> {
    const response = await api.post(`/paiements/${id}/validate`);
    return response.data;
  },

  // Rejeter un paiement
  async reject(id: number, motif: string): Promise<Paiement> {
    const response = await api.post(`/paiements/${id}/reject`, { motif });
    return response.data;
  },





    // ==================== GROUPEMENT PAR LOCATAIRE ====================
  
  // 🔥 NOUVEAU: Paiements groupés par locataire
  async getGroupedByLocataire(annee?: number): Promise<PaiementParLocataire[]> {
    const params = annee ? { annee } : {};
    console.log(`📡 Paiements groupés par locataire`, params);
    const response = await api.get('/paiements/grouped-by-locataire', { params });
    return response.data;
  },

  // 🔥 NOUVEAU: Détail des paiements d'un locataire
  async getByLocataire(locataireId: number, annee?: number): Promise<PaiementParLocataire> {
    const params = annee ? { annee } : {};
    const response = await api.get(`/paiements/locataire/${locataireId}/grouped`, { params });
    return response.data;
  },

  // ==================== SESSIONS DE PAIEMENT ====================
  
  // 🔥 Sessions de paiement par bail
  async getSessionsByBail(bailId: number, annee?: number, mois?: number, statut?: string): Promise<any[]> {
    const params: any = {};
    if (annee) params.annee = annee;
    if (mois) params.mois = mois;
    if (statut) params.statut = statut;
    const response = await api.get(`/paiements/sessions/bail/${bailId}`, { params });
    return response.data;
  },

  // 🔥 Payer une session
  async paySession(sessionId: number, data: { mode_paiement: string; reference_paiement?: string; montant?: number }): Promise<any> {
    const response = await api.post(`/paiements/sessions/${sessionId}/pay`, data);
    return response.data;
  },

  // 🔥 Générer quittance pour session
  async generateQuittanceForSession(sessionId: number): Promise<Blob> {
    const response = await api.post(`/paiements/sessions/${sessionId}/quittance`, {
      responseType: 'blob'
    });
    return response.data;
  },

  // ==================== RELEVÉS JIRAMA ====================
  
  // 🔥 Relevés JIRAMA par logement
  async getRelevesByLogement(logementId: number, annee?: number, mois?: number): Promise<any[]> {
    const params: any = {};
    if (annee) params.annee = annee;
    if (mois) params.mois = mois;
    const response = await api.get(`/releves/logement/${logementId}`, { params });
    return response.data;
  },

  // 🔥 Créer un relevé JIRAMA
  async createReleve(data: {
    logement_id: number;
    type_releve: 'eau' | 'electricite';
    index_ancien: number;
    index_nouveau: number;
    mois: number;
    annee: number;
    photo_url?: string;
  }): Promise<any> {
    const response = await api.post('/releves/', data);
    return response.data;
  },

  // 🔥 Calculer consommation
  async calculerConsommation(releveId: number): Promise<any> {
    const response = await api.post(`/releves/${releveId}/calculer`);
    return response.data;
  },

  // 🔥 Calculer charges communes
  async calculerChargesCommunes(batimentId: number, mois: number, annee: number): Promise<any> {
    const response = await api.post('/releves/charges-communes/calculer', null, {
      params: { batiment_id: batimentId, mois, annee }
    });
    return response.data;
  },

  // ==================== NOTIFICATIONS ====================
  
  // 🔥 Envoyer relance impayé
  async envoyerRelanceImpaye(paiementId: number, joursRetard: number): Promise<any> {
    const response = await api.post(`/notifications/relances/impaye/${paiementId}`, null, {
      params: { jours_retard: joursRetard }
    });
    return response.data;
  },

  // src/services/paiementService.ts - Ajouter cette méthode

  async getRelevesJIRAMA(annee?: number): Promise<any[]> {
    const params = annee ? { annee } : {};
    const response = await api.get('/releves', { params });
    return response.data;
  },
  
};

// Type pour PaiementParLocataire (à ajouter dans vos types)
export interface PaiementParLocataire {
  data: boolean;
  items: boolean;
  results: boolean;
  paiements: boolean;
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
  // Optionnel: détails mensuels
  paiements_mensuels?: Array<{
    mois: number;
    annee: number;
    mois_nom: string;
    montant_du: number;
    montant_paye: number;
    est_complet: boolean;
  }>;


};