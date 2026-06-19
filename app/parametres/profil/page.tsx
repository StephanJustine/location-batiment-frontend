// app/parametres/profil/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Box, Container, Typography, Paper, Avatar, alpha, 
  Chip, Breadcrumbs, Link, Grid, TextField, Button,
  Divider, Alert, CircularProgress, InputAdornment,
  IconButton, Dialog, DialogTitle, DialogContent,
  DialogActions, Stack
} from '@mui/material';
import { 
  Person, NavigateNext, Save,
  Visibility, VisibilityOff, Lock
} from '@mui/icons-material';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { useAuth } from '@/contexts/AuthContext';
import { userService } from '@/services/userService';
import { authService } from '@/services/authService';

export default function ProfilPage() {
  const { user, updateUser, refreshUser } = useAuth(); // ✅ Utilisation de updateUser
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    nom: user?.nom || '',
    prenom: user?.prenom || '',
    telephone: user?.telephone || '',
    email: user?.email || ''
  });

  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });

  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);

// app/parametres/profil/page.tsx

    const handleUpdateProfile = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
        // ✅ Construire l'objet avec telephone seulement si rempli
        const updateData: any = {
        nom: formData.nom,
        prenom: formData.prenom,
        email: formData.email
        };
        if (formData.telephone) {
        updateData.telephone = formData.telephone;
        }
        
        const updated = await userService.update(user!.id, updateData);
        
        // ✅ updateUser accepte User
        updateUser(updated);
        
        // ✅ Rafraîchir l'utilisateur
        await refreshUser();
        
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
        setError(err.message || 'Erreur lors de la mise à jour');
    } finally {
        setLoading(false);
    }
    };

  const handleChangePassword = async () => {
    if (passwordData.new_password !== passwordData.confirm_password) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await authService.changePassword({
        current_password: passwordData.current_password,
        new_password: passwordData.new_password,
        confirm_password: passwordData.confirm_password
      });
      setPasswordDialogOpen(false);
      setPasswordData({ current_password: '', new_password: '', confirm_password: '' });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || 'Erreur lors du changement de mot de passe');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <Box sx={{ display: 'flex', bgcolor: '#f8fafc', minHeight: '100vh' }}>
        <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
        <Box component="main" sx={{ flexGrow: 1 }}>
          <Header onMenuClick={() => setMobileOpen(!mobileOpen)} />
          <Container sx={{ py: 4 }}>
            <Alert severity="warning">Veuillez vous connecter</Alert>
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
          
          <Breadcrumbs separator={<NavigateNext fontSize="small" />} sx={{ mb: 2 }}>
            <Link href="/" color="inherit" sx={{ textDecoration: 'none' }}>Accueil</Link>
            <Link href="/parametres" color="inherit" sx={{ textDecoration: 'none' }}>Paramètres</Link>
            <Typography color="text.primary">Profil</Typography>
          </Breadcrumbs>

          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              mb: 3,
              borderRadius: 3,
              background: 'linear-gradient(135deg, #fff 0%, #f8fafc 100%)',
              border: '1px solid rgba(46,125,50,0.1)'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: alpha('#2e7d32', 0.1), width: 52, height: 52 }}>
                <Person sx={{ color: '#2e7d32', fontSize: 26 }} />
              </Avatar>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a' }}>
                  Mon profil
                </Typography>
                <Chip label={user.role} size="small" sx={{ bgcolor: '#e8f5e9', color: '#2e7d32', mt: 0.5 }} />
              </Box>
            </Box>
          </Paper>

          <Paper sx={{ p: 3, borderRadius: 2, border: '1px solid #e2e8f0' }}>
            {error && <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>Profil mis à jour avec succès</Alert>}

            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 4 }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Avatar sx={{ width: 120, height: 120, mx: 'auto', mb: 2, bgcolor: '#2e7d32', fontSize: 48 }}>
                    {user.prenom?.[0]}{user.nom?.[0]}
                  </Avatar>
                  <Typography variant="h6">{user.nom} {user.prenom}</Typography>
                  <Typography variant="body2" color="text.secondary">@{user.username}</Typography>
                  <Chip label={user.role} size="small" sx={{ mt: 1 }} />
                </Box>
              </Grid>

              <Grid size={{ xs: 12, md: 8 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                  Informations personnelles
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Nom"
                      value={formData.nom}
                      onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Prénom"
                      value={formData.prenom}
                      onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Téléphone"
                      value={formData.telephone}
                      onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                    />
                  </Grid>
                </Grid>

                <Divider sx={{ my: 3 }} />

                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Button
                    variant="contained"
                    startIcon={loading ? <CircularProgress size={20} /> : <Save />}
                    onClick={handleUpdateProfile}
                    disabled={loading}
                    sx={{ bgcolor: '#2e7d32', '&:hover': { bgcolor: '#1b5e20' }, borderRadius: 2, textTransform: 'none' }}
                  >
                    {loading ? 'Enregistrement...' : 'Enregistrer les modifications'}
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<Lock />}
                    onClick={() => setPasswordDialogOpen(true)}
                    sx={{ borderRadius: 2, textTransform: 'none' }}
                  >
                    Changer le mot de passe
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Container>
      </Box>

      {/* Dialog Changer le mot de passe */}
      <Dialog open={passwordDialogOpen} onClose={() => setPasswordDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Changer le mot de passe</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              fullWidth
              size="small"
              label="Mot de passe actuel"
              type={showPassword ? 'text' : 'password'}
              value={passwordData.current_password}
              onChange={(e) => setPasswordData({ ...passwordData, current_password: e.target.value })}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} size="small">
                        {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                      </IconButton>
                    </InputAdornment>
                  )
                }
              }}
            />
            <TextField
              fullWidth
              size="small"
              label="Nouveau mot de passe"
              type={showNewPassword ? 'text' : 'password'}
              value={passwordData.new_password}
              onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowNewPassword(!showNewPassword)} size="small">
                        {showNewPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                      </IconButton>
                    </InputAdornment>
                  )
                }
              }}
            />
            <TextField
              fullWidth
              size="small"
              label="Confirmer le nouveau mot de passe"
              type={showConfirmPassword ? 'text' : 'password'}
              value={passwordData.confirm_password}
              onChange={(e) => setPasswordData({ ...passwordData, confirm_password: e.target.value })}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} size="small">
                        {showConfirmPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                      </IconButton>
                    </InputAdornment>
                  )
                }
              }}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPasswordDialogOpen(false)}>Annuler</Button>
          <Button
            variant="contained"
            onClick={handleChangePassword}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
            sx={{ bgcolor: '#2e7d32', '&:hover': { bgcolor: '#1b5e20' } }}
          >
            {loading ? 'Changement...' : 'Changer le mot de passe'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}