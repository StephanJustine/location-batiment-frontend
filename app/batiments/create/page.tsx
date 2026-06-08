'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Container, Typography, IconButton, Breadcrumbs, Link, Paper } from '@mui/material';
import { ArrowBack, Home, Apartment, AddBox } from '@mui/icons-material';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import BatimentForm from '@/components/batiments/BatimentForm';
import { batimentService } from '@/services/batimentService';
import { motion } from 'framer-motion';

export default function CreateBatimentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSubmit = async (data: any) => {
    setLoading(true);
    try {
      const result = await batimentService.create(data);
      return result;
    } catch (error) {
      console.error('Erreur:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', bgcolor: '#f8fafc', minHeight: '100vh' }}>
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Header onMenuClick={() => setMobileOpen(!mobileOpen)} />
        
        <Container maxWidth="md" sx={{ px: { xs: 2, sm: 3 }, py: { xs: 2, sm: 2.5 }, mt: { xs: 7, sm: 8 } }}>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            
            {/* Breadcrumbs */}
            <Breadcrumbs sx={{ mb: 2, fontSize: '0.75rem' }}>
              <Link href="/" sx={{ display: 'flex', alignItems: 'center', color: '#64748b', textDecoration: 'none', '&:hover': { color: '#2e7d32' } }}>
                <Home sx={{ mr: 0.5, fontSize: 14 }} />
                Accueil
              </Link>
              <Link href="/batiments" sx={{ display: 'flex', alignItems: 'center', color: '#64748b', textDecoration: 'none', '&:hover': { color: '#2e7d32' } }}>
                <Apartment sx={{ mr: 0.5, fontSize: 14 }} />
                Bâtiments
              </Link>
              <Typography color="#2e7d32" sx={{ display: 'flex', alignItems: 'center', fontSize: '0.75rem', fontWeight: 500 }}>
                Nouveau
              </Typography>
            </Breadcrumbs>

            {/* Header */}
            <Paper elevation={0} sx={{ p: 2, mb: 3, borderRadius: 2, border: '1px solid #e2e8f0', bgcolor: '#fff' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <IconButton 
                    onClick={() => router.back()} 
                    size="small" 
                    sx={{ bgcolor: '#f1f5f9', '&:hover': { bgcolor: '#e2e8f0' } }}
                  >
                    <ArrowBack sx={{ fontSize: 18 }} />
                  </IconButton>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#0f172a' }}>
                      Nouveau bâtiment
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#64748b' }}>
                      Ajoutez un nouveau bâtiment à votre parc immobilier
                    </Typography>
                  </Box>
                </Box>
                <AddBox sx={{ fontSize: 20, color: '#2e7d32' }} />
              </Box>
            </Paper>

            {/* Formulaire */}
            <BatimentForm onSubmit={handleSubmit} onCancel={() => router.back()} isLoading={loading} />
          </motion.div>
        </Container>
      </Box>
    </Box>
  );
}