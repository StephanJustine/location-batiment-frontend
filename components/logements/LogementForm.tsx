'use client';
import { useState, useEffect } from 'react';
import { 
  Box, TextField, Button, Grid, MenuItem, FormControl, 
  InputLabel, Select, Typography, IconButton, CircularProgress, 
  Dialog, alpha, Chip, Paper
} from '@mui/material';
import { 
  CloudUpload, Close, Apartment, SquareFoot, 
  Bathtub, AttachMoney, Description
} from '@mui/icons-material';
import { Logement } from '@/services/logementService';
import { batimentService, Batiment } from '@/services/batimentService';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  initialData?: Logement;
  onSubmit: (data: any) => Promise<any>;
  onCancel: () => void;
  isLoading?: boolean;
}

const typesLogement = [
  { value: 'studio', label: 'Studio' },
  { value: 't1', label: 'T1' },
  { value: 't2', label: 'T2' },
  { value: 't3', label: 'T3' },
  { value: 't4', label: 'T4' },
  { value: 't5', label: 'T5' },
  { value: 'duplex', label: 'Duplex' },
  { value: 'villa', label: 'Villa' },
  { value: 'magasin', label: 'Magasin' },
  { value: 'bureau', label: 'Bureau' },
];

const equipementsList = [
  'Clim', 'Chauffage', 'Cuisine équipée', 'Lave-linge', 'Sèche-linge',
  'Réfrigérateur', 'Four', 'Micro-ondes', 'TV', 'Internet',
  'Parking', 'Ascenseur', 'Interphone', 'Gardiennage'
];

