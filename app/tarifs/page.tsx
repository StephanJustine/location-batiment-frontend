'use client';

import { useState, useEffect, JSX } from 'react';
import {
  Box, Container, Typography, Paper, Button, Table,
  TableBody, TableCell, TableContainer, TableHead, TableRow,
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, MenuItem, FormControl, InputLabel, Select,
  Chip, IconButton, CircularProgress, Alert, Snackbar, Grid,
  Card, CardContent, Stack
} from '@mui/material';
import { Add, Edit, Delete, Close, WaterDrop, ElectricBolt, TrendingUp } from '@mui/icons-material';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { releveService } from '@/services/releveService';
import { TypeReleve, TarifService } from '@/types/releve';
import { formatDate, formatCurrency } from '@/utils/formatters';

const typeLabels: Record<TypeReleve, { label: string; icon: JSX.Element; color: string; bg: string }> = {
  [TypeReleve.EAU]: { label: 'Eau', icon: <WaterDrop sx={{ fontSize: 14 }} />, color: '#3b82f6', bg: '#eff6ff' },
  [TypeReleve.ELECTRICITE]: { label: 'Électricité', icon: <ElectricBolt sx={{ fontSize: 14 }} />, color: '#f59e0b', bg: '#fffbeb' },
  [TypeReleve.GAZ]: { label: 'Gaz', icon: <TrendingUp sx={{ fontSize: 14 }} />, color: '#10b981', bg: '#f0fdf4' },
  [TypeReleve.AUTRE]: { label: 'Autre', icon: <TrendingUp sx={{ fontSize: 14 }} />, color: '#64748b', bg: '#f8fafc' }
};

