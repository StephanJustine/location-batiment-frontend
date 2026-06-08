'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Box, Container, Typography, IconButton, CircularProgress, Alert, Breadcrumbs, Link, Paper } from '@mui/material';
import { ArrowBack, Home, Apartment, Save } from '@mui/icons-material';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import BatimentForm from '@/components/batiments/BatimentForm';
import { batimentService, Batiment } from '@/services/batimentService';
import { motion } from 'framer-motion';

export default function EditBatimentPage() {
  const { id } = useParams();
  const router = useRouter();
  const [batiment, setBatiment] = useState<Batiment | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    fetchBatiment();
  }, [id]);

  const fetchBatiment = async () => {
    try {
      setError(null);
      const data = await batimentService.getById(Number(id));
      setBatiment(data);
    } catch (error) {
      setError("Impossible de charger les informations du bâtiment");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data: any) => {
    setSubmitting(true);
    setError(null);
    try {
      await batimentService.update(Number(id), data);
      router.push('/batiments');
    } catch (error) {
      setError("Erreur lors de la modification");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', bgcolor: '#f8fafc', minHeight: '100vh' }}>
        <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
        <Box component="main" sx={{ flexGrow: 1 }}>
          <Header onMenuClick={() => setMobileOpen(!mobileOpen)} />
          <Container maxWidth="md" sx={{ px: 3, py: 3, mt: { xs: 7, sm: 8 } }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
              <CircularProgress sx={{ color: '#2e7d32' }} />
            </Box>
          </Container>
        </Box>
      </Box>
    );
  }

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
                Modifier
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
                      Modifier {batiment?.nom}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#64748b' }}>
                      Modifiez les informations du bâtiment
                    </Typography>
                  </Box>
                </Box>
                <Save sx={{ fontSize: 20, color: '#94a3b8' }} />
              </Box>
            </Paper>

            {/* Error Alert */}
            {error && (
              <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }} onClose={() => setError(null)}>
                {error}
              </Alert>
            )}

            {/* Formulaire */}
            {batiment && (
              <BatimentForm 
                initialData={batiment} 
                onSubmit={handleSubmit} 
                onCancel={() => router.back()} 
                isLoading={submitting} 
              />
            )}
          </motion.div>
        </Container>
      </Box>
    </Box>
  );
}