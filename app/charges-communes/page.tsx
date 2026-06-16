// src/app/charges-communes/page.tsx

'use client';

import { useState, useEffect } from 'react';
import {
  Box, Container, Typography, Paper, Grid, Card, CardContent,
  Button, TextField, FormControl, InputLabel, Select, MenuItem,
  Chip, IconButton, CircularProgress, Alert, Snackbar,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Dialog, DialogTitle, DialogContent, DialogActions,
  Autocomplete, Avatar, Divider, Stack, Tooltip, Fade,
  LinearProgress, useTheme
} from '@mui/material';
import {
  Calculate, WaterDrop, ElectricBolt, TrendingUp,
  People, Home, Apartment, Refresh, Add,
  Close, Delete, Edit, Receipt, Description,
  CheckCircle, Schedule, AttachMoney, Layers,
  Save, Cancel
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { releveService } from '@/services/releveService';
import { batimentService } from '@/services/batimentService';
import { formatCurrency } from '@/utils/formatters';

const moisNoms = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

// ==================== COMPOSANT STATCARD ====================

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color?: string;
  bgColor?: string;
  subValue?: string;
}

function StatCard({ icon, label, value, color = '#64748b', bgColor = '#f8fafc', subValue }: StatCardProps) {
  return (
    <Card sx={{ 
      borderRadius: 2, 
      boxShadow: 'none', 
      border: '1px solid #e2e8f0',
      transition: 'all 0.2s ease',
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
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
            {subValue && (
              <Typography variant="caption" color="text.secondary">
                {subValue}
              </Typography>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

// ==================== COMPOSANT PRINCIPAL ====================

export default function ChargesCommunesPage() {
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [calculating, setCalculating] = useState(false);
  const [batiments, setBatiments] = useState<any[]>([]);
  const [selectedBatiment, setSelectedBatiment] = useState<any>(null);
  const [mois, setMois] = useState(new Date().getMonth() + 1);
  const [annee, setAnnee] = useState(new Date().getFullYear());
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [loadingBatiments, setLoadingBatiments] = useState(false);
  const [openResult, setOpenResult] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // État du formulaire de charge
  const [chargeForm, setChargeForm] = useState({
    batiment_id: '',
    type_charge: '',
    montant_total: 0,
    methode_repartition: 'prorata_surface',
    mois: new Date().getMonth() + 1,
    annee: new Date().getFullYear(),
    notes: ''
  });

  useEffect(() => {
    fetchBatiments();
  }, []);

  const fetchBatiments = async () => {
    setLoadingBatiments(true);
    try {
      const data = await batimentService.getAll();
      setBatiments(Array.isArray(data) ? data : []);
    } catch (err) {
      setError('Erreur chargement bâtiments');
    } finally {
      setLoadingBatiments(false);
    }
  };

  const handleCalculer = async () => {
    if (!selectedBatiment) {
      setError('Veuillez sélectionner un bâtiment');
      return;
    }

    setCalculating(true);
    try {
      const data = await releveService.calculerChargesCommunes(
        selectedBatiment.id,
        mois,
        annee
      );
      setResult(data);
      setSuccess('Calcul des charges communes effectué');
      setOpenResult(true);
    } catch (err: any) {
      setError(err?.message || 'Erreur lors du calcul');
    } finally {
      setCalculating(false);
    }
  };

  const handleRefresh = async () => {
    if (selectedBatiment) {
      await handleCalculer();
    }
  };

  // ==================== GESTION DES CHARGES ====================

  const handleOpenDialog = () => {
    setChargeForm({
      batiment_id: selectedBatiment?.id || '',
      type_charge: '',
      montant_total: 0,
      methode_repartition: 'prorata_surface',
      mois: mois,
      annee: annee,
      notes: ''
    });
    setOpenDialog(true);
  };

  const handleSubmitCharge = async () => {
    // Validation
    if (!chargeForm.batiment_id) {
      setError('Veuillez sélectionner un bâtiment');
      return;
    }
    if (!chargeForm.type_charge) {
      setError('Veuillez saisir un type de charge');
      return;
    }
    if (chargeForm.montant_total <= 0) {
      setError('Le montant doit être supérieur à 0');
      return;
    }

    setSubmitting(true);
    try {
      // Appel API pour créer la charge
      // À adapter selon votre API
      const response = await fetch('/api/v1/charges-communes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(chargeForm),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la création');
      }

      setSuccess('Charge commune créée avec succès');
      setOpenDialog(false);
      // Recalculer les charges après ajout
      if (selectedBatiment) {
        await handleCalculer();
      }
    } catch (err: any) {
      setError(err?.message || 'Erreur lors de la création');
    } finally {
      setSubmitting(false);
    }
  };

  // Calcul du total des charges
  const totalCharges = result?.charges ? 
    Object.values(result.charges).reduce((sum: number, c: any) => sum + c.montant_total, 0) : 0;

  // Types de charges disponibles
  const typesCharge = [
    'Eau',
    'Électricité',
    'Gaz',
    'Entretien',
    'Ascenseur',
    'Poubelles',
    'Jardin',
    'Sécurité',
    'Assurance',
    'Chauffage',
    'Climatisation',
    'Autre'
  ];

  // Méthodes de répartition
  const methodesRepartition = [
    { value: 'egal', label: 'Égalitaire' },
    { value: 'prorata_surface', label: 'Prorata surface' },
    { value: 'prorata_personnes', label: 'Prorata personnes' },
  ];

  return (
    <Box sx={{ display: 'flex', bgcolor: '#f8fafc', minHeight: '100vh' }}>
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Header onMenuClick={() => setMobileOpen(!mobileOpen)} />
        <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3 }, py: 2.5, mt: { xs: 7, sm: 8 } }}>
          
          {/* En-tête */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5, flexWrap: 'wrap', gap: 2 }}>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Calculate sx={{ color: '#1976d2' }} />
                Charges communes
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Calcul et répartition des charges communes par bâtiment
              </Typography>
            </Box>
            <Button 
              variant="contained" 
              startIcon={<Add />} 
              onClick={handleOpenDialog} 
              sx={{ textTransform: 'none', borderRadius: 2 }}
            >
              Nouvelle charge
            </Button>
          </Box>

          {/* Formulaire de calcul */}
          <Paper sx={{ p: 2.5, mb: 3, borderRadius: 2, border: '1px solid #e2e8f0' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Layers sx={{ fontSize: 20 }} />
              Paramètres du calcul
            </Typography>
            
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 4 }}>
                <Autocomplete
                  options={batiments}
                  loading={loadingBatiments}
                  value={selectedBatiment}
                  onChange={(_, newValue) => setSelectedBatiment(newValue)}
                  getOptionLabel={(option: any) => option.nom || ''}
                  renderInput={(params) => (
                    <TextField 
                      {...params} 
                      label="Bâtiment *" 
                      size="small"
                      required
                      helperText={!selectedBatiment && "Veuillez sélectionner un bâtiment"}
                    />
                  )}
                  renderOption={(props, option: any) => (
                    <li {...props} key={option.id}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Apartment sx={{ fontSize: 18, color: '#64748b' }} />
                        <Box>
                          <Typography variant="body2">{option.nom}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {option.adresse || ''}
                          </Typography>
                        </Box>
                      </Box>
                    </li>
                  )}
                  isOptionEqualToValue={(option, value) => option.id === value?.id}
                />
              </Grid>
              <Grid size={{ xs: 6, md: 2 }}>
                <FormControl fullWidth size="small">
                  <InputLabel>Mois</InputLabel>
                  <Select 
                    value={mois} 
                    label="Mois" 
                    onChange={(e) => setMois(Number(e.target.value))}
                  >
                    {moisNoms.map((m, i) => (
                      <MenuItem key={i} value={i + 1}>{m}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 6, md: 2 }}>
                <TextField
                  fullWidth
                  size="small"
                  type="number"
                  label="Année"
                  value={annee}
                  onChange={(e) => setAnnee(Number(e.target.value))}
                  slotProps={{ htmlInput: { min: 2000, max: 2100 } }}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <Stack direction="row" spacing={1}>
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={calculating ? <CircularProgress size={20} /> : <Calculate />}
                    onClick={handleCalculer}
                    disabled={calculating || !selectedBatiment}
                    sx={{ textTransform: 'none', borderRadius: 2 }}
                  >
                    {calculating ? 'Calcul en cours...' : 'Calculer les charges'}
                  </Button>
                  {result && (
                    <IconButton onClick={handleRefresh} sx={{ bgcolor: '#f1f5f9' }}>
                      <Refresh />
                    </IconButton>
                  )}
                </Stack>
              </Grid>
            </Grid>

            {calculating && (
              <Box sx={{ mt: 2 }}>
                <LinearProgress />
                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                  Calcul en cours...
                </Typography>
              </Box>
            )}
          </Paper>

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

          {/* Résultat */}
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: openResult ? 1 : 0, y: openResult ? 0 : 20 }}
              transition={{ duration: 0.4 }}
            >
              <Paper sx={{ p: 2.5, borderRadius: 2, border: '1px solid #e2e8f0' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" component="div" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Description sx={{ color: '#1976d2' }} />
                    Résultat du calcul
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Chip 
                      icon={<Schedule sx={{ fontSize: 14 }} />}
                      label={`${moisNoms[mois - 1]} ${annee}`} 
                      color="primary" 
                      size="medium" 
                    />
                    <Chip 
                      icon={<CheckCircle sx={{ fontSize: 14 }} />}
                      label={`${Object.keys(result.charges || {}).length} types`} 
                      size="medium" 
                    />
                  </Box>
                </Box>

                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid size={{ xs: 6, sm: 3 }}>
                    <StatCard
                      icon={<Home sx={{ color: '#3b82f6' }} />}
                      label="Logements"
                      value={result.nb_logements || 0}
                      color="#3b82f6"
                      bgColor="#eff6ff"
                      subValue={result.nb_logements > 0 ? `Total ${result.nb_logements}` : undefined}
                    />
                  </Grid>
                  <Grid size={{ xs: 6, sm: 3 }}>
                    <StatCard
                      icon={<People sx={{ color: '#10b981' }} />}
                      label="Personnes"
                      value={result.total_personnes || 0}
                      color="#10b981"
                      bgColor="#f0fdf4"
                      subValue={result.total_personnes > 0 ? `Total occupants` : undefined}
                    />
                  </Grid>
                  <Grid size={{ xs: 6, sm: 3 }}>
                    <StatCard
                      icon={<Layers sx={{ color: '#8b5cf6' }} />}
                      label="Surface totale"
                      value={`${result.surface_totale || 0} m²`}
                      color="#8b5cf6"
                      bgColor="#f5f3ff"
                    />
                  </Grid>
                  <Grid size={{ xs: 6, sm: 3 }}>
                    <StatCard
                      icon={<AttachMoney sx={{ color: '#059669' }} />}
                      label="Total charges"
                      value={formatCurrency(totalCharges)}
                      color="#059669"
                      bgColor="#e8f5e9"
                    />
                  </Grid>
                </Grid>

                {/* Détail par type de charge */}
                {result.charges && Object.keys(result.charges).length > 0 ? (
                  Object.keys(result.charges).map((type, index) => {
                    const charge = result.charges[type];
                    return (
                      <motion.div
                        key={type}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <Card sx={{ mb: 2, borderRadius: 2, border: '1px solid #e2e8f0' }}>
                          <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5, flexWrap: 'wrap', gap: 1 }}>
                              <Typography variant="subtitle1" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                                {type === 'eau' && <WaterDrop sx={{ color: '#3b82f6' }} />}
                                {type === 'electricite' && <ElectricBolt sx={{ color: '#f59e0b' }} />}
                                {type === 'entretien' && <TrendingUp sx={{ color: '#10b981' }} />}
                                {type !== 'eau' && type !== 'electricite' && type !== 'entretien' && <Receipt sx={{ color: '#64748b' }} />}
                                {type.charAt(0).toUpperCase() + type.slice(1)}
                              </Typography>
                              <Box sx={{ display: 'flex', gap: 1 }}>
                                <Chip 
                                  label={`Total: ${formatCurrency(charge.montant_total)}`} 
                                  color="primary" 
                                  size="small"
                                  sx={{ fontWeight: 500 }}
                                />
                                <Chip 
                                  label={charge.methode} 
                                  size="small" 
                                  variant="outlined"
                                />
                              </Box>
                            </Box>
                            <Divider sx={{ mb: 1.5 }} />
                            <TableContainer>
                              <Table size="small">
                                <TableHead sx={{ bgcolor: '#f8fafc' }}>
                                  <TableRow>
                                    <TableCell sx={{ fontWeight: 600 }}>Logement</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 600 }}>Montant</TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {charge.details && Object.entries(charge.details).map(([logement, montant]) => (
                                    <TableRow key={logement} hover>
                                      <TableCell>{logement}</TableCell>
                                      <TableCell align="right" sx={{ fontWeight: 500, color: '#2e7d32' }}>
                                        {formatCurrency(montant as number)}
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </TableContainer>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })
                ) : (
                  <Alert severity="info" sx={{ borderRadius: 2 }}>
                    Aucune charge commune trouvée pour cette période
                  </Alert>
                )}
              </Paper>
            </motion.div>
          )}

          {/* Snackbar */}
          <Snackbar 
            open={!!success} 
            autoHideDuration={4000} 
            onClose={() => setSuccess('')} 
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          >
            <Alert severity="success" onClose={() => setSuccess('')} sx={{ borderRadius: 2 }}>
              {success}
            </Alert>
          </Snackbar>
        </Container>
      </Box>

      {/* ============================================================ */}
      {/* MODALE D'AJOUT DE CHARGE COMMUNE */}
      {/* ============================================================ */}
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
            <Add sx={{ color: '#1976d2' }} />
            <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
              Nouvelle charge commune
            </Typography>
          </Box>
          <IconButton size="small" onClick={() => setOpenDialog(false)}>
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, mt: 1 }}>
            {/* Bâtiment */}
            <Autocomplete
              options={batiments}
              loading={loadingBatiments}
              value={batiments.find(b => b.id === chargeForm.batiment_id) || null}
              onChange={(_, newValue) => {
                setChargeForm({ 
                  ...chargeForm, 
                  batiment_id: newValue?.id || '' 
                });
              }}
              getOptionLabel={(option: any) => option.nom || ''}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Bâtiment *"
                  size="small"
                  required
                  helperText={!chargeForm.batiment_id && "Veuillez sélectionner un bâtiment"}
                />
              )}
              renderOption={(props, option: any) => (
                <li {...props} key={option.id}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Apartment sx={{ fontSize: 18, color: '#64748b' }} />
                    <Box>
                      <Typography variant="body2">{option.nom}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {option.adresse || ''}
                      </Typography>
                    </Box>
                  </Box>
                </li>
              )}
              isOptionEqualToValue={(option, value) => option.id === value?.id}
            />

            {/* Type de charge */}
            <FormControl fullWidth size="small">
              <InputLabel>Type de charge *</InputLabel>
              <Select
                value={chargeForm.type_charge}
                label="Type de charge *"
                onChange={(e) => setChargeForm({ ...chargeForm, type_charge: e.target.value })}
              >
                {typesCharge.map((type) => (
                  <MenuItem key={type} value={type.toLowerCase()}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Montant total */}
            <TextField
              fullWidth
              size="small"
              type="number"
              label="Montant total (Ar) *"
              value={chargeForm.montant_total}
              onChange={(e) => setChargeForm({ ...chargeForm, montant_total: Number(e.target.value) })}
              slotProps={{ 
                htmlInput: { min: 0, step: 100 } 
              }}
              helperText="Montant total à répartir entre les logements"
            />

            {/* Méthode de répartition */}
            <FormControl fullWidth size="small">
              <InputLabel>Méthode de répartition *</InputLabel>
              <Select
                value={chargeForm.methode_repartition}
                label="Méthode de répartition *"
                onChange={(e) => setChargeForm({ ...chargeForm, methode_repartition: e.target.value })}
              >
                {methodesRepartition.map((methode) => (
                  <MenuItem key={methode.value} value={methode.value}>
                    {methode.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Mois et Année */}
            <Grid container spacing={2}>
              <Grid size={{ xs: 6 }}>
                <FormControl fullWidth size="small">
                  <InputLabel>Mois *</InputLabel>
                  <Select
                    value={chargeForm.mois}
                    label="Mois *"
                    onChange={(e) => setChargeForm({ ...chargeForm, mois: Number(e.target.value) })}
                  >
                    {moisNoms.map((m, i) => (
                      <MenuItem key={i} value={i + 1}>{m}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 6 }}>
                <TextField
                  fullWidth
                  size="small"
                  type="number"
                  label="Année *"
                  value={chargeForm.annee}
                  onChange={(e) => setChargeForm({ ...chargeForm, annee: Number(e.target.value) })}
                  slotProps={{ htmlInput: { min: 2000, max: 2100 } }}
                />
              </Grid>
            </Grid>

            {/* Notes */}
            <TextField
              fullWidth
              size="small"
              label="Notes (optionnel)"
              multiline
              rows={2}
              value={chargeForm.notes}
              onChange={(e) => setChargeForm({ ...chargeForm, notes: e.target.value })}
              placeholder="Informations complémentaires..."
            />

            {/* Résumé */}
            <Alert severity="info" sx={{ borderRadius: 2 }}>
              <Typography variant="body2">
                <strong>Résumé :</strong> Charge {chargeForm.type_charge || 'non définie'} du{' '}
                {chargeForm.mois ? moisNoms[chargeForm.mois - 1] : '--'} {chargeForm.annee || '--'} -{' '}
                {formatCurrency(chargeForm.montant_total || 0)}
              </Typography>
            </Alert>
          </Box>
        </DialogContent>

        <DialogActions sx={{ 
          px: 3, 
          pb: 3, 
          borderTop: '1px solid #e2e8f0', 
          pt: 2,
          gap: 1
        }}>
          <Button 
            onClick={() => setOpenDialog(false)} 
            variant="outlined" 
            startIcon={<Cancel />}
            sx={{ textTransform: 'none' }}
          >
            Annuler
          </Button>
          <Button 
            variant="contained" 
            onClick={handleSubmitCharge} 
            disabled={submitting}
            startIcon={submitting ? <CircularProgress size={20} /> : <Save />}
            sx={{ textTransform: 'none' }}
          >
            {submitting ? 'Enregistrement...' : 'Enregistrer la charge'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}