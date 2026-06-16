'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Box, Container, Typography, Paper, Grid, Card, CardContent,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Chip, Avatar, IconButton, Tooltip, Button,
  CircularProgress, Alert, Stack, Divider, LinearProgress,
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, MenuItem, Tabs, Tab, Snackbar
} from '@mui/material';
import {
  ArrowBack, PictureAsPdf, Visibility, Receipt, CheckCircle, Warning, Schedule,
  Payment, Home, AttachMoney, Autorenew, Close,
  History, TrendingUp, Person,
  ChevronLeft, ChevronRight, Refresh
} from '@mui/icons-material';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { paiementService } from '@/services/paiementService';
import { paiementSessionService } from '@/services/paiementSessionService';
import { locataireService } from '@/services/locataireService';
import { bailService } from '@/services/bailService';
import { formatCurrency } from '@/utils/formatters';

interface SessionParLocataire {
  id: number;
  mois: number;
  annee: number;
  montant_total: number;
  montant_paye: number;
  statut: string;
  date_echeance: string;
}

interface PaiementParLocataire {
  id: number;
  numero_quittance: string;
  montant: number;
  date_paiement: string;
  mode_paiement: string;
  statut: string;
  mois_concerne: number;
  annee_concernee: number;
}

export default function LocatairePaiementsPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [locataire, setLocataire] = useState<any>(null);
  const [paiements, setPaiements] = useState<PaiementParLocataire[]>([]);
  const [sessions, setSessions] = useState<SessionParLocataire[]>([]);
  const [annee, setAnnee] = useState(new Date().getFullYear());
  const [tabValue, setTabValue] = useState(0);
  const [openPayDialog, setOpenPayDialog] = useState(false);
  const [selectedSession, setSelectedSession] = useState<SessionParLocataire | null>(null);
  const [payData, setPayData] = useState({
    montant: 0,
    mode_paiement: 'virement',
    reference_paiement: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [autoReference, setAutoReference] = useState('');
  const [restant, setRestant] = useState(0);
  const [dejaPaye, setDejaPaye] = useState(0);
  const [selectedBailId, setSelectedBailId] = useState<number | null>(null);
  const [success, setSuccess] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    fetchData();
  }, [id, annee]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Récupérer les infos du locataire
      const locatairesData = await locataireService.getLocataires({});
      const locataireFound = Array.isArray(locatairesData) 
        ? locatairesData.find((l: any) => l.id === id)
        : null;
      setLocataire(locataireFound);
      
      // Récupérer les baux du locataire
      const allBaux = await bailService.getAll({ limit: 200 });
      const bauxLocataire = Array.isArray(allBaux) 
        ? allBaux.filter((b: any) => b.locataire_id === id)
        : [];
      
      const bailActif = bauxLocataire.find((b: any) => b.statut === 'actif');
      if (bailActif) {
        const bailIdValue = bailActif.id;
        setSelectedBailId(bailIdValue);
        
        // Récupérer les paiements
        const allPaiements = await paiementService.getAll({ limit: 500 });
        const paiementsLocataire = Array.isArray(allPaiements)
          ? allPaiements.filter((p: any) => p.locataire_id === id)
          : [];
        setPaiements(paiementsLocataire);
        
        // Récupérer les sessions
        const sessionsData = await paiementSessionService.getByBail(bailIdValue, { annee });
        const formattedSessions: SessionParLocataire[] = sessionsData.map((s: any) => ({
          id: s.id,
          mois: s.mois,
          annee: s.annee,
          montant_total: s.montant_total,
          montant_paye: s.montant_paye || 0,
          statut: s.statut,
          date_echeance: s.date_echeance
        }));
        setSessions(formattedSessions);
      }
    } catch (err) {
      console.error('Erreur chargement:', err);
      setError('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  const generateReference = async () => {
    if (!selectedBailId) return;
    try {
      const ref = await paiementSessionService.generateReference(selectedBailId);
      setAutoReference(ref);
      setPayData(prev => ({ ...prev, reference_paiement: ref }));
    } catch (err) {
      const fallbackRef = `PAY-${selectedBailId}-${Date.now()}`;
      setAutoReference(fallbackRef);
      setPayData(prev => ({ ...prev, reference_paiement: fallbackRef }));
    }
  };

  const handleOpenPayDialog = (session: SessionParLocataire) => {
    setSelectedSession(session);
    const paye = session.montant_paye || 0;
    const reste = session.montant_total - paye;
    setDejaPaye(paye);
    setRestant(reste);
    setPayData({ montant: reste, mode_paiement: 'virement', reference_paiement: '' });
    generateReference();
    setOpenPayDialog(true);
  };

  const handlePaySession = async () => {
    if (!selectedSession || !selectedBailId) return;
    
    if (payData.montant <= 0) {
      setErrorMsg('Le montant doit être supérieur à 0');
      return;
    }
    
    if (payData.montant > restant) {
      setErrorMsg(`Le montant ne peut pas dépasser le reste à payer (${formatCurrency(restant)})`);
      return;
    }
    
    setSubmitting(true);
    try {
      await paiementSessionService.paySession(selectedSession.id, {
        montant: payData.montant,
        mode_paiement: payData.mode_paiement,
        reference_paiement: payData.reference_paiement || autoReference
      });
      
      await fetchData();
      
      const nouveauTotalPaye = dejaPaye + payData.montant;
      const estComplet = nouveauTotalPaye >= selectedSession.montant_total;
      
      setSuccess(estComplet 
        ? `✅ Paiement complet de ${formatCurrency(payData.montant)} enregistré`
        : `💰 Paiement partiel de ${formatCurrency(payData.montant)} enregistré`);
      
      setOpenPayDialog(false);
      setTimeout(() => setSuccess(''), 5000);
    } catch (err: any) {
      setErrorMsg(err?.response?.data?.detail || 'Erreur lors du paiement');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatutColor = (statut: string) => {
    switch (statut) {
      case 'paye': return '#22c55e';
      case 'en_retard': return '#ef4444';
      case 'partiel': return '#f59e0b';
      default: return '#94a3b8';
    }
  };

  const getStatutLabel = (statut: string) => {
    switch (statut) {
      case 'paye': return 'Payé';
      case 'en_retard': return 'En retard';
      case 'partiel': return 'Partiel';
      default: return 'En attente';
    }
  };

  const totalPaye = paiements.reduce((sum, p) => sum + (p.montant || 0), 0);
  const sessionsPayees = sessions.filter(s => s.statut === 'paye').length;
  const moisNoms = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

  if (loading) {
    return (
      <Box sx={{ display: 'flex', bgcolor: '#f8fafc', minHeight: '100vh' }}>
        <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
        <Box component="main" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          <Header onMenuClick={() => setMobileOpen(!mobileOpen)} />
          <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 64px)' }}>
            <CircularProgress size={40} />
          </Box>
        </Box>
      </Box>
    );
  }

  if (error || !locataire) {
    return (
      <Box sx={{ display: 'flex', bgcolor: '#f8fafc', minHeight: '100vh' }}>
        <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
        <Box component="main" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          <Header onMenuClick={() => setMobileOpen(!mobileOpen)} />
          <Container sx={{ py: 4, flexGrow: 1 }}>
            <Alert severity="error" sx={{ mb: 2 }}>{error || 'Locataire non trouvé'}</Alert>
            <Button startIcon={<ArrowBack />} onClick={() => router.push('/paiements')} variant="outlined">
              Retour aux paiements
            </Button>
          </Container>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', bgcolor: '#f8fafc', minHeight: '100vh' }}>
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <Box component="main" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Header onMenuClick={() => setMobileOpen(!mobileOpen)} />
        <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3 }, py: 3, flexGrow: 1 }}>
          
          {/* En-tête */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <IconButton onClick={() => router.push('/paiements')} sx={{ bgcolor: '#f1f5f9', borderRadius: 2 }}>
              <ArrowBack />
            </IconButton>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                Paiements de {locataire.nom} {locataire.prenom}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Historique des paiements et échéances
              </Typography>
            </Box>
          </Box>

          {/* Infos locataire */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Paper sx={{ p: 2, borderRadius: 2, border: '1px solid #e2e8f0' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ width: 56, height: 56, bgcolor: '#059669' }}>
                    <Person sx={{ fontSize: 28 }} />
                  </Avatar>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {locataire.nom} {locataire.prenom}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {locataire.telephone && `📞 ${locataire.telephone}`}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {locataire.email && `✉️ ${locataire.email}`}
                    </Typography>
                    {locataire.cin && (
                      <Typography variant="caption" color="text.secondary">
                        CIN: {locataire.cin}
                      </Typography>
                    )}
                  </Box>
                </Box>
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Paper sx={{ p: 2, borderRadius: 2, border: '1px solid #e2e8f0' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: '#059669' }}>Résumé</Typography>
                <Divider sx={{ mb: 1 }} />
                <Grid container spacing={1}>
                  <Grid size={{ xs: 6 }}>
                    <Typography variant="caption" color="text.secondary">Total payé</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#22c55e' }}>
                      {formatCurrency(totalPaye)}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <Typography variant="caption" color="text.secondary">Sessions payées</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      {sessionsPayees}/{sessions.length}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>

          {/* Tabs */}
          <Paper sx={{ borderRadius: 2, overflow: 'hidden', border: '1px solid #e2e8f0' }}>
            <Tabs 
              value={tabValue} 
              onChange={(_, v) => setTabValue(v)} 
              sx={{ 
                borderBottom: 1, 
                borderColor: '#e2e8f0', 
                bgcolor: '#fff',
                minHeight: 44,
                '& .MuiTab-root': { textTransform: 'none', fontWeight: 500, minHeight: 44 }
              }}
            >
              <Tab icon={<Schedule sx={{ fontSize: 18 }} />} iconPosition="start" label="Échéances" />
              <Tab icon={<History sx={{ fontSize: 18 }} />} iconPosition="start" label="Historique" />
            </Tabs>

            <Box sx={{ p: 2.5 }}>
              {/* Tab 0: Échéances */}
              <Box sx={{ display: tabValue === 0 ? 'block' : 'none' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#059669' }}>
                    Échéances {annee}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <IconButton size="small" onClick={() => setAnnee(annee - 1)} sx={{ bgcolor: '#f1f5f9', borderRadius: 1 }}>
                      <ChevronLeft fontSize="small" />
                    </IconButton>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>{annee}</Typography>
                    <IconButton size="small" onClick={() => setAnnee(annee + 1)} sx={{ bgcolor: '#f1f5f9', borderRadius: 1 }}>
                      <ChevronRight fontSize="small" />
                    </IconButton>
                    <IconButton size="small" onClick={fetchData} sx={{ bgcolor: '#f1f5f9', borderRadius: 1 }}>
                      <Refresh fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>

                {sessions.length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 6 }}>
                    <Receipt sx={{ fontSize: 48, color: '#cbd5e1' }} />
                    <Typography variant="body2" color="text.secondary">Aucune échéance trouvée</Typography>
                  </Box>
                ) : (
                  <Grid container spacing={1.5}>
                    {sessions.map((session) => {
                      const reste = session.montant_total - (session.montant_paye || 0);
                      const pourcentage = ((session.montant_paye || 0) / session.montant_total) * 100;
                      const statusColor = getStatutColor(session.statut);
                      const estPaye = session.statut === 'paye';
                      
                      return (
                        <Grid size={{ xs: 6, sm: 4, md: 3, lg: 2 }} key={session.id}>
                          <Card sx={{ 
                            borderRadius: 2, 
                            border: `1px solid ${statusColor}40`,
                            bgcolor: estPaye ? '#f0fdf4' : 'white',
                            transition: '0.2s',
                            '&:hover': { transform: 'translateY(-2px)', boxShadow: 1 }
                          }}>
                            <CardContent sx={{ p: 1.5, textAlign: 'center' }}>
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                {moisNoms[session.mois - 1].substring(0, 3)}
                              </Typography>
                              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                                {formatCurrency(session.montant_total)}
                              </Typography>
                              <LinearProgress variant="determinate" value={pourcentage} sx={{ height: 3, borderRadius: 2, my: 1 }} />
                              <Typography variant="caption" sx={{ color: '#ef4444', fontSize: '0.6rem' }}>
                                Reste: {formatCurrency(reste)}
                              </Typography>
                              <Chip 
                                label={getStatutLabel(session.statut)} 
                                size="small" 
                                sx={{ mt: 1, height: 20, fontSize: '0.6rem', bgcolor: `${statusColor}20`, color: statusColor }}
                              />
                              {!estPaye && reste > 0 && (
                                <Button
                                  size="small"
                                  variant="contained"
                                  startIcon={<AttachMoney sx={{ fontSize: 14 }} />}
                                  onClick={() => handleOpenPayDialog(session)}
                                  sx={{ mt: 1, fontSize: '0.6rem', py: 0.3, bgcolor: '#059669' }}
                                >
                                  Payer
                                </Button>
                              )}
                            </CardContent>
                          </Card>
                        </Grid>
                      );
                    })}
                  </Grid>
                )}
              </Box>

              {/* Tab 1: Historique */}
              <Box sx={{ display: tabValue === 1 ? 'block' : 'none' }}>
                {paiements.length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 6 }}>
                    <History sx={{ fontSize: 48, color: '#cbd5e1' }} />
                    <Typography variant="body2" color="text.secondary">Aucun paiement trouvé</Typography>
                  </Box>
                ) : (
                  <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 1.5, border: '1px solid #e2e8f0' }}>
                    <Table size="small">
                      <TableHead sx={{ bgcolor: '#f8fafc' }}>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 600 }}>N° Quittance</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Période</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Montant</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Mode</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Date paiement</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Statut</TableCell>
                          <TableCell align="center" sx={{ fontWeight: 600 }}>Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {paiements.map((paiement) => (
                          <TableRow key={paiement.id} hover>
                            <TableCell sx={{ fontFamily: 'monospace' }}>{paiement.numero_quittance || '-'}</TableCell>
                            <TableCell>
                              {paiement.mois_concerne && paiement.annee_concernee 
                                ? `${moisNoms[paiement.mois_concerne - 1]} ${paiement.annee_concernee}` 
                                : '-'}
                            </TableCell>
                            <TableCell sx={{ fontWeight: 600, color: '#059669' }}>{formatCurrency(paiement.montant)}</TableCell>
                            <TableCell>{paiement.mode_paiement || '-'}</TableCell>
                            <TableCell>{paiement.date_paiement ? new Date(paiement.date_paiement).toLocaleDateString() : '-'}</TableCell>
                            <TableCell>
                              <Chip 
                                label={paiement.statut === 'paye' ? 'Payé' : paiement.statut} 
                                size="small" 
                                sx={{ bgcolor: paiement.statut === 'paye' ? '#f0fdf4' : '#fef2f2', color: paiement.statut === 'paye' ? '#22c55e' : '#ef4444' }}
                              />
                            </TableCell>
                            <TableCell align="center">
                              <Tooltip title="Voir détails">
                                <IconButton size="small" onClick={() => router.push(`/paiements/${paiement.id}`)}>
                                  <Visibility fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </Box>
            </Box>
          </Paper>

          {/* Dialog paiement */}
          <Dialog open={openPayDialog} onClose={() => setOpenPayDialog(false)} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ pb: 1 }}>
              Paiement - {selectedSession && `${moisNoms[selectedSession.mois - 1]} ${selectedSession.annee}`}
              {selectedSession && (
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                  Montant total: {formatCurrency(selectedSession.montant_total)}
                </Typography>
              )}
              <IconButton sx={{ position: 'absolute', right: 8, top: 8 }} onClick={() => setOpenPayDialog(false)}>
                <Close />
              </IconButton>
            </DialogTitle>
            <DialogContent>
              <Box sx={{ mt: 1 }}>
                <Paper sx={{ p: 2, mb: 3, bgcolor: '#f8fafc', borderRadius: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">Montant total</Typography>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{formatCurrency(selectedSession?.montant_total || 0)}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="success.main">Déjà payé</Typography>
                    <Typography variant="subtitle1" color="success.main">{formatCurrency(dejaPaye)}</Typography>
                  </Box>
                  <Divider sx={{ my: 1 }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="error.main">Reste à payer</Typography>
                    <Typography variant="h6" color="error.main">{formatCurrency(restant)}</Typography>
                  </Box>
                </Paper>

                <TextField
                  fullWidth
                  label="Référence de paiement"
                  value={payData.reference_paiement}
                  onChange={(e) => setPayData({ ...payData, reference_paiement: e.target.value })}
                  placeholder="Référence auto-générée"
                  sx={{ mb: 2 }}
                  size="small"
                  slotProps={{
                    input: { startAdornment: <Autorenew sx={{ mr: 1, color: '#94a3b8' }} /> }
                  }}
                />
                
                <TextField
                  fullWidth
                  type="number"
                  label="Montant à payer"
                  value={payData.montant}
                  onChange={(e) => {
                    const v = parseFloat(e.target.value) || 0;
                    if (v <= restant) setPayData({ ...payData, montant: v });
                  }}
                  helperText={`Maximum: ${formatCurrency(restant)}`}
                  sx={{ mb: 2 }}
                  size="small"
                />
                
                <TextField
                  select
                  fullWidth
                  label="Mode de paiement"
                  value={payData.mode_paiement}
                  onChange={(e) => setPayData({ ...payData, mode_paiement: e.target.value })}
                  size="small"
                >
                  <MenuItem value="virement">🏦 Virement bancaire</MenuItem>
                  <MenuItem value="especes">💵 Espèces</MenuItem>
                  <MenuItem value="cheque">📝 Chèque</MenuItem>
                  <MenuItem value="mvola">📱 MVola</MenuItem>
                  <MenuItem value="orange_money">📱 Orange Money</MenuItem>
                  <MenuItem value="airtel_money">📱 Airtel Money</MenuItem>
                </TextField>

                {payData.montant > 0 && payData.montant < restant && (
                  <Alert severity="info" sx={{ mt: 2 }}>
                    💡 Paiement partiel. Reste après paiement: {formatCurrency(restant - payData.montant)}
                  </Alert>
                )}
                
                {payData.montant === restant && restant > 0 && (
                  <Alert severity="success" sx={{ mt: 2 }}>
                    ✅ Paiement complet du solde
                  </Alert>
                )}
              </Box>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
              <Button onClick={() => setOpenPayDialog(false)} variant="outlined">
                Annuler
              </Button>
              <Button 
                variant="contained" 
                onClick={handlePaySession} 
                disabled={submitting || payData.montant <= 0 || payData.montant > restant}
                sx={{ bgcolor: '#059669', '&:hover': { bgcolor: '#047857' } }}
              >
                {submitting ? 'Traitement...' : `Payer ${formatCurrency(payData.montant)}`}
              </Button>
            </DialogActions>
          </Dialog>
        </Container>
      </Box>
      
      {/* Snackbar */}
      <Snackbar open={!!success} autoHideDuration={5000} onClose={() => setSuccess('')} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity="success">{success}</Alert>
      </Snackbar>
      <Snackbar open={!!errorMsg} autoHideDuration={4000} onClose={() => setErrorMsg('')} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity="error">{errorMsg}</Alert>
      </Snackbar>
    </Box>
  );
}