export default function TarifsPage() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tarifs, setTarifs] = useState<TarifService[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    type_service: TypeReleve.EAU,
    tarif: 0,
    date_debut: new Date().toISOString().split('T')[0],
    date_fin: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTarifs();
  }, []);

  const fetchTarifs = async () => {
    setLoading(true);
    try {
      const data = await releveService.getTarifs();
      setTarifs(data);
    } catch (err) {
      setError('Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (formData.tarif <= 0) {
      setError('Le tarif doit être supérieur à 0');
      return;
    }
    
    setSubmitting(true);
    setError('');
    
    try {
      // Créer les dates avec le format attendu par le backend
      // Le backend attend un datetime complet (YYYY-MM-DDTHH:mm:ss)
      const dateDebut = new Date(formData.date_debut);
      dateDebut.setHours(0, 0, 0, 0);
      
      let dateFin: Date | undefined = undefined;
      if (formData.date_fin) {
        dateFin = new Date(formData.date_fin);
        dateFin.setHours(23, 59, 59, 999);
      }

      await releveService.createTarif({
        type_service: formData.type_service,
        tarif: formData.tarif,
        date_debut: dateDebut,
        date_fin: dateFin
      });
      
      setSuccess('Tarif créé avec succès');
      setOpenDialog(false);
      resetForm();
      fetchTarifs();
    } catch (err: any) {
      console.error('Erreur création tarif:', err);
      const errorMessage = err?.response?.data?.detail || err?.message || 'Erreur lors de la création';
      setError(typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage));
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      type_service: TypeReleve.EAU,
      tarif: 0,
      date_debut: new Date().toISOString().split('T')[0],
      date_fin: ''
    });
  };

  // Statistiques
  const tarifsActifs = tarifs.filter(t => t.est_actif);
  const tarifsEau = tarifs.filter(t => t.type_service === TypeReleve.EAU && t.est_actif);
  const tarifsElec = tarifs.filter(t => t.type_service === TypeReleve.ELECTRICITE && t.est_actif);

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
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>Tarifs JIRAMA</Typography>
              <Typography variant="caption" color="text.secondary">
                Gestion des tarifs pour l'eau et l'électricité
              </Typography>
            </Box>
            <Button variant="contained" startIcon={<Add />} onClick={() => setOpenDialog(true)} sx={{ bgcolor: '#059669', textTransform: 'none' }}>
              Nouveau tarif
            </Button>
          </Box>

          {/* Stats Cards */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid size={{ xs: 6, sm: 3 }}>
              <Card sx={{ borderRadius: 2, boxShadow: 'none', border: '1px solid #e2e8f0' }}>
                <CardContent sx={{ p: 2 }}>
                  <Typography variant="caption" color="text.secondary">Total tarifs</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>{tarifs.length}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 6, sm: 3 }}>
              <Card sx={{ borderRadius: 2, boxShadow: 'none', border: '1px solid #e2e8f0' }}>
                <CardContent sx={{ p: 2 }}>
                  <Typography variant="caption" color="text.secondary">Tarifs actifs</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#059669' }}>{tarifsActifs.length}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 6, sm: 3 }}>
              <Card sx={{ borderRadius: 2, boxShadow: 'none', border: '1px solid #e2e8f0' }}>
                <CardContent sx={{ p: 2 }}>
                  <Typography variant="caption" color="text.secondary">Tarifs eau actifs</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#3b82f6' }}>{tarifsEau.length}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 6, sm: 3 }}>
              <Card sx={{ borderRadius: 2, boxShadow: 'none', border: '1px solid #e2e8f0' }}>
                <CardContent sx={{ p: 2 }}>
                  <Typography variant="caption" color="text.secondary">Tarifs électricité actifs</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#f59e0b' }}>{tarifsElec.length}</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Paper sx={{ borderRadius: 2, overflow: 'hidden', border: '1px solid #e2e8f0' }}>
            <TableContainer>
              <Table size="small">
                <TableHead sx={{ bgcolor: '#f8fafc' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Tarif (Ar)</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Date début</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Date fin</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Statut</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 600 }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tarifs.map((tarif) => {
                    const typeInfo = typeLabels[tarif.type_service];
                    return (
                      <TableRow key={tarif.id} hover>
                        <TableCell>
                          <Chip 
                            size="small" 
                            icon={typeInfo.icon} 
                            label={typeInfo.label} 
                            sx={{ height: 22, bgcolor: typeInfo.bg, color: typeInfo.color }} 
                          />
                        </TableCell>
                        <TableCell sx={{ fontWeight: 600, color: '#059669' }}>
                          {formatCurrency(tarif.tarif)}
                        </TableCell>
                        <TableCell>{formatDate(tarif.date_debut)}</TableCell>
                        <TableCell>{tarif.date_fin ? formatDate(tarif.date_fin) : '-'}</TableCell>
                        <TableCell>
                          <Chip 
                            label={tarif.est_actif ? 'Actif' : 'Inactif'} 
                            size="small" 
                            color={tarif.est_actif ? 'success' : 'default'} 
                            sx={{ height: 22 }}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Stack direction="row" spacing={0.5} sx={{ justifyContent: 'center' }}>
                            <IconButton size="small" disabled>
                              <Edit fontSize="small" />
                            </IconButton>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>

          {/* Dialog création */}
          <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ borderBottom: '1px solid #e2e8f0', pb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
                  Nouveau tarif
                </Typography>
                <IconButton size="small" onClick={() => setOpenDialog(false)}>
                  <Close />
                </IconButton>
              </Box>
            </DialogTitle>
            <DialogContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, mt: 1 }}>
                <FormControl fullWidth size="small">
                  <InputLabel>Type *</InputLabel>
                  <Select
                    value={formData.type_service}
                    label="Type *"
                    onChange={(e) => setFormData({ ...formData, type_service: e.target.value as TypeReleve })}
                  >
                    <MenuItem value={TypeReleve.EAU}>Eau</MenuItem>
                    <MenuItem value={TypeReleve.ELECTRICITE}>Électricité</MenuItem>
                  </Select>
                </FormControl>

                <TextField
                  fullWidth
                  size="small"
                  type="number"
                  label="Tarif (Ar) *"
                  value={formData.tarif}
                  onChange={(e) => setFormData({ ...formData, tarif: Number(e.target.value) })}
                  slotProps={{ 
                    htmlInput: { min: 0, step: 100 } 
                  }}
                />

                <TextField
                  fullWidth
                  size="small"
                  type="date"
                  label="Date début *"
                  value={formData.date_debut}
                  onChange={(e) => setFormData({ ...formData, date_debut: e.target.value })}
                  slotProps={{ inputLabel: { shrink: true } }}
                />

                <TextField
                  fullWidth
                  size="small"
                  type="date"
                  label="Date fin (optionnel)"
                  value={formData.date_fin}
                  onChange={(e) => setFormData({ ...formData, date_fin: e.target.value })}
                  slotProps={{ inputLabel: { shrink: true } }}
                  helperText="Laisser vide si le tarif est toujours valide"
                />
              </Box>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 3, borderTop: '1px solid #e2e8f0', pt: 2 }}>
              <Button onClick={() => setOpenDialog(false)} variant="outlined" sx={{ textTransform: 'none' }}>
                Annuler
              </Button>
              <Button 
                variant="contained" 
                onClick={handleSubmit} 
                disabled={submitting} 
                sx={{ bgcolor: '#059669', textTransform: 'none' }}
              >
                {submitting ? 'Création...' : 'Créer le tarif'}
              </Button>
            </DialogActions>
          </Dialog>

          <Snackbar 
            open={!!success} 
            autoHideDuration={4000} 
            onClose={() => setSuccess('')} 
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          >
            <Alert severity="success" sx={{ borderRadius: 2 }}>{success}</Alert>
          </Snackbar>
          
          <Snackbar 
            open={!!error} 
            autoHideDuration={6000} 
            onClose={() => setError('')} 
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          >
            <Alert severity="error" sx={{ borderRadius: 2 }}>{error}</Alert>
          </Snackbar>
        </Container>
      </Box>
    </Box>
  );
}