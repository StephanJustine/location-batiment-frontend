// src/app/paiements/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import {
  Box, Button, Card, CardContent, Typography,
  Toolbar, Container, Chip, Fade, CircularProgress,
  Paper, Alert, Grid, IconButton,
  Tooltip, LinearProgress, Tabs, Tab, Badge,
  TablePagination, Stack, Skeleton
} from '@mui/material';
import { 
  Add, Refresh, AttachMoney, TrendingDown,
  CheckCircle, Schedule, Warning, Receipt, 
  ReceiptLong, Assessment, NotificationsActive,
  ChevronLeft, ChevronRight, People, Payment,
  TrendingUp, ArrowBack
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { paiementGroupService } from '@/services/paiementGroupService';
import { PaiementMensuel, PaiementGlobalStats } from '@/types/paiementGroup';
import PaiementForm from '@/components/paiements/PaiementForm';
import { formatCurrency } from '@/utils/formatters';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel({ children, index, value }: TabPanelProps) {
  return <Box sx={{ display: value === index ? 'block' : 'none', mt: 2 }}>{children}</Box>;
}

export default function PaiementsPage() {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [tab, setTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [annee, setAnnee] = useState(new Date().getFullYear());
  const [paiementsGroup, setPaiementsGroup] = useState<PaiementMensuel[]>([]);
  const [globalStats, setGlobalStats] = useState<PaiementGlobalStats | null>(null);
  const [impayes, setImpayes] = useState<PaiementMensuel[]>([]);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(12);

  useEffect(() => {
    fetchData();
    fetchImpayes();
  }, [annee]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [grouped, stats] = await Promise.all([
        paiementGroupService.getGroupedByMonth(annee),
        paiementGroupService.getGlobalStats()
      ]);
      setPaiementsGroup(Array.isArray(grouped) ? grouped : []);
      setGlobalStats(stats);
    } catch (err) {
      setError('Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  const fetchImpayes = async () => {
    try {
      const data = await paiementGroupService.getImpayes();
      setImpayes(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Erreur:', err);
    }
  };

  const getMonthStatus = (estComplet: boolean, montantPaye: number) => {
    if (estComplet) return { label: 'Payé', color: '#4caf50', bg: '#e8f5e9' };
    if (montantPaye > 0) return { label: 'Partiel', color: '#ff9800', bg: '#fff3e0' };
    return { label: 'Impayé', color: '#f44336', bg: '#ffebee' };
  };

  const statCards = globalStats ? [
    { value: globalStats.total_du, icon: <AttachMoney />, color: '#1976d2', suffix: 'Ar' },
    { value: globalStats.total_paye, icon: <CheckCircle />, color: '#388e3c', suffix: 'Ar' },
    { value: globalStats.total_restant, icon: <Warning />, color: '#d32f2f', suffix: 'Ar' },
    { value: `${globalStats.taux_paiement}%`, icon: <TrendingUp />, color: '#7b1fa2' }
  ] : [];

  const paginatedMonths = paiementsGroup.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  const totalImpayesMontant = impayes.reduce((sum, i) => sum + i.montant_restant, 0);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', bgcolor: '#f5f5f5', minHeight: '100vh' }}>
        <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
        <Box component="main" sx={{ flexGrow: 1 }}>
          <Header onMenuClick={() => setMobileOpen(!mobileOpen)} />
          <Container maxWidth="xl" sx={{ px: 3, py: 3 }}>
            <Skeleton variant="rectangular" height={80} sx={{ mb: 3, borderRadius: 2 }} />
            <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 2 }} />
          </Container>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', bgcolor: '#f5f5f5', minHeight: '100vh' }}>
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Header onMenuClick={() => setMobileOpen(!mobileOpen)} />
        <Toolbar />
        <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3 }, py: 2.5 }}>

          {/* Retour */}
          {/* <Button 
            variant="contained" 
            startIcon={<ArrowBack />} 
            onClick={() => router.push('/dashboard')}
            size="small"
            sx={{ mb: 2, borderRadius: 2, textTransform: 'none', bgcolor: '#4caf50', '&:hover': { bgcolor: '#388e3c' } }}
          >
            Retour
          </Button> */}

          {/* En-tête */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5, flexWrap: 'wrap', gap: 1.5 }}>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>Paiements</Typography>
              <Typography variant="caption" color="text.secondary">Suivi des loyers</Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button variant="outlined" size="small" startIcon={<Refresh />} onClick={() => { fetchData(); fetchImpayes(); }} sx={{ borderRadius: 2, textTransform: 'none' }}>
                Rafraîchir
              </Button>
              {!showForm && (
                <Button variant="contained" size="small" startIcon={<Add />} onClick={() => setShowForm(true)} sx={{ borderRadius: 2, textTransform: 'none', bgcolor: '#4caf50', '&:hover': { bgcolor: '#388e3c' } }}>
                  Paiement
                </Button>
              )}
            </Box>
          </Box>

          {/* Stats mini cartes */}
          {globalStats && (
            <Box sx={{ display: 'flex', gap: 1.5, mb: 2.5, flexWrap: 'wrap' }}>
              {statCards.map((s, i) => (
                <Card key={i} sx={{ flex: 1, minWidth: 100, borderRadius: 2, border: '1px solid #e0e0e0', boxShadow: 'none' }}>
                  <CardContent sx={{ p: 1.5, textAlign: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, mb: 0.5 }}>
                      {s.icon}
                      <Typography variant="caption" sx={{ fontWeight: 500, color: s.color }}>{s.key || ''}</Typography>
                    </Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                      {typeof s.value === 'number' ? s.value.toLocaleString() : s.value}
                      {s.suffix && <Typography component="span" variant="caption" sx={{ ml: 0.3 }}>{s.suffix}</Typography>}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Box>
          )}

          {/* Formulaire */}
          {showForm && (
            <Fade in={showForm}>
              <Box sx={{ mb: 2.5 }}>
                <PaiementForm onSubmit={async () => { await fetchData(); await fetchImpayes(); setShowForm(false); }} onCancel={() => setShowForm(false)} loading={loading} />
              </Box>
            </Fade>
          )}

          {/* Messages */}
          {success && <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }} onClose={() => setSuccess('')}>{success}</Alert>}
          {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }} onClose={() => setError('')}>{error}</Alert>}

          {/* Tabs */}
          <Paper sx={{ borderRadius: 2, overflow: 'hidden', boxShadow: 'none', border: '1px solid #e0e0e0' }}>
            <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ borderBottom: 1, borderColor: '#e0e0e0', bgcolor: '#fff', minHeight: 44 }}>
              <Tab icon={<ReceiptLong sx={{ fontSize: 18 }} />} iconPosition="start" label="Mois" sx={{ textTransform: 'none', fontWeight: 500, minHeight: 44, fontSize: '0.8rem' }} />
              <Tab icon={<Warning sx={{ fontSize: 18 }} />} iconPosition="start" label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  Impayés
                  {impayes.length > 0 && <Badge badgeContent={impayes.length} color="error" sx={{ '& .MuiBadge-badge': { fontSize: '0.6rem', height: 16, minWidth: 16 } }} />}
                </Box>
              } sx={{ textTransform: 'none', fontWeight: 500, minHeight: 44, fontSize: '0.8rem' }} />
              <Tab icon={<Assessment sx={{ fontSize: 18 }} />} iconPosition="start" label="Stats" sx={{ textTransform: 'none', fontWeight: 500, minHeight: 44, fontSize: '0.8rem' }} />
            </Tabs>

            <Box sx={{ p: 2.5, bgcolor: '#fff' }}>
              {/* Tab 0: Mois */}
              <TabPanel value={tab} index={0}>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1, mb: 2.5 }}>
                  <IconButton onClick={() => setAnnee(annee - 1)} size="small" sx={{ bgcolor: '#f5f5f5', borderRadius: 1 }}><ChevronLeft fontSize="small" /></IconButton>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>{annee}</Typography>
                  <IconButton onClick={() => setAnnee(annee + 1)} size="small" sx={{ bgcolor: '#f5f5f5', borderRadius: 1 }}><ChevronRight fontSize="small" /></IconButton>
                </Box>

                {paiementsGroup.length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Receipt sx={{ fontSize: 40, color: '#ccc' }} />
                    <Typography variant="body2" color="text.secondary">Aucune donnée</Typography>
                  </Box>
                ) : (
                  <>
                    <Grid container spacing={1.5}>
                      {paginatedMonths.map((month) => {
                        const status = getMonthStatus(month.est_complet, month.montant_paye);
                        const pourcentage = month.montant_du > 0 ? (month.montant_paye / month.montant_du) * 100 : 0;
                        return (
                          <Grid size={{ xs: 6, sm: 4, md: 3, lg: 2 }} key={month.mois}>
                            <Card sx={{ 
                              borderRadius: 1.5, 
                              border: '1px solid #e0e0e0', 
                              boxShadow: 'none', 
                              cursor: 'pointer', 
                              transition: '0.2s', 
                              '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }
                            }} onClick={() => router.push(`/paiements/mois/${month.annee}/${month.mois}`)}>
                              <CardContent sx={{ p: 1.5, textAlign: 'center' }}>
                                <Typography variant="body2" sx={{ fontWeight: 600 }}>{month.mois_nom.substring(0, 3)}</Typography>
                                <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: '0.85rem' }}>{formatCurrency(month.montant_paye)}</Typography>
                                <Typography variant="caption" sx={{ color: '#999', fontSize: '0.6rem' }}>/ {formatCurrency(month.montant_du)}</Typography>
                                <LinearProgress variant="determinate" value={pourcentage} sx={{ height: 2, borderRadius: 2, my: 1, bgcolor: '#e0e0e0' }} />
                                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5, mt: 0.5 }}>
                                  <Tooltip title="Locataires"><Chip icon={<People sx={{ fontSize: 10 }} />} label={month.nombre_locataires} size="small" variant="outlined" sx={{ height: 18, fontSize: '0.55rem' }} /></Tooltip>
                                  <Tooltip title="Paiements"><Chip icon={<Payment sx={{ fontSize: 10 }} />} label={month.nombre_paiements} size="small" variant="outlined" sx={{ height: 18, fontSize: '0.55rem' }} /></Tooltip>
                                </Box>
                                <Chip label={status.label} size="small" sx={{ mt: 1, height: 18, fontSize: '0.55rem', bgcolor: status.bg, color: status.color }} />
                              </CardContent>
                            </Card>
                          </Grid>
                        );
                      })}
                    </Grid>
                    {paiementsGroup.length > rowsPerPage && (
                      <TablePagination rowsPerPageOptions={[12, 24, 36]} component="div" count={paiementsGroup.length} rowsPerPage={rowsPerPage} page={page} onPageChange={(_, p) => setPage(p)} onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }} sx={{ mt: 2, border: 'none' }} />
                    )}
                  </>
                )}
              </TabPanel>

              {/* Tab 1: Impayés */}
              <TabPanel value={tab} index={1}>
                {impayes.length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <CheckCircle sx={{ fontSize: 40, color: '#4caf50' }} />
                    <Typography variant="body2" sx={{ mt: 1, color: '#4caf50' }}>Aucun impayé</Typography>
                  </Box>
                ) : (
                  <>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, p: 1.5, bgcolor: '#ffebee', borderRadius: 2 }}>
                      <Typography variant="caption" sx={{ fontWeight: 600, color: '#d32f2f' }}>Total impayés</Typography>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#d32f2f' }}>{formatCurrency(totalImpayesMontant)}</Typography>
                    </Box>
                    <Grid container spacing={1.5}>
                      {impayes.map((impaye) => (
                        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={`${impaye.mois}-${impaye.annee}`}>
                          <Card sx={{ borderRadius: 1.5, border: '1px solid #ffcdd2', cursor: 'pointer', transition: '0.2s', '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' } }} onClick={() => router.push(`/paiements/mois/${impaye.annee}/${impaye.mois}`)}>
                            <CardContent sx={{ p: 1.5 }}>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                                <Typography variant="body2" sx={{ fontWeight: 600 }}>{impaye.mois_nom} {impaye.annee}</Typography>
                                <Chip label="Impayé" size="small" color="error" sx={{ height: 18, fontSize: '0.55rem' }} />
                              </Box>
                              <Typography variant="caption" color="text.secondary">Payé: {formatCurrency(impaye.montant_paye)}</Typography>
                              <Typography variant="caption" color="error" sx={{ display: 'block', fontWeight: 500 }}>Reste: {formatCurrency(impaye.montant_restant)}</Typography>
                              <LinearProgress variant="determinate" value={(impaye.montant_paye / impaye.montant_du) * 100} sx={{ height: 2, borderRadius: 2, mt: 1 }} />
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  </>
                )}
              </TabPanel>

              {/* Tab 2: Stats */}
              <TabPanel value={tab} index={2}>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12 }}>
                    <Card sx={{ borderRadius: 2, border: '1px solid #e0e0e0', boxShadow: 'none' }}>
                      <CardContent sx={{ p: 2 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5 }}>Récapitulatif</Typography>
                        <Stack spacing={1}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="caption" color="text.secondary">Total payé</Typography>
                            <Typography variant="caption" sx={{ fontWeight: 600, color: '#388e3c' }}>{globalStats?.total_paye?.toLocaleString()} Ar</Typography>
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="caption" color="text.secondary">Mois complets</Typography>
                            <Typography variant="caption" sx={{ fontWeight: 600 }}>{globalStats?.mois_complets || 0}/12</Typography>
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="caption" color="text.secondary">Taux recouvrement</Typography>
                            <Typography variant="caption" sx={{ fontWeight: 600, color: '#1976d2' }}>{globalStats?.taux_paiement || 0}%</Typography>
                          </Box>
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </TabPanel>
            </Box>
          </Paper>
        </Container>
      </Box>
    </Box>
  );
}