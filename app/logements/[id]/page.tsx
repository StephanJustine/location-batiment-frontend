'use client';
import { useEffect, useState, useCallback, JSX } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  Box, Container, Typography, IconButton, Chip, Grid, Card, CardContent, 
  Divider, CircularProgress, Alert, Button, ImageList, ImageListItem, 
  Tabs, Tab, List, ListItem, ListItemText, ListItemAvatar, Avatar, Paper,
  Tooltip, Fade, Dialog, IconButton as MuiIconButton, Breadcrumbs, Link,
  alpha, Skeleton, Stepper, Step, StepLabel, LinearProgress
} from '@mui/material';
import { 
  ArrowBack, Edit, LocationOn, SquareFoot, Bed, Bathtub, 
  Apartment, Person, Build, TrendingUp, AttachMoney,
  PhotoCamera, Description, Visibility, Close, Home, CheckCircle,
  ChevronLeft, ChevronRight, CalendarToday, MeetingRoom, 
  WaterDrop, ElectricBolt, LocalFireDepartment, Wifi, Security,
  Grade, Share, Download, Print, WhatsApp, Refresh,
  Store,
  Business
} from '@mui/icons-material';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { logementService, Logement, Travaux } from '@/services/logementService';
import { motion, AnimatePresence } from 'framer-motion';

// Fonction utilitaire pour obtenir l'URL de l'image
const getImageUrl = (path: string | null | undefined): string => {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  if (path.startsWith('blob:')) return path;
  
  const photoBaseUrl = process.env.NEXT_PUBLIC_PHOTO_URL || 'http://localhost:8000';
  let cleanPath = path;
  if (cleanPath.startsWith('/static/')) {
    cleanPath = cleanPath.substring(1);
  }
  
  return `${photoBaseUrl}/${cleanPath}`;
};

