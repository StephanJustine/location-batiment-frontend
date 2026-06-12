// src/app/paiements/mois/[annee]/[mois]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Box, Container, Typography, Paper, Grid, Card, CardContent,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Chip, Avatar, IconButton, Tooltip, Button, Breadcrumbs, Link,
  CircularProgress, Alert, Stack, TablePagination, Divider,
  LinearProgress
} from '@mui/material';
import {
  ArrowBack, Download, Email, WhatsApp, NotificationsActive,
  PictureAsPdf, Visibility, Receipt, CheckCircle, Warning, Schedule,
  People, Payment, Home, AttachMoney
} from '@mui/icons-material';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { paiementGroupService } from '@/services/paiementGroupService';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { PaiementMensuel } from '@/types/paiementGroup';

export default function MonthDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const annee = parseInt(params.annee as string);
  const mois = parseInt(params.mois as string);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [monthData, setMonthData] = useState<PaiementMensuel | null>(null);
  const [generatingQuittance, setGeneratingQuittance] = useState<number | null>(null);
  const [sendingRelance, setSendingRelance] = useState(false);
  const [success, setSuccess] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    fetchMonthDetails();
  }, [annee, mois]);

  const fetchMonthDetails = async () => {
    setLoading(true);
    try {
      const data = await paiementGroupService.getMonthDetails(mois, annee);
      setMonthData(data);
    } catch (err) {
      setError('Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      const blob = await paiementGroupService.exportMonth(mois, annee);
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
      setSuccess('Export lancé');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setErrorMsg('Erreur export');
    }
  };

  const handleSendRelance = async (type: 'email' | 'sms' | 'both') => {
    setSendingRelance(true);
    try {
      await paiementGroupService.sendRelance(mois, annee, type);
      setSuccess(`Relance ${type} envoyée`);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setErrorMsg('Erreur relance');
    } finally {
      setSendingRelance(false);
    }
  };

  const handleGenerateQuittance = async (paiementId: number) => {
    setGeneratingQuittance(paiementId);
    try {
      const blob = await paiementGroupService.generateQuittance(paiementId);
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
      setSuccess('Quittance générée');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setErrorMsg('Erreur quittance');
    } finally {
      setGeneratingQuittance(null);
    }
  };

  const getStatutInfo = (statut: string) => {
    switch (statut) {
      case 'paye': return { label: 'Payé', color: '#4caf50', bg: '#e8f5e9' };
      default: return { label: 'En attente', color: '#ff9800', bg: '#fff3e0' };
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', bgcolor: '#f5f5f5', minHeight: '100vh' }}>
        <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
        <Box component="main" sx={{ flexGrow: 1 }}>
          <Header onMenuClick={() => setMobileOpen(!mobileOpen)} />
          <Container maxWidth="xl" sx={{ py: 3 }}>
            <CircularProgress />
          </Container>
        </Box>
      </Box>
    );
  }

  if (error || !monthData) {
    return (
      <Box sx={{ display: 'flex', bgcolor: '#f5f5f5', minHeight: '100vh' }}>
        <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
        <Box component="main" sx={{ flexGrow: 1 }}>
          <Header onMenuClick={() => setMobileOpen(!mobileOpen)} />
          <Container sx={{ py: 3 }}>
            <Alert severity="error" sx={{ borderRadius: 2 }}>{error || 'Mois non trouvé'}</Alert>
          </Container>
        </Box>
      </Box>
    );
  }

  const paginatedPaiements = (monthData.paiements || []).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  // 🔥 Correction: éviter Infinity quand montant_du = 0
  const pourcentage = monthData.montant_du > 0 ? (monthData.montant_paye / monthData.montant_du) * 100 : 0;

  return (
    <Box sx={{ display: 'flex', bgcolor: '#f5f5f5', minHeight: '100vh' }}>
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <Box component="main" sx={{ flexGrow: 1, width: { sm: 'calc(100% - 260px)' }, minWidth: 0 }}>
        <Header onMenuClick={() => setMobileOpen(!mobileOpen)} />
        <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3 }, py: 3 }}>
          
          {/* Bouton retour vert */}
          {/* <Box sx={{ mb: 2 }}>
            <Button 
              variant="contained" 
              startIcon={<ArrowBack />} 
              onClick={() => router.push('/paiements')}
              sx={{ borderRadius: 2, textTransform: 'none', bgcolor: '#4caf50', '&:hover': { bgcolor: '#388e3c' } }}
            >
              Retour aux paiements
            </Button>
          </Box> */}

          {/* Breadcrumbs */}
          <Breadcrumbs sx={{ mb: 2 }}>
            <Link href="/" color="inherit" underline="hover">Dashboard</Link>
            <Link href="/paiements" color="inherit" underline="hover">Paiements</Link>
            <Typography color="text.primary" sx={{ fontWeight: 500 }}>{monthData.mois_nom} {monthData.annee}</Typography>
          </Breadcrumbs>

          {/* En-tête */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#1a1a1a' }}>{monthData.mois_nom} {monthData.annee}</Typography>
              <Typography variant="body2" color="text.secondary">Détail des paiements pour cette période</Typography>
            </Box>
            <Stack direction="row" spacing={1}>
            <Button 
              variant="contained" 
              startIcon={<ArrowBack />} 
              onClick={() => router.push('/paiements')}
              sx={{ borderRadius: 2, textTransform: 'none', bgcolor: '#4caf50', '&:hover': { bgcolor: '#388e3c' } }}
            >
              Retour aux paiements
            </Button>
              <Button variant="outlined" startIcon={<Download />} onClick={handleExport} sx={{ borderRadius: 2, textTransform: 'none' }}>Exporter</Button>
              <Button variant="outlined" startIcon={<Email />} onClick={() => handleSendRelance('email')} disabled={sendingRelance} sx={{ borderRadius: 2, textTransform: 'none' }}>Email</Button>
              <Button variant="outlined" startIcon={<WhatsApp />} onClick={() => handleSendRelance('sms')} disabled={sendingRelance} sx={{ borderRadius: 2, textTransform: 'none' }}>SMS</Button>
              <Button variant="contained" startIcon={<NotificationsActive />} onClick={() => handleSendRelance('both')} disabled={sendingRelance} sx={{ borderRadius: 2, textTransform: 'none', bgcolor: '#4caf50', '&:hover': { bgcolor: '#388e3c' } }}>
                Relancer tous
              </Button>
            </Stack>
          </Box>

          {/* Messages */}
          {success && <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }} onClose={() => setSuccess('')}>{success}</Alert>}
          {errorMsg && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }} onClose={() => setErrorMsg('')}>{errorMsg}</Alert>}

          {/* Statistiques */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid size={{ xs: 6, sm: 3 }}>
              <Card sx={{ borderRadius: 2, border: '1px solid #e0e0e0', boxShadow: 'none' }}>
                <CardContent sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="caption" color="text.secondary">Total dû</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>{formatCurrency(monthData.montant_du)}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 6, sm: 3 }}>
              <Card sx={{ borderRadius: 2, border: '1px solid #e0e0e0', boxShadow: 'none', bgcolor: '#e8f5e9' }}>
                <CardContent sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="caption" sx={{ color: '#2e7d32' }}>Total payé</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#2e7d32' }}>{formatCurrency(monthData.montant_paye)}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 6, sm: 3 }}>
              <Card sx={{ borderRadius: 2, border: '1px solid #e0e0e0', boxShadow: 'none', bgcolor: '#ffebee' }}>
                <CardContent sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="caption" sx={{ color: '#c62828' }}>Reste à payer</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#c62828' }}>{formatCurrency(monthData.montant_restant)}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 6, sm: 3 }}>
              <Card sx={{ borderRadius: 2, border: '1px solid #e0e0e0', boxShadow: 'none' }}>
                <CardContent sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="caption" color="text.secondary">Taux paiement</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>{Math.round(pourcentage)}%</Typography>
                  <LinearProgress variant="determinate" value={pourcentage} sx={{ height: 4, borderRadius: 2, mt: 1 }} />
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Résumé */}
          <Stack direction="row" spacing={1} sx={{ mb: 3, flexWrap: 'wrap', gap: 1 }}>
            <Chip icon={<People />} label={`${monthData.nombre_locataires} locataire(s)`} size="small" variant="outlined" />
            <Chip icon={<Payment />} label={`${monthData.nombre_paiements} paiement(s)`} size="small" variant="outlined" />
            <Chip icon={<Home />} label={`${monthData.paiements?.length || 0} logement(s)`} size="small" variant="outlined" />
            <Chip label={monthData.est_complet ? '✅ Mois complet' : '⚠️ Mois incomplet'} size="small" color={monthData.est_complet ? 'success' : 'warning'} />
          </Stack>

          {/* Liste des paiements */}
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>Liste des paiements</Typography>
          
          {paginatedPaiements.length > 0 ? (
            <>
              <TableContainer component={Paper} sx={{ borderRadius: 2, border: '1px solid #e0e0e0', boxShadow: 'none' }}>
                <Table size="small">
                  <TableHead sx={{ bgcolor: '#fafafa' }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600 }}>N° Quittance</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Locataire</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Logement</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Date paiement</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Montant</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Mode</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Statut</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 600 }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginatedPaiements.map((p) => {
                      const statutInfo = getStatutInfo(p.statut);
                      return (
                        <TableRow key={p.id} hover>
                          <TableCell>{p.numero_quittance || '-'}</TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Avatar sx={{ width: 28, height: 28, bgcolor: '#e0e0e0', fontSize: '0.7rem' }}>{p.locataire_prenom?.[0]}{p.locataire_nom?.[0]}</Avatar>
                              <Typography variant="body2">{p.locataire_prenom} {p.locataire_nom}</Typography>
                            </Box>
                          </TableCell>
                          <TableCell><Chip label={p.logement_numero || '-'} size="small" variant="outlined" sx={{ height: 22 }} /></TableCell>
                          <TableCell>{formatDate(p.date_paiement)}</TableCell>
                          <TableCell sx={{ fontWeight: 600, color: '#2e7d32' }}>{formatCurrency(p.montant)}</TableCell>
                          <TableCell>{p.mode_paiement || '-'}</TableCell>
                          <TableCell>
                            <Chip label={statutInfo.label} size="small" sx={{ height: 22, bgcolor: statutInfo.bg, color: statutInfo.color }} />
                          </TableCell>
                          <TableCell align="center">
                            <Tooltip title="Voir détail">
                              <IconButton size="small" onClick={() => router.push(`/paiements/${p.id}`)}>
                                <Visibility fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Télécharger quittance">
                              <IconButton size="small" onClick={() => handleGenerateQuittance(p.id)} disabled={generatingQuittance === p.id}>
                                {generatingQuittance === p.id ? <CircularProgress size={16} /> : <PictureAsPdf fontSize="small" sx={{ color: '#d32f2f' }} />}
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination 
                rowsPerPageOptions={[5, 10, 25]} 
                component="div" 
                count={monthData.paiements.length} 
                rowsPerPage={rowsPerPage} 
                page={page} 
                onPageChange={(_, p) => setPage(p)} 
                onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }} 
                sx={{ mt: 2, border: 'none' }} 
              />
            </>
          ) : (
            <Paper sx={{ textAlign: 'center', py: 6, borderRadius: 2, border: '1px solid #e0e0e0' }}>
              <Receipt sx={{ fontSize: 48, color: '#999' }} />
              <Typography variant="body1" sx={{ mt: 1, color: '#666' }}>Aucun paiement enregistré</Typography>
            </Paper>
          )}
        </Container>
      </Box>
    </Box>
  );
}