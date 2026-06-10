// src/app/baux/page.tsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Box, Button, Card, CardContent, Typography, TextField, InputAdornment, MenuItem, IconButton, Tooltip, Pagination, Toolbar, Container, Chip, Avatar, Fade, CircularProgress, Stack } from '@mui/material';
import { Add, Search, Refresh, Description, CheckCircle, Edit, Archive, FilterList } from '@mui/icons-material';
import { bailService } from '@/services/bailService';
import BailCard from '@/components/baux/BailCard';
import { Bail } from '@/types/models';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';

const P = 12;
const statCards = [
  { k: 'total', l: 'Total', i: <Description />, c: '#1565c0', b: '#e3f2fd' },
  { k: 'actifs', l: 'Actifs', i: <CheckCircle />, c: '#2e7d32', b: '#e8f5e9' },
  { k: 'brouillons', l: 'Brouillons', i: <Edit />, c: '#f57c00', b: '#fff3e0' },
  { k: 'termines', l: 'Terminés', i: <Archive />, c: '#616161', b: '#f5f5f5' }
];
const statOpts = [
  { v: '', l: 'Tous', e: '📋' }, { v: 'actif', l: 'Actifs', e: '✅' },
  { v: 'brouillon', l: 'Brouillons', e: '📝' }, { v: 'resilie', l: 'Résiliés', e: '🚫' },
  { v: 'termine', l: 'Terminés', e: '🏁' }, { v: 'expired', l: 'Expirés', e: '⏰' }
];

