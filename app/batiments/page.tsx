'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Box, Container, Typography, Button, Grid, 
  CircularProgress, Alert, Chip, Fade, IconButton, InputBase, Paper
} from '@mui/material';
import { Add, Search, Apartment, Home, Clear } from '@mui/icons-material';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import BatimentCard from '@/components/batiments/BatimentCard';
import { batimentService, Batiment } from '@/services/batimentService';
import { motion } from 'framer-motion';

export default function BatimentsPage() {
  const router = useRouter();
  const [batiments, setBatiments] = useState<Batiment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    fetchBatiments();
  }, []);

  const fetchBatiments = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await batimentService.getAll();
      setBatiments(data);
    } catch (error: any) {
      console.error('Erreur:', error);
      setError(error.message || 'Impossible de charger les bâtiments');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await batimentService.delete(id);
      setBatiments(batiments.filter(b => b.id !== id));
    } catch (error) {
      console.error('Erreur suppression:', error);
    }
  };

  const filteredBatiments = batiments.filter(b =>
    b.nom.toLowerCase().includes(search.toLowerCase()) ||
    b.ville.toLowerCase().includes(search.toLowerCase())
  );

  const totalBatiments = filteredBatiments.length;
  const totalVilles = [...new Set(filteredBatiments.map(b => b.ville))].length;

  const clearSearch = () => setSearch('');

  return (
    <Box sx={{ display: 'flex', bgcolor: '#f8fafc', minHeight: '100vh' }}>
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Header onMenuClick={() => setMobileOpen(!mobileOpen)} />
        
        <Container maxWidth={false} sx={{ px: { xs: 2, sm: 3 }, py: { xs: 2, sm: 2.5 }, mt: { xs: 7, sm: 8 } }}>
          
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Box sx={{ mb: 2.5 }}>
              <Typography variant="h5" sx={{ fontWeight: 700, color: '#1a1a1a', mb: 0.5 }}>
                Bâtiments
              </Typography>
              <Typography variant="body2" sx={{ color: '#757575' }}>
                Gérez l'ensemble de votre parc immobilier
              </Typography>
            </Box>
          </motion.div>

          {/* Statistiques */}
          {!loading && filteredBatiments.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', mb: 2.5 }}>
                <Chip 
                  icon={<Apartment sx={{ fontSize: 14 }} />} 
                  label={`${totalBatiments}`} 
                  size="small"
                  sx={{ bgcolor: '#e8f5e9', color: '#2e7d32', fontWeight: 500 }}
                />
                <Chip 
                  icon={<Home sx={{ fontSize: 14 }} />} 
                  label={`${totalVilles} villes`} 
                  size="small"
                  sx={{ bgcolor: '#e3f2fd', color: '#1565c0', fontWeight: 500 }}
                />
              </Box>
            </motion.div>
          )}

          {/* Barre de recherche minimisée */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Paper 
              elevation={0} 
              sx={{ 
                p: 1, 
                mb: 3, 
                borderRadius: 2,
                border: '1px solid #e0e0e0',
                bgcolor: '#fff',
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', flex: 1, position: 'relative' }}>
                <Search sx={{ position: 'absolute', left: 10, color: '#9e9e9e', fontSize: 16 }} />
                <InputBase
                  placeholder="Rechercher..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  sx={{ 
                    pl: 4, 
                    pr: 3, 
                    py: 0.8, 
                    width: '100%',
                    fontSize: '0.85rem',
                    '& input': { p: 0 }
                  }}
                />
                {search && (
                  <IconButton size="small" onClick={clearSearch} sx={{ position: 'absolute', right: 4, p: 0.3 }}>
                    <Clear sx={{ fontSize: 14, color: '#9e9e9e' }} />
                  </IconButton>
                )}
              </Box>
              <Button 
                variant="contained" 
                startIcon={<Add />} 
                onClick={() => router.push('/batiments/create')} 
                sx={{ 
                  bgcolor: '#2e7d32', 
                  borderRadius: 1.5,
                  textTransform: 'none',
                  fontWeight: 500,
                  fontSize: '0.75rem',
                  py: 0.6,
                  px: 1.5,
                  '&:hover': { bgcolor: '#1b5e20' }
                }}
              >
                Nouveau
              </Button>
            </Paper>
          </motion.div>

          {/* Error Alert */}
          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }} onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          {/* Loading */}
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
              <CircularProgress sx={{ color: '#2e7d32' }} />
            </Box>
          ) : filteredBatiments.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Paper sx={{ textAlign: 'center', py: 6, borderRadius: 2 }}>
                <Apartment sx={{ fontSize: 48, color: '#bdbdbd', mb: 1 }} />
                <Typography variant="body1" sx={{ color: '#757575', mb: 1 }}>
                  {search ? 'Aucun résultat' : 'Aucun bâtiment'}
                </Typography>
                {!search && (
                  <Button 
                    variant="contained" 
                    startIcon={<Add />} 
                    onClick={() => router.push('/batiments/create')} 
                    sx={{ bgcolor: '#2e7d32', mt: 1 }}
                  >
                    Ajouter un bâtiment
                  </Button>
                )}
              </Paper>
            </motion.div>
          ) : (
            <Grid container spacing={2}>
              {filteredBatiments.map((batiment, index) => (
                <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={batiment.id}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: (index % 8) * 0.05 }}
                  >
                    <BatimentCard batiment={batiment} onDelete={handleDelete} />
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          )}
        </Container>
      </Box>
    </Box>
  );
}