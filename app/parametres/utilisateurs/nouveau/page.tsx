// app/parametres/utilisateurs/nouveau/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Container, Typography, Paper, Avatar, alpha, Chip, Breadcrumbs, Link } from '@mui/material';
import { PersonAdd, Settings } from '@mui/icons-material';
import { NavigateNext } from '@mui/icons-material';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import UserForm from '@/components/users/UserForm';

export default function NouvelUtilisateurPage() {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <Box sx={{ display: 'flex', bgcolor: '#f8fafc', minHeight: '100vh' }}>
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Header onMenuClick={() => setMobileOpen(!mobileOpen)} />

        <Container maxWidth="md" sx={{ px: { xs: 2, sm: 3 }, py: { xs: 2, sm: 2.5 }, mt: { xs: 7, sm: 8 } }}>
          
          <Breadcrumbs separator={<NavigateNext fontSize="small" />} sx={{ mb: 2 }}>
            <Link href="/" color="inherit" sx={{ textDecoration: 'none' }}>Accueil</Link>
            <Link href="/parametres" color="inherit" sx={{ textDecoration: 'none' }}>Paramètres</Link>
            <Link href="/parametres/utilisateurs" color="inherit" sx={{ textDecoration: 'none' }}>Utilisateurs</Link>
            <Typography color="text.primary">Nouveau</Typography>
          </Breadcrumbs>

          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              mb: 3,
              borderRadius: 3,
              background: 'linear-gradient(135deg, #fff 0%, #f8fafc 100%)',
              border: '1px solid rgba(46,125,50,0.1)'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: alpha('#2e7d32', 0.1), width: 52, height: 52 }}>
                <PersonAdd sx={{ color: '#2e7d32', fontSize: 26 }} />
              </Avatar>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a' }}>
                  Nouvel utilisateur
                </Typography>
                <Chip label="Création" size="small" sx={{ bgcolor: '#e8f5e9', color: '#2e7d32', mt: 0.5 }} />
              </Box>
            </Box>
          </Paper>

          <UserForm onSuccess={() => router.push('/parametres/utilisateurs')} />
        </Container>
      </Box>
    </Box>
  );
}