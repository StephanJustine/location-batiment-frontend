// src/app/login/page.tsx
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
} from '@mui/material';
import {
  Person,
  Lock,
  Visibility,
  VisibilityOff,
  Apartment,
} from '@mui/icons-material';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { login, user, isLoading: authLoading } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Rediriger si déjà connecté
  useEffect(() => {
    if (!authLoading && user) {
      router.replace('/');
    }
  }, [user, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!username.trim()) {
      setError("Le nom d'utilisateur est requis");
      return;
    }
    if (!password.trim()) {
      setError("Le mot de passe est requis");
      return;
    }
    
    setError('');
    setLoading(true);

    try {
      console.log('🔐 Tentative de connexion...');
      await login(username.trim(), password);
      // La redirection est gérée dans le contexte Auth
    } catch (err: any) {
      console.error('❌ Erreur login:', err);
      
      // Gestion des différents types d'erreurs
      let errorMessage = "Erreur de connexion";
      
      if (err.response) {
        // Erreur serveur
        if (err.response.status === 401) {
          errorMessage = "Nom d'utilisateur ou mot de passe incorrect";
        } else if (err.response.status === 422) {
          errorMessage = "Erreur de validation. Vérifiez les champs.";
          console.error('Détail erreur 422:', err.response.data);
        } else if (err.response.data?.detail) {
          errorMessage = err.response.data.detail;
        }
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Écran de chargement pendant la vérification auth
  if (authLoading) {
    return (
      <Box sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center', 
        bgcolor: '#f5f5f5' 
      }}>
        <CircularProgress size={40} sx={{ color: '#2e7d32', mb: 2 }} />
        <Typography variant="body2" color="text.secondary">
          Vérification de la session...
        </Typography>
      </Box>
    );
  }

  // Ne pas afficher le formulaire si déjà connecté
  if (user) {
    return null;
  }

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      bgcolor: '#f5f5f5',
      p: 2
    }}>
      <Container maxWidth="xs" disableGutters>
        <Paper 
          elevation={0} 
          sx={{ 
            p: 4, 
            borderRadius: 3, 
            border: '1px solid #e0e0e0', 
            bgcolor: '#fff',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
          }}
        >
          {/* Logo et titre */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Box sx={{ 
              width: 56, 
              height: 56, 
              borderRadius: 2, 
              bgcolor: '#2e7d32', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              margin: '0 auto 16px',
              boxShadow: '0 4px 12px rgba(46,125,50,0.3)'
            }}>
              <Apartment sx={{ fontSize: 32, color: '#fff' }} />
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#1a1a1a', mb: 0.5 }}>
              Location Batiment
            </Typography>
            <Typography variant="body2" sx={{ color: '#757575' }}>
              Système de gestion locative
            </Typography>
          </Box>

          {/* Message d'erreur */}
          {error && (
            <Alert 
              severity="error" 
              sx={{ mb: 3, borderRadius: 1 }}
              onClose={() => setError('')}
            >
              {error}
            </Alert>
          )}

          {/* Formulaire */}
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              size="medium"
              label="Nom d'utilisateur"
              placeholder="Entrez votre nom d'utilisateur"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setError('');
              }}
              disabled={loading}
              autoFocus
              autoComplete="username"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person sx={{ color: '#9e9e9e' }} />
                    </InputAdornment>
                  ),
                },
              }}
              sx={{ mb: 2.5 }}
            />

            <TextField
              fullWidth
              size="medium"
              type={showPassword ? 'text' : 'password'}
              label="Mot de passe"
              placeholder="Entrez votre mot de passe"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              disabled={loading}
              autoComplete="current-password"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock sx={{ color: '#9e9e9e' }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton 
                        onClick={() => setShowPassword(!showPassword)} 
                        edge="end"
                        size="small"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
              sx={{ mb: 3 }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSubmit(e);
              }}
            />

            <Button
              fullWidth
              type="submit"
              variant="contained"
              disabled={loading || !username.trim() || !password.trim()}
              sx={{
                py: 1.5,
                bgcolor: '#2e7d32',
                '&:hover': { bgcolor: '#1b5e20' },
                '&:disabled': { bgcolor: '#a5d6a7' },
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '1rem',
                boxShadow: '0 4px 12px rgba(46,125,50,0.3)',
              }}
            >
              {loading ? (
                <CircularProgress size={24} sx={{ color: '#fff' }} />
              ) : (
                'Se connecter'
              )}
            </Button>
          </Box>

          {/* Lien mot de passe oublié */}
          <Box sx={{ textAlign: 'center', mt: 2.5 }}>
            <Button
              onClick={() => router.push('/forgot-password')}
              sx={{ 
                textTransform: 'none', 
                color: '#2e7d32', 
                fontSize: '0.85rem',
                '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' } 
              }}
            >
              Mot de passe oublié ?
            </Button>
          </Box>
        </Paper>

        {/* Footer */}
        <Typography 
          variant="caption" 
          sx={{ 
            display: 'block', 
            textAlign: 'center', 
            mt: 3, 
            color: '#9e9e9e' 
          }}
        >
          © {new Date().getFullYear()} Location Batiment Madagascar
        </Typography>
      </Container>
    </Box>
  );
}