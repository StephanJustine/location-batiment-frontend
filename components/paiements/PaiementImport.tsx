// src/components/paiements/PaiementImport.tsx
'use client';

import { useState } from 'react';
import {
  Box, Button, Dialog, DialogTitle, DialogContent,
  DialogActions, Typography, Alert, CircularProgress,
  LinearProgress, Paper
} from '@mui/material';
import { CloudUpload, CheckCircle, Error } from '@mui/icons-material';
import { paiementService } from '@/services/paiementService';
import * as XLSX from 'xlsx';

interface ImportResult {
  success: number;
  errors: number;
  total: number;
  details: Array<{ row: number; error: string }>;
}

export default function PaiementImport({ onSuccess }: { onSuccess?: () => void }) {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [error, setError] = useState('');

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      const extension = selectedFile.name.split('.').pop()?.toLowerCase();
      if (extension === 'xlsx' || extension === 'xls') {
        setFile(selectedFile);
        setError('');
      } else {
        setError('Format non supporté. Utilisez .xlsx ou .xls');
      }
    }
  };

  const handleImport = async () => {
    if (!file) return;
    
    setUploading(true);
    setResult(null);
    setError('');
    
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(sheet);
        
        const results: ImportResult = {
          success: 0,
          errors: 0,
          total: rows.length,
          details: []
        };
        
        for (let i = 0; i < rows.length; i++) {
          const row = rows[i] as any;
          try {
            await paiementService.create({
              bail_id: row.bail_id,
              montant: row.montant,
              date_echeance: new Date(row.date_echeance).toISOString(),
              type_paiement: row.type_paiement,
              mode_paiement: row.mode_paiement,
              mois_concerne: row.mois_concerne,
              annee_concernee: row.annee_concernee,
              reference_paiement: row.reference_paiement,
              notes: row.notes
            });
            results.success++;
          } catch (err) {
            results.errors++;
            results.details.push({ row: i + 2, error: 'Erreur d\'import' });
          }
        }
        
        setResult(results);
        if (results.success > 0) {
          onSuccess?.();
        }
      };
      reader.readAsArrayBuffer(file);
    } catch (err) {
      setError('Erreur lors de l\'import');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Box>
      <Button variant="outlined" startIcon={<CloudUpload />} onClick={() => setOpen(true)} size="small">
        Importer
      </Button>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Importer des paiements (Excel)</DialogTitle>
        <DialogContent>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          
          {result ? (
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                {result.errors === 0 ? (
                  <CheckCircle sx={{ fontSize: 48, color: '#2e7d32' }} />
                ) : result.success > 0 ? (
                  <CheckCircle sx={{ fontSize: 48, color: '#ed6c02' }} />
                ) : (
                  <Error sx={{ fontSize: 48, color: '#d32f2f' }} />
                )}
              </Box>
              <Typography variant="h6">
                {result.success} / {result.total} paiements importés
              </Typography>
              {result.errors > 0 && (
                <Typography color="error" variant="body2">
                  {result.errors} erreurs
                </Typography>
              )}
              {result.details.length > 0 && (
                <Box sx={{ mt: 2, maxHeight: 200, overflow: 'auto' }}>
                  {result.details.map((d, i) => (
                    <Typography key={i} variant="caption" color="error" display="block">
                      Ligne {d.row}: {d.error}
                    </Typography>
                  ))}
                </Box>
              )}
            </Paper>
          ) : (
            <Box sx={{ textAlign: 'center', py: 3 }}>
              <CloudUpload sx={{ fontSize: 48, color: '#9e9e9e', mb: 2 }} />
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Sélectionnez un fichier Excel
              </Typography>
              <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 2 }}>
                Colonnes requises : bail_id, montant, date_echeance, type_paiement, mode_paiement
              </Typography>
              <Button variant="outlined" component="label">
                Choisir un fichier
                <input type="file" hidden accept=".xlsx,.xls" onChange={handleFileSelect} />
              </Button>
              {file && (
                <Typography variant="body2" sx={{ mt: 2 }}>
                  Fichier sélectionné : {file.name}
                </Typography>
              )}
            </Box>
          )}

          {uploading && <LinearProgress sx={{ mt: 2 }} />}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Fermer</Button>
          {!result && file && (
            <Button onClick={handleImport} variant="contained" disabled={uploading}>
              {uploading ? 'Import...' : 'Importer'}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
}