// src/app/releves/[id]/edit/page.tsx
'use client';

import { useState, useEffect, JSX } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Box, Container, Typography, Button, Grid,
  CircularProgress, Alert, Chip, Paper,
  TextField, MenuItem, FormControl, InputLabel, Select,
  Snackbar, Autocomplete, Avatar,
  IconButton
} from '@mui/material';
import {
  ArrowBack, Save, WaterDrop, ElectricBolt, Home, Close
} from '@mui/icons-material';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { releveService } from '@/services/releveService';
import { logementService } from '@/services/logementService';
import { TypeReleve, StatutReleve, Releve } from '@/types/releve';
import { formatDate } from '@/utils/formatters';
import { motion } from 'framer-motion';

const typeLabels: Record<TypeReleve, { label: string; icon: JSX.Element; color: string }> = {
  [TypeReleve.EAU]: { label: 'Eau', icon: <WaterDrop sx={{ fontSize: 14 }} />, color: '#3b82f6' },
  [TypeReleve.ELECTRICITE]: { label: 'Électricité', icon: <ElectricBolt sx={{ fontSize: 14 }} />, color: '#f59e0b' },
  [TypeReleve.GAZ]: { label: 'Gaz', icon: <WaterDrop sx={{ fontSize: 14 }} />, color: '#10b981' },
  [TypeReleve.AUTRE]: { label: 'Autre', icon: <WaterDrop sx={{ fontSize: 14 }} />, color: '#64748b' }
};

const statutOptions = [
  { value: StatutReleve.BROUILLON, label: 'Brouillon' },
  { value: StatutReleve.VALIDE, label: 'Validé' },
  { value: StatutReleve.FACTURE, label: 'Facturé' },
  { value: StatutReleve.CONTESTE, label: 'Contesté' }
];

