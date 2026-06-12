// src/app/paiements/[id]/page.tsx
'use client';

import { useState, useEffect, JSX } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Container, Typography, Box, Card, CardContent,
  Chip, CircularProgress, Button, Toolbar,
  Paper, Tooltip, Alert, Snackbar, IconButton,
  Divider, Stack
} from '@mui/material';
import {
  ArrowBack, PictureAsPdf, Receipt, CheckCircle,
  AttachMoney, Person, Home, CreditCard, Info,
  Download, Print, Email, WhatsApp, Schedule,
  Warning, Close
} from '@mui/icons-material';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { paiementService } from '@/services/paiementService';
import { PaiementDetail, StatutPaiement, TypePaiement, ModePaiement } from '@/types/paiement';
import { formatCurrency, formatDate } from '@/utils/formatters';

const statutConfig: Record<StatutPaiement, { label: string; color: string; bg: string }> = {
  [StatutPaiement.PAYE]: { label: 'Payé', color: '#16a34a', bg: '#f0fdf4' },
  [StatutPaiement.EN_ATTENTE]: { label: 'En attente', color: '#d97706', bg: '#fffbeb' },
  [StatutPaiement.EN_RETARD]: { label: 'En retard', color: '#dc2626', bg: '#fef2f2' },
  [StatutPaiement.ANNULE]: { label: 'Annulé', color: '#6b7280', bg: '#f9fafb' },
  [StatutPaiement.REMBOURSE]: { label: 'Remboursé', color: '#3b82f6', bg: '#eff6ff' }
};

const typeLabels: Record<TypePaiement, string> = {
  [TypePaiement.LOYER]: 'Loyer',
  [TypePaiement.CHARGE]: 'Charges',
  [TypePaiement.CAUTION]: 'Caution',
  [TypePaiement.PENALITE]: 'Pénalités',
  [TypePaiement.REGULARISATION]: 'Régularisation',
  [TypePaiement.AUTRE]: 'Autre'
};

const modeIcons: Record<ModePaiement, { label: string; icon: JSX.Element }> = {
  [ModePaiement.VIREMENT]: { label: 'Virement', icon: <CreditCard sx={{ fontSize: 14 }} /> },
  [ModePaiement.ESPECES]: { label: 'Espèces', icon: <AttachMoney sx={{ fontSize: 14 }} /> },
  [ModePaiement.CHEQUE]: { label: 'Chèque', icon: <Receipt sx={{ fontSize: 14 }} /> },
  [ModePaiement.MVOLA]: { label: 'MVola', icon: <CreditCard sx={{ fontSize: 14 }} /> },
  [ModePaiement.ORANGE_MONEY]: { label: 'Orange Money', icon: <CreditCard sx={{ fontSize: 14 }} /> },
  [ModePaiement.AIRTEL_MONEY]: { label: 'Airtel Money', icon: <CreditCard sx={{ fontSize: 14 }} /> }
};

