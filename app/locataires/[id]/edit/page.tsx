// src/app/locataires/[id]/edit/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Breadcrumbs, Link, Paper, Alert, Button,
  CircularProgress, Toolbar, Container, Avatar, Chip, Fade
} from '@mui/material';
import {
  Home, NavigateNext, Edit, ArrowBack
} from '@mui/icons-material';
import { useRouter, useParams } from 'next/navigation';
import { locataireService } from '@/services/locataireService';
import { Locataire } from '@/types/models';
import LocataireForm from '@/components/locataires/LocataireForm';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';

export default function EditLocatairePage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params?.id) || 0;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [d, setD] = useState<Locataire | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [ok, setOk] = useState('');

  useEffect(() => { if (id) load(); }, [id]);

  const load = async () => {
    try { setLoading(true); setD(await locataireService.getLocataireById(id)); }
    catch (e: any) { setError(e?.response?.data?.detail || 'Erreur'); }
    finally { setLoading(false); }
  };

  const submit = async (data: any) => {
    try {
      setSaving(true); setError('');
      await locataireService.updateLocataire(id, data);
      setOk('Locataire mis à jour !');
      setTimeout(() => router.push(`/locataires/${id}`), 1200);
    } catch (e: any) { setError(e?.response?.data?.detail || 'Erreur'); }
    finally { setSaving(false); }
  };

  return (
    <Box sx={{ display: 'flex', bgcolor: '#f5f7fa', minHeight: '100vh' }}>
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <Box component="main" sx={{ flexGrow: 1, width: { sm: 'calc(100% - 260px)' }, minWidth: 0 }}>
        <Header onMenuClick={() => setMobileOpen(!mobileOpen)} />
        <Toolbar />
        <Container maxWidth="md" sx={{ px: { xs: 2, sm: 3 }, py: 2.5 }}>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
              <CircularProgress size={44} />
            </Box>
          ) : !d ? (
            <Alert severity="warning" action={<Button size="small" onClick={load}>Réessayer</Button>}>
              {error || 'Locataire introuvable'}
            </Alert>
          ) : (
            <Fade in>
              <Box>
                {/* Fil d'Ariane */}
                <Breadcrumbs separator={<NavigateNext sx={{ fontSize: 14 }} />} sx={{ mb: 2 }}>
                  <Link href="/" color="inherit" underline="hover" sx={{ display: 'flex', alignItems: 'center', fontSize: '0.8rem' }}>
                    <Home sx={{ mr: 0.5, fontSize: 16 }} /> Dashboard
                  </Link>
                  <Link href="/locataires" color="inherit" underline="hover" sx={{ fontSize: '0.8rem' }}>Locataires</Link>
                  <Link href={`/locataires/${id}`} color="inherit" underline="hover" sx={{ fontSize: '0.8rem' }}>{d.prenom} {d.nom}</Link>
                  <Typography variant="caption" color="text.primary">Modifier</Typography>
                </Breadcrumbs>

                {/* Alertes */}
                {ok && <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }} onClose={() => setOk('')}>{ok}</Alert>}
                {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }} onClose={() => setError('')}>{error}</Alert>}

                {/* Carte en-tête */}
                <Paper sx={{
                  p: 2.5, mb: 3, borderRadius: 3,
                  background: 'linear-gradient(135deg, #fff 60%, #f0f4ff 100%)',
                  border: '1px solid #e0e7ff',
                  display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap'
                }}>
                  <Avatar sx={{
                    width: 52, height: 52,
                    bgcolor: 'primary.main',
                    background: 'linear-gradient(135deg, #1976d2, #42a5f5)',
                    fontSize: 20, fontWeight: 700, boxShadow: '0 4px 12px rgba(25,118,210,.3)'
                  }}>
                    {d.prenom?.[0]}{d.nom?.[0]}
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                      Modifier : {d.prenom} {d.nom}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, mt: 0.5, flexWrap: 'wrap' }}>
                      <Chip icon={<Edit sx={{ fontSize: 14 }} />} label="Édition" size="small" color="primary" variant="outlined" />
                      <Chip label={`ID: ${d.id}`} size="small" variant="outlined" />
                      <Chip label={d.statut} size="small" color={d.statut === 'actif' ? 'success' : 'default'} />
                    </Box>
                  </Box>
                  <Button size="small" variant="outlined" startIcon={<ArrowBack />} onClick={() => router.push(`/locataires/${id}`)}>
                    Retour
                  </Button>
                </Paper>

                {/* Formulaire */}
                <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid #e8edf2', boxShadow: '0 2px 8px rgba(0,0,0,.04)' }}>
                  <LocataireForm
                    initialData={d}
                    onSubmit={submit}
                    onCancel={() => router.push(`/locataires/${id}`)}
                    loading={saving}
                  />
                </Paper>
              </Box>
            </Fade>
          )}
        </Container>
      </Box>
    </Box>
  );
}