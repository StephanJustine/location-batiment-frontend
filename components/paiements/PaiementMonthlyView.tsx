// src/components/paiements/PaiementMonthlyView.tsx
'use client';

import { useState, useEffect } from 'react';
import {
  Box, Card, CardContent, Typography, Chip, Button,
  CircularProgress, Alert, IconButton, Table,
  TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Dialog, DialogTitle, DialogContent, LinearProgress,
  Tooltip, Snackbar, Stack
} from '@mui/material';
import {
  CheckCircle, Warning, Schedule, Receipt, PictureAsPdf,
  Close, Refresh, AttachMoney, ChevronLeft, ChevronRight
} from '@mui/icons-material';
import { paiementGroupService } from '@/services/paiementGroupService';
import { paiementService } from '@/services/paiementService';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { PaiementMensuel, PaiementGlobalStats } from '@/types/paiementGroup';

interface Props {
  bailId: number;
  loyerMensuel: number;
  chargesMensuelles: number;
}

const moisNoms = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

export default function PaiementMonthlyView({ bailId, loyerMensuel, chargesMensuelles }: Props) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [annee, setAnnee] = useState(new Date().getFullYear());
  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const [generatingQuittance, setGeneratingQuittance] = useState<number | null>(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [paiementsGroup, setPaiementsGroup] = useState<PaiementMensuel[]>([]);
  const [globalStats, setGlobalStats] = useState<PaiementGlobalStats | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<PaiementMensuel | null>(null);

  const fetchData = async () => {
    if (!bailId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const [grouped, stats] = await Promise.all([
        paiementGroupService.getGroupedByMonth(bailId, annee),
        paiementGroupService.getGlobalStats(bailId)
      ]);
      setPaiementsGroup(Array.isArray(grouped) ? grouped : []);
      setGlobalStats(stats);
    } catch (err: any) {
      console.error('❌ Erreur fetchData:', err);
      setError(err?.response?.data?.detail || err?.message || 'Erreur lors du chargement');
      setPaiementsGroup([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [bailId, annee]);

  const handleMonthClick = async (mois: number, annee: number) => {
    try {
      const details = await paiementGroupService.getMonthDetails(bailId, mois, annee);
      setSelectedMonth(details);
      setOpenDetailDialog(true);
    } catch (err: any) {
      setErrorMessage(err?.response?.data?.detail || 'Erreur lors du chargement des détails');
    }
  };

  const handleGenerateQuittance = async (paiementId: number) => {
    setGeneratingQuittance(paiementId);
    try {
      const blob = await paiementService.getQuittancePDF(paiementId);
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
      URL.revokeObjectURL(url);
      setSuccessMessage('Quittance générée avec succès');
    } catch (err: any) {
      setErrorMessage(err?.response?.data?.detail || 'Erreur lors de la génération');
    } finally {
      setGeneratingQuittance(null);
    }
  };

  const getMonthStatus = (estComplet: boolean, montantPaye: number) => {
    if (estComplet) return { label: 'Payé', color: '#4caf50', bg: '#e8f5e9' };
    if (montantPaye > 0) return { label: 'Partiel', color: '#ff9800', bg: '#fff3e0' };
    return { label: 'Impayé', color: '#f44336', bg: '#ffebee' };
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress size={32} />
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

  // Stats minimales
  const montantTotalMensuel = loyerMensuel + chargesMensuelles;
  const totalDu = paiementsGroup.reduce((sum, m) => sum + m.montant_du, 0);
  const totalPaye = paiementsGroup.reduce((sum, m) => sum + m.montant_paye, 0);
  const tauxPaiement = totalDu > 0 ? Math.round((totalPaye / totalDu) * 100) : 0;

  return (
    <Box>
      {/* Stats rapides */}
      <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap', gap: 1 }}>
        <Chip label={`Total dû: ${formatCurrency(totalDu)}`} size="small" variant="outlined" />
        <Chip label={`Payé: ${formatCurrency(totalPaye)}`} size="small" variant="outlined" color="success" />
        <Chip label={`Taux: ${tauxPaiement}%`} size="small" variant="outlined" color="info" />
      </Stack>

      {/* Sélecteur année */}
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1, mb: 2 }}>
        <IconButton size="small" onClick={() => setAnnee(annee - 1)}>
          <ChevronLeft />
        </IconButton>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>{annee}</Typography>
        <IconButton size="small" onClick={() => setAnnee(annee + 1)}>
          <ChevronRight />
        </IconButton>
        <IconButton size="small" onClick={fetchData}>
          <Refresh fontSize="small" />
        </IconButton>
      </Box>

      {/* Grille 6 cartes par ligne */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { 
          xs: 'repeat(2, 1fr)', 
          sm: 'repeat(3, 1fr)', 
          md: 'repeat(4, 1fr)',
          lg: 'repeat(6, 1fr)'  // 6 cartes sur grand écran
        }, 
        gap: 1.5 
      }}>
        {paiementsGroup.map((month) => {
          const status = getMonthStatus(month.est_complet, month.montant_paye);
          const pourcentage = month.montant_du > 0 ? (month.montant_paye / month.montant_du) * 100 : 0;

          return (
            <Card 
              key={month.mois}
              sx={{ 
                borderRadius: 1.5,
                border: `1px solid ${status.color}30`,
                bgcolor: month.est_complet ? '#fafafa' : 'white',
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': { transform: 'translateY(-2px)', boxShadow: 1 }
              }}
              onClick={() => handleMonthClick(month.mois, month.annee)}
            >
              <CardContent sx={{ p: 1, '&:last-child': { pb: 1 } }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                  <Typography variant="caption" sx={{ fontWeight: 600, fontSize: '0.7rem' }}>
                    {month.mois_nom.substring(0, 3)}
                  </Typography>
                  <Chip 
                    label={status.label}
                    size="small"
                    sx={{ height: 18, fontSize: '0.6rem', bgcolor: status.bg, color: status.color }}
                  />
                </Box>

                <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: '0.85rem' }}>
                  {formatCurrency(month.montant_paye)}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.6rem' }}>
                  / {formatCurrency(month.montant_du)}
                </Typography>

                <LinearProgress 
                  variant="determinate" 
                  value={pourcentage}
                  sx={{ height: 3, borderRadius: 1, my: 0.5, bgcolor: '#e0e0e0' }}
                />

                {month.paiements && month.paiements.length > 0 && (
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.6rem', display: 'block' }}>
                    {month.paiements.length} payt(s)
                  </Typography>
                )}
              </CardContent>
            </Card>
          );
        })}
      </Box>

      {/* Dialog détails du mois - version compacte */}
      <Dialog open={openDetailDialog} onClose={() => setOpenDetailDialog(false)} maxWidth="sm" fullWidth>
        {selectedMonth && (
          <>
            <DialogTitle sx={{ p: 1.5, pb: 0 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  {selectedMonth.mois_nom} {selectedMonth.annee}
                </Typography>
                <IconButton size="small" onClick={() => setOpenDetailDialog(false)}>
                  <Close fontSize="small" />
                </IconButton>
              </Box>
            </DialogTitle>
            <DialogContent dividers sx={{ p: 1.5 }}>
              {/* Stats rapides mois */}
              <Stack direction="row" spacing={1} sx={{ mb: 2, justifyContent: 'space-around' }}>
                <Chip label={`Dû: ${formatCurrency(selectedMonth.montant_du)}`} size="small" variant="outlined" />
                <Chip label={`Payé: ${formatCurrency(selectedMonth.montant_paye)}`} size="small" color="success" />
                <Chip label={`Restant: ${formatCurrency(selectedMonth.montant_restant)}`} size="small" color="error" />
              </Stack>

              {/* Liste des paiements */}
              {selectedMonth.paiements && selectedMonth.paiements.length > 0 ? (
                <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 1 }}>
                  <Table size="small">
                    <TableHead sx={{ bgcolor: '#f5f5f5' }}>
                      <TableRow>
                        <TableCell sx={{ py: 0.5, fontSize: '0.7rem' }}>Date</TableCell>
                        <TableCell sx={{ py: 0.5, fontSize: '0.7rem' }}>Montant</TableCell>
                        <TableCell sx={{ py: 0.5, fontSize: '0.7rem' }}>Mode</TableCell>
                        <TableCell align="center" sx={{ py: 0.5, fontSize: '0.7rem' }}>Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {selectedMonth.paiements.map((p: any) => (
                        <TableRow key={p.id}>
                          <TableCell sx={{ py: 0.5, fontSize: '0.7rem' }}>{formatDate(p.date_paiement)}</TableCell>
                          <TableCell sx={{ py: 0.5, fontWeight: 600, fontSize: '0.75rem' }}>{formatCurrency(p.montant)}</TableCell>
                          <TableCell sx={{ py: 0.5, fontSize: '0.7rem' }}>{p.mode_paiement || '-'}</TableCell>
                          <TableCell align="center" sx={{ py: 0.5 }}>
                            <Tooltip title="Quittance">
                              <IconButton 
                                size="small" 
                                onClick={() => handleGenerateQuittance(p.id)}
                                disabled={generatingQuittance === p.id}
                                sx={{ p: 0.5 }}
                              >
                                {generatingQuittance === p.id ? (
                                  <CircularProgress size={14} />
                                ) : (
                                  <PictureAsPdf fontSize="small" sx={{ fontSize: 14 }} color="error" />
                                )}
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Box sx={{ textAlign: 'center', py: 2 }}>
                  <Receipt sx={{ fontSize: 32, color: 'text.disabled' }} />
                  <Typography variant="caption" color="text.secondary">
                    Aucun paiement
                  </Typography>
                </Box>
              )}
            </DialogContent>
          </>
        )}
      </Dialog>

      {/* Notifications */}
      <Snackbar open={!!successMessage} autoHideDuration={3000} onClose={() => setSuccessMessage('')}>
        <Alert severity="success" onClose={() => setSuccessMessage('')}>{successMessage}</Alert>
      </Snackbar>
      <Snackbar open={!!errorMessage} autoHideDuration={3000} onClose={() => setErrorMessage('')}>
        <Alert severity="error" onClose={() => setErrorMessage('')}>{errorMessage}</Alert>
      </Snackbar>
    </Box>
  );
}