export default function PaiementDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [paiement, setPaiement] = useState<PaiementDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchData();
  }, [params.id]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await paiementService.getById(Number(params.id));
      setPaiement(data);
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Erreur');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadQuittance = async () => {
    if (!paiement?.id) return;
    try {
      const blob = await paiementService.getQuittancePDF(paiement.id);
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
      URL.revokeObjectURL(url);
      setSuccess('Quittance téléchargée');
    } catch {
      setError('Erreur');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', bgcolor: '#f8fafc', minHeight: '100vh' }}>
        <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
        <Box component="main" sx={{ flexGrow: 1 }}>
          <Header onMenuClick={() => setMobileOpen(!mobileOpen)} />
          <Toolbar />
          <Container sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress size={32} />
          </Container>
        </Box>
      </Box>
    );
  }

  if (error || !paiement) {
    return (
      <Box sx={{ display: 'flex', bgcolor: '#f8fafc', minHeight: '100vh' }}>
        <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
        <Box component="main" sx={{ flexGrow: 1 }}>
          <Header onMenuClick={() => setMobileOpen(!mobileOpen)} />
          <Toolbar />
          <Container sx={{ py: 3 }}>
            <Alert severity="error" onClose={() => setError('')}>{error || 'Non trouvé'}</Alert>
            <Button startIcon={<ArrowBack />} onClick={() => router.back()} sx={{ mt: 2 }}>Retour</Button>
          </Container>
        </Box>
      </Box>
    );
  }

  const statut = statutConfig[paiement.statut] || { label: paiement.statut, color: '#6b7280', bg: '#f9fafb' };
  const modeInfo = modeIcons[paiement.mode_paiement as ModePaiement] || { label: paiement.mode_paiement || '-', icon: <CreditCard sx={{ fontSize: 14 }} /> };

  return (
    <Box sx={{ display: 'flex', bgcolor: '#f8fafc', minHeight: '100vh' }}>
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Header onMenuClick={() => setMobileOpen(!mobileOpen)} />
        <Toolbar />
        <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 }, py: 2 }}>

          {/* Header minimal */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <IconButton onClick={() => router.back()} size="small" sx={{ bgcolor: '#f1f5f9' }}>
              <ArrowBack fontSize="small" />
            </IconButton>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>Détail paiement</Typography>
          </Box>

          {/* Carte principale */}
          <Paper sx={{ p: 2, mb: 2, borderRadius: 2, border: '1px solid #e2e8f0', bgcolor: '#fff' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 1 }}>
              <Box>
                <Typography variant="caption" color="text.secondary">N° Quittance</Typography>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>{paiement.numero_quittance || 'Non généré'}</Typography>
              </Box>
              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="caption" color="text.secondary">Montant</Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#22c55e' }}>
                  {formatCurrency(paiement.montant)}
                </Typography>
              </Box>
            </Box>
            <Box sx={{ mt: 1.5 }}>
              <Chip 
                label={statut.label}
                size="small"
                sx={{ bgcolor: statut.bg, color: statut.color, fontWeight: 500, height: 22, fontSize: '0.7rem' }}
              />
            </Box>
          </Paper>

          {/* Actions */}
          {paiement.quittance_pdf_url && (
            <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap', gap: 1 }}>
              <Button size="small" variant="contained" startIcon={<Download />} onClick={handleDownloadQuittance} sx={{ borderRadius: 1.5, textTransform: 'none', bgcolor: '#22c55e' }}>PDF</Button>
              <Button size="small" variant="outlined" startIcon={<Print />} onClick={() => window.print()} sx={{ borderRadius: 1.5, textTransform: 'none' }}>Imprimer</Button>
              <Button size="small" variant="outlined" startIcon={<Email />} sx={{ borderRadius: 1.5, textTransform: 'none' }}>Email</Button>
            </Stack>
          )}

          {/* Grille info */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2, mb: 2 }}>
            {/* Carte infos générales */}
            <Card sx={{ borderRadius: 1.5, border: '1px solid #e2e8f0', boxShadow: 'none' }}>
              <CardContent sx={{ p: 1.5 }}>
                <Typography variant="caption" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                  <Receipt sx={{ fontSize: 14 }} /> Paiement
                </Typography>
                <Divider sx={{ mb: 1 }} />
                <Stack spacing={0.75}>
                  <InfoRow label="Échéance" value={formatDate(paiement.date_echeance)} />
                  {paiement.date_paiement && <InfoRow label="Payé le" value={formatDate(paiement.date_paiement)} />}
                  <InfoRow label="Type" value={typeLabels[paiement.type_paiement as TypePaiement] || paiement.type_paiement} />
                  <InfoRow label="Mode" value={modeInfo.label} icon={modeInfo.icon} />
                  {paiement.mois_concerne && <InfoRow label="Période" value={`${paiement.mois_concerne}/${paiement.annee_concernee}`} />}
                  {paiement.reference_paiement && <InfoRow label="Référence" value={paiement.reference_paiement} />}
                </Stack>
              </CardContent>
            </Card>

            {/* Carte contrat */}
            <Card sx={{ borderRadius: 1.5, border: '1px solid #e2e8f0', boxShadow: 'none' }}>
              <CardContent sx={{ p: 1.5 }}>
                <Typography variant="caption" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                  <Info sx={{ fontSize: 14 }} /> Contrat
                </Typography>
                <Divider sx={{ mb: 1 }} />
                <Stack spacing={0.75}>
                  <InfoRow label="Bail" value={paiement.bail_numero || '-'} icon={<Home sx={{ fontSize: 14 }} />} />
                  {paiement.locataire_nom && (
                    <InfoRow label="Locataire" value={`${paiement.locataire_nom} ${paiement.locataire_prenom || ''}`} icon={<Person sx={{ fontSize: 14 }} />} />
                  )}
                  {paiement.locataire_telephone && <InfoRow label="Tél" value={paiement.locataire_telephone} />}
                  {paiement.logement_adresse && <InfoRow label="Adresse" value={paiement.logement_adresse} />}
                </Stack>
              </CardContent>
            </Card>
          </Box>

          {/* Pénalités */}
          {(paiement.penalites_appliquees > 0 || paiement.jours_retard > 0) && (
            <Paper sx={{ p: 1.5, mb: 2, borderRadius: 1.5, bgcolor: '#fef2f2', border: '1px solid #fecaca' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                <Warning sx={{ fontSize: 14, color: '#dc2626' }} />
                <Typography variant="caption" sx={{ fontWeight: 600, color: '#dc2626' }}>Retard</Typography>
              </Box>
              <Stack direction="row" spacing={2}>
                {paiement.jours_retard > 0 && (
                  <Box><Typography variant="caption" color="text.secondary">Jours</Typography><Typography variant="body2" sx={{ fontWeight: 600 }}>{paiement.jours_retard} jours</Typography></Box>
                )}
                {paiement.penalites_appliquees > 0 && (
                  <Box><Typography variant="caption" color="text.secondary">Pénalités</Typography><Typography variant="body2" sx={{ fontWeight: 600, color: '#dc2626' }}>{formatCurrency(paiement.penalites_appliquees)}</Typography></Box>
                )}
              </Stack>
            </Paper>
          )}

          {/* Notes */}
          {paiement.notes && (
            <Paper sx={{ p: 1.5, borderRadius: 1.5, bgcolor: '#fffbeb', border: '1px solid #fde68a' }}>
              <Typography variant="caption" sx={{ fontWeight: 600 }}>Notes</Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>{paiement.notes}</Typography>
            </Paper>
          )}
        </Container>

        <Snackbar open={!!success} autoHideDuration={3000} onClose={() => setSuccess('')} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
          <Alert severity="success" onClose={() => setSuccess('')}>{success}</Alert>
        </Snackbar>
        <Snackbar open={!!error} autoHideDuration={3000} onClose={() => setError('')} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
          <Alert severity="error" onClose={() => setError('')}>{error}</Alert>
        </Snackbar>
      </Box>
    </Box>
  );
}

// Composant InfoRow minimal
function InfoRow({ label, value, icon }: { label: string; value: string | number; icon?: JSX.Element }) {
  if (!value) return null;
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Typography variant="caption" sx={{ color: '#64748b', display: 'flex', alignItems: 'center', gap: 0.5 }}>
        {icon}{label}
      </Typography>
      <Typography variant="caption" sx={{ fontWeight: 500, color: '#0f172a', textAlign: 'right' }}>{value}</Typography>
    </Box>
  );
}