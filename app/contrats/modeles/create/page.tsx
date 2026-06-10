// src/app/contrats/modeles/create/page.tsx
'use client';

import React, { useState } from 'react';
import { Box, Typography, Breadcrumbs, Link, Toolbar, Paper, TextField, Button, MenuItem, Alert, Fade, Stack } from '@mui/material';
import { Home, NavigateNext, Save, ArrowBack } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { contratService } from '@/services/contratService';

export default function CreateModelePage() {
  const r = useRouter();
  const [mo, setMo] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    nom: '', type_contrat: 'habitation', description: '', template_html: '',
    variables: '', clauses_par_defaut: '{}', conditions_resiliation: '', est_par_defaut: false
  });

  const submit = async () => {
    setLoading(true); setError('');
    try {
      await contratService.createModele({
        ...form,
        variables: form.variables.split(',').map(v => v.trim()).filter(Boolean),
        clauses_par_defaut: JSON.parse(form.clauses_par_defaut || '{}')
      });
      r.push('/contrats');
    } catch (e: any) { setError(e?.response?.data?.detail || 'Erreur'); }
    finally { setLoading(false); }
  };

  return (
    <Box sx={{ display: 'flex', bgcolor: '#f5f7fa', minHeight: '100vh' }}>
      <Sidebar mobileOpen={mo} onClose={() => setMo(false)} />
      <Box component="main" sx={{ flexGrow: 1, width: { sm: 'calc(100% - 260px)' }, minWidth: 0 }}>
        <Header onMenuClick={() => setMo(!mo)} />
        <Toolbar />
        <Box sx={{ p: { xs: 2, sm: 2.5 }, maxWidth: 900, mx: 'auto' }}>
          <Breadcrumbs separator={<NavigateNext sx={{ fontSize: 14 }} />} sx={{ mb: 2 }}>
            <Link href="/" color="inherit" underline="hover" sx={{ fontSize: '0.75rem' }}><Home sx={{ mr: 0.5, fontSize: 14 }} />Dashboard</Link>
            <Link href="/contrats" color="inherit" underline="hover" sx={{ fontSize: '0.75rem' }}>Contrats</Link>
            <Typography variant="caption">Nouveau modèle</Typography>
          </Breadcrumbs>

          <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>Créer un modèle de contrat</Typography>

          {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }} onClose={() => setError('')}>{error}</Alert>}

          <Fade in>
            <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid #e8edf2' }}>
              <Stack spacing={2}>
                <TextField label="Nom du modèle *" value={form.nom} onChange={e => setForm({ ...form, nom: e.target.value })} size="small" required />
                <TextField label="Type de contrat" select value={form.type_contrat} onChange={e => setForm({ ...form, type_contrat: e.target.value })} size="small">
                  {['habitation','commercial','professionnel','saisonnier'].map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
                </TextField>
                <TextField label="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} size="small" multiline rows={2} />
                <TextField label="Template HTML *" value={form.template_html} onChange={e => setForm({ ...form, template_html: e.target.value })} size="small" multiline rows={8} required />
                <TextField label="Variables (séparées par des virgules)" value={form.variables} onChange={e => setForm({ ...form, variables: e.target.value })} size="small" helperText="Ex: locataire_nom, loyer, date_debut" />
                <TextField label="Clauses par défaut (JSON)" value={form.clauses_par_defaut} onChange={e => setForm({ ...form, clauses_par_defaut: e.target.value })} size="small" multiline rows={3} />
                <TextField label="Conditions de résiliation" value={form.conditions_resiliation} onChange={e => setForm({ ...form, conditions_resiliation: e.target.value })} size="small" multiline rows={2} />
              </Stack>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                <Button variant="outlined" startIcon={<ArrowBack />} onClick={() => r.push('/contrats')} sx={{ borderRadius: 2, textTransform: 'none' }}>Annuler</Button>
                <Button variant="contained" startIcon={<Save />} onClick={submit} disabled={loading || !form.nom || !form.template_html}
                  sx={{ borderRadius: 2, textTransform: 'none' }}>{loading ? 'Création...' : 'Créer le modèle'}</Button>
              </Box>
            </Paper>
          </Fade>
        </Box>
      </Box>
    </Box>
  );
}