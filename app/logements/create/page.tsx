'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Box, Container, Typography, IconButton, Breadcrumbs, Link, Paper, 
  Fade, alpha, Avatar, Button, Stepper, Step, StepLabel
} from '@mui/material';
import { 
  ArrowBack, Home, Apartment, AddBox, CheckCircle, 
  Dashboard, Description, PhotoCamera
} from '@mui/icons-material';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import LogementForm from '@/components/logements/LogementForm';
import { logementService } from '@/services/logementService';
import { motion, AnimatePresence } from 'framer-motion';

export default function CreateLogementPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [success, setSuccess] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  const steps = ['Informations', 'Détails', 'Médias'];

  const handleSubmit = async (data: any) => {
    setLoading(true);
    setSuccess(false);
    try {
      const result = await logementService.create(data);
      setSuccess(true);
      
      // Animation de succès puis redirection après 2 secondes
      setTimeout(() => {
        router.push('/logements');
      }, 2000);
      
      return result;
    } catch (error) {
      console.error('Erreur:', error);
      setSuccess(false);
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
        
        <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 }, py: { xs: 2, sm: 2.5 }, mt: { xs: 7, sm: 8 } }}>
          <Fade in timeout={500}>
            <Box>
              {/* Breadcrumbs modernisés */}
              <Breadcrumbs sx={{ mb: 2.5 }} separator={<ChevronRight sx={{ fontSize: 14, color: '#94a3b8' }} />}>
                <Link 
                  href="/" 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    color: '#64748b', 
                    textDecoration: 'none',
                    transition: 'all 0.2s',
                    '&:hover': { color: '#2e7d32', transform: 'translateX(2px)' }
                  }}
                >
                  <Home sx={{ mr: 0.5, fontSize: 14 }} /> Accueil
                </Link>
                <Link 
                  href="/logements" 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    color: '#64748b', 
                    textDecoration: 'none',
                    transition: 'all 0.2s',
                    '&:hover': { color: '#2e7d32', transform: 'translateX(2px)' }
                  }}
                >
                  <Apartment sx={{ mr: 0.5, fontSize: 14 }} /> Logements
                </Link>
                <Typography 
                  color="#2e7d32" 
                  sx={{ 
                    fontSize: '0.75rem', 
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5
                  }}
                >
                  <AddBox sx={{ fontSize: 12 }} /> Nouveau logement
                </Typography>
              </Breadcrumbs>

              {/* Header avec effet glassmorphism */}
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 3, 
                  mb: 3, 
                  borderRadius: 3, 
                  background: 'linear-gradient(135deg, #fff 0%, #f8fafc 100%)',
                  border: '1px solid rgba(46,125,50,0.1)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <Box sx={{ 
                  position: 'absolute', 
                  top: -20, 
                  right: -20, 
                  width: 150, 
                  height: 150, 
                  borderRadius: '50%', 
                  bgcolor: alpha('#2e7d32', 0.05),
                  zIndex: 0
                }} />
                
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2, position: 'relative', zIndex: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar 
                      sx={{ 
                        bgcolor: alpha('#2e7d32', 0.1), 
                        width: 56, 
                        height: 56,
                        transition: 'transform 0.3s ease',
                        '&:hover': { transform: 'scale(1.05)' }
                      }}
                    >
                      <AddBox sx={{ color: '#2e7d32', fontSize: 28 }} />
                    </Avatar>
                    <Box>
                      <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
                        Ajouter un logement
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#64748b', mt: 0.5, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Dashboard sx={{ fontSize: 12 }} /> Complétez les informations pour créer un nouveau logement
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Button
                    variant="outlined"
                    onClick={() => router.back()}
                    size="small"
                    startIcon={<ArrowBack sx={{ fontSize: 16 }} />}
                    sx={{ 
                      borderRadius: 2,
                      textTransform: 'none',
                      borderColor: '#e2e8f0',
                      color: '#64748b',
                      '&:hover': { borderColor: '#f44336', color: '#f44336', bgcolor: alpha('#f44336', 0.05) }
                    }}
                  >
                    Retour
                  </Button>
                </Box>

                {/* Stepper moderne */}
                <Box sx={{ mt: 3, pt: 1 }}>
                  <Stepper 
                    activeStep={activeStep} 
                    alternativeLabel
                    sx={{
                      '& .MuiStepConnector-line': {
                        borderColor: '#e2e8f0',
                        borderWidth: 2
                      },
                      '& .MuiStepLabel-label': {
                        fontSize: '0.7rem',
                        fontWeight: 500,
                        color: '#94a3b8',
                        '&.Mui-active': { color: '#2e7d32', fontWeight: 600 },
                        '&.Mui-completed': { color: '#2e7d32' }
                      },
                      '& .MuiStepIcon-root': {
                        color: '#cbd5e1',
                        '&.Mui-active': { color: '#2e7d32' },
                        '&.Mui-completed': { color: '#2e7d32' }
                      }
                    }}
                  >
                    {steps.map((label, index) => (
                      <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                      </Step>
                    ))}
                  </Stepper>
                </Box>
              </Paper>

              {/* Message de succès */}
              <AnimatePresence>
                {success && (
                  <motion.div
                    initial={{ opacity: 0, y: -20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Paper 
                      sx={{ 
                        p: 2, 
                        mb: 3, 
                        borderRadius: 2,
                        bgcolor: alpha('#2e7d32', 0.1),
                        border: '1px solid rgba(46,125,50,0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2
                      }}
                    >
                      <CheckCircle sx={{ color: '#2e7d32', fontSize: 28 }} />
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#2e7d32' }}>
                          Logement créé avec succès !
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#64748b' }}>
                          Redirection vers la liste des logements...
                        </Typography>
                      </Box>
                    </Paper>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Formulaire avec animations */}
              <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    >
                    <LogementForm 
                        onSubmit={handleSubmit} 
                        onCancel={() => router.back()} 
                        isLoading={loading}
                        // onStepChange={setActiveStep} ← Supprimez ou commentez cette ligne
                    />
                </motion.div>

              {/* Footer informatif */}
              <Box sx={{ mt: 3, textAlign: 'center' }}>
                <Typography variant="caption" sx={{ color: '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                  <Description sx={{ fontSize: 12 }} />
                  Tous les champs marqués d'un * sont obligatoires
                </Typography>
              </Box>
            </Box>
          </Fade>
        </Container>
      </Box>
    </Box>
  );
}

// Composant ChevronRight pour les breadcrumbs
const ChevronRight = ({ sx }: { sx?: any }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={sx}>
    <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);