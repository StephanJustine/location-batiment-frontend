// components/users/UserForm.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box, Grid, TextField, Button, Paper, Typography,
  FormControl, InputLabel, Select, MenuItem, Alert,
  CircularProgress, Divider, InputAdornment, IconButton
} from '@mui/material';
import { Visibility, VisibilityOff, Save, Cancel } from '@mui/icons-material';
import { userService } from '@/services/userService';
import { User, UserRole, UserStatus } from '@/types/user';

interface UserFormProps {
  initialData?: User;
  onSuccess?: () => void;
}

// ✅ Valeurs en minuscules pour correspondre au backend
const roleOptions = [
  { value: 'admin' as UserRole, label: 'Administrateur', color: '#dc2626', bg: '#fef2f2' },
  { value: 'gestionnaire' as UserRole, label: 'Gestionnaire', color: '#2563eb', bg: '#eff6ff' },
  { value: 'locataire' as UserRole, label: 'Locataire', color: '#059669', bg: '#f0fdf4' },
  { value: 'superviseur' as UserRole, label: 'Superviseur', color: '#7c3aed', bg: '#f3e8ff' }
];

const statusOptions = [
  { value: 'actif' as UserStatus, label: 'Actif', color: '#22c55e', bg: '#f0fdf4' },
  { value: 'inactif' as UserStatus, label: 'Inactif', color: '#64748b', bg: '#f1f5f9' },
  { value: 'suspendu' as UserStatus, label: 'Suspendu', color: '#dc2626', bg: '#fef2f2' }
];

export default function UserForm({ initialData, onSuccess }: UserFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: initialData?.email || '',
    username: initialData?.username || '',
    nom: initialData?.nom || '',
    prenom: initialData?.prenom || '',
    telephone: initialData?.telephone || '',
    role: initialData?.role || 'locataire' as UserRole,
    status: initialData?.status || 'actif' as UserStatus,
    password: '',
    confirm_password: ''
  });

  const isEditing = !!initialData;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isEditing) {
        const updateData: any = {
          nom: formData.nom,
          prenom: formData.prenom,
          telephone: formData.telephone,
          role: formData.role,
          status: formData.status
        };
        if (formData.email !== initialData.email) {
          updateData.email = formData.email;
        }
        await userService.update(initialData.id, updateData);
      } else {
        if (formData.password !== formData.confirm_password) {
          setError('Les mots de passe ne correspondent pas');
          setLoading(false);
          return;
        }
        await userService.create({
          email: formData.email,
          username: formData.username,
          nom: formData.nom,
          prenom: formData.prenom,
          telephone: formData.telephone,
          password: formData.password,
          role: formData.role  // ✅ Envoie 'admin', 'gestionnaire', 'superviseur' ou 'locataire'
        });
      }
      onSuccess?.();
    } catch (err: any) {
      setError(err.message || 'Erreur lors de l\'enregistrement');
    } finally {
      setLoading(false);
    }
  };

  const getRoleColor = (role: UserRole) => {
    const option = roleOptions.find(r => r.value === role);
    return option?.color || '#64748b';
  };

  const getRoleLabel = (role: UserRole) => {
    const option = roleOptions.find(r => r.value === role);
    return option?.label || role;
  };

  const getRoleBg = (role: UserRole) => {
    const option = roleOptions.find(r => r.value === role);
    return option?.bg || '#f1f5f9';
  };

  return (
    <Paper sx={{ p: 3, borderRadius: 2, border: '1px solid #e2e8f0' }}>
      <form onSubmit={handleSubmit}>
        {error && <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}

        <Grid container spacing={2.5}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              size="small"
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              disabled={isEditing}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              size="small"
              label="Nom d'utilisateur"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              required
              disabled={isEditing}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              size="small"
              label="Nom"
              value={formData.nom}
              onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
              required
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              size="small"
              label="Prénom"
              value={formData.prenom}
              onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
              required
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

          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Rôle</InputLabel>
              <Select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                label="Rôle"
                sx={{
                  '& .MuiSelect-select': {
                    color: getRoleColor(formData.role)
                  }
                }}
              >
                {roleOptions.map(r => (
                  <MenuItem 
                    key={r.value} 
                    value={r.value}
                    sx={{ 
                      color: r.color,
                      '&:hover': { bgcolor: r.bg }
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ 
                        width: 8, 
                        height: 8, 
                        borderRadius: '50%', 
                        bgcolor: r.color 
                      }} />
                      {r.label}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {isEditing && (
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Statut</InputLabel>
                <Select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as UserStatus })}
                  label="Statut"
                >
                  {statusOptions.map(s => (
                    <MenuItem key={s.value} value={s.value}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ 
                          width: 8, 
                          height: 8, 
                          borderRadius: '50%', 
                          bgcolor: s.color 
                        }} />
                        {s.label}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          )}

          {!isEditing && (
            <>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  size="small"
                  label="Mot de passe"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
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
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  size="small"
                  label="Confirmer le mot de passe"
                  type="password"
                  value={formData.confirm_password}
                  onChange={(e) => setFormData({ ...formData, confirm_password: e.target.value })}
                  required
                />
              </Grid>
            </>
          )}

          {isEditing && (
            <Grid size={{ xs: 12 }}>
              <Divider />
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                py: 1
              }}>
                <Typography variant="caption" color="text.secondary">
                  Rôle actuel: 
                </Typography>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1,
                  px: 1.5,
                  py: 0.5,
                  borderRadius: 1,
                  bgcolor: getRoleBg(initialData?.role || 'locataire' as UserRole)
                }}>
                  <Box sx={{ 
                    width: 8, 
                    height: 8, 
                    borderRadius: '50%', 
                    bgcolor: getRoleColor(initialData?.role || 'locataire' as UserRole) 
                  }} />
                  <Typography variant="caption" sx={{ 
                    fontWeight: 500,
                    color: getRoleColor(initialData?.role || 'locataire' as UserRole)
                  }}>
                    {getRoleLabel(initialData?.role || 'locataire' as UserRole)}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          )}

          <Grid size={{ xs: 12 }}>
            <Divider />
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
              <Button onClick={() => router.back()} disabled={loading} startIcon={<Cancel />}>
                Annuler
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : <Save />}
                sx={{ bgcolor: '#2e7d32', '&:hover': { bgcolor: '#1b5e20' }, borderRadius: 2, textTransform: 'none' }}
              >
                {loading ? 'Enregistrement...' : isEditing ? 'Modifier' : 'Créer'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
}