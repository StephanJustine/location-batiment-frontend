// app/employes/create/page.tsx
'use client';

import { useState } from 'react';
import { Box, Container, Typography, Paper, Avatar, alpha, Chip } from '@mui/material';
import { PersonAdd } from '@mui/icons-material';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import EmployeForm from '@/components/employes/EmployeForm';

export default function NouvelEmployePage() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <Box sx={{ display: 'flex', bgcolor: '#f8fafc', minHeight: '100vh' }}>
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Header onMenuClick={() => setMobileOpen(!mobileOpen)} />
        <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 }, py: { xs: 2, sm: 2.5 }, mt: { xs: 7, sm: 8 } }}>
          <Paper elevation={0} sx={{ p: 2.5, mb: 3, borderRadius: 3, border: '1px solid rgba(46,125,50,0.1)' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: alpha('#2e7d32', 0.1), width: 52, height: 52 }}>
                <PersonAdd sx={{ color: '#2e7d32', fontSize: 26 }} />
              </Avatar>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a' }}>Nouvel employé</Typography>
                <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                  <Chip label="Création" size="small" sx={{ bgcolor: '#e8f5e9', color: '#2e7d32' }} />
                </Box>
              </Box>
            </Box>
          </Paper>
          <EmployeForm />
        </Container>
      </Box>
    </Box>
  );
}