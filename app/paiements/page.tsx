// src/app/paiements/page.tsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Box, Button, Card, CardContent, Typography, TextField,
  InputAdornment, MenuItem, IconButton, Tooltip, Pagination,
  Toolbar, Container, Chip, Avatar, Fade, CircularProgress
} from '@mui/material';
import { Add, Search, Refresh, AttachMoney, TrendingDown, CheckCircle, Schedule } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';

const statCards = [
  { key: 'total', label: 'Total perçu', icon: <AttachMoney />, color: '#2e7d32', bg: '#e8f5e9' },
  { key: 'impayes', label: 'Impayés', icon: <TrendingDown />, color: '#c62828', bg: '#ffebee' },
  { key: 'payes', label: 'Payés', icon: <CheckCircle />, color: '#1565c0', bg: '#e3f2fd' },
  { key: 'attente', label: 'En attente', icon: <Schedule />, color: '#f57c00', bg: '#fff3e0' }
];

export default function PaiementsPage() {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statut, setStatut] = useState('');
  const [page, setPage] = useState(1);

  return (
    <Box sx={{ display: 'flex', bgcolor: '#f5f7fa', minHeight: '100vh' }}>
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <Box component="main" sx={{ flexGrow: 1, width: { sm: 'calc(100% - 260px)' }, minWidth: 0 }}>
        <Header onMenuClick={() => setMobileOpen(!mobileOpen)} />
        <Toolbar />
        <Container maxWidth={false} sx={{ px: { xs: 2, sm: 3 }, py: 2.5 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2.5 }}>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>Paiements</Typography>
              <Typography variant="caption" color="text.secondary">Gestion des loyers</Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button size="small" variant="outlined" onClick={() => router.push('/paiements/impayes')} sx={{ textTransform: 'none', fontSize: '0.8rem' }}>Impayés</Button>
              <Button variant="contained" size="small" startIcon={<Add />} onClick={() => router.push('/paiements/create')} sx={{ textTransform: 'none', borderRadius: 2 }}>Nouveau</Button>
            </Box>
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(4, 1fr)' }, gap: 1.5, mb: 2.5 }}>
            {statCards.map(s => (
              <Card key={s.key} sx={{ bgcolor: s.bg, boxShadow: 'none', border: `1px solid ${s.color}20`, borderRadius: 2.5 }}>
                <CardContent sx={{ p: 1.5, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Avatar sx={{ width: 38, height: 38, bgcolor: `${s.color}18`, color: s.color }}>{s.icon}</Avatar>
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>{s.label}</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: s.color, fontSize: '1.1rem' }}>0 Ar</Typography>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>

          <Card sx={{ boxShadow: 'none', border: '1px solid #e8edf2', borderRadius: 2, p: 6, textAlign: 'center' }}>
            <AttachMoney sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
            <Typography color="text.secondary">Module en cours de développement</Typography>
            <Button variant="contained" size="small" sx={{ mt: 2 }} onClick={() => router.push('/baux')}>Voir les baux</Button>
          </Card>
        </Container>
      </Box>
    </Box>
  );
}