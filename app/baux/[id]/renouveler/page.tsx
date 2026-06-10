// src/app/baux/[id]/renouveler/page.tsx
'use client';

import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Toolbar, Alert, Breadcrumbs, Link, Paper, Stack, Fade } from '@mui/material';
import { Home, NavigateNext, ArrowBack, Autorenew } from '@mui/icons-material';
import { useRouter, useParams } from 'next/navigation';
import { bailService } from '@/services/bailService';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';

export default function RenouvelerBailPage() {
  const r = useRouter();
  const params = useParams();
  const id = Number(params?.id) || 0;
  const [mo, setMo] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ nouvelle_date_fin: '', nouveau_loyer: 0, motif: '' });

  const submit = async () => {
    if (!form.nouvelle_date_fin || !form.motif) {
      setError('Veuillez remplir la date et le motif');
      return;
    }
    setLoading(true); setError('');
    try { await bailService.renouveler(id, form); r.push(`/baux/${id}`); }
    catch (e: any) { setError(e?.response?.data?.detail || 'Erreur'); }
    finally { setLoading(false); }
  };

  return (
    <Box sx={{ display: 'flex', bgcolor: '#f5f7fa', minHeight: '100vh' }}>
      <Sidebar mobileOpen={mo} onClose={() => setMo(false)} />
      <Box component="main" sx={{ flexGrow: 1, width: { sm: 'calc(100% - 260px)' }, minWidth: 0 }}>
        <Header onMenuClick={() => setMo(!mo)} />
        <Toolbar />
        <Box sx={{ p: { xs: 2, sm: 2.5 }, maxWidth: 700, mx: 'auto' }}>

          <Breadcrumbs separator={<NavigateNext sx={{ fontSize: 14 }} />} sx={{ mb: 2 }}>
            <Link href="/" color="inherit" underline="hover" sx={{ fontSize: '0.75rem' }}><Home sx={{ mr: 0.5, fontSize: 14 }} />Dashboard</Link>
            <Link href="/baux" color="inherit" underline="hover" sx={{ fontSize: '0.75rem' }}>Baux</Link>
            <Link href={`/baux/${id}`} color="inherit" underline="hover" sx={{ fontSize: '0.75rem' }}>Bail #{id}</Link>
            <Typography variant="caption" color="success.main">Renouveler</Typography>
          </Breadcrumbs>

          <Paper sx={{ p: 2.5, mb: 2, borderRadius: 3, border: '1px solid #c8e6c9', bgcolor: '#e8f5e9' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Autorenew sx={{ fontSize: 32, color: 'success.main' }} />
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700, color: 'success.main', fontSize: '1rem' }}>Renouveler le bail</Typography>
                <Typography variant="caption" color="text.secondary">Prolonger la durée du contrat</Typography>
              </Box>
            </Box>
          </Paper>

          {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }} onClose={() => setError('')}>{error}</Alert>}

          <Fade in>
            <Paper sx={{ p: 2.5, borderRadius: 3, border: '1px solid #e8edf2', boxShadow: '0 1px 3px rgba(0,0,0,.04)' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField label="Nouvelle date de fin *" type="date" value={form.nouvelle_date_fin}
                  onChange={e => setForm({ ...form, nouvelle_date_fin: e.target.value })} size="small"
                  slotProps={{ inputLabel: { shrink: true } }} required />
                <TextField label="Nouveau loyer (Ar)" type="number" value={form.nouveau_loyer}
                  onChange={e => setForm({ ...form, nouveau_loyer: +e.target.value })} size="small"
                  helperText="Laissez 0 pour garder le loyer actuel" />
                <TextField label="Motif de renouvellement *" value={form.motif}
                  onChange={e => setForm({ ...form, motif: e.target.value })} size="small" multiline rows={3} required />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                <Button variant="outlined" startIcon={<ArrowBack sx={{ fontSize: 15 }} />} onClick={() => r.push(`/baux/${id}`)}
                  sx={{ borderRadius: 2, textTransform: 'none', fontSize: '0.7rem' }}>Annuler</Button>
                <Button variant="contained" color="success" onClick={submit} disabled={loading}
                  sx={{ borderRadius: 2, textTransform: 'none', fontSize: '0.7rem', px: 3 }}>
                  {loading ? 'Renouvellement...' : 'Renouveler le bail'}
                </Button>
              </Box>
            </Paper>
          </Fade>
        </Box>
      </Box>
    </Box>
  );
}