// src/app/baux/[id]/resilier/page.tsx
'use client';

import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Toolbar, Alert, Breadcrumbs, Link, Paper, Stack, Fade } from '@mui/material';
import { Home, NavigateNext, ArrowBack, Block } from '@mui/icons-material';
import { useRouter, useParams } from 'next/navigation';
import { bailService } from '@/services/bailService';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';

export default function ResilierBailPage() {
  const r = useRouter();
  const params = useParams();
  const id = Number(params?.id) || 0;
  const [mo, setMo] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    date_resiliation: '', motif: '', appreciation_locataire: '',
    retenues_caution: 0, restitution_caution: 0, etat_des_lieux_sortie: '{}'
  });

  const submit = async () => {
    if (!form.date_resiliation || !form.motif) {
      setError('Veuillez remplir la date et le motif');
      return;
    }
    setLoading(true); setError('');
    try {
      await bailService.resilier(id, { ...form, etat_des_lieux_sortie: JSON.parse(form.etat_des_lieux_sortie || '{}') });
      r.push(`/baux/${id}`);
    } catch (e: any) { setError(e?.response?.data?.detail || 'Erreur'); }
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
            <Typography variant="caption" color="error.main">Résilier</Typography>
          </Breadcrumbs>

          <Paper sx={{ p: 2.5, mb: 2, borderRadius: 3, border: '1px solid #ffcdd2', bgcolor: '#fff5f5' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Block sx={{ fontSize: 32, color: 'error.main' }} />
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700, color: 'error.main', fontSize: '1rem' }}>Résilier le bail</Typography>
                <Typography variant="caption" color="text.secondary">Cette action est irréversible</Typography>
              </Box>
            </Box>
          </Paper>

          {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }} onClose={() => setError('')}>{error}</Alert>}

          <Fade in>
            <Paper sx={{ p: 2.5, borderRadius: 3, border: '1px solid #e8edf2', boxShadow: '0 1px 3px rgba(0,0,0,.04)' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField label="Date de résiliation *" type="date" value={form.date_resiliation}
                  onChange={e => setForm({ ...form, date_resiliation: e.target.value })} size="small"
                  slotProps={{ inputLabel: { shrink: true } }} required />
                <TextField label="Motif de résiliation *" value={form.motif}
                  onChange={e => setForm({ ...form, motif: e.target.value })} size="small" multiline rows={3} required />
                <TextField label="Appréciation du locataire" value={form.appreciation_locataire}
                  onChange={e => setForm({ ...form, appreciation_locataire: e.target.value })} size="small" />
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                  <TextField label="Retenues caution (Ar)" type="number" value={form.retenues_caution}
                    onChange={e => setForm({ ...form, retenues_caution: +e.target.value })} size="small" />
                  <TextField label="Reste caution (Ar)" type="number" value={form.restitution_caution}
                    onChange={e => setForm({ ...form, restitution_caution: +e.target.value })} size="small" />
                </Box>
                <TextField label="État des lieux sortie (JSON)" value={form.etat_des_lieux_sortie}
                  onChange={e => setForm({ ...form, etat_des_lieux_sortie: e.target.value })} size="small" multiline rows={3} />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                <Button variant="outlined" startIcon={<ArrowBack sx={{ fontSize: 15 }} />} onClick={() => r.push(`/baux/${id}`)}
                  sx={{ borderRadius: 2, textTransform: 'none', fontSize: '0.7rem' }}>Annuler</Button>
                <Button variant="contained" color="error" onClick={submit} disabled={loading}
                  sx={{ borderRadius: 2, textTransform: 'none', fontSize: '0.7rem', px: 3 }}>
                  {loading ? 'Résiliation...' : 'Résilier le bail'}
                </Button>
              </Box>
            </Paper>
          </Fade>
        </Box>
      </Box>
    </Box>
  );
}