// src/app/baux/[id]/edit/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Box, Typography, Breadcrumbs, Link, Toolbar, CircularProgress, Alert, Paper, Avatar, Chip, Stack, Fade, Button } from '@mui/material';
import { Home, NavigateNext, Edit, ArrowBack, Article } from '@mui/icons-material';
import { useRouter, useParams } from 'next/navigation';
import BailForm from '@/components/baux/BailForm';
import { bailService } from '@/services/bailService';
import { Bail } from '@/types/models';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';

const cfg: Record<string, any> = {
  actif: { c: 'success', bg: '#43a047', l: 'Actif' },
  brouillon: { c: 'warning', bg: '#f57c00', l: 'Brouillon' },
  resilie: { c: 'error', bg: '#e53935', l: 'Résilié' },
  termine: { c: 'default', bg: '#757575', l: 'Terminé' }
};

export default function EditBailPage() {
  const r = useRouter();
  const params = useParams();
  const id = Number(params?.id) || 0;
  const [mo, setMo] = useState(false);
  const [d, setD] = useState<Bail | null>(null);
  const [ld, setLd] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [ok, setOk] = useState('');

  useEffect(() => { if (id) bailService.getById(id).then(setD).finally(() => setLd(false)); }, [id]);

  const submit = async (data: any) => {
    setSaving(true); setError('');
    try { await bailService.update(id, data); setOk('Bail mis à jour !'); setTimeout(() => r.push(`/baux/${id}`), 1200); }
    catch (e: any) { setError(e?.response?.data?.detail || 'Erreur'); }
    finally { setSaving(false); }
  };

  if (ld) return <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}><CircularProgress size={40} /></Box>;
  if (!d) return <Box sx={{ p: 3 }}><Alert severity="warning">Bail introuvable</Alert></Box>;

  const s = cfg[d.statut] || cfg.termine;

  return (
    <Box sx={{ display: 'flex', bgcolor: '#f5f7fa', minHeight: '100vh' }}>
      <Sidebar mobileOpen={mo} onClose={() => setMo(false)} />
      <Box component="main" sx={{ flexGrow: 1, width: { sm: 'calc(100% - 260px)' }, minWidth: 0 }}>
        <Header onMenuClick={() => setMo(!mo)} />
        <Toolbar />
        <Box sx={{ p: { xs: 2, sm: 2.5 }, maxWidth: 1400, mx: 'auto' }}>

          {/* Fil d'Ariane */}
          <Breadcrumbs separator={<NavigateNext sx={{ fontSize: 14 }} />} sx={{ mb: 2 }}>
            <Link href="/" color="inherit" underline="hover" sx={{ fontSize: '0.75rem' }}>Dashboard</Link>
            <Link href="/baux" color="inherit" underline="hover" sx={{ fontSize: '0.75rem' }}>Baux</Link>
            <Link href={`/baux/${id}`} color="inherit" underline="hover" sx={{ fontSize: '0.75rem' }}>{d.numero_contrat}</Link>
            <Typography variant="caption" color="text.primary">Modifier</Typography>
          </Breadcrumbs>

          {/* En-tête compact */}
          <Paper sx={{ p: 2, mb: 2.5, borderRadius: 3, border: '1px solid #e8edf2', background: 'linear-gradient(135deg, #fff 0%, #fafbfc 100%)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ width: 44, height: 44, bgcolor: s.bg, fontSize: 18 }}><Article /></Avatar>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1rem', lineHeight: 1.2 }}>{d.numero_contrat}</Typography>
                <Box sx={{ display: 'flex', gap: 0.8, mt: 0.3, flexWrap: 'wrap' }}>
                  <Chip label={s.l} color={s.c} size="small" sx={{ height: 18, fontSize: '0.65rem', borderRadius: 1.5 }} />
                  <Chip label={d.type_bail} size="small" variant="outlined" sx={{ height: 18, fontSize: '0.65rem', borderRadius: 1.5 }} />
                  <Chip icon={<Edit sx={{ fontSize: 12 }} />} label="Édition" size="small" variant="outlined" sx={{ height: 18, fontSize: '0.65rem', borderRadius: 1.5 }} />
                </Box>
              </Box>
            </Box>
            <Button size="small" variant="outlined" startIcon={<ArrowBack sx={{ fontSize: 15 }} />} onClick={() => r.push(`/baux/${id}`)} sx={{ borderRadius: 2, textTransform: 'none', fontSize: '0.7rem' }}>
              Retour
            </Button>
          </Paper>

          {/* Messages */}
          {ok && <Alert severity="success" sx={{ mb: 2, borderRadius: 2, py: 0.5 }} onClose={() => setOk('')}>{ok}</Alert>}
          {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2, py: 0.5 }} onClose={() => setError('')}>{error}</Alert>}

          {/* Formulaire */}
          <Fade in>
            <Paper sx={{ p: 2.5, borderRadius: 3, border: '1px solid #e8edf2', boxShadow: '0 1px 3px rgba(0,0,0,.04)' }}>
              <BailForm initialData={d} onSubmit={submit} onCancel={() => r.push(`/baux/${id}`)} loading={saving} />
            </Paper>
          </Fade>
        </Box>
      </Box>
    </Box>
  );
}