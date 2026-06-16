'use client';

import { useState, useEffect, Fragment, JSX } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box, Container, Typography, Button, Grid,
  CircularProgress, Alert, Chip, IconButton, InputBase, Paper,
  Card, CardContent, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Avatar, Divider, Stack, Tooltip,
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, MenuItem, FormControl, InputLabel, Select,
  Snackbar, Autocomplete
} from '@mui/material';
import {
  Add, Search, WaterDrop, ElectricBolt, TrendingUp,
  Assessment, Close, Refresh, ChevronLeft, ChevronRight,
  Receipt, CheckCircle, Warning, Schedule, Visibility, Home
} from '@mui/icons-material';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { releveService } from '@/services/releveService';
import { logementService } from '@/services/logementService';
import { TypeReleve, StatutReleve, Releve } from '@/types/releve';
import { formatCurrency, formatDate } from '@/utils/formatters';

const typeLabels: Record<TypeReleve, { label: string; icon: JSX.Element; color: string; bg: string }> = {
  [TypeReleve.EAU]: { label: 'Eau', icon: <WaterDrop sx={{ fontSize: 14 }} />, color: '#3b82f6', bg: '#eff6ff' },
  [TypeReleve.ELECTRICITE]: { label: 'Électricité', icon: <ElectricBolt sx={{ fontSize: 14 }} />, color: '#f59e0b', bg: '#fffbeb' },
  [TypeReleve.GAZ]: { label: 'Gaz', icon: <TrendingUp sx={{ fontSize: 14 }} />, color: '#10b981', bg: '#f0fdf4' },
  [TypeReleve.AUTRE]: { label: 'Autre', icon: <Assessment sx={{ fontSize: 14 }} />, color: '#64748b', bg: '#f8fafc' }
};

const statutLabels: Record<StatutReleve, { label: string; color: string; bg: string; icon: JSX.Element }> = {
  [StatutReleve.BROUILLON]: { label: 'Brouillon', color: '#f59e0b', bg: '#fffbeb', icon: <Schedule sx={{ fontSize: 12 }} /> },
  [StatutReleve.VALIDE]: { label: 'Validé', color: '#22c55e', bg: '#f0fdf4', icon: <CheckCircle sx={{ fontSize: 12 }} /> },
  [StatutReleve.FACTURE]: { label: 'Facturé', color: '#3b82f6', bg: '#eff6ff', icon: <Receipt sx={{ fontSize: 12 }} /> },
  [StatutReleve.CONTESTE]: { label: 'Contesté', color: '#ef4444', bg: '#fef2f2', icon: <Warning sx={{ fontSize: 12 }} /> }
};

