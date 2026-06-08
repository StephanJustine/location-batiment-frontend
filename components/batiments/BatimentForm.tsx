'use client';
import { useState } from 'react';
import { 
  Box, TextField, Button, Grid, MenuItem, FormControl, 
  InputLabel, Select, Typography, IconButton, 
  CircularProgress, Dialog, alpha
} from '@mui/material';
import { CloudUpload, Close } from '@mui/icons-material';
import { Batiment } from '@/services/batimentService';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/api';

interface Props {
  initialData?: Batiment;
  onSubmit: (data: any) => Promise<any>;
  onCancel: () => void;
  isLoading?: boolean;
}

const typesBatiment = [
  { value: 'residential', label: 'Résidentiel' },
  { value: 'commercial', label: 'Commercial' },
  { value: 'mixte', label: 'Mixte' },
];

const villes = ['Antananarivo', 'Toamasina', 'Mahajanga', 'Fianarantsoa', 'Antsirabe'];

export default function BatimentForm({ initialData, onSubmit, onCancel, isLoading }: Props) {
  const [formData, setFormData] = useState({
    nom: initialData?.nom || '',
    adresse: initialData?.adresse || '',
    ville: initialData?.ville || 'Antananarivo',
    commune: initialData?.commune || '',
    surface_totale: initialData?.surface_totale || 0,
    surface_terrain: initialData?.surface_terrain || 0,
    nb_etages: initialData?.nb_etages || 0,
    annee_construction: initialData?.annee_construction || new Date().getFullYear(),
    type_batiment: initialData?.type_batiment || 'residential',
    description: initialData?.description || '',
  });
  
  const [photoPreviews, setPhotoPreviews] = useState<string[]>(initialData?.photos || []);
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [showPreview, setShowPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const uploadPhotosToServer = async (id: number) => {
    if (photoFiles.length === 0) return;
    
    setUploading(true);
    const formDataUpload = new FormData();
    photoFiles.forEach(file => formDataUpload.append('files', file));
    
    try {
      await api.post(`/batiments/${id}/photos`, formDataUpload, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    } catch (error) {
      console.error('Erreur upload photos:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let result;
      if (initialData) {
        await onSubmit(formData);
        result = initialData;
      } else {
        result = await onSubmit(formData);
      }
      
      const batimentId = result?.id || initialData?.id;
      if (batimentId && photoFiles.length > 0) {
        await uploadPhotosToServer(batimentId);
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPhotoFiles([...photoFiles, ...files]);
    setPhotoPreviews([...photoPreviews, ...newPreviews]);
  };

  const removePhoto = (index: number) => {
    setPhotoFiles(photoFiles.filter((_, i) => i !== index));
    setPhotoPreviews(photoPreviews.filter((_, i) => i !== index));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    const imageFiles = files.filter(f => f.type.startsWith('image/'));
    const newPreviews = imageFiles.map(file => URL.createObjectURL(file));
    setPhotoFiles([...photoFiles, ...imageFiles]);
    setPhotoPreviews([...photoPreviews, ...newPreviews]);
  };

  const inputSx = {
    '& .MuiOutlinedInput-root': { 
      borderRadius: 1.5, 
      bgcolor: '#fafafa',
      fontSize: '0.8rem'
    },
    '& .MuiInputLabel-root': { 
      fontSize: '0.75rem'
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
      <Box component="form" onSubmit={handleSubmit} sx={{ p: 1.5 }}>
        <Grid container spacing={1.5}>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField fullWidth size="small" label="Nom" name="nom" 
              value={formData.nom} onChange={handleChange} required disabled={isLoading || uploading}
              sx={inputSx} />
          </Grid>
          
          <Grid size={{ xs: 12, md: 6 }}>
            <FormControl fullWidth size="small" sx={inputSx}>
              <InputLabel>Type</InputLabel>
              <Select name="type_batiment" value={formData.type_batiment} 
                onChange={(e) => setFormData({ ...formData, type_batiment: e.target.value })} 
                disabled={isLoading || uploading}>
                {typesBatiment.map(t => <MenuItem key={t.value} value={t.value}>{t.label}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField fullWidth size="small" label="Adresse" name="adresse" 
              value={formData.adresse} onChange={handleChange} required disabled={isLoading || uploading}
              sx={inputSx} />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth size="small" sx={inputSx}>
              <InputLabel>Ville</InputLabel>
              <Select name="ville" value={formData.ville} 
                onChange={(e) => setFormData({ ...formData, ville: e.target.value })} 
                disabled={isLoading || uploading}>
                {villes.map(v => <MenuItem key={v} value={v}>{v}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField fullWidth size="small" label="Commune" name="commune" 
              value={formData.commune} onChange={handleChange} disabled={isLoading || uploading}
              sx={inputSx} />
          </Grid>

          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField fullWidth size="small" type="number" label="Surface (m²)" name="surface_totale" 
              value={formData.surface_totale || ''} onChange={handleChange} disabled={isLoading || uploading}
              slotProps={{ htmlInput: { min: 0 } }} sx={inputSx} />
          </Grid>

          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField fullWidth size="small" type="number" label="Terrain (m²)" name="surface_terrain" 
              value={formData.surface_terrain || ''} onChange={handleChange} disabled={isLoading || uploading}
              slotProps={{ htmlInput: { min: 0 } }} sx={inputSx} />
          </Grid>

          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField fullWidth size="small" type="number" label="Étages" name="nb_etages" 
              value={formData.nb_etages || ''} onChange={handleChange} disabled={isLoading || uploading}
              slotProps={{ htmlInput: { min: 0 } }} sx={inputSx} />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField fullWidth size="small" type="number" label="Année const." name="annee_construction" 
              value={formData.annee_construction || ''} onChange={handleChange} disabled={isLoading || uploading}
              slotProps={{ htmlInput: { min: 1800, max: new Date().getFullYear() } }} sx={inputSx} />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField fullWidth size="small" multiline rows={2} label="Description" name="description" 
              value={formData.description} onChange={handleChange} disabled={isLoading || uploading}
              sx={inputSx} />
          </Grid>

          {/* Upload Photos */}
          <Grid size={{ xs: 12 }}>
            <Box sx={{ 
              border: `1px dashed ${isDragging ? '#2e7d32' : '#e0e0e0'}`,
              borderRadius: 1.5, p: 1, textAlign: 'center', cursor: 'pointer',
              bgcolor: isDragging ? alpha('#2e7d32', 0.05) : '#fafafa',
              '&:hover': { borderColor: '#2e7d32' }
            }}
            onClick={() => document.getElementById('photo-upload')?.click()}
            onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}>
              <input id="photo-upload" type="file" multiple accept="image/*" onChange={handlePhotoUpload} style={{ display: 'none' }} disabled={isLoading || uploading} />
              <CloudUpload sx={{ fontSize: 16, color: '#bdbdbd' }} />
              <Typography variant="caption" sx={{ color: '#757575', display: 'block', fontSize: '0.65rem' }}>
                {uploading ? 'Upload en cours...' : (photoPreviews.length > 0 ? `${photoPreviews.length} photo(s)` : 'Ajouter photos')}
              </Typography>
            </Box>

            {photoPreviews.length > 0 && (
              <Box sx={{ display: 'flex', gap: 0.8, mt: 1, flexWrap: 'wrap' }}>
                <AnimatePresence>
                  {photoPreviews.map((preview, index) => (
                    <motion.div key={index} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} style={{ position: 'relative' }}>
                      <Box sx={{ position: 'relative' }}>
                        <img src={preview} alt="Aperçu" style={{ height: 45, width: 45, objectFit: 'cover', borderRadius: 6, cursor: 'pointer' }} onClick={() => setShowPreview(preview)} />
                        <IconButton size="small" sx={{ position: 'absolute', top: -6, right: -6, bgcolor: '#fff', width: 18, height: 18, '&:hover': { bgcolor: '#f44336', '& svg': { color: '#fff' } } }}
                          onClick={() => removePhoto(index)}>
                          <Close sx={{ fontSize: 10, color: '#f44336' }} />
                        </IconButton>
                      </Box>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </Box>
            )}
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', mt: 1 }}>
              <Button variant="text" onClick={onCancel} disabled={isLoading || uploading} size="small" 
                sx={{ borderRadius: 1.5, textTransform: 'none', color: '#757575', fontSize: '0.7rem', px: 2 }}>
                Annuler
              </Button>
              <Button type="submit" variant="contained" disabled={isLoading || uploading} size="small" 
                sx={{ bgcolor: '#2e7d32', borderRadius: 1.5, textTransform: 'none', fontWeight: 500, fontSize: '0.7rem', px: 2.5, '&:hover': { bgcolor: '#1b5e20' } }}>
                {isLoading || uploading ? <CircularProgress size={16} sx={{ color: '#fff' }} /> : (initialData ? 'Modifier' : 'Créer')}
              </Button>
            </Box>
          </Grid>
        </Grid>

        <Dialog open={!!showPreview} onClose={() => setShowPreview(null)} maxWidth="xs">
          <Box sx={{ position: 'relative', p: 1, bgcolor: '#000', borderRadius: 1 }}>
            <img src={showPreview || ''} alt="Prévisualisation" style={{ width: '100%', height: 'auto', borderRadius: 4 }} />
            <IconButton sx={{ position: 'absolute', top: 4, right: 4, bgcolor: 'rgba(0,0,0,0.6)', width: 28, height: 28 }} onClick={() => setShowPreview(null)}>
              <Close sx={{ fontSize: 14, color: '#fff' }} />
            </IconButton>
          </Box>
        </Dialog>
      </Box>
    </motion.div>
  );
}