// src/components/paiements/MonthDetailsDialog.tsx
'use client';

import React from 'react';
import {
  Box, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Chip, IconButton, Typography,
  Dialog, DialogTitle, DialogContent, Tooltip,
  Grid, Avatar, Divider, Stack, Alert
} from '@mui/material';
import { 
  PictureAsPdf, Download, Email, WhatsApp, Close,
  Receipt, Visibility, CheckCircle, Warning, Schedule
} from '@mui/icons-material';
import { PaiementMensuel } from '@/types/paiementGroup';
import { formatCurrency } from '@/utils/formatters';

interface Props {
  open: boolean;
  month: PaiementMensuel | null;
  onClose: () => void;
  onExport?: () => void;
  onRelance?: (type: 'email' | 'sms' | 'both') => void;
  onViewPaiement?: (id: number) => void;
  sending?: boolean;
}

// Fonction safe pour formater la date
const safeFormatDate = (date: string | null | undefined): string => {
  if (!date) return '-';
  try {
    return new Date(date).toLocaleDateString('fr-FR');
  } catch {
    return '-';
  }
};

export default function MonthDetailsDialog({ 
  open, month, onClose, onExport, onRelance, onViewPaiement, sending 
}: Props) {
  if (!month) return null;

  const getStatutInfo = (statut: string) => {
    switch (statut) {
      case 'paye':
        return { label: 'Payé', color: '#4caf50', icon: <CheckCircle sx={{ fontSize: 16 }} /> };
      case 'en_attente':
        return { label: 'En attente', color: '#ff9800', icon: <Schedule sx={{ fontSize: 16 }} /> };
      default:
        return { label: 'En retard', color: '#f44336', icon: <Warning sx={{ fontSize: 16 }} /> };
    }
  };

  const pourcentage = month.montant_du > 0 ? (month.montant_paye / month.montant_du) * 100 : 0;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
          <Typography variant="h6">
            {month.mois_nom} {month.annee}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Tooltip title="Exporter">
              <IconButton onClick={onExport} size="small">
                <Download />
              </IconButton>
            </Tooltip>
            <Tooltip title="Relance email">
              <IconButton onClick={() => onRelance?.('email')} disabled={sending} size="small">
                <Email />
              </IconButton>
            </Tooltip>
            <Tooltip title="Relance SMS">
              <IconButton onClick={() => onRelance?.('sms')} disabled={sending} size="small">
                <WhatsApp />
              </IconButton>
            </Tooltip>
            <Tooltip title="Relance tous">
              <IconButton onClick={() => onRelance?.('both')} disabled={sending} size="small">
                <Receipt />
              </IconButton>
            </Tooltip>
            <IconButton onClick={onClose} size="small">
              <Close />
            </IconButton>
          </Box>
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        {/* Statistiques */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(4, 1fr)' }, gap: 2, mb: 3 }}>
          <Paper sx={{ p: 1.5, textAlign: 'center', bgcolor: '#e3f2fd' }}>
            <Typography variant="caption" color="text.secondary">Total dû</Typography>
            <Typography variant="h6">{formatCurrency(month.montant_du)}</Typography>
          </Paper>
          <Paper sx={{ p: 1.5, textAlign: 'center', bgcolor: '#e8f5e9' }}>
            <Typography variant="caption" color="text.secondary">Total payé</Typography>
            <Typography variant="h6" color="success.main">{formatCurrency(month.montant_paye)}</Typography>
          </Paper>
          <Paper sx={{ p: 1.5, textAlign: 'center', bgcolor: '#ffebee' }}>
            <Typography variant="caption" color="text.secondary">Reste à payer</Typography>
            <Typography variant="h6" color="error.main">{formatCurrency(month.montant_restant)}</Typography>
          </Paper>
          <Paper sx={{ p: 1.5, textAlign: 'center', bgcolor: '#fff3e0' }}>
            <Typography variant="caption" color="text.secondary">Taux paiement</Typography>
            <Typography variant="h6">{Math.round(pourcentage)}%</Typography>
          </Paper>
        </Box>

        {/* Résumé */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, gap: 2, flexWrap: 'wrap' }}>
          <Chip 
            label={`${month.nombre_paiements || month.paiements?.length || 0} paiement(s)`} 
            size="small" 
            color="primary" 
            variant="outlined"
          />
          <Chip 
            label={`${month.nombre_locataires || 0} locataire(s)`} 
            size="small" 
            color="secondary" 
            variant="outlined"
          />
          <Chip 
            label={month.est_complet ? 'Mois complet' : 'Mois incomplet'}
            size="small"
            color={month.est_complet ? 'success' : 'warning'}
          />
        </Box>

        {/* Liste des paiements */}
        {month.paiements && month.paiements.length > 0 ? (
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead sx={{ bgcolor: '#f5f5f5' }}>
                <TableRow>
                  <TableCell>N° Quittance</TableCell>
                  <TableCell>Locataire</TableCell>
                  <TableCell>Logement</TableCell>
                  <TableCell>Date paiement</TableCell>
                  <TableCell>Montant</TableCell>
                  <TableCell>Mode</TableCell>
                  <TableCell>Statut</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {month.paiements.map((paiement) => {
                  const statutInfo = getStatutInfo(paiement.statut);
                  return (
                    <TableRow key={paiement.id} hover>
                      <TableCell>{paiement.numero_quittance || '-'}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Avatar sx={{ width: 24, height: 24, fontSize: '0.7rem' }}>
                            {(paiement.locataire_prenom?.[0] || '')}{(paiement.locataire_nom?.[0] || '')}
                          </Avatar>
                          <Typography variant="body2" noWrap>
                            {paiement.locataire_prenom} {paiement.locataire_nom}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={paiement.logement_numero || '-'} 
                          size="small" 
                          variant="outlined" 
                          sx={{ height: 20, fontSize: '0.65rem' }}
                        />
                      </TableCell>
                      <TableCell>{safeFormatDate(paiement.date_paiement)}</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>{formatCurrency(paiement.montant)}</TableCell>
                      <TableCell>{paiement.mode_paiement || '-'}</TableCell>
                      <TableCell>
                        <Chip 
                          label={statutInfo.label} 
                          size="small"
                          sx={{ height: 22, fontSize: '0.65rem', bgcolor: `${statutInfo.color}20`, color: statutInfo.color }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="Voir le détail">
                          <IconButton size="small" onClick={() => onViewPaiement?.(paiement.id)}>
                            <Visibility fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Télécharger quittance">
                          <IconButton size="small">
                            <PictureAsPdf fontSize="small" color="error" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Receipt sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
            <Typography variant="body2" color="text.secondary">
              Aucun paiement enregistré pour ce mois
            </Typography>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}