export default function ReleveEditPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [releve, setReleve] = useState<Releve | null>(null);
  const [logements, setLogements] = useState<any[]>([]);
  const [loadingLogements, setLoadingLogements] = useState(false);
  const [selectedLogement, setSelectedLogement] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    logement_id: '',
    type_releve: TypeReleve.EAU,
    index_ancien: 0,
    index_nouveau: 0,
    mois: new Date().getMonth() + 1,
    annee: new Date().getFullYear(),
    date_releve: '',
    statut: StatutReleve.BROUILLON,
    notes: ''
  });

  useEffect(() => {
    if (id) {
      fetchReleve();
      fetchLogements();
    }
  }, [id]);

  const fetchReleve = async () => {
    setLoading(true);
    try {
      const data = await releveService.getById(id);
      setReleve(data);
      
      // Remplir le formulaire avec les données existantes
      setFormData({
        logement_id: data.logement_id.toString(),
        type_releve: data.type_releve,
        index_ancien: data.index_ancien,
        index_nouveau: data.index_nouveau,
        mois: data.mois,
        annee: data.annee,
        date_releve: data.date_releve.slice(0, 16),
        statut: data.statut,
        notes: data.notes || ''
      });
      
      setError(null);
    } catch (err) {
      console.error('Erreur chargement relevé:', err);
      setError('Erreur lors du chargement du relevé');
    } finally {
      setLoading(false);
    }
  };

  const fetchLogements = async () => {
    setLoadingLogements(true);
    try {
      const data = await logementService.getDisponibles();
      const logementsData = Array.isArray(data) ? data : (data as any)?.items || (data as any)?.data || [];
      setLogements(logementsData);
      
      // Sélectionner le logement actuel
      if (releve?.logement_id) {
        const currentLogement = logementsData.find((l: any) => l.id === releve.logement_id);
        setSelectedLogement(currentLogement);
      }
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
        index_nouveau: nouveau,
        statut: formData.statut,
        notes: formData.notes || undefined
      };
      
      await releveService.update(id, payload);
      setSuccess('Relevé modifié avec succès');
      setTimeout(() => router.push(`/releves/${id}`), 1500);
    } catch (err: any) {
      console.error('Erreur modification:', err);
      const errorDetail = err?.response?.data?.detail || err?.message || 'Erreur lors de la modification';
      setError(typeof errorDetail === 'string' ? errorDetail : JSON.stringify(errorDetail));
    } finally {
      setSubmitting(false);
    }
  };

  const moisNoms = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

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

  if (error && !releve) {
    return (
      <Box sx={{ display: 'flex', bgcolor: '#f8fafc', minHeight: '100vh' }}>
        <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
        <Box component="main" sx={{ flexGrow: 1 }}>
          <Header onMenuClick={() => setMobileOpen(!mobileOpen)} />
          <Container sx={{ py: 3 }}>
            <Alert severity="error" sx={{ mb: 2 }}>{error || 'Relevé non trouvé'}</Alert>
            <Button startIcon={<ArrowBack />} onClick={() => router.push('/releves')}>Retour à la liste</Button>
          </Container>
        </Box>
      </Box>
    );
  }

  const typeInfo = releve ? typeLabels[releve.type_releve] : typeLabels[TypeReleve.EAU];

  return (
    <Box sx={{ display: 'flex', bgcolor: '#f8fafc', minHeight: '100vh' }}>
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Header onMenuClick={() => setMobileOpen(!mobileOpen)} />
        
        <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 }, py: { xs: 2, sm: 2.5 }, mt: { xs: 7, sm: 8 } }}>
          
          {/* En-tête */}
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <IconButton onClick={() => router.push(`/releves/${id}`)} sx={{ bgcolor: '#f1f5f9' }}>
                <ArrowBack />
              </IconButton>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  Modifier le relevé
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {releve?.type_releve === TypeReleve.EAU ? 'Relevé d\'eau' : 'Relevé d\'électricité'} - {releve && `${moisNoms[releve.mois - 1]} ${releve.annee}`}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Formulaire */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Paper sx={{ p: 3, borderRadius: 2 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {/* Type - Lecture seule */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, bgcolor: '#f8fafc', borderRadius: 2 }}>
                  <Avatar sx={{ bgcolor: typeInfo.color, color: '#fff', width: 40, height: 40 }}>
                    {typeInfo.icon}
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">Type de relevé</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>{typeInfo.label}</Typography>
                  </Box>
                  <Chip 
                    label={`${moisNoms[releve!.mois - 1]} ${releve!.annee}`}
                    size="small"
                    sx={{ ml: 'auto' }}
                  />
                </Box>

                {/* Logement - Lecture seule */}
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: '#1976d2' }}>Logement</Typography>
                  <Paper variant="outlined" sx={{ p: 2, bgcolor: '#fafafa' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Avatar sx={{ width: 32, height: 32, bgcolor: '#e2e8f0' }}>
                        <Home sx={{ fontSize: 16 }} />
                      </Avatar>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {selectedLogement?.numero || `#${releve?.logement_id}`}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {selectedLogement?.batiment_nom || 'Bâtiment non spécifié'}
                        </Typography>
                      </Box>
                    </Box>
                  </Paper>
                </Box>

                {/* Index - Lecture seule */}
                <Grid container spacing={2}>
                  <Grid size={{ xs: 6 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: '#1976d2' }}>Index ancien</Typography>
                    <Paper variant="outlined" sx={{ p: 2, bgcolor: '#fafafa' }}>
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>{releve?.index_ancien}</Typography>
                    </Paper>
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: '#1976d2' }}>Index nouveau</Typography>
                    <TextField
                      fullWidth
                      type="number"
                      value={formData.index_nouveau}
                      onChange={(e) => setFormData({ ...formData, index_nouveau: Number(e.target.value) })}
                      size="small"
                    />
                  </Grid>
                </Grid>

                {/* Date du relevé - Lecture seule */}
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: '#1976d2' }}>Date du relevé</Typography>
                  <Paper variant="outlined" sx={{ p: 2, bgcolor: '#fafafa' }}>
                    <Typography variant="body2">{formatDate(releve!.date_releve)}</Typography>
                  </Paper>
                </Box>

                {/* Statut */}
                <FormControl fullWidth size="small">
                  <InputLabel>Statut</InputLabel>
                  <Select
                    value={formData.statut}
                    label="Statut"
                    onChange={(e) => setFormData({ ...formData, statut: e.target.value as StatutReleve })}
                  >
                    {statutOptions.map((opt) => (
                      <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {/* Notes */}
                <TextField
                  fullWidth
                  label="Notes"
                  multiline
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Observations particulières..."
                />

                {/* Consommation calculée */}
                {(releve?.consommation || (formData.index_nouveau - formData.index_ancien)) > 0 && (
                  <Box sx={{ p: 2, bgcolor: '#f0fdf4', borderRadius: 2, border: '1px solid #dcfce7' }}>
                    <Typography variant="caption" color="text.secondary">Consommation calculée</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#059669' }}>
                      {(formData.index_nouveau - formData.index_ancien)} {releve?.type_releve === TypeReleve.EAU ? 'm³' : 'kWh'}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Paper>
          </motion.div>

          {/* Actions */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, mt: 3 }}>
            <Button 
              onClick={() => router.push(`/releves/${id}`)} 
              variant="outlined" 
              startIcon={<ArrowBack />}
              sx={{ borderRadius: 2, textTransform: 'none', px: 3 }}
            >
              Annuler
            </Button>
            <Button 
              type="submit" 
              variant="contained" 
              startIcon={submitting ? <CircularProgress size={20} /> : <Save />}
              onClick={handleSubmit}
              disabled={submitting}
              sx={{ borderRadius: 2, textTransform: 'none', px: 4, bgcolor: '#1976d2' }}
            >
              {submitting ? 'Enregistrement...' : 'Enregistrer les modifications'}
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Snackbar */}
      <Snackbar open={!!success} autoHideDuration={4000} onClose={() => setSuccess('')} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity="success" sx={{ borderRadius: 2 }}>{success}</Alert>
      </Snackbar>
      <Snackbar open={!!error} autoHideDuration={4000} onClose={() => setError(null)} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity="error" sx={{ borderRadius: 2 }}>{error}</Alert>
      </Snackbar>
    </Box>
  );
}