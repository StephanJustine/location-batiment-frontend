'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  InputAdornment,
  IconButton,
  CircularProgress,
  Fade,
  Zoom,
  Slide,
  Stack,
  alpha,
} from '@mui/material';
import {
  Person,
  Lock,
  Visibility,
  VisibilityOff,
  Apartment,
  ArrowForward,
} from '@mui/icons-material';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const router = useRouter();
  const { login, user, isLoading: authLoading } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Redirection si déjà connecté
  useEffect(() => {
    if (!authLoading && user) {
      router.push('/');
    }
  }, [user, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim()) {
      setError("Nom d'utilisateur requis");
      return;
    }
    if (!password.trim()) {
      setError("Mot de passe requis");
      return;
    }
    
    setError('');
    setLoading(true);

    try {
      await login(username, password);
      router.push('/');
    } catch (err: any) {
      let errorMessage = "Identifiants incorrects";
      if (err.response?.data?.detail) {
        errorMessage = err.response.data.detail;
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const demoCredentials = [
    { role: 'Administrateur', username: 'admin@locationbatiment.mg', password: 'Admin@123456' },
    { role: 'Gestionnaire', username: 'gestionnaire@locationbatiment.mg', password: 'Gestion@123456' },
  ];

  const fillCredentials = (demoUsername: string, demoPassword: string) => {
    setUsername(demoUsername);
    setPassword(demoPassword);
  };

  if (authLoading) {
    return (
      <Box sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: '#ffffff'
      }}>
        <CircularProgress sx={{ color: '#2e7d32' }} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ffffff',
      }}
    >
      <Container maxWidth="sm">
        <Fade in timeout={800}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, sm: 5 },
              borderRadius: 4,
              backgroundColor: '#ffffff',
              border: '1px solid #e8e8e8',
              boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
            }}
          >
            {/* Logo and Title */}
            <Zoom in timeout={600}>
              <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Box
                  component={motion.div}
                  whileHover={{ scale: 1.02 }}
                  sx={{
                    width: 70,
                    height: 70,
                    borderRadius: '50%',
                    backgroundColor: '#e8f5e9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 20px',
                  }}
                >
                  <Apartment sx={{ fontSize: 40, color: '#2e7d32' }} />
                </Box>
                <Typography
                  variant="h4"
                  component={motion.h1}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  sx={{
                    color: '#1a1a1a',
                    fontWeight: 700,
                    mb: 1,
                    fontSize: { xs: '1.8rem', sm: '2rem' }
                  }}
                >
                  Location Batiment
                </Typography>
                <Typography
                  variant="body2"
                  component={motion.p}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  sx={{ color: '#757575' }}
                >
                  Madagascar
                </Typography>
              </Box>
            </Zoom>

            {/* Error Alert */}
            {error && (
              <Fade in>
                <Alert 
                  severity="error" 
                  sx={{ mb: 3, borderRadius: 2 }}
                  onClose={() => setError('')}
                >
                  {error}
                </Alert>
              </Fade>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit}>
              <Slide direction="right" in timeout={400}>
                <Box>
                  <Typography variant="body2" sx={{ mb: 1, color: '#333', fontWeight: 500 }}>
                    Nom d'utilisateur
                  </Typography>
                  <TextField
                    fullWidth
                    placeholder="admin@locationbatiment.mg"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    onFocus={() => setFocusedField('username')}
                    onBlur={() => setFocusedField(null)}
                    disabled={loading}
                    variant="outlined"
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <Person sx={{ 
                              color: focusedField === 'username' ? '#2e7d32' : '#999',
                              fontSize: 20
                            }} />
                          </InputAdornment>
                        ),
                      },
                    }}
                    sx={{
                      mb: 3,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        backgroundColor: '#fafafa',
                        '&:hover fieldset': {
                          borderColor: '#2e7d32',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#2e7d32',
                          borderWidth: 2,
                        },
                      },
                    }}
                  />
                </Box>
              </Slide>

              <Slide direction="right" in timeout={500}>
                <Box>
                  <Typography variant="body2" sx={{ mb: 1, color: '#333', fontWeight: 500 }}>
                    Mot de passe
                  </Typography>
                  <TextField
                    fullWidth
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                    disabled={loading}
                    variant="outlined"
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <Lock sx={{ 
                              color: focusedField === 'password' ? '#2e7d32' : '#999',
                              fontSize: 20
                            }} />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      },
                    }}
                    sx={{
                      mb: 3,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        backgroundColor: '#fafafa',
                        '&:hover fieldset': {
                          borderColor: '#2e7d32',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#2e7d32',
                          borderWidth: 2,
                        },
                      },
                    }}
                  />
                </Box>
              </Slide>

              {/* Login Button */}
              <Button
                fullWidth
                type="submit"
                variant="contained"
                disabled={loading}
                sx={{
                  mt: 2,
                  mb: 3,
                  py: 1.5,
                  backgroundColor: '#2e7d32',
                  borderRadius: 2,
                  fontSize: 16,
                  fontWeight: 600,
                  textTransform: 'none',
                  boxShadow: 'none',
                  '&:hover': {
                    backgroundColor: '#1b5e20',
                    boxShadow: 'none',
                  },
                  '&.Mui-disabled': {
                    backgroundColor: '#c8e6c9',
                  },
                }}
                endIcon={!loading && <ArrowForward />}
              >
                {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Se connecter'}
              </Button>
            </form>

            {/* Demo Credentials */}
            <Fade in timeout={800}>
              <Box>
                <Box sx={{ textAlign: 'center', mb: 2 }}>
                  <Typography variant="caption" sx={{ color: '#999' }}>
                    Comptes de démonstration
                  </Typography>
                </Box>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  {demoCredentials.map((cred, index) => (
                    <motion.div
                      key={cred.role}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      style={{ flex: 1 }}
                    >
                      <Button
                        fullWidth
                        variant="outlined"
                        onClick={() => fillCredentials(cred.username, cred.password)}
                        sx={{
                          borderColor: '#e0e0e0',
                          borderRadius: 2,
                          py: 1.5,
                          textTransform: 'none',
                          '&:hover': {
                            borderColor: '#2e7d32',
                            backgroundColor: alpha('#2e7d32', 0.05),
                          },
                        }}
                      >
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="caption" sx={{ color: '#666', display: 'block', fontWeight: 500 }}>
                            {cred.role}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#2e7d32', fontFamily: 'monospace', fontSize: '0.65rem' }}>
                            {cred.username}
                          </Typography>
                        </Box>
                      </Button>
                    </motion.div>
                  ))}
                </Stack>
              </Box>
            </Fade>

            {/* Footer Links */}
            <Box sx={{ textAlign: 'center', mt: 3 }}>
              <Button
                onClick={() => router.push('/forgot-password')}
                sx={{
                  textTransform: 'none',
                  color: '#2e7d32',
                  fontWeight: 500,
                  '&:hover': { backgroundColor: 'transparent', textDecoration: 'underline' },
                }}
              >
                Mot de passe oublié ?
              </Button>
            </Box>
          </Paper>
        </Fade>
      </Container>
    </Box>
  );
}