// src/components/paiements/PaiementList.tsx
'use client';

import { useState, useEffect } from 'react';
import {
  Box, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Chip, IconButton, Typography,
  TablePagination, CircularProgress, Alert, Button,
  Card, CardContent, Grid as MuiGrid, Stack
} from '@mui/material';
import { Visibility, PictureAsPdf, Refresh, Receipt } from '@mui/icons-material';
import { Paiement, StatutPaiement } from '@/types/paiement';
import { paiementService } from '@/services/paiementService';
import { formatCurrency } from '@/utils/formatters';

interface Props {
  bailId?: number;
  paiements?: Paiement[];
  loading?: boolean;
  onView?: (paiement: Paiement) => void;
  onRefresh?: () => void;
  variant?: 'table' | 'cards';
}

const statutColors: Record<string, 'success' | 'warning' | 'error' | 'default' | 'info'> = {
  [StatutPaiement.PAYE]: 'success',
  [StatutPaiement.EN_ATTENTE]: 'warning',
  [StatutPaiement.EN_RETARD]: 'error',
  [StatutPaiement.ANNULE]: 'default',
  [StatutPaiement.REMBOURSE]: 'info'
};

const statutLabels: Record<string, string> = {
  [StatutPaiement.PAYE]: 'Payé',
  [StatutPaiement.EN_ATTENTE]: 'En attente',
  [StatutPaiement.EN_RETARD]: 'En retard',
  [StatutPaiement.ANNULE]: 'Annulé',
  [StatutPaiement.REMBOURSE]: 'Remboursé'
};

