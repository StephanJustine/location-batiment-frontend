// src/app/releves/[id]/page.tsx
'use client';

import { useState, useEffect, JSX } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Box, Container, Typography, Paper, Grid, Card, CardContent,
  Button, Chip, Avatar, Divider, Stack, IconButton,
  CircularProgress, Alert, Snackbar, Tooltip,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle
} from '@mui/material';
import {
  ArrowBack, Edit, Delete, WaterDrop, ElectricBolt,
  TrendingUp, Assessment, Receipt, CheckCircle,
  Warning, Schedule, Visibility, Close, Refresh,
  PictureAsPdf, Print, Download
} from '@mui/icons-material';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { releveService } from '@/services/releveService';
import { logementService } from '@/services/logementService';
import { TypeReleve, StatutReleve, Releve } from '@/types/releve';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { motion } from 'framer-motion';

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

export default function ReleveDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [releve, setReleve] = useState<Releve | null>(null);
  const [logement, setLogement] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState('');
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [calculating, setCalculating] = useState(false);

  useEffect(() => {
    if (id) {
      fetchReleve();
    }
  }, [id]);

  const fetchReleve = async () => {
    setLoading(true);
    try {
      const data = await releveService.getById(id);
      setReleve(data);
      setError(null);
      
      // Charger les infos du logement
      if (data?.logement_id) {
        const logementData = await logementService.getById(data.logement_id);
        setLogement(logementData);
      }
    } catch (err) {
      console.error('Erreur chargement relevé:', err);
      setError('Erreur lors du chargement du relevé');
    } finally {
      setLoading(false);
    }
  };

  const handleCalculerConsommation = async () => {
    if (!releve) return;
    setCalculating(true);
    try {
      const result = await releveService.calculerConsommation(releve.id);
      if (result) {
        setSuccess(`Consommation calculée: ${result.consommation} - ${formatCurrency(result.montant)}`);
        fetchReleve();
      }
    } catch (err) {
      setError('Erreur lors du calcul de la consommation');
    } finally {
      setCalculating(false);
    }
  };

  const handleDelete = async () => {
    try {
      await releveService.deleteReleve(id);
      setSuccess('Relevé supprimé avec succès');
      setTimeout(() => router.push('/releves'), 1500);
    } catch (err) {
      setError('Erreur lors de la suppression');
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

  if (error || !releve) {
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

  const typeInfo = typeLabels[releve.type_releve];
  const statutInfo = statutLabels[releve.statut];
  const consommation = releve.consommation || (releve.index_nouveau - releve.index_ancien);
  const montant = releve.montant;

  return (
    <Box sx={{ display: 'flex', bgcolor: '#f8fafc', minHeight: '100vh' }}>
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Header onMenuClick={() => setMobileOpen(!mobileOpen)} />
        
        <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 }, py: { xs: 2, sm: 2.5 }, mt: { xs: 7, sm: 8 } }}>
          
          {/* En-tête */}
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <IconButton onClick={() => router.push('/releves')} sx={{ bgcolor: '#f1f5f9' }}>
                  <ArrowBack />
                </IconButton>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    Détail du relevé
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {releve.type_releve === TypeReleve.EAU ? 'Relevé d\'eau' : 'Relevé d\'électricité'}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Tooltip title="Recalculer la consommation">
                  <Button 
                    variant="outlined" 
                    startIcon={calculating ? <CircularProgress size={16} /> : <TrendingUp />}
                    onClick={handleCalculerConsommation}
                    disabled={calculating}
                    size="small"
                  >
                    Calculer
                  </Button>
                </Tooltip>
                <Tooltip title="Modifier">
                  <Button variant="outlined" startIcon={<Edit />} onClick={() => router.push(`/releves/${id}/edit`)} size="small">
                    Modifier
                  </Button>
                </Tooltip>
                <Tooltip title="Supprimer">
                  <Button variant="outlined" color="error" startIcon={<Delete />} onClick={() => setOpenDeleteDialog(true)} size="small">
                    Supprimer
                  </Button>
                </Tooltip>
              </Box>
            </Box>
          </Box>

          {/* Carte principale */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Paper sx={{ borderRadius: 2, overflow: 'hidden', mb: 3 }}>
              {/* Header coloré */}
              <Box sx={{ p: 2, bgcolor: typeInfo.bg, borderBottom: `1px solid ${typeInfo.color}20` }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                  <Avatar sx={{ width: 48, height: 48, bgcolor: typeInfo.color, color: '#fff' }}>
                    {typeInfo.icon}
                  </Avatar>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>{typeInfo.label}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {moisNoms[releve.mois - 1]} {releve.annee}
                    </Typography>
                  </Box>
                  <Chip 
                    icon={statutInfo.icon}
                    label={statutInfo.label} 
                    size="small" 
                    sx={{ ml: 'auto', bgcolor: statutInfo.bg, color: statutInfo.color, fontWeight: 500 }} 
                  />
                </Box>
              </Box>

              {/* Contenu */}
              <Box sx={{ p: 3 }}>
                <Grid container spacing={3}>
                  {/* Informations logement */}
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#1976d2', mb: 1.5 }}>
                      Informations du logement
                    </Typography>
                    <Card variant="outlined" sx={{ borderRadius: 2 }}>
                      <CardContent>
                        <Stack spacing={1.5}>
                          <InfoRow label="Logement" value={logement?.numero || `#${releve.logement_id}`} />
                          <InfoRow label="Bâtiment" value={logement?.batiment_nom || '-'} />
                          <InfoRow label="Adresse" value={logement?.adresse || '-'} />
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>

                  {/* Informations relevé */}
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#1976d2', mb: 1.5 }}>
                      Détails du relevé
                    </Typography>
                    <Card variant="outlined" sx={{ borderRadius: 2 }}>
                      <CardContent>
                        <Stack spacing={1.5}>
                          <InfoRow label="Date du relevé" value={formatDate(releve.date_releve)} />
                          <InfoRow label="Index ancien" value={releve.index_ancien} />
                          <InfoRow label="Index nouveau" value={releve.index_nouveau} />
                          <Divider />
                          <InfoRow label="Consommation" value={`${consommation} ${releve.type_releve === TypeReleve.EAU ? 'm³' : 'kWh'}`} bold />
                          <InfoRow label="Tarif unitaire" value={releve.tarif_unitaire ? `${releve.tarif_unitaire} Ar` : '-'} />
                          <InfoRow label="Montant" value={montant ? formatCurrency(montant) : '-'} bold color="#2e7d32" />
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>

                {/* Notes */}
                {releve.notes && (
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#1976d2', mb: 1 }}>
                      Notes
                    </Typography>
                    <Paper variant="outlined" sx={{ p: 2, bgcolor: '#fafafa', borderRadius: 2 }}>
                      <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>{releve.notes}</Typography>
                    </Paper>
                  </Box>
                )}

                {/* Photo */}
                {releve.photo_url && (
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#1976d2', mb: 1 }}>
                      Photo du compteur
                    </Typography>
                    <Box 
                      component="img" 
                      src={releve.photo_url} 
                      alt="Compteur"
                      sx={{ maxWidth: '100%', maxHeight: 300, borderRadius: 2, border: '1px solid #e2e8f0' }}
                    />
                  </Box>
                )}

                {/* Informations de création */}
                <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid #e2e8f0' }}>
                  <Stack direction="row" spacing={2} sx={{ justifyContent: 'space-between', flexWrap: 'wrap' }}>
                    <Typography variant="caption" color="text.secondary">
                      Créé le {formatDate(releve.created_at)}
                    </Typography>
                    {releve.date_facturation && (
                      <Typography variant="caption" color="text.secondary">
                        Facturé le {formatDate(releve.date_facturation)}
                      </Typography>
                    )}
                    {releve.numero_facture && (
                      <Typography variant="caption" color="text.secondary">
                        Facture N°: {releve.numero_facture}
                      </Typography>
                    )}
                  </Stack>
                </Box>
              </Box>
            </Paper>
          </motion.div>

          {/* Historique des consommations */}
          {/* <Card sx={{ borderRadius: 2, border: '1px solid #e2e8f0' }}>
            <CardContent sx={{ p: 2 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: '#1976d2' }}>
                Historique des consommations
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Les statistiques détaillées seront disponibles prochainement
              </Typography>
            </CardContent>
          </Card> */}
        </Container>
      </Box>

      {/* Dialog suppression */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ borderBottom: '1px solid #e2e8f0', pb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>Confirmer la suppression</Typography>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Typography variant="body2">
            Êtes-vous sûr de vouloir supprimer ce relevé ?
            <br />
            Cette action est irréversible.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, borderTop: '1px solid #e2e8f0', pt: 2 }}>
          <Button onClick={() => setOpenDeleteDialog(false)} variant="outlined">Annuler</Button>
          <Button onClick={handleDelete} variant="contained" color="error">
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>

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

// Composant InfoRow
function InfoRow({ label, value, bold, color }: { label: string; value: string | number; bold?: boolean; color?: string }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Typography variant="body2" color="text.secondary">{label}</Typography>
      <Typography variant="body2" sx={{ fontWeight: bold ? 700 : 400, color: color || 'inherit' }}>
        {value}
      </Typography>
    </Box>
  );
}