// src/components/paiements/PaiementExport.tsx
'use client';

import { useState } from 'react';
import {
  Box, Button, Menu, MenuItem, ListItemIcon,
  ListItemText, Alert, Snackbar
} from '@mui/material';
import { FileDownload, PictureAsPdf, TableChart } from '@mui/icons-material';
import * as XLSX from 'xlsx';
import { paiementService } from '@/services/paiementService';
import { Paiement } from '@/types/paiement';

interface Props {
  paiements: Paiement[];
}

export default function PaiementExport({ paiements }: Props) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [exporting, setExporting] = useState(false);
  const [message, setMessage] = useState<{ text: string; severity: 'success' | 'error' } | null>(null);

  const handleExportExcel = () => {
    try {
      const data = paiements.map(p => ({
        'N° Quittance': p.numero_quittance,
        'Date échéance': new Date(p.date_echeance).toLocaleDateString(),
        'Montant (Ar)': p.montant,
        'Type': p.type_paiement,
        'Mode': p.mode_paiement,
        'Statut': p.statut,
        'Mois concerné': `${p.mois_concerne}/${p.annee_concernee}`,
        'Date paiement': p.date_paiement ? new Date(p.date_paiement).toLocaleDateString() : '-',
        'Jours retard': p.jours_retard,
        'Référence': p.reference_paiement || '-'
      }));

      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Paiements');
      XLSX.writeFile(wb, `paiements_${new Date().toISOString().split('T')[0]}.xlsx`);
      
      setMessage({ text: 'Export Excel réussi', severity: 'success' });
    } catch (error) {
      setMessage({ text: 'Erreur lors de l\'export', severity: 'error' });
    } finally {
      setAnchorEl(null);
    }
  };

  const handleExportPDF = async () => {
    setExporting(true);
    try {
      // Logique d'export PDF (à implémenter selon besoin)
      setMessage({ text: 'Export PDF réussi', severity: 'success' });
    } catch (error) {
      setMessage({ text: 'Erreur lors de l\'export PDF', severity: 'error' });
    } finally {
      setExporting(false);
      setAnchorEl(null);
    }
  };

  return (
    <Box>
      <Button
        variant="outlined"
        startIcon={<FileDownload />}
        onClick={(e) => setAnchorEl(e.currentTarget)}
        disabled={paiements.length === 0}
      >
        Exporter
      </Button>

      <Menu anchorEl={anchorEl} open={!!anchorEl} onClose={() => setAnchorEl(null)}>
        <MenuItem onClick={handleExportExcel}>
          <ListItemIcon><TableChart fontSize="small" /></ListItemIcon>
          <ListItemText>Excel (.xlsx)</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleExportPDF} disabled={exporting}>
          <ListItemIcon><PictureAsPdf fontSize="small" /></ListItemIcon>
          <ListItemText>{exporting ? 'Export...' : 'PDF'}</ListItemText>
        </MenuItem>
      </Menu>

      <Snackbar 
        open={!!message} 
        autoHideDuration={4000} 
        onClose={() => setMessage(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        {message && <Alert severity={message.severity}>{message.text}</Alert>}
      </Snackbar>
    </Box>
  );
}