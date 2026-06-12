// src/components/paiements/PaiementRelance.tsx
'use client';

import { useState, useEffect } from 'react';
import { 
  Box, Button, Card, CardContent, Typography, 
  List, ListItem, ListItemText, Alert, CircularProgress,
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Chip, Divider
} from '@mui/material';
import { NotificationsActive, Send, Warning, Schedule, CheckCircle  } from '@mui/icons-material';
import { paiementService } from '@/services/paiementService';
import { Paiement, StatutPaiement } from '@/types/paiement';

export default function PaiementRelance() {
  const [impayes, setImpayes] = useState<Paiement[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [resultats, setResultats] = useState<any[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedPaiement, setSelectedPaiement] = useState<Paiement | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchImpayes();
  }, []);

  const fetchImpayes = async () => {
    setLoading(true);
    try {
      const data = await paiementService.getImpayes();
      setImpayes(data);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenererRelances = async () => {
    setGenerating(true);
    try {
      const result = await paiementService.genererRelances();
      setResultats(result?.resultats || []);
      await fetchImpayes();
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setGenerating(false);
    }
  };

  const handleEnvoyerRelance = (paiement: Paiement) => {
    setSelectedPaiement(paiement);
    setMessage(`Madame/Monsieur,

Nous vous rappelons que votre paiement de ${paiement.montant.toLocaleString()} Ar pour la période du ${paiement.mois_concerne}/${paiement.annee_concernee} est en retard.

Merci de régulariser votre situation dans les plus brefs délais.

Cordialement.`);
    setOpenDialog(true);
  };

  const getJoursRetard = (dateEcheance: string) => {
    const echeance = new Date(dateEcheance);
    const maintenant = new Date();
    const diff = Math.floor((maintenant.getTime() - echeance.getTime()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress size={32} />
      </Box>
    );
  }

  return (
    <Box>
      {/* Actions */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">Paiements en retard</Typography>
        <Button 
          variant="contained" 
          startIcon={<NotificationsActive />}
          onClick={handleGenererRelances}
          disabled={generating}
        >
          {generating ? 'Génération...' : 'Générer relances auto'}
        </Button>
      </Box>

      {/* Résultats génération */}
      {resultats.length > 0 && (
        <Alert severity="info" sx={{ mb: 2 }} onClose={() => setResultats([])}>
          <Typography variant="subtitle2">Relances générées :</Typography>
          <ul style={{ margin: 0, paddingLeft: 20 }}>
            {resultats.map((r, i) => (
              <li key={i}>Paiement #{r.paiement_id} : {r.action} ({r.jours_retard} jours)</li>
            ))}
          </ul>
        </Alert>
      )}

      {/* Liste des impayés */}
      {impayes.length === 0 ? (
        <Card sx={{ borderRadius: 2 }}>
          <CardContent sx={{ textAlign: 'center', py: 4 }}>
            <CheckCircle sx={{ fontSize: 48, color: '#2e7d32', mb: 1 }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>Aucun impayé</Typography>
            <Typography variant="body2" color="text.secondary">
              Tous les paiements sont à jour
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Card sx={{ borderRadius: 2 }}>
          <List disablePadding>
            {impayes.map((paiement, index) => (
              <Box key={paiement.id}>
                {index > 0 && <Divider />}
                <ListItem
                  sx={{ py: 2 }}
                  secondaryAction={
                    <Button 
                      size="small" 
                      variant="outlined"
                      startIcon={<Send />}
                      onClick={() => handleEnvoyerRelance(paiement)}
                    >
                      Relancer
                    </Button>
                  }
                >
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          {paiement.montant.toLocaleString()} Ar
                        </Typography>
                        <Chip 
                          label={`${getJoursRetard(paiement.date_echeance)} jours de retard`}
                          size="small"
                          color="error"
                          icon={<Schedule />}
                        />
                      </Box>
                    }
                    secondary={
                      <Box sx={{ mt: 0.5 }}>
                        <Typography variant="caption" sx={{ display: 'block' }} color="text.secondary">
                          Échéance : {new Date(paiement.date_echeance).toLocaleDateString()}
                        </Typography>
                        <Typography variant="caption" sx={{ display: 'block' }} color="text.secondary">
                          Période : {paiement.mois_concerne}/{paiement.annee_concernee}
                        </Typography>
                        {paiement.reference_paiement && (
                          <Typography variant="caption" sx={{ display: 'block' }} color="text.secondary">
                            Réf : {paiement.reference_paiement}
                          </Typography>
                        )}
                      </Box>
                    }
                  />
                </ListItem>
              </Box>
            ))}
          </List>
        </Card>
      )}

      {/* Dialog d'envoi de relance */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Warning color="warning" />
            <Typography variant="h6">Envoyer une relance</Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={8}
            label="Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Annuler</Button>
          <Button variant="contained" startIcon={<Send />}>Envoyer</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}