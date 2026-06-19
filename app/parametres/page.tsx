// app/parametres/page.tsx
'use client';

import { useState } from 'react';
import { Box, Container, Typography, Paper, Avatar, alpha, Chip, Grid, Card, CardContent, Button } from '@mui/material';
import { Settings, People, Person, AttachMoney, Security, ArrowForward } from '@mui/icons-material';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import Link from 'next/link';

const parametresItems = [
  {
    title: 'Profil',
    description: 'Gérer vos informations personnelles',
    icon: <Person sx={{ fontSize: 32 }} />,
    color: '#2e7d32',
    bg: '#e8f5e9',
    href: '/parametres/profil'
  },
  {
    title: 'Utilisateurs',
    description: 'Gérer les comptes utilisateurs et leurs permissions',
    icon: <People sx={{ fontSize: 32 }} />,
    color: '#2563eb',
    bg: '#eff6ff',
    href: '/parametres/utilisateurs'
  },
  {
    title: 'Tarifs JIRAMA',
    description: 'Configurer les tarifs de l\'eau et de l\'électricité',
    icon: <AttachMoney sx={{ fontSize: 32 }} />,
    color: '#f59e0b',
    bg: '#fffbeb',
    href: '/parametres/tarifs'
  },
  {
    title: 'Sécurité',
    description: 'Gérer les paramètres de sécurité et les sessions',
    icon: <Security sx={{ fontSize: 32 }} />,
    color: '#7c3aed',
    bg: '#f3e8ff',
    href: '/parametres/securite'
  }
];

export default function ParametresPage() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <Box sx={{ display: 'flex', bgcolor: '#f8fafc', minHeight: '100vh' }}>
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Header onMenuClick={() => setMobileOpen(!mobileOpen)} />

        <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3 }, py: { xs: 2, sm: 2.5 }, mt: { xs: 7, sm: 8 } }}>
          
          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              mb: 4,
              borderRadius: 3,
              background: 'linear-gradient(135deg, #fff 0%, #f8fafc 100%)',
              border: '1px solid rgba(46,125,50,0.1)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <Box sx={{ position: 'absolute', top: -30, right: -30, width: 150, height: 150, borderRadius: '50%', bgcolor: alpha('#2e7d32', 0.05) }} />

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: alpha('#2e7d32', 0.1), width: 52, height: 52 }}>
                <Settings sx={{ color: '#2e7d32', fontSize: 26 }} />
              </Avatar>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a' }}>
                  Paramètres
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748b' }}>
                  Gérez les paramètres de votre application
                </Typography>
              </Box>
            </Box>
          </Paper>

          <Grid container spacing={3}>
            {parametresItems.map((item) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={item.title}>
                <Card 
                  sx={{ 
                    borderRadius: 2, 
                    border: '1px solid #e2e8f0',
                    transition: 'all 0.2s',
                    '&:hover': { 
                      transform: 'translateY(-4px)', 
                      boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                      borderColor: item.color
                    },
                    height: '100%',
                    cursor: 'pointer'
                  }}
                  component={Link}
                  href={item.href}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Avatar sx={{ bgcolor: item.bg, color: item.color, width: 56, height: 56, mb: 2 }}>
                      {item.icon}
                    </Avatar>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                      {item.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#64748b', mb: 2 }}>
                      {item.description}
                    </Typography>
                    <Button 
                      variant="text" 
                      endIcon={<ArrowForward />}
                      sx={{ color: item.color, textTransform: 'none', p: 0 }}
                    >
                      Configurer
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}