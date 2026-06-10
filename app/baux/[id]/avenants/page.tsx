// src/app/baux/[id]/avenants/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Box, Card, Typography, Chip, Toolbar, CircularProgress, Alert, Paper, Divider, Button, Breadcrumbs, Link, Stack, Fade } from '@mui/material';
import { ArrowBack, Add, Article, NavigateNext, Home } from '@mui/icons-material';
import { useRouter, useParams } from 'next/navigation';
import { bailService } from '@/services/bailService';
import { Avenant } from '@/types/models';
import { formatDate } from '@/utils/formatters';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import AvenantForm from '@/components/baux/AvenantForm';

export default function AvenantsPage() {
  const r = useRouter();
  const params = useParams();
  const id = Number(params?.id) || 0;
  const [mo, setMo] = useState(false);
  const [avenants, setAvenants] = useState<Avenant[]>([]);
  const [ld, setLd] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { if (id) bailService.getAvenants(id).then(setAvenants).finally(() => setLd(false)); }, [id]);

  const handleAdd = async (data: any) => {
    setSaving(true); setError('');
    try {
      await bailService.addAvenant({ ...data, bail_id: id });
      const updated = await bailService.getAvenants(id);
      setAvenants(updated);
      setShowForm(false);
    } catch (e: any) { setError(e?.response?.data?.detail || 'Erreur'); }
    finally { setSaving(false); }
  };

  if (ld) return <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}><CircularProgress size={40} /></Box>;

  return (
    <Box sx={{ display: 'flex', bgcolor: '#f5f7fa', minHeight: '100vh' }}>
      <Sidebar mobileOpen={mo} onClose={() => setMo(false)} />
      <Box component="main" sx={{ flexGrow: 1, width: { sm: 'calc(100% - 260px)' }, minWidth: 0 }}>
        <Header onMenuClick={() => setMo(!mo)} />
        <Toolbar />
        <Box sx={{ p: { xs: 2, sm: 2.5 }, maxWidth: 900, mx: 'auto' }}>

          <Breadcrumbs separator={<NavigateNext sx={{ fontSize: 14 }} />} sx={{ mb: 2 }}>
            <Link href="/" color="inherit" underline="hover" sx={{ fontSize: '0.75rem' }}><Home sx={{ mr: 0.5, fontSize: 14 }} />Dashboard</Link>
            <Link href="/baux" color="inherit" underline="hover" sx={{ fontSize: '0.75rem' }}>Baux</Link>
            <Link href={`/baux/${id}`} color="inherit" underline="hover" sx={{ fontSize: '0.75rem' }}>Bail #{id}</Link>
            <Typography variant="caption">Avenants</Typography>
          </Breadcrumbs>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, fontSize: '1.2rem' }}>Avenants</Typography>
            <Stack direction="row" spacing={0.8}>
              <Button size="small" variant="outlined" startIcon={<ArrowBack sx={{ fontSize: 15 }} />} onClick={() => r.push(`/baux/${id}`)} sx={{ borderRadius: 2, textTransform: 'none', fontSize: '0.7rem' }}>Retour</Button>
              <Button size="small" variant="contained" startIcon={<Add sx={{ fontSize: 15 }} />} onClick={() => setShowForm(!showForm)} sx={{ borderRadius: 2, textTransform: 'none', fontSize: '0.7rem' }}>
                {showForm ? 'Annuler' : 'Nouvel avenant'}
              </Button>
            </Stack>
          </Box>

          {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }} onClose={() => setError('')}>{error}</Alert>}

          <Fade in={showForm}>
            <Box>{showForm && <AvenantForm bailId={id} onSubmit={handleAdd} onCancel={() => setShowForm(false)} loading={saving} />}</Box>
          </Fade>

          {!showForm && (
            avenants.length === 0 ? (
              <Paper sx={{ textAlign: 'center', py: 8, borderRadius: 3, border: '1px solid #e8edf2' }}>
                <Article sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
                <Typography color="text.secondary" sx={{ mb: 2 }}>Aucun avenant pour ce bail</Typography>
                <Button size="small" variant="outlined" startIcon={<Add />} onClick={() => setShowForm(true)} sx={{ borderRadius: 2, textTransform: 'none' }}>
                  Ajouter un avenant
                </Button>
              </Paper>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {avenants.map((a, i) => (
                  <Paper key={i} sx={{ p: 2.5, borderRadius: 2.5, border: '1px solid #e8edf2', boxShadow: '0 1px 3px rgba(0,0,0,.03)' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 1, mb: 1.5 }}>
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: '0.85rem' }}>
                          Avenant #{a.numero_avenant}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">{formatDate(a.date_avenant)}</Typography>
                      </Box>
                      <Chip label={a.type_modification} size="small" color={a.signe ? 'success' : 'warning'} variant="outlined" sx={{ borderRadius: 1.5, fontSize: '0.65rem' }} />
                    </Box>
                    <Divider sx={{ mb: 1.5 }} />
                    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, mb: 1 }}>
                      <Box sx={{ p: 1.5, bgcolor: '#f8fafc', borderRadius: 1.5 }}>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.3 }}>Ancienne valeur</Typography>
                        <Typography variant="body2" sx={{ fontSize: '0.75rem', fontWeight: 500 }}>{JSON.stringify(a.ancienne_valeur)}</Typography>
                      </Box>
                      <Box sx={{ p: 1.5, bgcolor: '#e8f5e9', borderRadius: 1.5 }}>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.3 }}>Nouvelle valeur</Typography>
                        <Typography variant="body2" sx={{ fontSize: '0.75rem', fontWeight: 500 }}>{JSON.stringify(a.nouvelle_valeur)}</Typography>
                      </Box>
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      📅 Effet : {formatDate(a.date_effet)}
                      {a.signe ? ' · ✅ Signé' : ' · ⏳ En attente'}
                    </Typography>
                  </Paper>
                ))}
              </Box>
            )
          )}
        </Box>
      </Box>
    </Box>
  );
}