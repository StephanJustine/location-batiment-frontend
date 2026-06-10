// src/app/baux/create/page.tsx
'use client';

import React, { useState } from 'react';
import { Box, Typography, Breadcrumbs, Link, Toolbar, Alert, Paper, Chip, Avatar, Fade } from '@mui/material';
import { Home, NavigateNext, Add, Article } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import BailForm from '@/components/baux/BailForm';
import { bailService } from '@/services/bailService';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';

export default function CreateBailPage() {
  const r = useRouter();
  const [mo, setMo] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [ok, setOk] = useState('');

// Remplacer la gestion d'erreur dans submit par :
const submit = async (data: any) => {
  setLoading(true); setError('');
  try { 
    await bailService.create(data); 
    setOk('Bail créé avec succès !'); 
    setTimeout(() => r.push('/baux'), 1200); 
  }
  catch (e: any) { 
    // 🔥 Extraire le message d'erreur correctement
    const detail = e?.response?.data?.detail;
    let msg = 'Erreur lors de la création';
    if (typeof detail === 'string') msg = detail;
    else if (Array.isArray(detail)) msg = detail.map((d: any) => d.msg || '').join(', ');
    else if (e?.message) msg = e.message;
    setError(msg); 
  }
  finally { setLoading(false); }
};

// Et dans le JSX, convertir en string :
{error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2, py: 0.5 }} onClose={() => setError('')}>{String(error)}</Alert>}

  return (
    <Box sx={{ display: 'flex', bgcolor: '#f5f7fa', minHeight: '100vh' }}>
      <Sidebar mobileOpen={mo} onClose={() => setMo(false)} />
      <Box component="main" sx={{ flexGrow: 1, width: { sm: 'calc(100% - 260px)' }, minWidth: 0 }}>
        <Header onMenuClick={() => setMo(!mo)} />
        <Toolbar />
        <Box sx={{ p: { xs: 2, sm: 2.5 }, maxWidth: 1400, mx: 'auto' }}>

          <Breadcrumbs separator={<NavigateNext sx={{ fontSize: 14 }} />} sx={{ mb: 2 }}>
            <Link href="/" color="inherit" underline="hover" sx={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center' }}>
              <Home sx={{ mr: 0.5, fontSize: 14 }} />Dashboard
            </Link>
            <Link href="/baux" color="inherit" underline="hover" sx={{ fontSize: '0.75rem' }}>Baux</Link>
            <Typography variant="caption" sx={{ color: '#2e7d32', fontWeight: 600 }}>Nouveau</Typography>
          </Breadcrumbs>

          <Paper sx={{ p: 2, mb: 2.5, borderRadius: 3, border: '1px solid #e0e0e0', bgcolor: '#fff' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ width: 44, height: 44, bgcolor: '#2e7d32', fontSize: 20 }}><Add /></Avatar>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1rem', color: '#1a1a1a' }}>Nouveau contrat de bail</Typography>
                <Box sx={{ display: 'flex', gap: 0.8, mt: 0.3 }}>
                  <Chip icon={<Article sx={{ fontSize: 12 }} />} label="Création" size="small" variant="outlined" sx={{ height: 18, fontSize: '0.65rem', color: '#2e7d32', borderColor: '#2e7d32' }} />
                  <Chip label="Brouillon" size="small" sx={{ height: 18, fontSize: '0.65rem', bgcolor: '#f5f5f5', color: '#616161' }} />
                </Box>
              </Box>
            </Box>
          </Paper>

          {ok && <Alert severity="success" sx={{ mb: 2, borderRadius: 2, py: 0.5 }} onClose={() => setOk('')}>{ok}</Alert>}
          {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2, py: 0.5 }} onClose={() => setError('')}>{error}</Alert>}

          <Fade in>
            <Paper sx={{ p: 2.5, borderRadius: 3, border: '1px solid #e0e0e0', bgcolor: '#fff' }}>
              <BailForm onSubmit={submit} onCancel={() => r.push('/baux')} loading={loading} />
            </Paper>
          </Fade>
        </Box>
      </Box>
    </Box>
  );
}