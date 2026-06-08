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

  if (authLoading) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#fff' }}>
        <CircularProgress size={32} sx={{ color: '#2e7d32' }} />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#f5f5f5' }}>
      <Container maxWidth="xs">
        <Paper elevation={0} sx={{ p: 3, borderRadius: 2, border: '1px solid #e0e0e0', bgcolor: '#fff' }}>
          {/* Logo */}
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Box sx={{ width: 48, height: 48, borderRadius: 2, bgcolor: '#2e7d32', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
              <Apartment sx={{ fontSize: 28, color: '#fff' }} />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a1a1a' }}>
              Location Batiment
            </Typography>
            <Typography variant="caption" sx={{ color: '#9e9e9e' }}>
              Madagascar
            </Typography>
          </Box>

          {/* Error */}
          {error && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: 1, py: 0 }}>
              {error}
            </Alert>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              size="small"
              placeholder="Nom d'utilisateur"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
              variant="outlined"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person sx={{ color: '#9e9e9e', fontSize: 18 }} />
                    </InputAdornment>
                  ),
                },
              }}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              size="small"
              type={showPassword ? 'text' : 'password'}
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              variant="outlined"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock sx={{ color: '#9e9e9e', fontSize: 18 }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="small">
                        {showPassword ? <VisibilityOff sx={{ fontSize: 18 }} /> : <Visibility sx={{ fontSize: 18 }} />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
              sx={{ mb: 2 }}
            />

            <Button
              fullWidth
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{
                py: 1,
                bgcolor: '#2e7d32',
                '&:hover': { bgcolor: '#1b5e20' },
                textTransform: 'none',
                fontWeight: 600,
              }}
            >
              {loading ? <CircularProgress size={20} sx={{ color: '#fff' }} /> : 'Se connecter'}
            </Button>
          </form>

          {/* Footer */}
          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Button
              onClick={() => router.push('/forgot-password')}
              sx={{ textTransform: 'none', color: '#2e7d32', fontSize: '0.7rem', '&:hover': { bgcolor: 'transparent' } }}
            >
              Mot de passe oublié ?
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}