export default function RelevesPage() {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingLogements, setLoadingLogements] = useState(false);
  const [releves, setReleves] = useState<Releve[]>([]);
  const [logements, setLogements] = useState<any[]>([]);
  const [annee, setAnnee] = useState(new Date().getFullYear());
  const [search, setSearch] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedType, setSelectedType] = useState<TypeReleve | 'all'>('all');
  const [selectedStatut, setSelectedStatut] = useState<StatutReleve | 'all'>('all');
  const [selectedLogement, setSelectedLogement] = useState<any>(null);
  const [formData, setFormData] = useState({
    logement_id: '',
    type_releve: TypeReleve.EAU,
    index_ancien: 0,
    index_nouveau: 0,
    mois: new Date().getMonth() + 1,
    annee: new Date().getFullYear(),
    date_releve: new Date().toISOString().slice(0, 16),
    notes: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');
  const [expandedRow, setExpandedRow] = useState<number | null>(null);

  useEffect(() => {
    fetchData();
    fetchLogements();
  }, [annee]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await releveService.getAll({ annee });
      setReleves(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      console.error('Erreur chargement relevés:', err);
      setError('Erreur lors du chargement des relevés');
    } finally {
      setLoading(false);
    }
  };

  const fetchLogements = async () => {
    setLoadingLogements(true);
    try {
      const data = await logementService.getAll({ limit: 500 });
      setLogements(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Erreur chargement logements:', err);
      setLogements([]);
    } finally {
      setLoadingLogements(false);
    }
  };

  const handleSubmit = async () => {
    if (!formData.logement_id) {
      setError('Veuillez sélectionner un logement');
      return;
    }
    const ancien = Number(formData.index_ancien);
    const nouveau = Number(formData.index_nouveau);
    if (nouveau < ancien) {
      setError('Le nouvel index doit être supérieur à l\'ancien');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        logement_id: Number(formData.logement_id),
        type_releve: formData.type_releve,
        index_ancien: ancien,
        index_nouveau: nouveau,
        mois: Number(formData.mois),
        annee: Number(formData.annee),
        date_releve: new Date(formData.date_releve).toISOString(),
        notes: formData.notes || undefined
      };
      
      await releveService.create(payload);
      setSuccess('Relevé créé avec succès');
      setOpenDialog(false);
      resetForm();
      fetchData();
    } catch (err: any) {
      console.error('Erreur création:', err);
      const errorDetail = err?.response?.data?.detail || err?.message || 'Erreur lors de la création';
      setError(typeof errorDetail === 'string' ? errorDetail : JSON.stringify(errorDetail));
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      logement_id: '',
      type_releve: TypeReleve.EAU,
      index_ancien: 0,
      index_nouveau: 0,
      mois: new Date().getMonth() + 1,
      annee: new Date().getFullYear(),
      date_releve: new Date().toISOString().slice(0, 16),
      notes: ''
    });
    setSelectedLogement(null);
  };

  const getLogementInfo = (logementId: number) => {
    return logements.find(l => l.id === logementId);
  };

  const clearSearch = () => setSearch('');

  const moisNoms = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
  
  const filteredReleves = releves.filter(r => {
    const logement = getLogementInfo(r.logement_id);
    const searchLower = search.toLowerCase();
    const matchSearch = search === '' || 
      logement?.numero?.toLowerCase().includes(searchLower) ||
      r.type_releve.toLowerCase().includes(searchLower) ||
      r.statut.toLowerCase().includes(searchLower);
    const matchType = selectedType === 'all' || r.type_releve === selectedType;
    const matchStatut = selectedStatut === 'all' || r.statut === selectedStatut;
    return r.annee === annee && matchSearch && matchType && matchStatut;
  });

  const totalEau = filteredReleves.filter(r => r.type_releve === TypeReleve.EAU).length;
  const totalElec = filteredReleves.filter(r => r.type_releve === TypeReleve.ELECTRICITE).length;
  const totalMontant = filteredReleves.reduce((sum, r) => sum + (r.montant || 0), 0);
  const totalConsommation = filteredReleves.reduce((sum, r) => sum + (r.consommation || 0), 0);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', bgcolor: '#f8fafc', minHeight: '100vh' }}>
        <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
        <Box component="main" sx={{ flexGrow: 1 }}>
          <Header onMenuClick={() => setMobileOpen(!mobileOpen)} />
          <Container sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress size={40} />
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
        
        <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3 }, py: { xs: 2, sm: 2.5 }, mt: { xs: 7, sm: 8 } }}>
          
          <Box sx={{ mb: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#1a1a1a', mb: 0.5 }}>
              Relevés JIRAMA
            </Typography>
            <Typography variant="body2" sx={{ color: '#757575' }}>
              Gestion des relevés d'eau et d'électricité
            </Typography>
          </Box>

          {/* Stats Cards */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid size={{ xs: 6, sm: 3 }}>
              <Card sx={{ borderRadius: 2, boxShadow: 'none', border: '1px solid #e2e8f0' }}>
                <CardContent sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box sx={{ p: 1, borderRadius: 1, bgcolor: '#eff6ff' }}>
                      <WaterDrop sx={{ color: '#3b82f6', fontSize: 20 }} />
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary">Relevés eau</Typography>
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>{totalEau}</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 6, sm: 3 }}>
              <Card sx={{ borderRadius: 2, boxShadow: 'none', border: '1px solid #e2e8f0' }}>
                <CardContent sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box sx={{ p: 1, borderRadius: 1, bgcolor: '#fffbeb' }}>
                      <ElectricBolt sx={{ color: '#f59e0b', fontSize: 20 }} />
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary">Relevés électricité</Typography>
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>{totalElec}</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 6, sm: 3 }}>
              <Card sx={{ borderRadius: 2, boxShadow: 'none', border: '1px solid #e2e8f0' }}>
                <CardContent sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box sx={{ p: 1, borderRadius: 1, bgcolor: '#f0fdf4' }}>
                      <TrendingUp sx={{ color: '#10b981', fontSize: 20 }} />
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary">Consommation totale</Typography>
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>{totalConsommation.toFixed(0)}</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 6, sm: 3 }}>
              <Card sx={{ borderRadius: 2, boxShadow: 'none', border: '1px solid #e2e8f0' }}>
                <CardContent sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box sx={{ p: 1, borderRadius: 1, bgcolor: '#fef2f2' }}>
                      <Receipt sx={{ color: '#ef4444', fontSize: 20 }} />
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary">Montant total</Typography>
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>{formatCurrency(totalMontant)}</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Search and Filters Bar */}
          <Paper elevation={0} sx={{ p: 2, mb: 3, borderRadius: 2, border: '1px solid #e2e8f0', bgcolor: '#fff' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', flex: 1, position: 'relative' }}>
                <Search sx={{ position: 'absolute', left: 12, color: '#94a3b8', fontSize: 18 }} />
                <InputBase
                  placeholder="Rechercher par logement, type ou statut..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  sx={{ 
                    pl: 4.5, pr: 3, py: 1, width: '100%', fontSize: '0.85rem',
                    bgcolor: '#f8fafc', borderRadius: 2,
                    '& input': { p: 0 }
                  }}
                />
                {search && (
                  <IconButton size="small" onClick={clearSearch} sx={{ position: 'absolute', right: 8 }}>
                    <Close sx={{ fontSize: 16, color: '#94a3b8' }} />
                  </IconButton>
                )}
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <IconButton size="small" onClick={() => setAnnee(annee - 1)} sx={{ bgcolor: '#f1f5f9' }}>
                  <ChevronLeft fontSize="small" />
                </IconButton>
                <Typography variant="body1" sx={{ fontWeight: 600, minWidth: 60, textAlign: 'center' }}>{annee}</Typography>
                <IconButton size="small" onClick={() => setAnnee(annee + 1)} sx={{ bgcolor: '#f1f5f9' }}>
                  <ChevronRight fontSize="small" />
                </IconButton>
              </Box>

              <FormControl size="small" sx={{ minWidth: 130 }}>
                <Select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value as TypeReleve | 'all')}
                  displayEmpty
                >
                  <MenuItem value="all">Tous types</MenuItem>
                  <MenuItem value={TypeReleve.EAU}>Eau</MenuItem>
                  <MenuItem value={TypeReleve.ELECTRICITE}>Électricité</MenuItem>
                </Select>
              </FormControl>

              <FormControl size="small" sx={{ minWidth: 140 }}>
                <Select
                  value={selectedStatut}
                  onChange={(e) => setSelectedStatut(e.target.value as StatutReleve | 'all')}
                  displayEmpty
                >
                  <MenuItem value="all">Tous statuts</MenuItem>
                  <MenuItem value={StatutReleve.BROUILLON}>Brouillon</MenuItem>
                  <MenuItem value={StatutReleve.VALIDE}>Validé</MenuItem>
                  <MenuItem value={StatutReleve.FACTURE}>Facturé</MenuItem>
                  <MenuItem value={StatutReleve.CONTESTE}>Contesté</MenuItem>
                </Select>
              </FormControl>

              <IconButton onClick={fetchData} sx={{ bgcolor: '#f1f5f9' }}>
                <Refresh fontSize="small" />
              </IconButton>

              <Button 
                variant="contained" 
                startIcon={<Add />} 
                onClick={() => setOpenDialog(true)} 
                sx={{ bgcolor: '#1976d2', borderRadius: 1.5, textTransform: 'none', fontSize: '0.75rem', py: 0.8, px: 2 }}
              >
                Nouveau relevé
              </Button>
            </Box>

            {(selectedType !== 'all' || selectedStatut !== 'all') && (
              <Box sx={{ display: 'flex', gap: 1, mt: 1.5, flexWrap: 'wrap' }}>
                {selectedType !== 'all' && (
                  <Chip label={selectedType === TypeReleve.EAU ? 'Eau' : 'Électricité'} size="small" onDelete={() => setSelectedType('all')} />
                )}
                {selectedStatut !== 'all' && (
                  <Chip label={statutLabels[selectedStatut].label} size="small" onDelete={() => setSelectedStatut('all')} />
                )}
              </Box>
            )}
          </Paper>

          {/* Error Alert */}
          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }} onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          {/* Tableau des relevés */}
          {filteredReleves.length === 0 ? (
            <Paper sx={{ textAlign: 'center', py: 6, borderRadius: 2 }}>
              <WaterDrop sx={{ fontSize: 48, color: '#cbd5e1', mb: 1 }} />
              <Typography variant="body1" sx={{ color: '#64748b', mb: 1 }}>
                {search || selectedType !== 'all' || selectedStatut !== 'all' 
                  ? 'Aucun résultat ne correspond à vos critères'
                  : `Aucun relevé pour l'année ${annee}`}
              </Typography>
              <Button 
                variant="contained" 
                startIcon={<Add />} 
                onClick={() => setOpenDialog(true)} 
                sx={{ bgcolor: '#1976d2', mt: 1 }}
              >
                Ajouter un relevé
              </Button>
            </Paper>
          ) : (
            <TableContainer component={Paper} sx={{ borderRadius: 2, overflow: 'hidden', border: '1px solid #e2e8f0' }}>
              <Table size="small">
                <TableHead sx={{ bgcolor: '#f8fafc' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>Logement</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Période</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Consommation</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Montant</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Statut</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 600 }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredReleves.map((releve) => {
                    const typeInfo = typeLabels[releve.type_releve];
                    const statutInfo = statutLabels[releve.statut];
                    const logement = getLogementInfo(releve.logement_id);
                    
                    return (
                      <TableRow 
                        key={releve.id} 
                        hover 
                        sx={{ cursor: 'pointer' }}
                        onClick={() => router.push(`/releves/${releve.id}`)}
                      >
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Avatar sx={{ width: 28, height: 28, bgcolor: '#e2e8f0', fontSize: '0.7rem' }}>
                              {logement?.numero?.[0] || 'L'}
                            </Avatar>
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                              {logement?.numero || `#${releve.logement_id}`}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip size="small" icon={typeInfo.icon} label={typeInfo.label} sx={{ height: 22, bgcolor: typeInfo.bg, color: typeInfo.color }} />
                        </TableCell>
                        <TableCell>
                          {moisNoms[releve.mois - 1]} {releve.annee}
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {(releve.consommation || 0).toFixed(2)} {releve.type_releve === TypeReleve.EAU ? 'm³' : 'kWh'}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ fontWeight: 600, color: '#2e7d32' }}>
                          {formatCurrency(releve.montant || 0)}
                        </TableCell>
                        <TableCell>
                          <Chip 
                            icon={statutInfo.icon}
                            label={statutInfo.label} 
                            size="small" 
                            sx={{ height: 22, bgcolor: statutInfo.bg, color: statutInfo.color }} 
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Tooltip title="Voir les détails et statistiques">
                            <IconButton 
                              size="small" 
                              onClick={(e) => {
                                e.stopPropagation();
                                router.push(`/releves/${releve.id}`);
                              }}
                              sx={{ color: '#1976d2' }}
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
          )}
        </Container>
      </Box>

      {/* Dialog création relevé */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ borderBottom: '1px solid #e2e8f0', pb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>Nouveau relevé</Typography>
            <IconButton size="small" onClick={() => setOpenDialog(false)}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, mt: 1 }}>
            <Autocomplete
              options={logements}
              loading={loadingLogements}
              value={selectedLogement}
              onChange={(_, newValue) => {
                setSelectedLogement(newValue);
                setFormData({ ...formData, logement_id: newValue?.id || '' });
              }}
              getOptionLabel={(option: any) => `${option.numero} - ${option.batiment_nom || option.adresse || ''}`}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Logement *"
                  size="small"
                  required
                  error={!formData.logement_id}
                  helperText={!formData.logement_id && "Veuillez sélectionner un logement"}
                />
              )}
              renderOption={(props, option: any) => (
                <li {...props} key={option.id}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, width: '100%' }}>
                    <Avatar src={option.photos?.[0]} sx={{ width: 32, height: 32, borderRadius: 1 }}>
                      <Home sx={{ fontSize: 16 }} />
                    </Avatar>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {option.numero} - {option.batiment_nom || 'Sans bâtiment'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {option.surface ? `${option.surface} m² - ` : ''}
                        {option.adresse || ''}
                      </Typography>
                    </Box>
                  </Box>
                </li>
              )}
              isOptionEqualToValue={(option, value) => option.id === value?.id}
              size="small"
            />

            <FormControl fullWidth size="small">
              <InputLabel>Type *</InputLabel>
              <Select
                value={formData.type_releve}
                label="Type *"
                onChange={(e) => setFormData({ ...formData, type_releve: e.target.value as TypeReleve })}
              >
                <MenuItem value={TypeReleve.EAU}>Eau</MenuItem>
                <MenuItem value={TypeReleve.ELECTRICITE}>Électricité</MenuItem>
              </Select>
            </FormControl>

            <Grid container spacing={2}>
              <Grid size={{ xs: 6 }}>
                <TextField
                  fullWidth
                  size="small"
                  type="number"
                  label="Index ancien *"
                  value={formData.index_ancien}
                  onChange={(e) => setFormData({ ...formData, index_ancien: Number(e.target.value) })}
                />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <TextField
                  fullWidth
                  size="small"
                  type="number"
                  label="Index nouveau *"
                  value={formData.index_nouveau}
                  onChange={(e) => setFormData({ ...formData, index_nouveau: Number(e.target.value) })}
                />
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid size={{ xs: 6 }}>
                <FormControl fullWidth size="small">
                  <InputLabel>Mois *</InputLabel>
                  <Select
                    value={formData.mois}
                    label="Mois *"
                    onChange={(e) => setFormData({ ...formData, mois: Number(e.target.value) })}
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
                  value={formData.annee}
                  onChange={(e) => setFormData({ ...formData, annee: Number(e.target.value) })}
                />
              </Grid>
            </Grid>

            <TextField
              fullWidth
              size="small"
              type="datetime-local"
              label="Date du relevé *"
              value={formData.date_releve}
              onChange={(e) => setFormData({ ...formData, date_releve: e.target.value })}
              slotProps={{ inputLabel: { shrink: true } }}
            />

            <TextField
              fullWidth
              size="small"
              label="Notes"
              multiline
              rows={2}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Observations particulières..."
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, borderTop: '1px solid #e2e8f0', pt: 2 }}>
          <Button onClick={() => setOpenDialog(false)} variant="outlined">Annuler</Button>
          <Button variant="contained" onClick={handleSubmit} disabled={submitting} sx={{ bgcolor: '#1976d2' }}>
            {submitting ? 'Création...' : 'Créer le relevé'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar open={!!success} autoHideDuration={4000} onClose={() => setSuccess('')} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity="success" sx={{ borderRadius: 2 }}>{success}</Alert>
      </Snackbar>
    </Box>
  );
}