export default function LogementDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [logement, setLogement] = useState<Logement | null>(null);
  const [travaux, setTravaux] = useState<Travaux[]>([]);
  const [historique, setHistorique] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [planDialogOpen, setPlanDialogOpen] = useState(false);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const [logementData, travauxData, historiqueData, statsData] = await Promise.all([
        logementService.getById(Number(id)),
        logementService.getTravaux(Number(id)),
        logementService.getHistorique(Number(id)),
        logementService.getStats(Number(id))
      ]);
      setLogement(logementData);
      setTravaux(travauxData);
      setHistorique(historiqueData);
      setStats(statsData);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchData();
  };

  const getValidPhotos = () => {
    if (!logement?.photos) return [];
    if (typeof logement.photos === 'string') {
      try {
        const parsed = JSON.parse(logement.photos);
        return Array.isArray(parsed) ? parsed.filter(p => p && p.trim() !== '') : [];
      } catch {
        return [];
      }
    }
    return Array.isArray(logement.photos) ? logement.photos.filter(p => p && p.trim() !== '') : [];
  };

  const photos = getValidPhotos();
  const hasPlan = !!logement?.plan_url && logement.plan_url.trim() !== '';
  
  const typeLabels: Record<string, { label: string; icon: JSX.Element }> = { 
    studio: { label: 'Studio', icon: <MeetingRoom sx={{ fontSize: 14 }} /> },
    t1: { label: 'T1', icon: <Home sx={{ fontSize: 14 }} /> },
    t2: { label: 'T2', icon: <Home sx={{ fontSize: 14 }} /> },
    t3: { label: 'T3', icon: <Home sx={{ fontSize: 14 }} /> },
    t4: { label: 'T4', icon: <Home sx={{ fontSize: 14 }} /> },
    t5: { label: 'T5', icon: <Home sx={{ fontSize: 14 }} /> },
    duplex: { label: 'Duplex', icon: <MeetingRoom sx={{ fontSize: 14 }} /> },
    villa: { label: 'Villa', icon: <Apartment sx={{ fontSize: 14 }} /> },
    magasin: { label: 'Magasin', icon: <Store sx={{ fontSize: 14 }} /> },
    bureau: { label: 'Bureau', icon: <Business sx={{ fontSize: 14 }} /> },
  };
  
  const statutInfo: Record<string, { color: string; bg: string; label: string; icon: JSX.Element }> = { 
    libre: { color: '#2e7d32', bg: '#e8f5e9', label: 'Libre', icon: <CheckCircle sx={{ fontSize: 12 }} /> },
    occupe: { color: '#1565c0', bg: '#e3f2fd', label: 'Occupé', icon: <Home sx={{ fontSize: 12 }} /> },
    reserve: { color: '#e65100', bg: '#fff3e0', label: 'Réservé', icon: <CalendarToday sx={{ fontSize: 12 }} /> },
    en_maintenance: { color: '#c62828', bg: '#ffebee', label: 'Maintenance', icon: <Build sx={{ fontSize: 12 }} /> },
    en_renovation: { color: '#6a1b9a', bg: '#f3e5f5', label: 'Rénovation', icon: <Build sx={{ fontSize: 12 }} /> },
  };

  const currentStatut = logement?.statut ? statutInfo[logement.statut] || statutInfo.libre : statutInfo.libre;
  const currentType = logement?.type ? typeLabels[logement.type] || { label: logement.type, icon: <Home sx={{ fontSize: 14 }} /> } : { label: 'Logement', icon: <Home sx={{ fontSize: 14 }} /> };

  const nextImage = () => {
    if (photos.length > 0) {
      setSelectedImageIndex((prev) => (prev + 1) % photos.length);
    }
  };

  const prevImage = () => {
    if (photos.length > 0) {
      setSelectedImageIndex((prev) => (prev - 1 + photos.length) % photos.length);
    }
  };

  const handleImageError = (photoPath: string) => {
    console.error(`Erreur chargement image: ${photoPath}`);
    setImageErrors(prev => ({ ...prev, [photoPath]: true }));
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Logement ${logement?.numero}`,
        text: `Découvrez ce logement ${logement?.type} à ${logement?.loyer_base} Ar/mois`,
        url: window.location.href,
      });
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Télécharger les informations du logement
    const data = {
      numero: logement?.numero,
      type: logement?.type,
      surface: logement?.surface,
      loyer: logement?.loyer_base,
      statut: logement?.statut,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `logement_${logement?.numero}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', bgcolor: '#f8fafc', minHeight: '100vh' }}>
        <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
        <Box component="main" sx={{ flexGrow: 1 }}>
          <Header onMenuClick={() => setMobileOpen(!mobileOpen)} />
          <Container sx={{ mt: 10 }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
              <Box sx={{ width: '100%', maxWidth: 400 }}>
                <LinearProgress sx={{ mb: 2, borderRadius: 2 }} />
                <Typography variant="body2" sx={{ color: '#64748b', textAlign: 'center' }}>
                  Chargement du logement...
                </Typography>
              </Box>
            </Box>
          </Container>
        </Box>
      </Box>
    );
  }

  if (!logement) {
    return (
      <Box sx={{ display: 'flex', bgcolor: '#f8fafc', minHeight: '100vh' }}>
        <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
        <Box component="main" sx={{ flexGrow: 1 }}>
          <Header onMenuClick={() => setMobileOpen(!mobileOpen)} />
          <Container sx={{ mt: 10 }}>
            <Alert 
              severity="error" 
              sx={{ borderRadius: 2 }}
              action={
                <Button color="inherit" size="small" onClick={() => router.push('/logements')}>
                  Voir la liste
                </Button>
              }
            >
              Logement non trouvé
            </Alert>
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
        
        <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 }, py: { xs: 2, sm: 2.5 }, mt: { xs: 7, sm: 8 } }}>
          <Fade in timeout={400}>
            <Box>
              {/* Breadcrumbs */}
              <Breadcrumbs sx={{ mb: 2 }} separator={<ChevronRight sx={{ fontSize: 14, color: '#94a3b8' }} />}>
                <Link href="/" sx={{ display: 'flex', alignItems: 'center', color: '#64748b', textDecoration: 'none' }}>
                  <Home sx={{ mr: 0.5, fontSize: 14 }} /> Accueil
                </Link>
                <Link href="/logements" sx={{ display: 'flex', alignItems: 'center', color: '#64748b', textDecoration: 'none' }}>
                  <Apartment sx={{ mr: 0.5, fontSize: 14 }} /> Logements
                </Link>
                <Typography color="#2e7d32" sx={{ fontSize: '0.75rem', fontWeight: 600 }}>
                  Logement {logement.numero}
                </Typography>
              </Breadcrumbs>

              {/* Header avec actions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
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
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2, position: 'relative', zIndex: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar 
                        sx={{ 
                          bgcolor: alpha('#2e7d32', 0.1), 
                          width: 56, 
                          height: 56,
                          transition: 'transform 0.3s',
                          '&:hover': { transform: 'scale(1.05)' }
                        }}
                      >
                        <Apartment sx={{ color: '#2e7d32', fontSize: 28 }} />
                      </Avatar>
                      <Box>
                        <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
                          Logement {logement.numero}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, mt: 0.5, flexWrap: 'wrap' }}>
                          <Chip 
                            icon={currentStatut.icon}
                            label={currentStatut.label} 
                            size="small" 
                            sx={{ 
                              bgcolor: currentStatut.bg, 
                              color: currentStatut.color, 
                              height: 26,
                              '& .MuiChip-icon': { color: currentStatut.color }
                            }} 
                          />
                          <Chip 
                            icon={currentType.icon}
                            label={currentType.label} 
                            size="small" 
                            sx={{ bgcolor: '#f1f5f9', color: '#475569', height: 26 }} 
                          />
                          <Chip 
                            icon={<AttachMoney sx={{ fontSize: 12 }} />}
                            label={`${logement.loyer_base.toLocaleString()} Ar/mois`} 
                            size="small" 
                            sx={{ bgcolor: '#e8f5e9', color: '#2e7d32', height: 26 }} 
                          />
                        </Box>
                      </Box>
                    </Box>
                    
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Tooltip title="Rafraîchir">
                        <IconButton 
                          onClick={handleRefresh} 
                          size="small"
                          sx={{ bgcolor: '#fff', border: '1px solid #e2e8f0' }}
                          disabled={refreshing}
                        >
                          <Refresh sx={{ fontSize: 18, color: '#64748b' }} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Partager">
                        <IconButton onClick={handleShare} size="small" sx={{ bgcolor: '#fff', border: '1px solid #e2e8f0' }}>
                          <Share sx={{ fontSize: 18, color: '#64748b' }} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Imprimer">
                        <IconButton onClick={handlePrint} size="small" sx={{ bgcolor: '#fff', border: '1px solid #e2e8f0' }}>
                          <Print sx={{ fontSize: 18, color: '#64748b' }} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Télécharger">
                        <IconButton onClick={handleDownload} size="small" sx={{ bgcolor: '#fff', border: '1px solid #e2e8f0' }}>
                          <Download sx={{ fontSize: 18, color: '#64748b' }} />
                        </IconButton>
                      </Tooltip>
                      <Button 
                        variant="contained" 
                        startIcon={<Edit sx={{ fontSize: 16 }} />} 
                        onClick={() => router.push(`/logements/${logement.id}/edit`)} 
                        size="small"
                        sx={{ 
                          bgcolor: '#2e7d32', 
                          borderRadius: 2, 
                          textTransform: 'none', 
                          px: 2.5,
                          '&:hover': { bgcolor: '#1b5e20', transform: 'translateY(-2px)' },
                          transition: 'all 0.2s'
                        }}
                      >
                        Modifier
                      </Button>
                    </Box>
                  </Box>
                </Paper>
              </motion.div>

              <Grid container spacing={3}>
                {/* Galerie photos */}
                <Grid size={{ xs: 12, md: 7 }}>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                  >
                    <Card sx={{ borderRadius: 3, overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                      {photos.length > 0 ? (
                        <>
                          <Box 
                            sx={{ 
                              position: 'relative', 
                              height: 400, 
                              bgcolor: '#0f172a', 
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'center',
                              cursor: 'pointer'
                            }}
                            onClick={() => setLightboxOpen(true)}
                          >
                            {!imageErrors[photos[selectedImageIndex]] ? (
                              <img
                                src={getImageUrl(photos[selectedImageIndex])}
                                alt={`Photo du logement ${logement.numero}`}
                                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                onError={() => handleImageError(photos[selectedImageIndex])}
                              />
                            ) : (
                              <Box sx={{ textAlign: 'center', color: '#fff' }}>
                                <PhotoCamera sx={{ fontSize: 64, mb: 2, opacity: 0.5 }} />
                                <Typography variant="body2">Image non disponible</Typography>
                              </Box>
                            )}
                            {photos.length > 1 && (
                              <>
                                <IconButton 
                                  sx={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', bgcolor: 'rgba(0,0,0,0.5)', color: '#fff', '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' } }}
                                  onClick={(e) => { e.stopPropagation(); prevImage(); }}
                                >
                                  <ChevronLeft />
                                </IconButton>
                                <IconButton 
                                  sx={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', bgcolor: 'rgba(0,0,0,0.5)', color: '#fff', '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' } }}
                                  onClick={(e) => { e.stopPropagation(); nextImage(); }}
                                >
                                  <ChevronRight />
                                </IconButton>
                                <Box sx={{ position: 'absolute', bottom: 16, right: 16, bgcolor: 'rgba(0,0,0,0.6)', px: 1.5, py: 0.5, borderRadius: 2 }}>
                                  <Typography variant="caption" sx={{ color: '#fff', fontWeight: 500 }}>
                                    {selectedImageIndex + 1}/{photos.length}
                                  </Typography>
                                </Box>
                              </>
                            )}
                          </Box>
                          {photos.length > 1 && (
                            <ImageList cols={5} gap={8} sx={{ p: 1.5, m: 0 }}>
                              {photos.map((photo, idx) => (
                                <ImageListItem 
                                  key={idx} 
                                  sx={{ 
                                    cursor: 'pointer', 
                                    borderRadius: 1.5, 
                                    overflow: 'hidden',
                                    border: selectedImageIndex === idx ? '2px solid #2e7d32' : '1px solid #e2e8f0',
                                    transition: 'all 0.2s',
                                    '&:hover': { transform: 'scale(1.05)' }
                                  }} 
                                  onClick={() => setSelectedImageIndex(idx)}
                                >
                                  {!imageErrors[photo] ? (
                                    <img 
                                      src={getImageUrl(photo)} 
                                      alt={`Photo ${idx + 1}`}
                                      style={{ height: 60, width: '100%', objectFit: 'cover' }}
                                      onError={() => handleImageError(photo)}
                                    />
                                  ) : (
                                    <Box sx={{ height: 60, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#f1f5f9' }}>
                                      <PhotoCamera sx={{ fontSize: 20, color: '#cbd5e1' }} />
                                    </Box>
                                  )}
                                </ImageListItem>
                              ))}
                            </ImageList>
                          )}
                        </>
                      ) : (
                        <Box sx={{ height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', bgcolor: '#f8fafc' }}>
                          <PhotoCamera sx={{ fontSize: 64, color: '#cbd5e1', mb: 2 }} />
                          <Typography variant="body1" sx={{ color: '#64748b' }}>Aucune photo</Typography>
                          <Typography variant="caption" sx={{ color: '#94a3b8' }}>Ajoutez des photos pour visualiser le logement</Typography>
                        </Box>
                      )}
                    </Card>
                  </motion.div>
                </Grid>

                {/* Informations et Plan */}
                <Grid size={{ xs: 12, md: 5 }}>
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                  >
                    <Card sx={{ borderRadius: 3, border: '1px solid #e2e8f0', height: '100%' }}>
                      <CardContent sx={{ p: 3 }}>
                        {/* Prix */}
                        <Box sx={{ textAlign: 'center', mb: 3, p: 2, bgcolor: '#e8f5e9', borderRadius: 2 }}>
                          <Typography variant="caption" sx={{ color: '#2e7d32', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>
                            Loyer mensuel
                          </Typography>
                          <Typography variant="h4" sx={{ fontWeight: 800, color: '#2e7d32', my: 0.5 }}>
                            {logement.loyer_base.toLocaleString()} Ar
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#64748b' }}>
                            + {logement.charges_mensuelles.toLocaleString()} Ar de charges
                          </Typography>
                        </Box>

                        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Apartment sx={{ fontSize: 18, color: '#2e7d32' }} /> Caractéristiques
                        </Typography>
                        
                        <Grid container spacing={2}>
                          <Grid size={{ xs: 6 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 1.5, bgcolor: '#f8fafc', borderRadius: 2 }}>
                              <LocationOn sx={{ color: '#94a3b8', fontSize: 20 }} />
                              <Box>
                                <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>Étage</Typography>
                                <Typography variant="body2" sx={{ fontWeight: 600 }}>{logement.etage || 'RDC'}</Typography>
                              </Box>
                            </Box>
                          </Grid>
                          <Grid size={{ xs: 6 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 1.5, bgcolor: '#f8fafc', borderRadius: 2 }}>
                              <SquareFoot sx={{ color: '#94a3b8', fontSize: 20 }} />
                              <Box>
                                <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>Surface</Typography>
                                <Typography variant="body2" sx={{ fontWeight: 600 }}>{logement.surface} m²</Typography>
                              </Box>
                            </Box>
                          </Grid>
                          <Grid size={{ xs: 6 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 1.5, bgcolor: '#f8fafc', borderRadius: 2 }}>
                              <Bed sx={{ color: '#94a3b8', fontSize: 20 }} />
                              <Box>
                                <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>Chambres</Typography>
                                <Typography variant="body2" sx={{ fontWeight: 600 }}>{logement.nb_chambres}</Typography>
                              </Box>
                            </Box>
                          </Grid>
                          <Grid size={{ xs: 6 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 1.5, bgcolor: '#f8fafc', borderRadius: 2 }}>
                              <Bathtub sx={{ color: '#94a3b8', fontSize: 20 }} />
                              <Box>
                                <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>Salles de bain</Typography>
                                <Typography variant="body2" sx={{ fontWeight: 600 }}>{logement.nb_sdb}</Typography>
                              </Box>
                            </Box>
                          </Grid>
                          {logement.nb_pieces > 0 && (
                            <Grid size={{ xs: 6 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 1.5, bgcolor: '#f8fafc', borderRadius: 2 }}>
                                <MeetingRoom sx={{ color: '#94a3b8', fontSize: 20 }} />
                                <Box>
                                  <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>Pièces</Typography>
                                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{logement.nb_pieces}</Typography>
                                </Box>
                              </Box>
                            </Grid>
                          )}
                          {logement.nb_wc > 0 && (
                            <Grid size={{ xs: 6 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 1.5, bgcolor: '#f8fafc', borderRadius: 2 }}>
                                <WaterDrop sx={{ color: '#94a3b8', fontSize: 20 }} />
                                <Box>
                                  <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>WC</Typography>
                                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{logement.nb_wc}</Typography>
                                </Box>
                              </Box>
                            </Grid>
                          )}
                        </Grid>

                        {/* Équipements */}
                        {logement.equipements && logement.equipements.length > 0 && (
                          <>
                            <Divider sx={{ my: 2 }} />
                            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5, color: '#0f172a' }}>
                              Équipements
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                              {logement.equipements.map((equip, idx) => (
                                <Chip 
                                  key={idx}
                                  label={equip}
                                  size="small"
                                  sx={{ bgcolor: '#f1f5f9', color: '#475569', fontSize: '0.7rem' }}
                                />
                              ))}
                            </Box>
                          </>
                        )}

                        {/* Plan */}
                        {hasPlan && (
                          <>
                            <Divider sx={{ my: 2 }} />
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Description sx={{ color: '#2e7d32', fontSize: 18 }} /> Plan du logement
                              </Typography>
                              <Button 
                                size="small" 
                                startIcon={<Visibility sx={{ fontSize: 14 }} />} 
                                onClick={() => setPlanDialogOpen(true)} 
                                sx={{ textTransform: 'none' }}
                              >
                                Agrandir
                              </Button>
                            </Box>
                            
                            <Box 
                              sx={{ 
                                height: 180, 
                                bgcolor: '#f8fafc', 
                                borderRadius: 2, 
                                overflow: 'hidden',
                                cursor: 'pointer',
                                border: '1px solid #e2e8f0',
                                position: 'relative'
                              }}
                              onClick={() => setPlanDialogOpen(true)}
                            >
                              <img 
                                src={getImageUrl(logement.plan_url)} 
                                alt="Plan du logement"
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                }}
                              />
                            </Box>
                          </>
                        )}

                        {/* Description */}
                        {logement.description && (
                          <>
                            <Divider sx={{ my: 2 }} />
                            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, color: '#0f172a' }}>
                              Description
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#475569', lineHeight: 1.6 }}>
                              {logement.description}
                            </Typography>
                          </>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              </Grid>

              {/* Tabs pour Travaux, Historique, Statistiques */}
              <Box sx={{ mt: 4 }}>
                <Tabs 
                  value={tabValue} 
                  onChange={(_, v) => setTabValue(v)} 
                  sx={{ 
                    mb: 3,
                    '& .MuiTabs-indicator': {
                      bgcolor: '#2e7d32',
                      height: 3
                    },
                    '& .MuiTab-root': { 
                      textTransform: 'none', 
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      minHeight: 48,
                      '&.Mui-selected': { color: '#2e7d32' }
                    } 
                  }}
                >
                  <Tab label="Travaux" icon={<Build sx={{ fontSize: 18 }} />} iconPosition="start" />
                  <Tab label="Historique" icon={<Person sx={{ fontSize: 18 }} />} iconPosition="start" />
                  <Tab label="Statistiques" icon={<TrendingUp sx={{ fontSize: 18 }} />} iconPosition="start" />
                </Tabs>

                <AnimatePresence mode="wait">
                  {tabValue === 0 && (
                    <motion.div key="travaux" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                      <Card sx={{ borderRadius: 3, border: '1px solid #e2e8f0' }}>
                        {travaux.length === 0 ? (
                          <Box sx={{ textAlign: 'center', py: 6 }}>
                            <Build sx={{ fontSize: 64, color: '#cbd5e1', mb: 2 }} />
                            <Typography variant="h6" sx={{ color: '#64748b' }}>Aucun travaux</Typography>
                            <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                              Aucun travail n'a été enregistré pour ce logement
                            </Typography>
                          </Box>
                        ) : (
                          <List sx={{ p: 0 }}>
                            {travaux.map((t, idx) => (
                              <ListItem key={t.id} divider={idx < travaux.length - 1} sx={{ py: 2, px: 3 }}>
                                <ListItemAvatar>
                                  <Avatar sx={{ bgcolor: '#e8f5e9' }}>
                                    <Build sx={{ color: '#2e7d32' }} />
                                  </Avatar>
                                </ListItemAvatar>
                                <ListItemText 
                                    primary={<Typography variant="subtitle2" sx={{ fontWeight: 600 }}>{t.type_travaux}</Typography>} 
                                    secondary={t.description}
                                    slotProps={{
                                        secondary: {
                                        sx: { color: '#64748b', fontSize: '0.75rem' }
                                        }
                                    }}
                                    />
                                <Chip 
                                  label={t.statut} 
                                  size="small" 
                                  sx={{ 
                                    height: 24, 
                                    fontSize: '0.7rem',
                                    bgcolor: t.statut === 'terminé' ? '#e8f5e9' : t.statut === 'en_cours' ? '#fff3e0' : '#f1f5f9',
                                    color: t.statut === 'terminé' ? '#2e7d32' : t.statut === 'en_cours' ? '#e65100' : '#64748b'
                                  }} 
                                />
                              </ListItem>
                            ))}
                          </List>
                        )}
                      </Card>
                    </motion.div>
                  )}

                  {tabValue === 1 && (
                    <motion.div key="historique" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                      <Card sx={{ borderRadius: 3, border: '1px solid #e2e8f0' }}>
                        {historique.length === 0 ? (
                          <Box sx={{ textAlign: 'center', py: 6 }}>
                            <Person sx={{ fontSize: 64, color: '#cbd5e1', mb: 2 }} />
                            <Typography variant="h6" sx={{ color: '#64748b' }}>Aucun historique</Typography>
                            <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                              Aucun locataire n'a été enregistré pour ce logement
                            </Typography>
                          </Box>
                        ) : (
                          <List sx={{ p: 0 }}>
                            {historique.map((h, idx) => (
                              <ListItem key={h.id} divider={idx < historique.length - 1} sx={{ py: 2, px: 3 }}>
                                <ListItemAvatar>
                                  <Avatar sx={{ bgcolor: '#e8f5e9' }}>
                                    <Person sx={{ color: '#2e7d32' }} />
                                  </Avatar>
                                </ListItemAvatar>
                                <ListItemText 
                                    primary={<Typography variant="subtitle2" sx={{ fontWeight: 600 }}>{h.nom}</Typography>} 
                                    secondary={`${new Date(h.date_debut).toLocaleDateString()} - ${h.date_fin ? new Date(h.date_fin).toLocaleDateString() : 'actuel'}`}
                                    slotProps={{
                                        secondary: {
                                        sx: { color: '#64748b', fontSize: '0.75rem' }
                                        }
                                    }}
                                    />
                                <Chip 
                                  label={`${h.loyer.toLocaleString()} Ar/mois`} 
                                  size="small" 
                                  sx={{ bgcolor: '#e8f5e9', color: '#2e7d32', height: 24, fontSize: '0.7rem' }} 
                                />
                              </ListItem>
                            ))}
                          </List>
                        )}
                      </Card>
                    </motion.div>
                  )}

                  {tabValue === 2 && stats && (
                    <motion.div key="stats" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                      <Grid container spacing={2.5}>
                        <Grid size={{ xs: 12, sm: 4 }}>
                          <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 3, border: '1px solid #e2e8f0' }}>
                            <Avatar sx={{ width: 48, height: 48, mx: 'auto', mb: 1.5, bgcolor: '#e8f5e9' }}>
                              <Person sx={{ color: '#2e7d32' }} />
                            </Avatar>
                            <Typography variant="h4" sx={{ fontWeight: 800, color: '#2e7d32' }}>
                              {stats.nb_locataires_historique || 0}
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#64748b' }}>Locataires total</Typography>
                          </Paper>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 4 }}>
                          <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 3, border: '1px solid #e2e8f0' }}>
                            <Avatar sx={{ width: 48, height: 48, mx: 'auto', mb: 1.5, bgcolor: '#e3f2fd' }}>
                              <TrendingUp sx={{ color: '#1565c0' }} />
                            </Avatar>
                            <Typography variant="h4" sx={{ fontWeight: 800, color: '#1565c0' }}>
                              {stats.taux_occupation_historique || 0}%
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#64748b' }}>Taux d'occupation</Typography>
                          </Paper>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 4 }}>
                          <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 3, border: '1px solid #e2e8f0' }}>
                            <Avatar sx={{ width: 48, height: 48, mx: 'auto', mb: 1.5, bgcolor: '#fff3e0' }}>
                              <CalendarToday sx={{ color: '#e65100' }} />
                            </Avatar>
                            <Typography variant="h4" sx={{ fontWeight: 800, color: '#e65100' }}>
                              {stats.duree_moyenne_location || 0}
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#64748b' }}>Mois moyen de location</Typography>
                          </Paper>
                        </Grid>
                      </Grid>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Box>
            </Box>
          </Fade>
        </Container>
      </Box>

      {/* Lightbox pour les photos */}
      <Dialog 
        open={lightboxOpen} 
        onClose={() => setLightboxOpen(false)} 
        maxWidth="lg" 
        fullWidth
        sx={{
          '& .MuiDialog-paper': {
            bgcolor: 'transparent',
            boxShadow: 'none',
            margin: 0,
            maxWidth: '90vw',
            width: '100%',
            overflow: 'hidden'
          }
        }}
      >
        <Box sx={{ position: 'relative', bgcolor: '#000', minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <MuiIconButton 
            sx={{ position: 'absolute', top: 16, right: 16, color: '#fff', bgcolor: 'rgba(0,0,0,0.5)', zIndex: 10, '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' } }} 
            onClick={() => setLightboxOpen(false)}
          >
            <Close />
          </MuiIconButton>
          {photos.length > 1 && (
            <>
              <MuiIconButton 
                sx={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#fff', bgcolor: 'rgba(0,0,0,0.5)', zIndex: 10, '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' } }} 
                onClick={prevImage}
              >
                <ChevronLeft sx={{ fontSize: 48 }} />
              </MuiIconButton>
              <MuiIconButton 
                sx={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', color: '#fff', bgcolor: 'rgba(0,0,0,0.5)', zIndex: 10, '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' } }} 
                onClick={nextImage}
              >
                <ChevronRight sx={{ fontSize: 48 }} />
              </MuiIconButton>
            </>
          )}
          {photos.length > 0 && !imageErrors[photos[selectedImageIndex]] ? (
            <img 
              src={getImageUrl(photos[selectedImageIndex])} 
              alt="Logement" 
              style={{ maxWidth: '90%', maxHeight: '85vh', objectFit: 'contain' }} 
              onError={() => handleImageError(photos[selectedImageIndex])}
            />
          ) : (
            <Box sx={{ textAlign: 'center', color: '#fff' }}>
              <PhotoCamera sx={{ fontSize: 80, mb: 2, opacity: 0.5 }} />
              <Typography variant="h6">Image non disponible</Typography>
            </Box>
          )}
          {photos.length > 1 && (
            <Box sx={{ position: 'absolute', bottom: 24, left: 0, right: 0, textAlign: 'center', zIndex: 10 }}>
              <Typography variant="body2" sx={{ color: '#fff', bgcolor: 'rgba(0,0,0,0.6)', px: 2, py: 0.75, borderRadius: 3, display: 'inline-block' }}>
                {selectedImageIndex + 1} / {photos.length}
              </Typography>
            </Box>
          )}
        </Box>
      </Dialog>

      {/* Dialog pour le plan */}
      <Dialog 
        open={planDialogOpen} 
        onClose={() => setPlanDialogOpen(false)} 
        maxWidth="md" 
        fullWidth
        sx={{
          '& .MuiDialog-paper': {
            bgcolor: '#fff',
            margin: 0,
            overflow: 'hidden',
            borderRadius: 2
          }
        }}
      >
        <Box sx={{ position: 'relative', bgcolor: '#fff', p: 1 }}>
          <MuiIconButton 
            sx={{ position: 'absolute', top: 8, right: 8, color: '#666', bgcolor: '#f5f5f5', zIndex: 1, '&:hover': { bgcolor: '#e0e0e0' } }} 
            onClick={() => setPlanDialogOpen(false)} 
            size="small"
          >
            <Close />
          </MuiIconButton>
          {hasPlan && (
            <img 
              src={getImageUrl(logement.plan_url)} 
              alt="Plan du logement" 
              style={{ width: '100%', height: 'auto', maxHeight: '85vh', objectFit: 'contain' }} 
              onError={(e) => {
                console.error('Erreur chargement plan dialog:', logement.plan_url);
                e.currentTarget.style.display = 'none';
              }}
            />
          )}
        </Box>
      </Dialog>
    </Box>
  );
}