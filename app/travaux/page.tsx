// app/travaux/page.tsx
'use client';

import { useState } from 'react';
import { Box, Container, Typography, Paper, IconButton, Tooltip, Chip, Avatar, alpha } from '@mui/material';
import { Construction, ViewList, ViewModule } from '@mui/icons-material';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import TravauxList from '@/components/travaux/TravauxList';

export default function TravauxPage() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

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
              mb: 3,
              borderRadius: 3,
              background: 'linear-gradient(135deg, #fff 0%, #f8fafc 100%)',
              border: '1px solid rgba(46,125,50,0.1)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <Box sx={{ position: 'absolute', top: -30, right: -30, width: 150, height: 150, borderRadius: '50%', bgcolor: alpha('#2e7d32', 0.05) }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: alpha('#2e7d32', 0.1), width: 52, height: 52 }}>
                  <Construction sx={{ color: '#2e7d32', fontSize: 26 }} />
                </Avatar>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a' }}>
                    Gestion des travaux
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                    <Chip label="Maintenance & rénovation" size="small" sx={{ bgcolor: '#e8f5e9', color: '#2e7d32' }} />
                    <Chip label="Suivi en temps réel" size="small" sx={{ bgcolor: '#e3f2fd', color: '#1976d2' }} />
                  </Box>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', gap: 1 }}>
                <Tooltip title="Vue liste">
                  <IconButton
                    onClick={() => setViewMode('list')}
                    size="small"
                    sx={{
                      bgcolor: viewMode === 'list' ? alpha('#2e7d32', 0.1) : '#fff',
                      border: '1px solid #e2e8f0',
                      borderRadius: 1.5
                    }}
                  >
                    <ViewList sx={{ fontSize: 18, color: viewMode === 'list' ? '#2e7d32' : '#64748b' }} />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Vue grille">
                  <IconButton
                    onClick={() => setViewMode('grid')}
                    size="small"
                    sx={{
                      bgcolor: viewMode === 'grid' ? alpha('#2e7d32', 0.1) : '#fff',
                      border: '1px solid #e2e8f0',
                      borderRadius: 1.5
                    }}
                  >
                    <ViewModule sx={{ fontSize: 18, color: viewMode === 'grid' ? '#2e7d32' : '#64748b' }} />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          </Paper>

          <TravauxList />
        </Container>
      </Box>
    </Box>
  );
}