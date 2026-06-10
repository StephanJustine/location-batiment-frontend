// src/components/baux/ContratSection.tsx - Version finale avec export PDF direct
'use client';

import React, { useState } from 'react';
import { Box, Button, Typography, Avatar, Stack, Card, CardContent, CircularProgress, Alert, Tooltip, IconButton, Dialog } from '@mui/material';
import { PictureAsPdf, Download, Print, Refresh, Visibility, Close } from '@mui/icons-material';
import { contratService } from '@/services/contratService';
import { bailService } from '@/services/bailService';

const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'http://localhost:8000';

interface Props { bailId: number; contratPdfUrl?: string; onGenerate?: () => void; }

export default function ContratSection({ bailId, contratPdfUrl, onGenerate }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [pdfUrl, setPdfUrl] = useState(contratPdfUrl || '');
  const [preview, setPreview] = useState(false);

  const getFullUrl = (url: string) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    return `${API_BASE}${url.startsWith('/') ? '' : '/'}${url}`;
  };

  const handleGenerate = async () => {
    setLoading(true); setError('');
    try {
      const result = await contratService.generer(bailId);
      setPdfUrl(result.pdf_url);
      onGenerate?.();
    } catch (e: any) {
      setError(e?.response?.data?.detail || 'Erreur génération');
    } finally { setLoading(false); }
  };

  // 🔥 Impression directe
  const handlePrint = () => {
    if (!pdfUrl) return;
    const fullUrl = getFullUrl(pdfUrl);
    const printWindow = window.open(fullUrl, '_blank');
    if (printWindow) {
      printWindow.onload = () => {
        printWindow.print();
        // Fermer après impression
        printWindow.onafterprint = () => printWindow.close();
      };
    }
  };

  // 🔥 Téléchargement direct
  const handleDownload = () => {
    if (!pdfUrl) return;
    const fullUrl = getFullUrl(pdfUrl);
    const link = document.createElement('a');
    link.href = fullUrl;
    link.download = `contrat_bail_${bailId}.pdf`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 🔥 Export PDF (téléchargement)
  const handleExport = () => {
    if (!pdfUrl) {
      handleGenerate();
      return;
    }
    handleDownload();
  };

  return (
    <>
      <Card sx={{ borderRadius: 2.5, border: '1px solid #e8edf2', boxShadow: 'none' }}>
        <CardContent sx={{ p: 2.5 }}>
          {error && <Alert severity="error" sx={{ mb: 1.5, py: 0 }} onClose={() => setError('')}>{error}</Alert>}
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Avatar sx={{ width: 48, height: 48, bgcolor: pdfUrl ? '#e8f5e9' : '#fff3e0' }}>
                <PictureAsPdf sx={{ color: pdfUrl ? '#2e7d32' : '#ed6c02' }} />
              </Avatar>
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: '0.85rem' }}>
                  Contrat de bail
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {pdfUrl ? '✅ Contrat généré et prêt' : '⚠️ Contrat non généré'}
                </Typography>
              </Box>
            </Box>

            <Stack direction="row" spacing={0.5}>
              {pdfUrl ? (
                <>
                  <Tooltip title="Aperçu">
                    <IconButton size="small" onClick={() => setPreview(true)}
                      sx={{ border: '1px solid #e0e0e0', borderRadius: 2, width: 34, height: 34 }}>
                      <Visibility sx={{ fontSize: 16 }} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Télécharger PDF">
                    <IconButton size="small" onClick={handleDownload}
                      sx={{ border: '1px solid #e0e0e0', borderRadius: 2, width: 34, height: 34 }}>
                      <Download sx={{ fontSize: 16 }} />
                    </IconButton>
                  </Tooltip>
                  <Button size="small" variant="contained" startIcon={<Print sx={{ fontSize: 15 }} />} onClick={handlePrint}
                    sx={{ borderRadius: 2, textTransform: 'none', fontSize: '0.7rem', bgcolor: '#1565c0' }}>
                    Imprimer
                  </Button>
                  <Button size="small" variant="contained" startIcon={<Download sx={{ fontSize: 15 }} />} onClick={handleExport}
                    sx={{ borderRadius: 2, textTransform: 'none', fontSize: '0.7rem', bgcolor: '#2e7d32' }}>
                    Exporter PDF
                  </Button>
                </>
              ) : (
                <Button size="small" variant="contained" startIcon={loading ? <CircularProgress size={14} color="inherit" /> : <Refresh sx={{ fontSize: 15 }} />}
                  onClick={handleGenerate} disabled={loading}
                  sx={{ borderRadius: 2, textTransform: 'none', fontSize: '0.7rem', bgcolor: '#ed6c02', '&:hover': { bgcolor: '#e65100' } }}>
                  {loading ? 'Génération...' : 'Générer le contrat'}
                </Button>
              )}
            </Stack>
          </Box>

          {!pdfUrl && !loading && (
            <Box sx={{ mt: 1.5, p: 1.5, bgcolor: '#f8fafc', borderRadius: 1.5, border: '1px solid #e8edf2' }}>
              <Typography variant="caption" color="text.secondary">
                📋 Le contrat sera généré au format PDF avec toutes les informations du bail, du logement et du locataire.
                Vous pourrez ensuite le télécharger, l'imprimer ou le partager.
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Aperçu PDF */}
      {preview && pdfUrl && (
        <Dialog open={preview} onClose={() => setPreview(false)} maxWidth="lg" fullWidth>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1.5, bgcolor: '#1a1a1a' }}>
            <Typography variant="body2" sx={{ color: 'white', fontWeight: 600 }}>Aperçu du contrat</Typography>
            <Stack direction="row" spacing={0.5}>
              <IconButton size="small" onClick={handleDownload} sx={{ color: 'white' }} title="Télécharger"><Download sx={{ fontSize: 18 }} /></IconButton>
              <IconButton size="small" onClick={handlePrint} sx={{ color: 'white' }} title="Imprimer"><Print sx={{ fontSize: 18 }} /></IconButton>
              <IconButton size="small" onClick={() => setPreview(false)} sx={{ color: 'white' }}><Close /></IconButton>
            </Stack>
          </Box>
          <iframe src={getFullUrl(pdfUrl)} style={{ width: '100%', height: '80vh', border: 'none' }} />
        </Dialog>
      )}
    </>
  );
}