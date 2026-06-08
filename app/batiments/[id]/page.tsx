'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Box, Container, Typography, IconButton, Chip, Grid, Card, CardContent, Divider, CircularProgress, Alert, Button, ImageList, ImageListItem } from '@mui/material';
import { ArrowBack, Edit, LocationOn, Business, SquareFoot, CalendarToday, Category, Apartment, ChevronLeft, ChevronRight } from '@mui/icons-material';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { batimentService, Batiment } from '@/services/batimentService';
import { motion, AnimatePresence } from 'framer-motion';

export default function BatimentDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [batiment, setBatiment] = useState<Batiment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => { fetchBatiment(); }, [id]);

  const fetchBatiment = async () => {
    try {
      setLoading(true);
      const data = await batimentService.getById(Number(id));
      setBatiment(data);
    } catch (err) { setError("Bâtiment non trouvé"); } finally { setLoading(false); }
  };

  const photoBaseUrl = process.env.NEXT_PUBLIC_PHOTO_URL || 'http://localhost:8000';
  
  const getImageUrl = (path: string) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    if (path.startsWith('/static')) return `${photoBaseUrl}${path}`;
    return `${photoBaseUrl}/static/${path}`;
  };

  const photos = batiment?.photos || [];
  const nextImage = () => setSelectedImageIndex((prev) => (prev + 1) % photos.length);
  const prevImage = () => setSelectedImageIndex((prev) => (prev - 1 + photos.length) % photos.length);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', bgcolor: '#f8fafc', minHeight: '100vh' }}>
        <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
        <Box component="main" sx={{ flexGrow: 1 }}>
          <Header onMenuClick={() => setMobileOpen(!mobileOpen)} />
          <Container sx={{ mt: 10, display: 'flex', justifyContent: 'center' }}><CircularProgress sx={{ color: '#2e7d32' }} /></Container>
        </Box>
      </Box>
    );
  }

  if (error || !batiment) {
    return (
      <Box sx={{ display: 'flex', bgcolor: '#f8fafc', minHeight: '100vh' }}>
        <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
        <Box component="main" sx={{ flexGrow: 1 }}>
          <Header onMenuClick={() => setMobileOpen(!mobileOpen)} />
          <Container sx={{ mt: 10 }}><Alert severity="error">{error || "Bâtiment non trouvé"}</Alert><Button sx={{ mt: 2 }} onClick={() => router.push('/batiments')}>Retour</Button></Container>
        </Box>
      </Box>
    );
  }

  const typeLabels: Record<string, string> = { residential: 'Résidentiel', commercial: 'Commercial', mixte: 'Mixte' };

  return (
    <Box sx={{ display: 'flex', bgcolor: '#f8fafc', minHeight: '100vh' }}>
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Header onMenuClick={() => setMobileOpen(!mobileOpen)} />
        <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 }, py: { xs: 2, sm: 3 }, mt: { xs: 7, sm: 8 } }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3, flexWrap: 'wrap', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <IconButton onClick={() => router.back()} sx={{ bgcolor: '#fff', border: '1px solid #e0e0e0' }}><ArrowBack /></IconButton>
                <Typography variant="h5" sx={{ fontWeight: 700, color: '#1a1a1a' }}>{batiment.nom}</Typography>
                <Chip label={batiment.statut === 'actif' ? 'Actif' : 'Inactif'} size="small" sx={{ bgcolor: batiment.statut === 'actif' ? '#e8f5e9' : '#ffebee', color: batiment.statut === 'actif' ? '#2e7d32' : '#f44336' }} />
              </Box>
              <Button variant="contained" startIcon={<Edit />} onClick={() => router.push(`/batiments/${batiment.id}/edit`)} sx={{ bgcolor: '#2e7d32' }}>Modifier</Button>
            </Box>

            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Card sx={{ borderRadius: 2, overflow: 'hidden', border: '1px solid #e8e8e8' }}>
                  {photos.length > 0 ? (
                    <>
                      <Box sx={{ position: 'relative', height: 350, bgcolor: '#000' }}>
                        <AnimatePresence mode="wait">
                          <motion.img key={selectedImageIndex} src={getImageUrl(photos[selectedImageIndex])} alt={batiment.nom} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                        </AnimatePresence>
                        {photos.length > 1 && (
                          <>
                            <IconButton onClick={prevImage} sx={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', bgcolor: 'rgba(0,0,0,0.5)', color: '#fff' }}><ChevronLeft /></IconButton>
                            <IconButton onClick={nextImage} sx={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', bgcolor: 'rgba(0,0,0,0.5)', color: '#fff' }}><ChevronRight /></IconButton>
                            <Chip label={`${selectedImageIndex + 1}/${photos.length}`} size="small" sx={{ position: 'absolute', bottom: 10, right: 10, bgcolor: 'rgba(0,0,0,0.6)', color: '#fff' }} />
                          </>
                        )}
                      </Box>
                      {photos.length > 1 && (
                        <ImageList cols={4} gap={4} sx={{ p: 1 }}>
                          {photos.map((photo, idx) => (
                            <ImageListItem key={idx} sx={{ cursor: 'pointer', borderRadius: 1, overflow: 'hidden', border: selectedImageIndex === idx ? '2px solid #2e7d32' : 'none' }} onClick={() => setSelectedImageIndex(idx)}>
                              <img src={getImageUrl(photo)} alt={`Photo ${idx + 1}`} style={{ height: 80, width: '100%', objectFit: 'cover' }} />
                            </ImageListItem>
                          ))}
                        </ImageList>
                      )}
                    </>
                  ) : (
                    <Box sx={{ height: 350, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#f5f5f5' }}><Apartment sx={{ fontSize: 80, color: '#cbd5e0' }} /></Box>
                  )}
                </Card>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Card sx={{ borderRadius: 2, border: '1px solid #e8e8e8', height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#2e7d32' }}>Informations générales</Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 6 }}><Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}><Category sx={{ fontSize: 18, color: '#94a3b8' }} /><Typography variant="body2" sx={{ color: '#64748b' }}>Type</Typography><Typography variant="body2" sx={{ fontWeight: 500 }}>{typeLabels[batiment.type_batiment] || batiment.type_batiment}</Typography></Box></Grid>
                      <Grid size={{ xs: 6 }}><Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}><CalendarToday sx={{ fontSize: 18, color: '#94a3b8' }} /><Typography variant="body2" sx={{ color: '#64748b' }}>Année</Typography><Typography variant="body2" sx={{ fontWeight: 500 }}>{batiment.annee_construction || '-'}</Typography></Box></Grid>
                      <Grid size={{ xs: 6 }}><Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}><SquareFoot sx={{ fontSize: 18, color: '#94a3b8' }} /><Typography variant="body2" sx={{ color: '#64748b' }}>Surface</Typography><Typography variant="body2" sx={{ fontWeight: 500 }}>{batiment.surface_totale?.toLocaleString()} m²</Typography></Box></Grid>
                      <Grid size={{ xs: 6 }}><Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}><Business sx={{ fontSize: 18, color: '#94a3b8' }} /><Typography variant="body2" sx={{ color: '#64748b' }}>Étages</Typography><Typography variant="body2" sx={{ fontWeight: 500 }}>{batiment.nb_etages || 0}</Typography></Box></Grid>
                    </Grid>
                    <Box sx={{ mb: 2 }}><Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>Adresse</Typography><Typography variant="body2" sx={{ color: '#475569' }}>{batiment.adresse}</Typography><Typography variant="body2" sx={{ color: '#475569' }}>{batiment.ville} {batiment.commune && `- ${batiment.commune}`}</Typography></Box>
                    {batiment.description && (<Box><Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>Description</Typography><Typography variant="body2" sx={{ color: '#475569', lineHeight: 1.6 }}>{batiment.description}</Typography></Box>)}
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </motion.div>
        </Container>
      </Box>
    </Box>
  );
}