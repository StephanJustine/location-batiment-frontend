// src/components/paiements/CautionManagement.tsx
'use client';

import { useState } from 'react';
import {
  Box, Card, CardContent, Typography, TextField,
  Button, Grid, Alert, Dialog, DialogTitle,
  DialogContent, DialogActions, CircularProgress
} from '@mui/material';
import { AccountBalanceWallet, Payment, Refresh } from '@mui/icons-material';
import { paiementService } from '@/services/paiementService';

interface Props {
  bailId: number;
  cautionMontant: number;
  onSuccess?: () => void;
}

export default function CautionManagement({ bailId, cautionMontant, onSuccess }: Props) {
  const [openEncaissement, setOpenEncaissement] = useState(false);
  const [openRestitution, setOpenRestitution] = useState(false);
  const [montant, setMontant] = useState(cautionMontant);
  const [retenues, setRetenues] = useState(0);
  const [motif, setMotif] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleEncaisser = async () => {
    setLoading(true);
    setError('');
    try {
      await paiementService.encaisserCaution(bailId, montant);
      setSuccess('Caution encaissée avec succès');
      setOpenEncaissement(false);
      onSuccess?.();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Erreur lors de l\'encaissement');
    } finally {
      setLoading(false);
    }
  };

  const handleRestituer = async () => {
    setLoading(true);
    setError('');
    try {
      const montantNet = montant - retenues;
      await paiementService.restituerCaution(bailId, montantNet, retenues, motif);
      setSuccess('Caution restituée avec succès');
      setOpenRestitution(false);
      onSuccess?.();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Erreur lors de la restitution');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Card sx={{ borderRadius: 2 }}>
        <CardContent>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
            Gestion de la caution
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#2e7d32', mb: 2 }}>
            {cautionMontant.toLocaleString()} Ar
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              startIcon={<Payment />}
              onClick={() => setOpenEncaissement(true)}
              size="small"
            >
              Encaisser
            </Button>
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={() => setOpenRestitution(true)}
              size="small"
              color="warning"
            >
              Restituer
            </Button>
          </Box>
        </CardContent>
      </Card>

      {success && (
        <Alert severity="success" sx={{ mt: 2 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      {/* Dialog Encaissement */}
      <Dialog open={openEncaissement} onClose={() => setOpenEncaissement(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Encaissement de la caution</DialogTitle>
        <DialogContent>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <TextField
            fullWidth
            label="Montant (Ar)"
            type="number"
            value={montant}
            onChange={(e) => setMontant(Number(e.target.value))}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEncaissement(false)}>Annuler</Button>
          <Button onClick={handleEncaisser} variant="contained" disabled={loading}>
            {loading ? <CircularProgress size={20} /> : 'Encaisser'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog Restitution */}
      <Dialog open={openRestitution} onClose={() => setOpenRestitution(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Restitution de la caution</DialogTitle>
        <DialogContent>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Montant initial (Ar)"
                type="number"
                value={montant}
                onChange={(e) => setMontant(Number(e.target.value))}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Retenues (Ar)"
                type="number"
                value={retenues}
                onChange={(e) => setRetenues(Number(e.target.value))}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Montant net à restituer (Ar)"
                value={(montant - retenues).toLocaleString()}
                disabled
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Motif des retenues"
                multiline
                rows={3}
                value={motif}
                onChange={(e) => setMotif(e.target.value)}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenRestitution(false)}>Annuler</Button>
          <Button onClick={handleRestituer} variant="contained" color="warning" disabled={loading}>
            {loading ? <CircularProgress size={20} /> : 'Restituer'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}