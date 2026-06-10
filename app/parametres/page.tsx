// src/app/parametres/page.tsx
'use client';

import React, { useState } from 'react';
import { Box, Card, CardContent, Typography, Toolbar, Container, Avatar, List, ListItem, ListItemIcon, ListItemText, Divider } from '@mui/material';
import { Person, People, Settings, AttachMoney, Notifications, Security, Palette } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';

const settings = [
  { title: 'Mon profil', desc: 'Informations personnelles', icon: <Person />, path: '/parametres/profil', color: '#1976d2' },
  { title: 'Utilisateurs', desc: 'Gestion des comptes', icon: <People />, path: '/parametres/utilisateurs', color: '#388e3c' },
  { title: 'Général', desc: 'Configuration système', icon: <Settings />, path: '/parametres/general', color: '#f57c00' },
  { title: 'Tarifs JIRAMA', desc: 'Gestion des tarifs', icon: <AttachMoney />, path: '/parametres/tarifs', color: '#7b1fa2' },
  { title: 'Notifications', desc: 'Préférences notifications', icon: <Notifications />, path: '/parametres/notifications', color: '#c62828' }
];

export default function ParametresPage() {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <Box sx={{ display: 'flex', bgcolor: '#f5f7fa', minHeight: '100vh' }}>
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <Box component="main" sx={{ flexGrow: 1, width: { sm: 'calc(100% - 260px)' }, minWidth: 0 }}>
        <Header onMenuClick={() => setMobileOpen(!mobileOpen)} />
        <Toolbar />
        <Container maxWidth="md" sx={{ px: { xs: 2, sm: 3 }, py: 2.5 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>Paramètres</Typography>
          <Card sx={{ borderRadius: 3, border: '1px solid #e8edf2', boxShadow: 'none' }}>
            <List>
              {settings.map((s, i) => (
                <React.Fragment key={s.title}>
                  <ListItem sx={{ py: 2, cursor: 'pointer', '&:hover': { bgcolor: '#f5f7fa' } }} onClick={() => router.push(s.path)}>
                    <ListItemIcon><Avatar sx={{ bgcolor: `${s.color}18`, color: s.color, width: 40, height: 40 }}>{s.icon}</Avatar></ListItemIcon>
                    <ListItemText 
                    primary={s.title} 
                    secondary={s.desc} 
                    slotProps={{ primary: { sx: { fontWeight: 600 } } }} 
                    />
                  </ListItem>
                  {i < settings.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Card>
        </Container>
      </Box>
    </Box>
  );
}