export default function LogementForm({ initialData, onSubmit, onCancel, isLoading }: Props) {
  const [batiments, setBatiments] = useState<Batiment[]>([]);
  const [formData, setFormData] = useState({
    batiment_id: initialData?.batiment_id || '',
    numero: initialData?.numero || '',
    etage: initialData?.etage || 0,
    porte: initialData?.porte || '',
    surface: initialData?.surface || 0,
    surface_balcon: initialData?.surface_balcon || 0,
    type: initialData?.type || 't2',
    nb_pieces: initialData?.nb_pieces || 0,
    nb_chambres: initialData?.nb_chambres || 0,
    nb_sdb: initialData?.nb_sdb || 0,
    nb_wc: initialData?.nb_wc || 0,
    equipements: initialData?.equipements || [],
    description: initialData?.description || '',
    loyer_base: initialData?.loyer_base || 0,
    charges_mensuelles: initialData?.charges_mensuelles || 0,
    caution_mois: initialData?.caution_mois || 2,
  });
  
  const [photoPreviews, setPhotoPreviews] = useState<string[]>(() => {
    const photos = initialData?.photos;
    if (Array.isArray(photos)) return photos;
    return [];
  });
  
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [showPreview, setShowPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    fetchBatiments();
  }, []);

  const fetchBatiments = async () => {
    const data = await batimentService.getAll();
    setBatiments(data);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEquipementToggle = (equipement: string) => {
    setFormData(prev => ({
      ...prev,
      equipements: prev.equipements.includes(equipement)
        ? prev.equipements.filter(e => e !== equipement)
        : [...prev.equipements, equipement]
    }));
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

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(false); };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    const imageFiles = files.filter(f => f.type.startsWith('image/'));
    const newPreviews = imageFiles.map(file => URL.createObjectURL(file));
    setPhotoFiles([...photoFiles, ...imageFiles]);
    setPhotoPreviews([...photoPreviews, ...newPreviews]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const inputSx = { 
    '& .MuiOutlinedInput-root': { 
      borderRadius: 1.5, 
      bgcolor: '#fafafa',
      fontSize: '0.75rem',
      minHeight: 38
    }, 
    '& .MuiInputLabel-root': { 
      fontSize: '0.7rem',
      transform: 'translate(14px, 10px) scale(1)',
      '&.MuiInputLabel-shrink': { transform: 'translate(14px, -9px) scale(0.75)' }
    },
    '& .MuiInputBase-input': { py: 1, px: 1.5, fontSize: '0.75rem' }
  };

  const hasPhotos = Array.isArray(photoPreviews) && photoPreviews.length > 0;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
      <Paper elevation={0} sx={{ p: 2, borderRadius: 2, border: '1px solid #e2e8f0' }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={1.5}>
            {/* Bâtiment et Numéro */}
            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth size="small" sx={inputSx}>
                <InputLabel>Bâtiment</InputLabel>
                <Select 
                  name="batiment_id" 
                  value={formData.batiment_id} 
                  onChange={(e) => setFormData({ ...formData, batiment_id: e.target.value })} 
                  required 
                  disabled={isLoading}
                >
                  {batiments.map(b => <MenuItem key={b.id} value={b.id} sx={{ fontSize: '0.75rem' }}>{b.nom}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField 
                fullWidth 
                size="small" 
                label="Numéro" 
                name="numero" 
                value={formData.numero} 
                onChange={handleChange} 
                required 
                disabled={isLoading} 
                sx={inputSx} 
              />
            </Grid>

            {/* Étage et Porte */}
            <Grid size={{ xs: 6, sm: 3 }}>
              <TextField 
                fullWidth 
                size="small" 
                type="number" 
                label="Étage" 
                name="etage" 
                value={formData.etage} 
                onChange={handleChange} 
                disabled={isLoading} 
                sx={inputSx} 
              />
            </Grid>

            <Grid size={{ xs: 6, sm: 3 }}>
              <TextField 
                fullWidth 
                size="small" 
                label="Porte" 
                name="porte" 
                value={formData.porte} 
                onChange={handleChange} 
                disabled={isLoading} 
                sx={inputSx} 
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth size="small" sx={inputSx}>
                <InputLabel>Type</InputLabel>
                <Select 
                  name="type" 
                  value={formData.type} 
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })} 
                  disabled={isLoading}
                >
                  {typesLogement.map(t => (
                    <MenuItem key={t.value} value={t.value} sx={{ fontSize: '0.75rem' }}>
                      {t.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Surfaces */}
            <Grid size={{ xs: 6, sm: 3 }}>
              <TextField 
                fullWidth 
                size="small" 
                type="number" 
                label="Surface" 
                name="surface" 
                value={formData.surface} 
                onChange={handleChange} 
                disabled={isLoading} 
                slotProps={{ htmlInput: { min: 0 } }} 
                sx={inputSx}
              />
            </Grid>

            <Grid size={{ xs: 6, sm: 3 }}>
              <TextField 
                fullWidth 
                size="small" 
                type="number" 
                label="Balcon" 
                name="surface_balcon" 
                value={formData.surface_balcon} 
                onChange={handleChange} 
                disabled={isLoading} 
                slotProps={{ htmlInput: { min: 0 } }} 
                sx={inputSx} 
              />
            </Grid>

            {/* Pièces */}
            <Grid size={{ xs: 6, sm: 3 }}>
              <TextField 
                fullWidth 
                size="small" 
                type="number" 
                label="Pièces" 
                name="nb_pieces" 
                value={formData.nb_pieces} 
                onChange={handleChange} 
                disabled={isLoading} 
                sx={inputSx} 
              />
            </Grid>

            <Grid size={{ xs: 6, sm: 3 }}>
              <TextField 
                fullWidth 
                size="small" 
                type="number" 
                label="Chambres" 
                name="nb_chambres" 
                value={formData.nb_chambres} 
                onChange={handleChange} 
                disabled={isLoading} 
                sx={inputSx} 
              />
            </Grid>

            <Grid size={{ xs: 6, sm: 3 }}>
              <TextField 
                fullWidth 
                size="small" 
                type="number" 
                label="SDB" 
                name="nb_sdb" 
                value={formData.nb_sdb} 
                onChange={handleChange} 
                disabled={isLoading} 
                sx={inputSx}
              />
            </Grid>

            <Grid size={{ xs: 6, sm: 3 }}>
              <TextField 
                fullWidth 
                size="small" 
                type="number" 
                label="WC" 
                name="nb_wc" 
                value={formData.nb_wc} 
                onChange={handleChange} 
                disabled={isLoading} 
                sx={inputSx} 
              />
            </Grid>

            {/* Loyer et Caution */}
            <Grid size={{ xs: 6, sm: 4 }}>
              <TextField 
                fullWidth 
                size="small" 
                type="number" 
                label="Loyer (Ar)" 
                name="loyer_base" 
                value={formData.loyer_base} 
                onChange={handleChange} 
                required 
                disabled={isLoading} 
                slotProps={{ htmlInput: { min: 0 } }} 
                sx={inputSx}
              />
            </Grid>

            <Grid size={{ xs: 6, sm: 4 }}>
              <TextField 
                fullWidth 
                size="small" 
                type="number" 
                label="Charges" 
                name="charges_mensuelles" 
                value={formData.charges_mensuelles} 
                onChange={handleChange} 
                disabled={isLoading} 
                sx={inputSx} 
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField 
                fullWidth 
                size="small" 
                type="number" 
                label="Caution (mois)" 
                name="caution_mois" 
                value={formData.caution_mois} 
                onChange={handleChange} 
                disabled={isLoading} 
                sx={inputSx} 
              />
            </Grid>

            {/* Équipements */}
            <Grid size={{ xs: 12 }}>
              <Typography variant="caption" sx={{ fontWeight: 500, color: '#64748b', mb: 0.8, display: 'block' }}>
                Équipements
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.6 }}>
                {equipementsList.map(equip => (
                  <Chip 
                    key={equip} 
                    label={equip} 
                    size="small" 
                    onClick={() => handleEquipementToggle(equip)} 
                    color={formData.equipements.includes(equip) ? 'primary' : 'default'} 
                    sx={{ 
                      borderRadius: 1.5, 
                      height: 24, 
                      fontSize: '0.65rem',
                      '&.MuiChip-colorPrimary': { bgcolor: '#2e7d32' } 
                    }} 
                  />
                ))}
              </Box>
            </Grid>

            {/* Description */}
            <Grid size={{ xs: 12 }}>
              <TextField 
                fullWidth 
                size="small" 
                multiline 
                rows={2} 
                label="Description" 
                name="description" 
                value={formData.description} 
                onChange={handleChange} 
                disabled={isLoading} 
                sx={inputSx}
              />
            </Grid>

            {/* Photos */}
            <Grid size={{ xs: 12 }}>
              <Typography variant="caption" sx={{ fontWeight: 500, color: '#64748b', mb: 0.8, display: 'block' }}>
                Photos
              </Typography>
              <Box sx={{ 
                border: `1px dashed ${isDragging ? '#2e7d32' : '#cbd5e1'}`,
                borderRadius: 1.5, 
                p: 1, 
                textAlign: 'center', 
                cursor: 'pointer', 
                bgcolor: isDragging ? alpha('#2e7d32', 0.05) : '#fafafa', 
                '&:hover': { borderColor: '#2e7d32' } 
              }}
              onClick={() => document.getElementById('photo-upload')?.click()} 
              onDragOver={handleDragOver} 
              onDragLeave={handleDragLeave} 
              onDrop={handleDrop}>
                <input id="photo-upload" type="file" multiple accept="image/*" onChange={handlePhotoUpload} style={{ display: 'none' }} disabled={isLoading || uploading} />
                <CloudUpload sx={{ fontSize: 16, color: '#94a3b8' }} />
                <Typography variant="caption" sx={{ color: '#64748b', display: 'block', fontSize: '0.6rem' }}>
                  {uploading ? 'Upload...' : (hasPhotos ? `${photoPreviews.length} photo(s)` : 'Ajouter photos')}
                </Typography>
              </Box>
              
              {hasPhotos && (
                <Box sx={{ display: 'flex', gap: 0.8, mt: 1, flexWrap: 'wrap' }}>
                  <AnimatePresence>
                    {photoPreviews.map((preview, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        style={{ position: 'relative' }}
                      >
                        <Box sx={{ position: 'relative' }}>
                          <img 
                            src={preview} 
                            alt="Aperçu" 
                            style={{ height: 45, width: 45, objectFit: 'cover', borderRadius: 6, cursor: 'pointer' }} 
                            onClick={() => setShowPreview(preview)} 
                          />
                          <IconButton 
                            size="small" 
                            sx={{ 
                              position: 'absolute', 
                              top: -6, 
                              right: -6, 
                              bgcolor: '#fff', 
                              width: 16, 
                              height: 16,
                              '&:hover': { bgcolor: '#f44336', '& svg': { color: '#fff' } }
                            }} 
                            onClick={() => removePhoto(index)}
                          >
                            <Close sx={{ fontSize: 8, color: '#f44336' }} />
                          </IconButton>
                        </Box>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </Box>
              )}
            </Grid>

            {/* Actions */}
            <Grid size={{ xs: 12 }}>
              <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', mt: 0.5 }}>
                <Button 
                  variant="text" 
                  onClick={onCancel} 
                  disabled={isLoading || uploading} 
                  size="small" 
                  sx={{ borderRadius: 1.5, textTransform: 'none', color: '#757575', fontSize: '0.7rem', px: 2, minWidth: 'auto' }}
                >
                  Annuler
                </Button>
                <Button 
                  type="submit" 
                  variant="contained" 
                  disabled={isLoading || uploading} 
                  size="small" 
                  sx={{ 
                    bgcolor: '#2e7d32', 
                    borderRadius: 1.5, 
                    textTransform: 'none', 
                    fontWeight: 500, 
                    fontSize: '0.7rem', 
                    px: 2.5, 
                    minWidth: 'auto',
                    '&:hover': { bgcolor: '#1b5e20' } 
                  }}
                >
                  {isLoading || uploading ? <CircularProgress size={14} sx={{ color: '#fff' }} /> : (initialData ? 'Modifier' : 'Créer')}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>

        <Dialog open={!!showPreview} onClose={() => setShowPreview(null)} maxWidth="xs">
          <Box sx={{ position: 'relative', p: 1, bgcolor: '#000', borderRadius: 1 }}>
            <img src={showPreview || ''} alt="Prévisualisation" style={{ width: '100%', height: 'auto', borderRadius: 4 }} />
            <IconButton sx={{ position: 'absolute', top: 4, right: 4, bgcolor: 'rgba(0,0,0,0.6)', width: 28, height: 28 }} onClick={() => setShowPreview(null)}>
              <Close sx={{ fontSize: 14, color: '#fff' }} />
            </IconButton>
          </Box>
        </Dialog>
      </Paper>
    </motion.div>
  );
}