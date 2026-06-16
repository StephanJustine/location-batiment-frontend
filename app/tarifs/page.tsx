'use client';

import { useState, useEffect, JSX } from 'react';
import {
  Box, Container, Typography, Paper, Button, Table,
  TableBody, TableCell, TableContainer, TableHead, TableRow,
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, MenuItem, FormControl, InputLabel, Select,
  Chip, IconButton, CircularProgress, Alert, Snackbar
} from '@mui/material';
import { Add, Edit, Delete, Close, WaterDrop, ElectricBolt } from '@mui/icons-material';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { releveService } from '@/services/releveService';
import { TypeReleve, TarifService } from '@/types/releve';
import { formatDate } from '@/utils/formatters';

export default function TarifsPage() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tarifs, setTarifs] = useState<TarifService[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedTarif, setSelectedTarif] = useState<TarifService | null>(null);
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
    try {
      await releveService.createTarif({
        type_service: formData.type_service,
        tarif: formData.tarif,
        date_debut: formData.date_debut,
        date_fin: formData.date_fin || undefined
      });
      setSuccess('Tarif créé avec succès');
      setOpenDialog(false);
      resetForm();
      fetchTarifs();
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Erreur lors de la création');
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
    setSelectedTarif(null);
  };

  const typeLabels: Record<TypeReleve, { label: string; icon: JSX.Element }> = {
    [TypeReleve.EAU]: { label: 'Eau', icon: <WaterDrop sx={{ fontSize: 14 }} /> },
    [TypeReleve.ELECTRICITE]: { label: 'Électricité', icon: <ElectricBolt sx={{ fontSize: 14 }} /> },
    [TypeReleve.GAZ]: { label: 'Gaz', icon: <ElectricBolt sx={{ fontSize: 14 }} /> },
    [TypeReleve.AUTRE]: { label: 'Autre', icon: <ElectricBolt sx={{ fontSize: 14 }} /> }
  };

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
        <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3 }, py: 2.5 }}>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>Tarifs JIRAMA</Typography>
              <Typography variant="caption" color="text.secondary">
                Gestion des tarifs pour l'eau et l'électricité
              </Typography>
            </Box>
            <Button variant="contained" startIcon={<Add />} onClick={() => setOpenDialog(true)} sx={{ bgcolor: '#059669' }}>
              Nouveau tarif
            </Button>
          </Box>

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
                          <Chip size="small" icon={typeInfo.icon} label={typeInfo.label} sx={{ height: 22 }} />
                        </TableCell>
                        <TableCell sx={{ fontWeight: 600, color: '#059669' }}>{tarif.tarif.toLocaleString()} Ar</TableCell>
                        <TableCell>{formatDate(tarif.date_debut)}</TableCell>
                        <TableCell>{tarif.date_fin ? formatDate(tarif.date_fin) : '-'}</TableCell>
                        <TableCell>
                          <Chip label={tarif.est_actif ? 'Actif' : 'Inactif'} size="small" color={tarif.est_actif ? 'success' : 'default'} />
                        </TableCell>
                        <TableCell align="center">
                          <IconButton size="small" disabled>
                            <Edit fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>

          <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
            <DialogTitle>
              Nouveau tarif
              <IconButton sx={{ position: 'absolute', right: 8, top: 8 }} onClick={() => setOpenDialog(false)}>
                <Close />
              </IconButton>
            </DialogTitle>
            <DialogContent>
              <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <FormControl fullWidth size="small">
                  <InputLabel>Type</InputLabel>
                  <Select
                    value={formData.type_service}
                    label="Type"
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
                  label="Tarif (Ar)"
                  value={formData.tarif}
                  onChange={(e) => setFormData({ ...formData, tarif: Number(e.target.value) })}
                />

                <TextField
                  fullWidth
                  size="small"
                  type="date"
                  label="Date début"
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
                />
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenDialog(false)}>Annuler</Button>
              <Button variant="contained" onClick={handleSubmit} disabled={submitting} sx={{ bgcolor: '#059669' }}>
                {submitting ? 'Création...' : 'Créer'}
              </Button>
            </DialogActions>
          </Dialog>

          <Snackbar open={!!success} autoHideDuration={4000} onClose={() => setSuccess('')}>
            <Alert severity="success">{success}</Alert>
          </Snackbar>
          <Snackbar open={!!error} autoHideDuration={4000} onClose={() => setError('')}>
            <Alert severity="error">{error}</Alert>
          </Snackbar>
        </Container>
      </Box>
    </Box>
  );
}