export default function PaiementList({ 
  bailId, 
  paiements: externalPaiements, 
  loading: externalLoading, 
  onView, 
  onRefresh,
  variant = 'table'
}: Props) {
  const [internalLoading, setInternalLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [internalPaiements, setInternalPaiements] = useState<Paiement[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const isExternalMode = externalPaiements !== undefined;
  const loading = isExternalMode ? (externalLoading || false) : internalLoading;
  const paiements = isExternalMode ? (externalPaiements || []) : internalPaiements;

  const fetchPaiements = async () => {
    if (!bailId || isExternalMode) return;
    
    setInternalLoading(true);
    setError(null);
    
    try {
      const response = await paiementService.getByBail(bailId);
      
      let paiementsData: Paiement[] = [];
      
      // 🔥 Gestion flexible des différents formats de réponse
      if (response && typeof response === 'object') {
        if (Array.isArray(response)) {
          paiementsData = response;
        } else if (response.data && Array.isArray(response.data)) {
          paiementsData = response.data;
        } else if (response.items && Array.isArray(response.items)) {
          paiementsData = response.items;
        } else if (response.results && Array.isArray(response.results)) {
          paiementsData = response.results;
        } else if (response.paiements && Array.isArray(response.paiements)) {
          paiementsData = response.paiements;
        } else {
          // 🔥 Chercher n'importe quelle propriété qui est un tableau
          const arrayKey = Object.keys(response).find(key => Array.isArray(response[key]));
          if (arrayKey && response[arrayKey]) {
            paiementsData = response[arrayKey];
          }
        }
      }
      
      setInternalPaiements(paiementsData);
    } catch (err: any) {
      console.error('Erreur:', err);
      setError(err?.message || 'Erreur de chargement');
      setInternalPaiements([]);
    } finally {
      setInternalLoading(false);
    }
  };

  useEffect(() => {
    if (!isExternalMode && bailId) {
      fetchPaiements();
    }
  }, [bailId, isExternalMode]);

  const handleRefresh = () => {
    if (isExternalMode) {
      onRefresh?.();
    } else {
      fetchPaiements();
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress size={32} />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert 
        severity="error" 
        action={
          <Button color="inherit" size="small" onClick={handleRefresh}>
            Réessayer
          </Button>
        }
      >
        {error}
      </Alert>
    );
  }

  const safePaiements = Array.isArray(paiements) ? paiements : [];
  const paginatedPaiements = safePaiements.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  if (safePaiements.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Receipt sx={{ fontSize: 48, color: 'action.disabled', mb: 1 }} />
        <Typography variant="body2" color="text.secondary">
          Aucun paiement trouvé
        </Typography>
      </Box>
    );
  }

  // Mode Cartes (minimaliste) - 🔥 Correction: Utilisation de Box avec display grid au lieu de Grid
  if (variant === 'cards') {
    return (
      <Box>
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { 
            xs: 'repeat(2, 1fr)', 
            sm: 'repeat(2, 1fr)', 
            md: 'repeat(3, 1fr)',
            lg: 'repeat(4, 1fr)' 
          }, 
          gap: 1.5 
        }}>
          {paginatedPaiements.map((paiement) => (
            <Card key={paiement.id} sx={{ borderRadius: 1.5, border: '1px solid #e8edf2', boxShadow: 'none' }}>
              <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      {paiement.numero_quittance || 'Quittance'}
                    </Typography>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: '0.9rem' }}>
                      {formatCurrency(paiement.montant)}
                    </Typography>
                  </Box>
                  <Chip 
                    label={statutLabels[paiement.statut] || paiement.statut} 
                    size="small"
                    sx={{ height: 20, fontSize: '0.6rem' }}
                    color={statutColors[paiement.statut] || 'default'}
                  />
                </Box>
                
                <Stack spacing={0.5} sx={{ mt: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="caption" color="text.secondary">Échéance:</Typography>
                    <Typography variant="caption">
                      {paiement.date_echeance ? new Date(paiement.date_echeance).toLocaleDateString() : '-'}
                    </Typography>
                  </Box>
                  {paiement.date_paiement && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="caption" color="success.main">Payé le:</Typography>
                      <Typography variant="caption" color="success.main">
                        {new Date(paiement.date_paiement).toLocaleDateString()}
                      </Typography>
                    </Box>
                  )}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="caption" color="text.secondary">Mode:</Typography>
                    <Typography variant="caption">{paiement.mode_paiement || '-'}</Typography>
                  </Box>
                </Stack>

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5, mt: 1 }}>
                  <IconButton size="small" onClick={() => onView?.(paiement)} sx={{ p: 0.5 }}>
                    <Visibility fontSize="small" sx={{ fontSize: 16 }} />
                  </IconButton>
                  {paiement.quittance_pdf_url && (
                    <IconButton size="small" sx={{ p: 0.5 }}>
                      <PictureAsPdf fontSize="small" sx={{ fontSize: 16 }} color="error" />
                    </IconButton>
                  )}
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
        
        {safePaiements.length > rowsPerPage && (
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={safePaiements.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(_, newPage) => setPage(newPage)}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
          />
        )}
      </Box>
    );
  }

  // Mode Tableau
  return (
    <Box>
      <TableContainer component={Paper} sx={{ borderRadius: 1.5 }}>
        <Table size="small">
          <TableHead sx={{ bgcolor: '#f5f5f5' }}>
            <TableRow>
              <TableCell sx={{ py: 1 }}>N° Quittance</TableCell>
              {!bailId && <TableCell sx={{ py: 1 }}>Bail</TableCell>}
              <TableCell sx={{ py: 1 }}>Date échéance</TableCell>
              <TableCell sx={{ py: 1 }}>Date paiement</TableCell>
              <TableCell sx={{ py: 1 }}>Montant</TableCell>
              <TableCell sx={{ py: 1 }}>Mode</TableCell>
              <TableCell sx={{ py: 1 }}>Statut</TableCell>
              <TableCell align="center" sx={{ py: 1 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedPaiements.map((paiement) => (
              <TableRow key={paiement.id} hover>
                <TableCell>{paiement.numero_quittance || '-'}</TableCell>
                {!bailId && (
                  <TableCell>
                    <Button 
                      size="small" 
                      onClick={() => window.location.href = `/baux/${paiement.bail_id}`}
                      sx={{ textTransform: 'none', minWidth: 'auto', p: 0, fontSize: '0.7rem' }}
                    >
                      #{paiement.bail_id}
                    </Button>
                  </TableCell>
                )}
                <TableCell>
                  {paiement.date_echeance ? new Date(paiement.date_echeance).toLocaleDateString() : '-'}
                </TableCell>
                <TableCell>
                  {paiement.date_paiement ? new Date(paiement.date_paiement).toLocaleDateString() : '-'}
                </TableCell>
                <TableCell sx={{ fontWeight: 600 }}>{formatCurrency(paiement.montant)}</TableCell>
                <TableCell>{paiement.mode_paiement || '-'}</TableCell>
                <TableCell>
                  <Chip 
                    label={statutLabels[paiement.statut] || paiement.statut} 
                    size="small"
                    sx={{ height: 22, fontSize: '0.65rem' }}
                    color={statutColors[paiement.statut] || 'default'}
                  />
                </TableCell>
                <TableCell align="center">
                  <IconButton size="small" onClick={() => onView?.(paiement)} sx={{ p: 0.5 }}>
                    <Visibility fontSize="small" sx={{ fontSize: 16 }} />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      
      {safePaiements.length > rowsPerPage && (
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={safePaiements.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
        />
      )}
    </Box>
  );
}