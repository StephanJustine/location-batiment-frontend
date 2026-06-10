// src/components/baux/ContratPDF.tsx
'use client';

import React from 'react';
import { Box, Button, Typography, Card, CardContent } from '@mui/material';
import { PictureAsPdf, Download } from '@mui/icons-material';

interface Props { bailId: number; pdfUrl?: string; onGenerate: () => void; loading?: boolean; }

export default function ContratPDF({ bailId, pdfUrl, onGenerate, loading }: Props) {
  return (
    <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid #e8edf2', p: 3, textAlign: 'center' }}>
      <PictureAsPdf sx={{ fontSize: 48, color: 'error.main', mb: 1 }} />
      <Typography variant="h6" sx={{ mb: 1 }}>Contrat PDF</Typography>
      {pdfUrl ? (
        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
          <Button variant="outlined" size="small" startIcon={<Download />} href={pdfUrl} target="_blank">Télécharger</Button>
          <Button variant="contained" size="small" onClick={onGenerate} disabled={loading}>Régénérer</Button>
        </Box>
      ) : (
        <Button variant="contained" size="small" onClick={onGenerate} disabled={loading}>{loading ? 'Génération...' : 'Générer le contrat'}</Button>
      )}
    </Card>
  );
}