export default function BauxPage() {
  const r = useRouter();
  const [mo, setMo] = useState(false);
  const [d, setD] = useState<Bail[]>([]);
  const [ld, setLd] = useState(true);
  const [err, setErr] = useState('');
  const [s, setS] = useState('');
  const [st, setSt] = useState('actif');
  const [p, setP] = useState(1);
  const [t, setT] = useState(0);
  const pg = Math.max(1, Math.ceil(t / P));

  const load = useCallback(async () => {
    setLd(true); setErr('');
    try {
      const data = await bailService.getAll({ skip: (p - 1) * P, limit: P, statut: st || undefined, search: s || undefined });
      setD(data); setT(data.length);
    } catch (e: any) { setErr(e?.response?.data?.detail || 'Erreur'); }
    finally { setLd(false); }
  }, [p, st, s]);

  useEffect(() => { load(); }, [load]);

  const stats = { total: t, actifs: d.filter(b => b.statut === 'actif').length, brouillons: d.filter(b => b.statut === 'brouillon').length, termines: d.filter(b => b.statut === 'termine' || b.statut === 'resilie').length };

  return (
    <Box sx={{ display: 'flex', bgcolor: '#f5f7fa', minHeight: '100vh' }}>
      <Sidebar mobileOpen={mo} onClose={() => setMo(false)} />
      <Box component="main" sx={{ flexGrow: 1, width: { sm: 'calc(100% - 260px)' }, minWidth: 0 }}>
        <Header onMenuClick={() => setMo(!mo)} />
        <Toolbar />
        <Container maxWidth={false} sx={{ px: { xs: 2, sm: 3 }, py: 2.5 }}>

          {/* Header */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5, flexWrap: 'wrap', gap: 1 }}>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.2 }}>Baux & Contrats</Typography>
              <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                <Chip label={`${t} résultat(s)`} size="small" variant="outlined" sx={{ fontSize: '0.7rem' }} />
                {pg > 1 && <Typography variant="caption" color="text.secondary">Page {p}/{pg}</Typography>}
              </Stack>
            </Box>
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              <Tooltip title="Actualiser"><IconButton size="small" onClick={load}><Refresh sx={{ fontSize: 18 }} /></IconButton></Tooltip>
              <Button variant="contained" size="small" startIcon={<Add sx={{ fontSize: 18 }} />} onClick={() => r.push('/baux/create')} sx={{ textTransform: 'none', fontWeight: 600, fontSize: '0.8rem', borderRadius: 2, boxShadow: '0 2px 8px rgba(25,118,210,.25)' }}>Nouveau bail</Button>
            </Box>
          </Box>

          {/* Stats */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(4, 1fr)' }, gap: 1.5, mb: 2.5 }}>
            {statCards.map(s => (
              <Card key={s.k} sx={{ bgcolor: s.b, boxShadow: 'none', border: `1px solid ${s.c}20`, borderRadius: 2.5, transition: 'all .2s', '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 4px 12px rgba(0,0,0,.08)' } }}>
                <CardContent sx={{ p: 1.5, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Avatar sx={{ width: 38, height: 38, bgcolor: `${s.c}18`, color: s.c }}>{s.i}</Avatar>
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>{s.l}</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: s.c, lineHeight: 1.2, fontSize: '1.1rem' }}>{(stats as any)[s.k]}</Typography>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>

          {/* Filtres */}
          <Card sx={{ mb: 2.5, boxShadow: 'none', border: '1px solid #e8edf2', borderRadius: 2.5 }}>
            <CardContent sx={{ p: 1.5, display: 'flex', flexWrap: 'wrap', gap: 1.5, alignItems: 'center' }}>
              <TextField size="small" placeholder="Rechercher n° contrat, locataire..." value={s} onChange={e => setS(e.target.value)}
                sx={{ flex: '1 1 300px', minWidth: 220 }}
                slotProps={{ input: { startAdornment: <InputAdornment position="start"><Search sx={{ fontSize: 18, color: 'text.secondary' }} /></InputAdornment> } }}
                onKeyDown={e => { if (e.key === 'Enter') { setP(1); load(); } }} />
              <TextField size="small" select label="Statut" value={st} onChange={e => { setSt(e.target.value); setP(1); }} sx={{ flex: '0 1 160px', minWidth: 140 }}>
                {statOpts.map(o => <MenuItem key={o.v} value={o.v}>{o.e} {o.l}</MenuItem>)}
              </TextField>
              <Button variant="contained" size="small" startIcon={<FilterList sx={{ fontSize: 16 }} />} onClick={() => { setP(1); load(); }} sx={{ textTransform: 'none', fontSize: '0.75rem', borderRadius: 2 }}>Appliquer</Button>
              {(s || st !== 'actif') && <Button size="small" onClick={() => { setS(''); setSt('actif'); setP(1); }} sx={{ textTransform: 'none', fontSize: '0.7rem', color: 'text.secondary' }}>Réinitialiser</Button>}
            </CardContent>
          </Card>

          {/* Contenu */}
          {ld ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress size={36} /></Box>
          ) : err ? (
            <Card sx={{ p: 4, textAlign: 'center', borderRadius: 2.5, border: '1px solid #ffcdd2', bgcolor: '#fff5f5' }}>
              <Typography color="error" sx={{ mb: 1, fontWeight: 500 }}>{err}</Typography>
              <Button size="small" variant="outlined" onClick={load}>Réessayer</Button>
            </Card>
          ) : d.length === 0 ? (
            <Card sx={{ textAlign: 'center', py: 8, borderRadius: 3, border: '1px solid #e8edf2' }}>
              <Description sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
              <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>Aucun bail trouvé</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                {st ? `Aucun bail "${statOpts.find(o => o.v === st)?.l}"` : 'Créez votre premier bail'}
              </Typography>
              <Button variant="contained" size="small" startIcon={<Add />} onClick={() => r.push('/baux/create')} sx={{ textTransform: 'none', borderRadius: 2 }}>Créer un bail</Button>
            </Card>
          ) : (
            <Fade in>
              <Box>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: '1fr 1fr 1fr' }, gap: 2 }}>
                  {d.map(b => <BailCard key={b.id} bail={b} onView={id => r.push(`/baux/${id}`)} onEdit={id => r.push(`/baux/${id}/edit`)} />)}
                </Box>
                {pg > 1 && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <Pagination count={pg} page={p} onChange={(_, v) => setP(v)} size="medium" color="primary" showFirstButton showLastButton />
                  </Box>
                )}
              </Box>
            </Fade>
          )}
        </Container>
      </Box>
    </Box>
  );
}