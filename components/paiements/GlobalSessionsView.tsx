'use client';

import { useState, useEffect } from 'react';
import {
  Box, Card, CardContent, Typography, Chip, Button,
  CircularProgress, Alert, IconButton, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, MenuItem, Snackbar,
  Grid, LinearProgress, Tooltip, Stack, Divider, Paper,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Avatar, Tab, Tabs, Badge
} from '@mui/material';
import {
  CheckCircle, Warning, Schedule, Receipt, AttachMoney,
  ChevronLeft, ChevronRight, Refresh, PictureAsPdf, Close,
  TrendingUp, People, Payment, Apartment, TrendingDown,
  ExpandMore, ExpandLess, Visibility
} from '@mui/icons-material';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { paiementSessionService, SessionMensuelle, SessionsGlobalStats } from '@/services/paiementSessionService';
import { PaiementSession } from '@/types/paiementSession';
import { useRouter } from 'next/navigation';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel({ children, index, value }: TabPanelProps) {
  return <Box sx={{ display: value === index ? 'block' : 'none', pt: 2 }}>{children}</Box>;
}

export default function GlobalSessionsView() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sessionsByMonth, setSessionsByMonth] = useState<SessionMensuelle[]>([]);
  const [globalStats, setGlobalStats] = useState<SessionsGlobalStats | null>(null);
  const [annee, setAnnee] = useState(new Date().getFullYear());
  const [tabValue, setTabValue] = useState(0);
  const [expandedMonth, setExpandedMonth] = useState<number | null>(null);
  const [success, setSuccess] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    fetchData();
  }, [annee]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [grouped, stats] = await Promise.all([
        paiementSessionService.getSessionsGroupedByMonth(annee),
        paiementSessionService.getGlobalStats(annee)
      ]);
      setSessionsByMonth(grouped);
      setGlobalStats(stats);
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  const toggleExpandMonth = (mois: number) => {
    setExpandedMonth(expandedMonth === mois ? null : mois);
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

  const getMonthStatus = (estComplet: boolean, montantPaye: number, montantDu: number) => {
    if (estComplet) return { label: 'Complet', color: '#22c55e', bg: '#f0fdf4' };
    if (montantPaye > 0) return { label: 'Partiel', color: '#f59e0b', bg: '#fffbeb' };
    return { label: 'Impayé', color: '#ef4444', bg: '#fef2f2' };
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
        <CircularProgress size={40} />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" action={
        <Button color="inherit" size="small" onClick={fetchData}>Réessayer</Button>
      }>
        {error}
      </Alert>
    );
  }

  const totalMontantDu = sessionsByMonth.reduce((sum, m) => sum + m.montant_du, 0);
  const totalMontantPaye = sessionsByMonth.reduce((sum, m) => sum + m.montant_paye, 0);
  const totalTaux = totalMontantDu > 0 ? Math.round((totalMontantPaye / totalMontantDu) * 100) : 0;

  return (
    <Box>
      {/* Navigation année */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton onClick={() => setAnnee(annee - 1)} size="small" sx={{ bgcolor: '#f1f5f9', borderRadius: 1 }}>
            <ChevronLeft />
          </IconButton>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>{annee}</Typography>
          <IconButton onClick={() => setAnnee(annee + 1)} size="small" sx={{ bgcolor: '#f1f5f9', borderRadius: 1 }}>
            <ChevronRight />
          </IconButton>
          <IconButton onClick={fetchData} size="small" sx={{ bgcolor: '#f1f5f9', ml: 1 }}>
            <Refresh />
          </IconButton>
        </Box>
        
        {/* Stats globales */}
        {globalStats && (
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Chip 
              icon={<Apartment />} 
              label={`${globalStats.total_baux} baux`} 
              size="small" 
              variant="outlined" 
            />
            <Chip 
              icon={<Payment />} 
              label={`${globalStats.total_sessions} sessions`} 
              size="small" 
              variant="outlined" 
            />
            <Chip 
              label={`${globalStats.taux_paiement}%`} 
              size="small" 
              color={globalStats.taux_paiement >= 90 ? 'success' : globalStats.taux_paiement >= 50 ? 'warning' : 'error'}
            />
          </Box>
        )}
      </Box>

      {/* Stats rapides */}
      <Grid container spacing={1.5} sx={{ mb: 3 }}>
        <Grid size={{ xs: 6, sm: 3 }}>
          <Card sx={{ bgcolor: '#f0fdf4', borderRadius: 2 }}>
            <CardContent sx={{ p: 1.5, textAlign: 'center' }}>
              <Typography variant="caption" color="text.secondary">Total payé</Typography>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#22c55e' }}>
                {formatCurrency(totalMontantPaye)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <Card sx={{ bgcolor: '#fef2f2', borderRadius: 2 }}>
            <CardContent sx={{ p: 1.5, textAlign: 'center' }}>
              <Typography variant="caption" color="text.secondary">Reste à payer</Typography>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#ef4444' }}>
                {formatCurrency(totalMontantDu - totalMontantPaye)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <Card sx={{ bgcolor: '#eff6ff', borderRadius: 2 }}>
            <CardContent sx={{ p: 1.5, textAlign: 'center' }}>
              <Typography variant="caption" color="text.secondary">Taux global</Typography>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#3b82f6' }}>
                {totalTaux}%
              </Typography>
              <LinearProgress variant="determinate" value={totalTaux} sx={{ height: 4, borderRadius: 2, mt: 0.5 }} />
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <Card sx={{ bgcolor: '#f8fafc', borderRadius: 2 }}>
            <CardContent sx={{ p: 1.5, textAlign: 'center' }}>
              <Typography variant="caption" color="text.secondary">Mois traités</Typography>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {sessionsByMonth.filter(m => m.est_complet).length}/12
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Paper sx={{ borderRadius: 2, overflow: 'hidden', border: '1px solid #e2e8f0' }}>
        <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)} sx={{ borderBottom: 1, borderColor: '#e2e8f0', bgcolor: '#fff' }}>
          <Tab icon={<Receipt sx={{ fontSize: 18 }} />} iconPosition="start" label="Vue mensuelle" />
          <Tab icon={<TrendingUp sx={{ fontSize: 18 }} />} iconPosition="start" label="Statistiques" />
        </Tabs>

        <Box sx={{ p: 2.5 }}>
          {/* Tab 0: Vue mensuelle */}
          <TabPanel value={tabValue} index={0}>
            {sessionsByMonth.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 6 }}>
                <Receipt sx={{ fontSize: 48, color: '#cbd5e1' }} />
                <Typography variant="body2" color="text.secondary">Aucune session pour {annee}</Typography>
              </Box>
            ) : (
              <Stack spacing={1.5}>
                {sessionsByMonth.map((month) => {
                  const status = getMonthStatus(month.est_complet, month.montant_paye, month.montant_du);
                  const pourcentage = month.montant_du > 0 ? (month.montant_paye / month.montant_du) * 100 : 0;
                  const isExpanded = expandedMonth === month.mois;

                  return (
                    <Card key={month.mois} sx={{ borderRadius: 2, border: '1px solid #e2e8f0', boxShadow: 'none' }}>
                      <CardContent sx={{ p: 2 }}>
                        {/* En-tête du mois */}
                        <Box 
                          sx={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            gap: 1,
                            cursor: 'pointer'
                          }}
                          onClick={() => toggleExpandMonth(month.mois)}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Typography variant="h6" sx={{ fontWeight: 600, minWidth: 100 }}>
                              {month.mois_nom}
                            </Typography>
                            <Chip label={status.label} size="small" sx={{ bgcolor: status.bg, color: status.color }} />
                          </Box>
                          
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                            <Box sx={{ textAlign: 'right' }}>
                              <Typography variant="caption" color="text.secondary">Payé</Typography>
                              <Typography variant="body2" sx={{ fontWeight: 600, color: '#22c55e' }}>
                                {formatCurrency(month.montant_paye)}
                              </Typography>
                            </Box>
                            <Box sx={{ textAlign: 'right' }}>
                              <Typography variant="caption" color="text.secondary">/ Total</Typography>
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                {formatCurrency(month.montant_du)}
                              </Typography>
                            </Box>
                            <Box sx={{ minWidth: 80 }}>
                              <LinearProgress variant="determinate" value={pourcentage} sx={{ height: 6, borderRadius: 2 }} />
                              <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center', display: 'block' }}>
                                {Math.round(pourcentage)}%
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <Tooltip title={`${month.nombre_paye} payés, ${month.nombre_partiel} partiels, ${month.nombre_attente} en attente, ${month.nombre_retard} en retard`}>
                                <Chip 
                                  icon={<People sx={{ fontSize: 14 }} />} 
                                  label={`${month.nombre_sessions} sessions`} 
                                  size="small" 
                                  variant="outlined" 
                                />
                              </Tooltip>
                              {isExpanded ? <ExpandLess /> : <ExpandMore />}
                            </Box>
                          </Box>
                        </Box>

                        {/* Détails des sessions (expandable) */}
                        {isExpanded && month.sessions.length > 0 && (
                          <Box sx={{ mt: 2 }}>
                            <Divider sx={{ mb: 2 }} />
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5, color: '#059669' }}>
                              Détail des baux
                            </Typography>
                            <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 1.5 }}>
                              <Table size="small">
                                <TableHead sx={{ bgcolor: '#f8fafc' }}>
                                  <TableRow>
                                    <TableCell sx={{ fontWeight: 600 }}>Bail</TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>Montant</TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>Payé</TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>Reste</TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>Statut</TableCell>
                                    <TableCell align="center" sx={{ fontWeight: 600 }}>Actions</TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {month.sessions.map((session) => {
                                    const reste = session.montant_total - (session.montant_paye || 0);
                                    const statusColor = getStatutColor(session.statut);
                                    return (
                                      <TableRow key={session.id} hover>
                                        <TableCell>
                                          <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                                            {session.bail_numero || `#${session.bail_id}`}
                                          </Typography>
                                        </TableCell>
                                        <TableCell>{formatCurrency(session.montant_total)}</TableCell>
                                        <TableCell sx={{ color: '#22c55e' }}>{formatCurrency(session.montant_paye || 0)}</TableCell>
                                        <TableCell sx={{ color: '#ef4444' }}>{formatCurrency(reste)}</TableCell>
                                        <TableCell>
                                          <Chip 
                                            label={getStatutLabel(session.statut)} 
                                            size="small" 
                                            sx={{ bgcolor: `${statusColor}20`, color: statusColor, height: 20 }} 
                                          />
                                        </TableCell>
                                        <TableCell align="center">
                                          <Tooltip title="Voir le bail">
                                            <IconButton 
                                              size="small" 
                                              onClick={() => router.push(`/baux/${session.bail_id}`)}
                                              sx={{ mr: 0.5 }}
                                            >
                                              <Visibility fontSize="small" />
                                            </IconButton>
                                          </Tooltip>
                                        </TableCell>
                                      </TableRow>
                                    );
                                  })}
                                </TableBody>
                              </Table>
                            </TableContainer>
                          </Box>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </Stack>
            )}
          </TabPanel>

          {/* Tab 1: Statistiques globales */}
          <TabPanel value={tabValue} index={1}>
            {globalStats && (
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Card sx={{ borderRadius: 2, border: '1px solid #e2e8f0', boxShadow: 'none' }}>
                    <CardContent sx={{ p: 2 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5, color: '#059669' }}>
                        Récapitulatif {annee}
                      </Typography>
                      <Stack spacing={1}>
                        <StatsRow label="Nombre de baux" value={globalStats.total_baux} />
                        <StatsRow label="Nombre de sessions" value={globalStats.total_sessions} />
                        <Divider />
                        <StatsRow label="Total des loyers" value={formatCurrency(globalStats.total_montant_du)} />
                        <StatsRow label="Total payé" value={formatCurrency(globalStats.total_montant_paye)} color="#22c55e" />
                        <StatsRow label="Reste à payer" value={formatCurrency(globalStats.total_montant_restant)} color="#ef4444" />
                        <Divider />
                        <StatsRow label="Sessions payées" value={`${globalStats.nb_paye}/${globalStats.total_sessions}`} />
                        <StatsRow label="Sessions partielles" value={`${globalStats.nb_partiel}/${globalStats.total_sessions}`} />
                        <StatsRow label="Sessions en attente" value={`${globalStats.nb_attente}/${globalStats.total_sessions}`} />
                        <StatsRow label="Sessions en retard" value={`${globalStats.nb_retard}/${globalStats.total_sessions}`} />
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Card sx={{ borderRadius: 2, border: '1px solid #e2e8f0', boxShadow: 'none' }}>
                    <CardContent sx={{ p: 2 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5, color: '#059669' }}>
                        Performance
                      </Typography>
                      <Stack spacing={1}>
                        <StatsRow label="Taux de paiement" value={`${globalStats.taux_paiement}%`} />
                        <LinearProgress variant="determinate" value={globalStats.taux_paiement} sx={{ height: 6, borderRadius: 2, mb: 1 }} />
                        <StatsRow label="Taux de sessions payées" value={`${globalStats.taux_sessions_payees}%`} />
                        <LinearProgress variant="determinate" value={globalStats.taux_sessions_payees} sx={{ height: 6, borderRadius: 2 }} />
                      </Stack>
                      <Divider sx={{ my: 2 }} />
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5, color: '#059669' }}>
                        Répartition par statut
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        <Chip label={`Payé: ${globalStats.nb_paye}`} sx={{ bgcolor: '#f0fdf4', color: '#22c55e' }} />
                        <Chip label={`Partiel: ${globalStats.nb_partiel}`} sx={{ bgcolor: '#fffbeb', color: '#f59e0b' }} />
                        <Chip label={`En attente: ${globalStats.nb_attente}`} sx={{ bgcolor: '#f8fafc', color: '#94a3b8' }} />
                        <Chip label={`En retard: ${globalStats.nb_retard}`} sx={{ bgcolor: '#fef2f2', color: '#ef4444' }} />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            )}
          </TabPanel>
        </Box>
      </Paper>

      <Snackbar open={!!success} autoHideDuration={5000} onClose={() => setSuccess('')}>
        <Alert severity="success">{success}</Alert>
      </Snackbar>
      <Snackbar open={!!errorMsg} autoHideDuration={4000} onClose={() => setErrorMsg('')}>
        <Alert severity="error">{errorMsg}</Alert>
      </Snackbar>
    </Box>
  );
}

function StatsRow({ label, value, color }: { label: string; value: string | number; color?: string }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Typography variant="body2" color="text.secondary">{label}</Typography>
      <Typography variant="body2" sx={{ fontWeight: 600, color: color || '#0f172a' }}>{value}</Typography>
    </Box>
  );
}