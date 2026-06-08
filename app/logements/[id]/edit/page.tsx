'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  Box, Container, Typography, IconButton, CircularProgress, Alert, 
  Breadcrumbs, Link, Paper, Tabs, Tab, Button, Chip, Fade, 
  alpha, Avatar, Divider
} from '@mui/material';
import { 
  ArrowBack, Home, Apartment, Save, PhotoCamera, Description,
  Info, CheckCircle, Cancel, Edit, ChevronRight
} from '@mui/icons-material';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import LogementForm from '@/components/logements/LogementForm';
import MediaManager from '@/components/logements/MediaManager';
import { logementService, Logement } from '@/services/logementService';
import { motion, AnimatePresence } from 'framer-motion';

export default function EditLogementPage() {
  const { id } = useParams();
  const router = useRouter();
  const [logement, setLogement] = useState<Logement | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    fetchLogement();
  }, [id]);

  const fetchLogement = async () => {
    try {
      const data = await logementService.getById(Number(id));
      setLogement(data);
    } catch (error) {
      setError("Logement non trouvé");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data: any) => {
    setSubmitting(true);
    setError(null);
    setSaveSuccess(false);
    try {
      await logementService.update(Number(id), data);
      await fetchLogement();
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      setError("Erreur lors de la modification");
    } finally {
      setSubmitting(false);
    }
  };

  const handleMediaUpload = async (files: File[], type: 'photos' | 'plan') => {
    if (type === 'photos') {
      return await logementService.uploadPhotos(Number(id), files);
    } else {
      return await logementService.uploadPlan(Number(id), files[0]);
    }
  };

  const handlePhotoDelete = async (photoUrl: string) => {
    return await logementService.deletePhoto(Number(id), photoUrl);
  };

  const tabs = [
    { label: 'Informations', icon: <Info />, value: 0, color: '#2e7d32' },
    { label: 'Photos', icon: <PhotoCamera />, value: 1, color: '#1565c0' },
    { label: 'Plan', icon: <Description />, value: 2, color: '#ff9800' },
  ];

  const getTabCount = () => {
    if (tabValue === 0) return 'Informations générales';
    if (tabValue === 1) return `${logement?.photos?.length || 0} photo(s)`;
    if (tabValue === 2) return logement?.plan_url ? 'Plan disponible' : 'Aucun plan';
    return '';
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', bgcolor: '#f8fafc', minHeight: '100vh' }}>
        <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
        <Box component="main" sx={{ flexGrow: 1 }}>
          <Header onMenuClick={() => setMobileOpen(!mobileOpen)} />
          <Container maxWidth="lg" sx={{ mt: 10 }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
              {/* ✅ Remplacer Stack par Box */}
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                <CircularProgress sx={{ color: '#2e7d32' }} />
                <Typography variant="body2" sx={{ color: '#64748b' }}>Chargement du logement...</Typography>
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
          <Container maxWidth="lg" sx={{ mt: 10 }}>
            <Alert severity="error" sx={{ borderRadius: 2 }}>Logement non trouvé</Alert>
            <Button sx={{ mt: 2 }} onClick={() => router.push('/logements')}>Retour</Button>
          </Container>
        </Box>
      </Box>
    );
  }

  const currentTab = tabs.find(t => t.value === tabValue) || tabs[0];

  return (
    <Box sx={{ display: 'flex', bgcolor: '#f8fafc', minHeight: '100vh' }}>
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Header onMenuClick={() => setMobileOpen(!mobileOpen)} />
        
        <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 }, py: { xs: 2, sm: 2.5 }, mt: { xs: 7, sm: 8 } }}>
          <Fade in timeout={400}>
            <Box>
              {/* Breadcrumbs modernisés */}
              <Breadcrumbs sx={{ mb: 2 }} separator={<ChevronRight sx={{ fontSize: 14, color: '#94a3b8' }} />}>
                <Link href="/" sx={{ display: 'flex', alignItems: 'center', color: '#64748b', textDecoration: 'none', '&:hover': { color: '#2e7d32' } }}>
                  <Home sx={{ mr: 0.5, fontSize: 14 }} /> Accueil
                </Link>
                <Link href="/logements" sx={{ display: 'flex', alignItems: 'center', color: '#64748b', textDecoration: 'none', '&:hover': { color: '#2e7d32' } }}>
                  <Apartment sx={{ mr: 0.5, fontSize: 14 }} /> Logements
                </Link>
                <Typography color="#2e7d32" sx={{ fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                  <Edit sx={{ mr: 0.5, fontSize: 12 }} /> Modification
                </Typography>
              </Breadcrumbs>

              {/* Header avec effet glassmorphism */}
              <Paper elevation={0} sx={{ 
                p: 2.5, 
                mb: 3, 
                borderRadius: 3, 
                background: 'linear-gradient(135deg, #fff 0%, #f8fafc 100%)',
                border: '1px solid rgba(46,125,50,0.1)',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ bgcolor: '#e8f5e9', width: 48, height: 48 }}>
                      <Apartment sx={{ color: '#2e7d32', fontSize: 24 }} />
                    </Avatar>
                    <Box>
                      <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
                        Modifier le logement
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                        <Chip 
                          label={`N° ${logement.numero}`} 
                          size="small" 
                          sx={{ bgcolor: '#2e7d32', color: '#fff', fontWeight: 500, height: 24 }} 
                        />
                        <Chip 
                          label={logement.statut === 'libre' ? 'Libre' : logement.statut === 'occupe' ? 'Occupé' : logement.statut} 
                          size="small" 
                          sx={{ 
                            bgcolor: logement.statut === 'libre' ? '#e8f5e9' : logement.statut === 'occupe' ? '#e3f2fd' : '#f1f5f9',
                            color: logement.statut === 'libre' ? '#2e7d32' : logement.statut === 'occupe' ? '#1565c0' : '#475569',
                            fontWeight: 500, 
                            height: 24 
                          }} 
                        />
                      </Box>
                    </Box>
                  </Box>
                  
                  {saveSuccess && (
                    <Fade in>
                      <Chip 
                        icon={<CheckCircle sx={{ fontSize: 16 }} />}
                        label="Modifications enregistrées" 
                        sx={{ bgcolor: '#e8f5e9', color: '#2e7d32', fontWeight: 500 }} 
                      />
                    </Fade>
                  )}
                </Box>
              </Paper>

              {/* Message d'erreur */}
              <AnimatePresence>
                {error && (
                  <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                    <Alert 
                      severity="error" 
                      sx={{ mb: 3, borderRadius: 2 }} 
                      onClose={() => setError(null)}
                      action={
                        <Button color="inherit" size="small" onClick={() => setError(null)}>
                          Fermer
                        </Button>
                      }
                    >
                      {error}
                    </Alert>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Tabs modernisés */}
              <Box sx={{ mb: 3 }}>
                <Tabs 
                  value={tabValue} 
                  onChange={(_, v) => setTabValue(v)} 
                  sx={{ 
                    mb: 2,
                    minHeight: 48,
                    '& .MuiTabs-indicator': {
                      height: 3,
                      borderRadius: '3px 3px 0 0',
                      backgroundColor: '#2e7d32'
                    }
                  }}
                >
                  {tabs.map((tab) => (
                    <Tab 
                      key={tab.value}
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {tab.icon}
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>{tab.label}</Typography>
                          {tab.value === 1 && logement.photos && logement.photos.length > 0 && (
                            <Chip 
                              label={logement.photos.length} 
                              size="small" 
                              sx={{ 
                                height: 18, 
                                fontSize: '0.6rem', 
                                bgcolor: tabValue === 1 ? '#fff' : '#e8f5e9',
                                color: '#2e7d32'
                              }} 
                            />
                          )}
                          {tab.value === 2 && logement.plan_url && (
                            <Chip 
                              label="✓" 
                              size="small" 
                              sx={{ 
                                height: 18, 
                                width: 18, 
                                bgcolor: tabValue === 2 ? '#fff' : '#e8f5e9',
                                color: '#2e7d32',
                                '& .MuiChip-label': { p: 0 }
                              }} 
                            />
                          )}
                        </Box>
                      } 
                      iconPosition="start"
                      sx={{ 
                        textTransform: 'none',
                        fontWeight: 500,
                        minHeight: 48,
                        '&.Mui-selected': { color: '#2e7d32' }
                      }}
                    />
                  ))}
                </Tabs>
                
                {/* Indicateur de section */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="caption" sx={{ color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: currentTab.color }} />
                    {getTabCount()}
                  </Typography>
                  {tabValue === 0 && (
                    <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                      Tous les champs marqués d'un * sont obligatoires
                    </Typography>
                  )}
                </Box>
              </Box>

              {/* Contenu des tabs avec animations */}
              <AnimatePresence mode="wait">
                {tabValue === 0 && (
                  <motion.div
                    key="info"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <LogementForm 
                      initialData={logement} 
                      onSubmit={handleSubmit} 
                      onCancel={() => router.back()} 
                      isLoading={submitting} 
                    />
                  </motion.div>
                )}

                {tabValue === 1 && (
                  <motion.div
                    key="photos"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <MediaManager
                      logementId={Number(id)}
                      existingPhotos={logement.photos || []}
                      existingPlan={logement.plan_url}
                      onPhotosUpdate={(photos) => {
                        setLogement(prev => prev ? { ...prev, photos } : prev);
                      }}
                      onPlanUpdate={(plan) => {
                        setLogement(prev => prev ? { ...prev, plan_url: plan } : prev);
                      }}
                      onUpload={handleMediaUpload}
                      onDeletePhoto={handlePhotoDelete}
                    />
                  </motion.div>
                )}

                {tabValue === 2 && (
                  <motion.div
                    key="plan"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <MediaManager
                      logementId={Number(id)}
                      existingPhotos={logement.photos || []}
                      existingPlan={logement.plan_url}
                      onPhotosUpdate={(photos) => {
                        setLogement(prev => prev ? { ...prev, photos } : prev);
                      }}
                      onPlanUpdate={(plan) => {
                        setLogement(prev => prev ? { ...prev, plan_url: plan } : prev);
                      }}
                      onUpload={handleMediaUpload}
                      onDeletePhoto={handlePhotoDelete}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Footer avec actions */}
              <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                <Button
                  variant="outlined"
                  onClick={() => router.back()}
                  sx={{ 
                    borderRadius: 2,
                    textTransform: 'none',
                    px: 3,
                    borderColor: '#e2e8f0',
                    color: '#64748b',
                    '&:hover': { borderColor: '#f44336', color: '#f44336' }
                  }}
                >
                  Annuler
                </Button>
                {tabValue === 0 && (
                  <Button
                    variant="contained"
                    onClick={() => document.querySelector('form')?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }))}
                    disabled={submitting}
                    sx={{ 
                      bgcolor: '#2e7d32', 
                      borderRadius: 2,
                      textTransform: 'none',
                      px: 4,
                      boxShadow: '0 2px 8px rgba(46,125,50,0.2)',
                      '&:hover': { bgcolor: '#1b5e20', transform: 'translateY(-2px)', boxShadow: '0 4px 12px rgba(46,125,50,0.3)' },
                      transition: 'all 0.2s'
                    }}
                    startIcon={submitting ? <CircularProgress size={16} sx={{ color: '#fff' }} /> : <Save />}
                  >
                    {submitting ? 'Enregistrement...' : 'Enregistrer les modifications'}
                  </Button>
                )}
              </Box>
            </Box>
          </Fade>
        </Container>
      </Box>
    </Box>
  );
}