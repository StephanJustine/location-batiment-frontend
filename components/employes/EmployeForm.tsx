// components/employes/EmployeForm.tsx
'use client';

import { useState, useEffect } from 'react';
import {
  Box, Grid, TextField, FormControl, InputLabel, Select,
  MenuItem, Button, Paper, Typography, Divider, Alert,
  CircularProgress, InputAdornment, Chip, Avatar
} from '@mui/material';
import { Person, Phone, Email, Work, AttachMoney, Badge } from '@mui/icons-material';
import { employeService } from '@/services/employeService';
import { batimentService } from '@/services/batimentService';
import { Employe, TypeEmploye, StatutEmploye } from '@/types/employe';
import { useRouter } from 'next/navigation';

interface EmployeFormProps {
  initialData?: Employe;
  isEditing?: boolean;
}

const typeOptions = Object.values(TypeEmploye).map(t => ({ value: t, label: t.replace('_', ' ').toUpperCase() }));
const statutOptions = Object.values(StatutEmploye).map(s => ({ value: s, label: s.replace('_', ' ').toUpperCase() }));

export default function EmployeForm({ initialData, isEditing = false }: EmployeFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [batiments, setBatiments] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    batiment_id: initialData?.batiment_id || '',
    nom: initialData?.nom || '',
    prenom: initialData?.prenom || '',
    cin: initialData?.cin || '',
    type_employe: initialData?.type_employe || TypeEmploye.GARDIEN,
    telephone: initialData?.telephone || '',
    email: initialData?.email || '',
    adresse: initialData?.adresse || '',
    date_embauche: initialData?.date_embauche || '',
    salaire_base: initialData?.salaire_base || 0,
    statut: initialData?.statut || StatutEmploye.ACTIF,
  });

  useEffect(() => {
    fetchBatiments();
  }, []);

  const fetchBatiments = async () => {
    try {
      const data = await batimentService.getAll();
      setBatiments(data);
    } catch (error) {
      console.error('Erreur chargement bâtiments:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const submitData = {
        ...formData,
        batiment_id: Number(formData.batiment_id),
        salaire_base: Number(formData.salaire_base),
      };

      if (isEditing && initialData) {
        await employeService.update(initialData.id, submitData);
      } else {
        await employeService.create(submitData);
      }
      router.push('/employes');
    } catch (err: any) {
      setError(err.message || 'Erreur lors de l\'enregistrement');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper sx={{ p: 3, borderRadius: 2, border: '1px solid #e2e8f0' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Avatar sx={{ bgcolor: '#e8f5e9' }}><Person sx={{ color: '#2e7d32' }} /></Avatar>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>{isEditing ? 'Modifier' : 'Nouvel'} employé</Typography>
          <Typography variant="caption" sx={{ color: '#64748b' }}>Remplissez les informations ci-dessous</Typography>
        </Box>
      </Box>

      {error && <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}

      <form onSubmit={handleSubmit}>
        <Grid container spacing={2.5}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Bâtiment *</InputLabel>
              <Select value={formData.batiment_id} onChange={(e) => setFormData({ ...formData, batiment_id: e.target.value })} label="Bâtiment *" required>
                {batiments.map(b => <MenuItem key={b.id} value={b.id}>{b.nom}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Type *</InputLabel>
              <Select value={formData.type_employe} onChange={(e) => setFormData({ ...formData, type_employe: e.target.value })} label="Type *" required>
                {typeOptions.map(t => <MenuItem key={t.value} value={t.value}>{t.label}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField fullWidth size="small" label="Nom *" value={formData.nom} onChange={(e) => setFormData({ ...formData, nom: e.target.value })} required />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField fullWidth size="small" label="Prénom *" value={formData.prenom} onChange={(e) => setFormData({ ...formData, prenom: e.target.value })} required />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField fullWidth size="small" label="CIN" value={formData.cin} onChange={(e) => setFormData({ ...formData, cin: e.target.value })} />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField fullWidth size="small" type="date" label="Date d'embauche" value={formData.date_embauche} onChange={(e) => setFormData({ ...formData, date_embauche: e.target.value })} slotProps={{ inputLabel: { shrink: true } }} />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField fullWidth size="small" label="Téléphone *" value={formData.telephone} onChange={(e) => setFormData({ ...formData, telephone: e.target.value })} required />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField fullWidth size="small" label="Email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField fullWidth size="small" label="Adresse" value={formData.adresse} onChange={(e) => setFormData({ ...formData, adresse: e.target.value })} />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField fullWidth size="small" type="number" label="Salaire base (Ar)" value={formData.salaire_base} onChange={(e) => setFormData({ ...formData, salaire_base: Number(e.target.value) })} slotProps={{ htmlInput: { min: 0 } }} />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Statut</InputLabel>
              <Select value={formData.statut} onChange={(e) => setFormData({ ...formData, statut: e.target.value })} label="Statut">
                {statutOptions.map(s => <MenuItem key={s.value} value={s.value}>{s.label}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Divider />
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
              <Button variant="text" onClick={() => router.back()} disabled={loading}>Annuler</Button>
              <Button type="submit" variant="contained" disabled={loading} startIcon={loading ? <CircularProgress size={20} /> : null} sx={{ bgcolor: '#2e7d32', '&:hover': { bgcolor: '#1b5e20' } }}>
                {isEditing ? 'Mettre à jour' : 'Créer'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
}