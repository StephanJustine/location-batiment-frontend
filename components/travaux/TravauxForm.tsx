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
  InputAdornment
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { TypeTravaux, StatutTravaux } from '@/types/travaux';
import { logementService } from '@/services/logementService';

interface TravauxFormData {
  logement_id: number;
  type_travaux: string;
  description: string;
  statut: string;
  date_debut?: string;
  date_fin?: string;
  cout_estime?: number;
  cout_reel?: number;
  prestataire?: string;
}

interface TravauxFormProps {
  initialData?: any;
  logementId?: number;
  onSubmit: (data: TravauxFormData) => Promise<void>;
  onCancel?: () => void;
  isEditing?: boolean;
}

interface LogementSimple {
  id: number;
  numero: string;
  type: string;
  surface: number;
  statut: string;
  batiment_nom?: string;
  batiment_id: number;
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
  const [logements, setLogements] = useState<LogementSimple[]>([]);
  const [loadingLogements, setLoadingLogements] = useState(false);

  const { control, handleSubmit, formState: { errors } } = useForm({
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
      fetchAllLogements();
    }
  }, [logementId]);

  const fetchAllLogements = async () => {
    try {
      setLoadingLogements(true);
      const data = await logementService.getAllLogementsSimple();
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
      
      const formData: TravauxFormData = {
        logement_id: Number(data.logement_id),
        type_travaux: data.type_travaux,
        description: data.description,
        statut: data.statut || 'planifie'
      };

      // Formatage des dates au format ISO avec T
      if (data.date_debut && data.date_debut !== '') {
        formData.date_debut = `${data.date_debut}T00:00:00`;
      }
      if (data.date_fin && data.date_fin !== '') {
        formData.date_fin = `${data.date_fin}T00:00:00`;
      }
      
      if (data.cout_estime && Number(data.cout_estime) > 0) {
        formData.cout_estime = Number(data.cout_estime);
      }
      if (data.cout_reel && Number(data.cout_reel) > 0) {
        formData.cout_reel = Number(data.cout_reel);
      }
      if (data.prestataire && data.prestataire !== '') {
        formData.prestataire = data.prestataire;
      }

      console.log('📤 Envoi des données:', formData);
      
      await onSubmit(formData);
    } catch (err: unknown) {
      let errorMessage = 'Erreur lors de la soumission';
      
      if (err && typeof err === 'object' && 'response' in err) {
        const error = err as { response?: { data?: { detail?: string; message?: string } } };
        if (error.response?.data?.detail) {
          errorMessage = error.response.data.detail;
        } else if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        }
      } else if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === 'string') {
        errorMessage = err;
      }
      
      setError(errorMessage);
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
      {error && <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}

      <form onSubmit={handleSubmit(onFormSubmit)}>
        <Grid container spacing={2.5}>
          {/* Logement */}
          {!logementId && (
            <Grid size={{ xs: 12 }}>
              <Controller
                name="logement_id"
                control={control}
                rules={{ required: 'Le logement est requis' }}
                render={({ field }) => (
                  <FormControl fullWidth size="small" error={!!errors.logement_id}>
                    <InputLabel>Logement *</InputLabel>
                    <Select 
                      {...field} 
                      label="Logement *" 
                      disabled={loadingLogements}
                      value={field.value || ''}
                    >
                      {logements.map((logement) => (
                        <MenuItem key={logement.id} value={logement.id}>
                          {logement.batiment_nom && `${logement.batiment_nom} - `}
                          {logement.numero} ({logement.type}) {logement.surface}m²
                          {logement.statut === 'occupe' ? ' 🟢 Occupé' : ' 🔵 Libre'}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.logement_id && (
                      <Typography variant="caption" color="error">{String(errors.logement_id.message)}</Typography>
                    )}
                  </FormControl>
                )}
              />
            </Grid>
          )}

          {/* Type */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <Controller
              name="type_travaux"
              control={control}
              rules={{ required: 'Le type est requis' }}
              render={({ field }) => (
                <FormControl fullWidth size="small" error={!!errors.type_travaux}>
                  <InputLabel>Type *</InputLabel>
                  <Select {...field} label="Type *">
                    {typeOptions.map((type) => (
                      <MenuItem key={type.value} value={type.value}>{type.label}</MenuItem>
                    ))}
                  </Select>
                  {errors.type_travaux && (
                    <Typography variant="caption" color="error">{String(errors.type_travaux.message)}</Typography>
                  )}
                </FormControl>
              )}
            />
          </Grid>

          {/* Statut */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <Controller
              name="statut"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth size="small">
                  <InputLabel>Statut</InputLabel>
                  <Select {...field} label="Statut">
                    {statutOptions.map((statut) => (
                      <MenuItem key={statut.value} value={statut.value}>{statut.label}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            />
          </Grid>

          {/* Description */}
          <Grid size={{ xs: 12 }}>
            <Controller
              name="description"
              control={control}
              rules={{ required: 'La description est requise', minLength: 5 }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Description *"
                  multiline
                  rows={2}
                  fullWidth
                  size="small"
                  error={!!errors.description}
                  helperText={errors.description ? String(errors.description.message) : ''}
                  placeholder="Décrivez les travaux..."
                />
              )}
            />
          </Grid>

          {/* Dates */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <Controller
              name="date_debut"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Début"
                  type="date"
                  fullWidth
                  size="small"
                  slotProps={{ inputLabel: { shrink: true } }}
                />
              )}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Controller
              name="date_fin"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Fin prévue"
                  type="date"
                  fullWidth
                  size="small"
                  slotProps={{ inputLabel: { shrink: true } }}
                />
              )}
            />
          </Grid>

          {/* Coûts */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <Controller
              name="cout_estime"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Coût estimé (Ar)"
                  type="number"
                  fullWidth
                  size="small"
                  slotProps={{
                    htmlInput: { min: 0, step: 1000 },
                    input: { startAdornment: <InputAdornment position="start">Ar</InputAdornment> }
                  }}
                  onChange={(e) => field.onChange(e.target.value === '' ? 0 : Number(e.target.value))}
                />
              )}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Controller
              name="cout_reel"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Coût réel (Ar)"
                  type="number"
                  fullWidth
                  size="small"
                  slotProps={{
                    htmlInput: { min: 0, step: 1000 },
                    input: { startAdornment: <InputAdornment position="start">Ar</InputAdornment> }
                  }}
                  onChange={(e) => field.onChange(e.target.value === '' ? 0 : Number(e.target.value))}
                />
              )}
            />
          </Grid>

          {/* Prestataire */}
          <Grid size={{ xs: 12 }}>
            <Controller
              name="prestataire"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Prestataire"
                  fullWidth
                  size="small"
                  placeholder="Nom du prestataire"
                />
              )}
            />
          </Grid>

          {/* Actions */}
          <Grid size={{ xs: 12 }}>
            <Divider sx={{ my: 1 }} />
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              {onCancel && <Button onClick={onCancel} disabled={loading}>Annuler</Button>}
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : null}
                sx={{ bgcolor: '#2e7d32', '&:hover': { bgcolor: '#1b5e20' } }}
              >
                {loading ? 'En cours...' : (isEditing ? 'Mettre à jour' : 'Créer')}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default TravauxForm;