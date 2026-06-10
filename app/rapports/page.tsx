// src/app/rapports/page.tsx
'use client';

import React, { useState } from 'react';
import { Box, Button, Card, CardContent, Typography, Toolbar, Container, Avatar, Grid } from '@mui/material';
import { Assessment, TrendingUp, Home, People, AttachMoney, Description } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';

const rapports = [
  { title: 'Rapports financiers', desc: 'Revenus, dépenses, impayés', icon: <AttachMoney />, color: '#2e7d32', bg: '#e8f5e9', path: '/rapports/financiers' },
  { title: 'Taux d\'occupation', desc: 'Analyse par bâtiment', icon: <Home />, color: '#1565c0', bg: '#e3f2fd', path: '/rapports/occupation' },
  { title: 'Performance locative', desc: 'Top locataires, tendances', icon: <TrendingUp />, color: '#6a1b9a', bg: '#f3e5f5', path: '/rapports/performance' },
  { title: 'Synthèse globale', desc: 'Vue d\'ensemble annuelle', icon: <Assessment />, color: '#f57c00', bg: '#fff3e0', path: '/rapports/synthese' }
];

export default function RapportsPage() {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <Box sx={{ display: 'flex', bgcolor: '#f5f7fa', minHeight: '100vh' }}>
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <Box component="main" sx={{ flexGrow: 1, width: { sm: 'calc(100% - 260px)' }, minWidth: 0 }}>
        <Header onMenuClick={() => setMobileOpen(!mobileOpen)} />
        <Toolbar />
        <Container maxWidth={false} sx={{ px: { xs: 2, sm: 3 }, py: 2.5 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>Rapports</Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: '1fr 1fr 1fr 1fr' }, gap: 2 }}>
            {rapports.map(r => (
              <Card key={r.title} sx={{ bgcolor: r.bg, borderRadius: 3, boxShadow: 'none', border: `1px solid ${r.color}20`, cursor: 'pointer', transition: 'all .25s', '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 8px 25px rgba(0,0,0,.1)' } }} onClick={() => router.push(r.path)}>
                <CardContent sx={{ p: 2.5, textAlign: 'center' }}>
                  <Avatar sx={{ width: 56, height: 56, bgcolor: `${r.color}20`, color: r.color, mx: 'auto', mb: 2 }}>{r.icon}</Avatar>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>{r.title}</Typography>
                  <Typography variant="caption" color="text.secondary">{r.desc}</Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Container>
      </Box>
    </Box>
  );
}