// src/app/decompte-annuel/page.tsx

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box, Container, Typography, Paper, Grid, Card, CardContent,
  Button, Chip, Avatar, Stack, IconButton, CircularProgress,
  Alert, Snackbar, Tooltip, Divider, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow,
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Autocomplete, LinearProgress, Fade,
  useTheme
} from '@mui/material';
import {
  Receipt, Download, Print, Home, People, WaterDrop,
  ElectricBolt, TrendingUp, CalendarToday, AttachMoney,
  ArrowBack, Refresh, PictureAsPdf, Close, CheckCircle,
  Schedule, Description
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { releveService } from '@/services/releveService';
import { logementService } from '@/services/logementService';
import { DecompteCharges } from '@/types/releve';
import { formatCurrency, formatDate } from '@/utils/formatters';

const moisNoms = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

// ==================== COMPOSANT INFOCARD ====================

interface InfoCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color?: string;
  bgColor?: string;
}

function InfoCard({ icon, label, value, color = '#64748b', bgColor = '#f8fafc' }: InfoCardProps) {
  return (
    <Card sx={{ 
      borderRadius: 2, 
      boxShadow: 'none', 
      border: '1px solid #e2e8f0',
      transition: 'all 0.2s ease',
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
      }
    }}>
      <CardContent sx={{ p: 2.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ 
            p: 1.5, 
            borderRadius: 2, 
            bgcolor: bgColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {icon}
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
              {label}
            </Typography>
            <Typography variant="h6" component="div" sx={{ fontWeight: 700, color: color }}>
              {value}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

// ==================== COMPOSANT PRINCIPAL ====================

export default function DecompteAnnuelPage() {
  const router = useRouter();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [logements, setLogements] = useState<any[]>([]);
  const [selectedLogement, setSelectedLogement] = useState<any>(null);
  const [annee, setAnnee] = useState(new Date().getFullYear());
  const [decompte, setDecompte] = useState<DecompteCharges | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [loadingLogements, setLoadingLogements] = useState(false);

  useEffect(() => {
    fetchLogements();
  }, []);

  const fetchLogements = async () => {
    setLoadingLogements(true);
    try {
      const data = await logementService.getOccupes();
      setLogements(Array.isArray(data) ? data : []);
    } catch (err) {
      setError('Erreur chargement logements');
    } finally {
      setLoadingLogements(false);
    }
  };

  const handleGenerer = async () => {
    if (!selectedLogement) {
      setError('Veuillez sélectionner un logement');
      return;
    }

    setGenerating(true);
    try {
      const result = await releveService.genererDecompteAnnuel(selectedLogement.id, annee);
      setDecompte(result);
      setSuccess(`Décompte généré pour ${selectedLogement.numero} - ${annee}`);
      setOpenDialog(false);
    } catch (err: any) {
      setError(err?.message || 'Erreur lors de la génération');
    } finally {
      setGenerating(false);
    }
  };

  const handlePrint = () => window.print();

  const handleRefresh = async () => {
    if (selectedLogement) {
      await handleGenerer();
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', bgcolor: '#f8fafc', minHeight: '100vh' }}>
        <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
        <Box component="main" sx={{ flexGrow: 1 }}>
          <Header onMenuClick={() => setMobileOpen(!mobileOpen)} />
          <Container sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', py: 8 }}>
            <CircularProgress size={40} />
            <Typography variant="body2" sx={{ mt: 2, color: '#64748b' }}>
              Chargement...
            </Typography>
          </Container>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', bgcolor: '#f8fafc', minHeight: '100vh' }}>
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Header onMenuClick={() => setMobileOpen(!mobileOpen)} />
        <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 }, py: 2.5, mt: { xs: 7, sm: 8 } }}>
          
          {/* En-tête */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Receipt sx={{ color: '#1976d2' }} />
                Décompte annuel
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Décompte annuel des charges par logement
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Button 
                variant="contained" 
                startIcon={<Receipt />} 
                onClick={() => setOpenDialog(true)} 
                sx={{ textTransform: 'none', borderRadius: 2 }}
              >
                Générer
              </Button>
              {decompte?.pdf_url && (
                <>
                  <Button 
                    variant="outlined" 
                    startIcon={<Download />} 
                    href={decompte.pdf_url} 
                    target="_blank" 
                    sx={{ textTransform: 'none', borderRadius: 2 }}
                  >
                    PDF
                  </Button>
                  <Button 
                    variant="outlined" 
                    startIcon={<Print />} 
                    onClick={handlePrint} 
                    sx={{ textTransform: 'none', borderRadius: 2 }}
                  >
                    Imprimer
                  </Button>
                  <IconButton onClick={handleRefresh} sx={{ bgcolor: '#f1f5f9' }}>
                    <Refresh />
                  </IconButton>
                </>
              )}
            </Box>
          </Box>

          {/* Alertes */}
          {error && (
            <Fade in={!!error}>
              <Alert 
                severity="error" 
                sx={{ mb: 2, borderRadius: 2 }} 
                onClose={() => setError(null)}
                action={
                  <Button color="inherit" size="small" onClick={() => setError(null)}>
                    OK
                  </Button>
                }
              >
                {error}
              </Alert>
            </Fade>
          )}

          {success && (
            <Fade in={!!success}>
              <Alert 
                severity="success" 
                sx={{ mb: 2, borderRadius: 2 }} 
                onClose={() => setSuccess('')}
              >
                {success}
              </Alert>
            </Fade>
          )}

          {/* Contenu principal */}
          {decompte ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              {/* Résumé */}
              <Paper sx={{ 
                p: 2.5, 
                mb: 3, 
                borderRadius: 2, 
                bgcolor: '#f8fafc',
                border: '1px solid #e2e8f0'
              }}>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
                      <Avatar sx={{ bgcolor: '#1976d2', width: 48, height: 48 }}>
                        <Home />
                      </Avatar>
                      <Box>
                        <Typography variant="body2" color="text.secondary">Logement</Typography>
                        <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
                          {selectedLogement?.numero || ''}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {selectedLogement?.batiment_nom || ''}
                        </Typography>
                      </Box>
                    </Stack>
                  </Grid>
                  <Grid size={{ xs: 12, md: 3 }}>
                    <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                      <People sx={{ color: '#64748b' }} />
                      <Box>
                        <Typography variant="caption" color="text.secondary">Personnes</Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          {decompte.nb_personnes || 1}
                        </Typography>
                      </Box>
                    </Stack>
                  </Grid>
                  <Grid size={{ xs: 12, md: 3 }}>
                    <Stack direction="row" spacing={1} sx={{ alignItems: 'center', justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
                      <CalendarToday sx={{ color: '#64748b' }} />
                      <Chip 
                        label={decompte.annee} 
                        size="medium" 
                        color="primary" 
                        sx={{ fontWeight: 600 }}
                      />
                      {decompte.est_valide && (
                        <Chip 
                          icon={<CheckCircle sx={{ fontSize: 14 }} />}
                          label="Validé" 
                          size="small" 
                          color="success"
                        />
                      )}
                    </Stack>
                  </Grid>
                </Grid>
              </Paper>

              {/* Statistiques */}
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <InfoCard
                    icon={<WaterDrop sx={{ color: '#3b82f6' }} />}
                    label="Eau"
                    value={formatCurrency(decompte.total_eau)}
                    color="#3b82f6"
                    bgColor="#eff6ff"
                  />
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <InfoCard
                    icon={<ElectricBolt sx={{ color: '#f59e0b' }} />}
                    label="Électricité"
                    value={formatCurrency(decompte.total_electricite)}
                    color="#f59e0b"
                    bgColor="#fffbeb"
                  />
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <InfoCard
                    icon={<TrendingUp sx={{ color: '#10b981' }} />}
                    label="Charges communes"
                    value={formatCurrency(decompte.total_charges_communes)}
                    color="#10b981"
                    bgColor="#f0fdf4"
                  />
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <InfoCard
                    icon={<Receipt sx={{ color: '#059669' }} />}
                    label="Total général"
                    value={formatCurrency(decompte.total_general)}
                    color="#059669"
                    bgColor="#e8f5e9"
                  />
                </Grid>
              </Grid>

              {/* Détail mensuel */}
              <Paper sx={{ borderRadius: 2, overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                <Box sx={{ 
                  p: 2, 
                  bgcolor: '#f8fafc', 
                  borderBottom: '1px solid #e2e8f0',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    Détail mensuel
                  </Typography>
                  <Chip 
                    icon={<Schedule sx={{ fontSize: 14 }} />}
                    label={`${Object.keys(decompte.details || {}).length} mois`} 
                    size="small" 
                  />
                </Box>
                <TableContainer>
                  <Table size="small">
                    <TableHead sx={{ bgcolor: '#f8fafc' }}>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 600 }}>Mois</TableCell>
                        <TableCell sx={{ fontWeight: 600, textAlign: 'right' }}>Eau</TableCell>
                        <TableCell sx={{ fontWeight: 600, textAlign: 'right' }}>Électricité</TableCell>
                        <TableCell sx={{ fontWeight: 600, textAlign: 'right' }}>Gaz</TableCell>
                        <TableCell sx={{ fontWeight: 600, textAlign: 'right' }}>Charges</TableCell>
                        <TableCell sx={{ fontWeight: 600, textAlign: 'right' }}>Total</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {decompte.details && Object.keys(decompte.details).map((moisKey) => {
                        const mois = parseInt(moisKey);
                        const details = decompte.details?.[mois];
                        if (!details) return null;
                        const isCurrentMonth = mois === new Date().getMonth() + 1 && decompte.annee === new Date().getFullYear();
                        return (
                          <TableRow 
                            key={mois}
                            sx={{ 
                              bgcolor: isCurrentMonth ? '#f0fdf4' : 'transparent',
                              '&:hover': { bgcolor: '#f8fafc' }
                            }}
                          >
                            <TableCell sx={{ fontWeight: isCurrentMonth ? 600 : 400 }}>
                              {moisNoms[mois - 1]}
                              {isCurrentMonth && (
                                <Chip label="En cours" size="small" color="success" sx={{ ml: 1, height: 18, fontSize: '0.6rem' }} />
                              )}
                            </TableCell>
                            <TableCell align="right">{formatCurrency(details.eau || 0)}</TableCell>
                            <TableCell align="right">{formatCurrency(details.electricite || 0)}</TableCell>
                            <TableCell align="right">{formatCurrency(details.gaz || 0)}</TableCell>
                            <TableCell align="right">{formatCurrency(details.charges_communes || 0)}</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 700, color: '#059669' }}>
                              {formatCurrency(details.total_mois || 0)}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>

              {/* Pied de page */}
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  <Description sx={{ fontSize: 14, verticalAlign: 'middle', mr: 0.5 }} />
                  Généré le {formatDate(decompte.created_at)}
                </Typography>
                {decompte.pdf_url && (
                  <Button 
                    size="small" 
                    startIcon={<PictureAsPdf />} 
                    href={decompte.pdf_url} 
                    target="_blank"
                    sx={{ textTransform: 'none' }}
                  >
                    Télécharger le PDF
                  </Button>
                )}
              </Box>
            </motion.div>
          ) : (
            /* État vide */
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Paper sx={{ textAlign: 'center', py: 8, px: 2, borderRadius: 2 }}>
                <Receipt sx={{ fontSize: 64, color: '#cbd5e1', mb: 2 }} />
                <Typography variant="h6" component="div" sx={{ color: '#64748b', mb: 1 }}>
                  Aucun décompte généré
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Sélectionnez un logement et une année pour générer le décompte annuel
                </Typography>
                <Button 
                  variant="contained" 
                  startIcon={<Receipt />} 
                  onClick={() => setOpenDialog(true)} 
                  sx={{ textTransform: 'none', borderRadius: 2 }}
                >
                  Générer un décompte
                </Button>
              </Paper>
            </motion.div>
          )}
        </Container>
      </Box>

      {/* Dialogue de génération - CORRIGÉ */}
      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)} 
        maxWidth="sm" 
        fullWidth
      >
        <DialogTitle sx={{ 
          borderBottom: '1px solid #e2e8f0', 
          pb: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Receipt sx={{ color: '#1976d2' }} />
            <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
              Générer un décompte
            </Typography>
          </Box>
          <IconButton size="small" onClick={() => setOpenDialog(false)}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, mt: 1 }}>
            <Autocomplete
              options={logements}
              loading={loadingLogements}
              value={selectedLogement}
              onChange={(_, newValue) => setSelectedLogement(newValue)}
              getOptionLabel={(option: any) => `${option.numero} - ${option.batiment_nom || ''}`}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Logement *"
                  size="small"
                  required
                  helperText={!selectedLogement && "Veuillez sélectionner un logement"}
                />
              )}
              renderOption={(props, option: any) => (
                <li {...props} key={option.id}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Home sx={{ fontSize: 18, color: '#64748b' }} />
                    <Box>
                      <Typography variant="body2">{option.numero}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {option.batiment_nom || ''}
                      </Typography>
                    </Box>
                  </Box>
                </li>
              )}
              isOptionEqualToValue={(option, value) => option.id === value?.id}
            />

            <TextField
              fullWidth
              size="small"
              type="number"
              label="Année *"
              value={annee}
              onChange={(e) => setAnnee(Number(e.target.value))}
              slotProps={{ 
                htmlInput: { min: 2000, max: 2100 } 
              }}
              helperText={`Année en cours: ${new Date().getFullYear()}`}
            />

            {selectedLogement && (
              <Alert severity="info" sx={{ borderRadius: 2 }}>
                <Typography variant="body2">
                  Génération du décompte pour <strong>{selectedLogement.numero}</strong> - {annee}
                </Typography>
              </Alert>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ 
          px: 3, 
          pb: 3, 
          borderTop: '1px solid #e2e8f0', 
          pt: 2,
          gap: 1
        }}>
          <Button onClick={() => setOpenDialog(false)} variant="outlined" sx={{ textTransform: 'none' }}>
            Annuler
          </Button>
          <Button 
            variant="contained" 
            onClick={handleGenerer} 
            disabled={generating || !selectedLogement}
            startIcon={generating ? <CircularProgress size={20} /> : <Receipt />}
            sx={{ textTransform: 'none' }}
          >
            {generating ? 'Génération...' : 'Générer'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar 
        open={!!success} 
        autoHideDuration={4000} 
        onClose={() => setSuccess('')} 
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          severity="success" 
          onClose={() => setSuccess('')}
          sx={{ borderRadius: 2 }}
        >
          {success}
        </Alert>
      </Snackbar>
    </Box>
  );
}