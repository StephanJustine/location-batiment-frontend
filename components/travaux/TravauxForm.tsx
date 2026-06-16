// components/travaux/TravauxForm.tsx
'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Button,
  Divider,
  Alert,
  CircularProgress,
  InputAdornment,
  Chip,
  Autocomplete,
  Paper
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { TypeTravaux, StatutTravaux } from '@/types/travaux';
import { logementService, Logement } from '@/services/logementService';

interface TravauxFormProps {
  initialData?: any;
  logementId?: number;
  onSubmit: (data: any) => Promise<void>;
  onCancel?: () => void;
  isEditing?: boolean;
}

const TravauxForm: React.FC<TravauxFormProps> = ({
  initialData,
  logementId,
  onSubmit,
  onCancel,
  isEditing = false
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [logements, setLogements] = useState<Logement[]>([]);
  const [loadingLogements, setLoadingLogements] = useState(false);

  const { control, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: {
      logement_id: initialData?.logement_id || logementId || '',
      type_travaux: initialData?.type_travaux || TypeTravaux.MAINTENANCE,
      description: initialData?.description || '',
      date_debut: initialData?.date_debut ? new Date(initialData.date_debut).toISOString().split('T')[0] : '',
      date_fin: initialData?.date_fin ? new Date(initialData.date_fin).toISOString().split('T')[0] : '',
      cout_estime: initialData?.cout_estime || 0,
      cout_reel: initialData?.cout_reel || 0,
      prestataire: initialData?.prestataire || '',
      statut: initialData?.statut || StatutTravaux.PLANIFIE
    }
  });

  useEffect(() => {
    if (!logementId) {
      fetchLogements();
    }
  }, [logementId]);

  const fetchLogements = async () => {
    try {
      setLoadingLogements(true);
      const data = await logementService.getDisponibles();
      setLogements(data);
    } catch (error) {
      console.error('Erreur chargement logements:', error);
    } finally {
      setLoadingLogements(false);
    }
  };

  const onFormSubmit = async (data: any) => {
    try {
      setLoading(true);
      setError(null);
      
      const formData = {
        ...data,
        logement_id: Number(data.logement_id),
        date_debut: data.date_debut || null,
        date_fin: data.date_fin || null,
        cout_estime: data.cout_estime || 0,
        cout_reel: data.cout_reel || 0
      };
      
      await onSubmit(formData);
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'Erreur lors de la soumission');
      console.error('Form submission error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const typeOptions = Object.values(TypeTravaux).map(type => ({
    value: type,
    label: type.replace('_', ' ').toUpperCase()
  }));

  const statutOptions = Object.values(StatutTravaux).map(statut => ({
    value: statut,
    label: statut.replace('_', ' ').toUpperCase()
  }));

  return (
    <Box sx={{ pt: 2 }}>
      {error && (
        <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 2, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit(onFormSubmit)}>
        <Grid container spacing={2.5}>
          {/* Logement - seulement si pas déjà défini */}
          {!logementId && (
            <Grid item xs={12}>
              <Controller
                name="logement_id"
                control={control}
                rules={{ required: 'Le logement est requis' }}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.logement_id}>
                    <InputLabel>Logement *</InputLabel>
                    <Select
                      {...field}
                      label="Logement *"
                      disabled={loadingLogements}
                    >
                      {logements.map((logement) => (
                        <MenuItem key={logement.id} value={logement.id}>
                          {logement.numero} - {logement.type} ({logement.surface} m²)
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.logement_id && (
                      <Typography variant="caption" color="error">
                        {errors.logement_id.message}
                      </Typography>
                    )}
                  </FormControl>
                )}
              />
            </Grid>
          )}

          {/* Type de travaux */}
          <Grid item xs={12} sm={6}>
            <Controller
              name="type_travaux"
              control={control}
              rules={{ required: 'Le type est requis' }}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.type_travaux}>
                  <InputLabel>Type de travaux *</InputLabel>
                  <Select {...field} label="Type de travaux *">
                    {typeOptions.map((type) => (
                      <MenuItem key={type.value} value={type.value}>
                        {type.label}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.type_travaux && (
                    <Typography variant="caption" color="error">
                      {errors.type_travaux.message}
                    </Typography>
                  )}
                </FormControl>
              )}
            />
          </Grid>

          {/* Statut */}
          <Grid item xs={12} sm={6}>
            <Controller
              name="statut"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth>
                  <InputLabel>Statut</InputLabel>
                  <Select {...field} label="Statut">
                    {statutOptions.map((statut) => (
                      <MenuItem key={statut.value} value={statut.value}>
                        {statut.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            />
          </Grid>

          {/* Description */}
          <Grid item xs={12}>
            <Controller
              name="description"
              control={control}
              rules={{ required: 'La description est requise', minLength: 5 }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Description *"
                  multiline
                  rows={3}
                  fullWidth
                  error={!!errors.description}
                  helperText={errors.description?.message}
                  placeholder="Décrivez les travaux à effectuer..."
                />
              )}
            />
          </Grid>

          {/* Dates */}
          <Grid item xs={12} sm={6}>
            <Controller
              name="date_debut"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Date de début"
                  type="date"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Controller
              name="date_fin"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Date de fin prévue"
                  type="date"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
              )}
            />
          </Grid>

          {/* Coûts */}
          <Grid item xs={12} sm={6}>
            <Controller
              name="cout_estime"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Coût estimé (Ar)"
                  type="number"
                  fullWidth
                  InputProps={{
                    inputProps: { min: 0, step: 1000 },
                    startAdornment: <InputAdornment position="start">Ar</InputAdornment>
                  }}
                  onChange={(e) => field.onChange(e.target.value === '' ? 0 : Number(e.target.value))}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Controller
              name="cout_reel"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Coût réel (Ar)"
                  type="number"
                  fullWidth
                  InputProps={{
                    inputProps: { min: 0, step: 1000 },
                    startAdornment: <InputAdornment position="start">Ar</InputAdornment>
                  }}
                  onChange={(e) => field.onChange(e.target.value === '' ? 0 : Number(e.target.value))}
                />
              )}
            />
          </Grid>

          {/* Prestataire */}
          <Grid item xs={12}>
            <Controller
              name="prestataire"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Prestataire / Entreprise"
                  fullWidth
                  placeholder="Nom de l'entreprise ou du prestataire"
                />
              )}
            />
          </Grid>

          {/* Actions */}
          <Grid item xs={12}>
            <Divider sx={{ my: 1 }} />
            <Box display="flex" gap={2} justifyContent="flex-end">
              {onCancel && (
                <Button onClick={onCancel} disabled={loading}>
                  Annuler
                </Button>
              )}
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : null}
                sx={{
                  bgcolor: '#2e7d32',
                  '&:hover': { bgcolor: '#1b5e20' }
                }}
              >
                {isEditing ? 'Mettre à jour' : 'Créer'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default TravauxForm;