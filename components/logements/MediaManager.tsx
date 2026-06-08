'use client';
import { useState, useEffect } from 'react';
import { 
  Box, Typography, Button, IconButton, ImageList, ImageListItem, 
  CircularProgress, Dialog, Alert, Paper, Fade
} from '@mui/material';
import { 
  CloudUpload, Delete, Close, Image, PictureAsPdf, 
  Description, ZoomIn, AddPhotoAlternate
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  logementId: number;
  existingPhotos?: string[];
  existingPlan?: string | null;
  onPhotosUpdate: (photos: string[]) => void;
  onPlanUpdate: (plan: string | null) => void;
  onUpload: (files: File[], type: 'photos' | 'plan') => Promise<string[] | string>;
  onDeletePhoto?: (photoUrl: string) => Promise<boolean>;
}

export default function MediaManager({ 
  logementId, 
  existingPhotos = [], 
  existingPlan = null,
  onPhotosUpdate,
  onPlanUpdate,
  onUpload,
  onDeletePhoto
}: Props) {
  // ✅ S'assurer que photos est toujours un tableau
  const [photos, setPhotos] = useState<string[]>(() => {
    if (Array.isArray(existingPhotos)) {
      return existingPhotos;
    }
    if (existingPhotos && typeof existingPhotos === 'string') {
      try {
        const parsed = JSON.parse(existingPhotos);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }
    return [];
  });
  
  const [plan, setPlan] = useState<string | null>(existingPlan);
  const [uploading, setUploading] = useState<'photos' | 'plan' | null>(null);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [showPreview, setShowPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ✅ Mettre à jour les photos quand existingPhotos change
  useEffect(() => {
    if (Array.isArray(existingPhotos)) {
      setPhotos(existingPhotos);
    }
  }, [existingPhotos]);

  const photoBaseUrl = process.env.NEXT_PUBLIC_PHOTO_URL || 'http://localhost:8000';
  
  const getImageUrl = (path: string) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    if (path.startsWith('/static')) return `${photoBaseUrl}${path}`;
    return `${photoBaseUrl}/static/${path}`;
  };

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;
    
    setUploading('photos');
    setError(null);
    
    try {
      const newPhotos = await onUpload(files, 'photos') as string[];
      const updatedPhotos = [...photos, ...newPhotos];
      setPhotos(updatedPhotos);
      onPhotosUpdate(updatedPhotos);
    } catch (err) {
      setError("Erreur lors de l'upload des photos");
    } finally {
      setUploading(null);
    }
  };

  const handlePlanUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    setUploading('plan');
    setError(null);
    
    try {
      const newPlan = await onUpload([file], 'plan') as string;
      setPlan(newPlan);
      onPlanUpdate(newPlan);
    } catch (err) {
      setError("Erreur lors de l'upload du plan");
    } finally {
      setUploading(null);
    }
  };

  const handleDeletePhoto = async (index: number, photoUrl: string) => {
    setDeleting(index);
    try {
      if (onDeletePhoto) {
        await onDeletePhoto(photoUrl);
      }
      const newPhotos = photos.filter((_, i) => i !== index);
      setPhotos(newPhotos);
      onPhotosUpdate(newPhotos);
    } catch (err) {
      setError("Erreur lors de la suppression");
    } finally {
      setDeleting(null);
    }
  };

  const handleDeletePlan = async () => {
    setPlan(null);
    onPlanUpdate(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    const imageFiles = files.filter(f => f.type.startsWith('image/'));
    if (imageFiles.length === 0) return;
    
    setUploading('photos');
    try {
      const newPhotos = await onUpload(imageFiles, 'photos') as string[];
      const updatedPhotos = [...photos, ...newPhotos];
      setPhotos(updatedPhotos);
      onPhotosUpdate(updatedPhotos);
    } catch (err) {
      setError("Erreur lors de l'upload");
    } finally {
      setUploading(null);
    }
  };

  // ✅ Vérification que photos est un tableau avant d'utiliser map
  const hasPhotos = Array.isArray(photos) && photos.length > 0;

  return (
    <Fade in timeout={500}>
      <Box>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* Section Photos */}
        <Paper elevation={0} sx={{ p: 2, mb: 3, borderRadius: 2, border: '1px solid #e2e8f0' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#0f172a' }}>
                Galerie photos
              </Typography>
              <Typography variant="caption" sx={{ color: '#64748b' }}>
                {hasPhotos ? photos.length : 0} photo{hasPhotos && photos.length > 1 ? 's' : ''}
              </Typography>
            </Box>
            
            <Button
              component="label"
              variant="outlined"
              startIcon={uploading === 'photos' ? <CircularProgress size={16} /> : <AddPhotoAlternate />}
              disabled={uploading === 'photos'}
              size="small"
              sx={{ borderRadius: 2, textTransform: 'none' }}
            >
              Ajouter
              <input type="file" multiple accept="image/*" hidden onChange={handlePhotoUpload} />
            </Button>
          </Box>

          {/* Zone de drop */}
          <Box
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            sx={{
              border: `2px dashed ${isDragging ? '#2e7d32' : '#cbd5e1'}`,
              borderRadius: 2,
              p: 2,
              textAlign: 'center',
              cursor: 'pointer',
              bgcolor: isDragging ? 'rgba(46,125,50,0.04)' : '#f8fafc',
              transition: 'all 0.2s ease',
              mb: 2
            }}
            onClick={() => document.getElementById('photo-upload-input')?.click()}
          >
            <CloudUpload sx={{ fontSize: 32, color: '#94a3b8', mb: 1 }} />
            <Typography variant="body2" sx={{ color: '#475569' }}>
              Glissez vos photos ici ou cliquez pour sélectionner
            </Typography>
            <Typography variant="caption" sx={{ color: '#94a3b8' }}>
              PNG, JPG jusqu'à 5MB
            </Typography>
            <input id="photo-upload-input" type="file" multiple accept="image/*" hidden onChange={handlePhotoUpload} />
          </Box>

          {/* Liste des photos - ✅ avec vérification */}
          {hasPhotos ? (
            <ImageList cols={4} gap={8} sx={{ mb: 0 }}>
              <AnimatePresence>
                {photos.map((photo, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                    style={{ position: 'relative' }}
                  >
                    <ImageListItem sx={{ borderRadius: 2, overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                      <img
                        src={getImageUrl(photo)}
                        alt={`Photo ${index + 1}`}
                        style={{ height: 120, width: '100%', objectFit: 'cover', cursor: 'pointer' }}
                        onClick={() => setShowPreview(getImageUrl(photo))}
                      />
                      <IconButton
                        size="small"
                        sx={{
                          position: 'absolute',
                          top: 4,
                          right: 4,
                          bgcolor: 'rgba(0,0,0,0.5)',
                          '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' }
                        }}
                        onClick={() => handleDeletePhoto(index, photo)}
                        disabled={deleting === index}
                      >
                        {deleting === index ? <CircularProgress size={14} sx={{ color: '#fff' }} /> : <Delete sx={{ fontSize: 14, color: '#fff' }} />}
                      </IconButton>
                      <IconButton
                        size="small"
                        sx={{
                          position: 'absolute',
                          bottom: 4,
                          right: 4,
                          bgcolor: 'rgba(0,0,0,0.5)',
                          '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' }
                        }}
                        onClick={() => setShowPreview(getImageUrl(photo))}
                      >
                        <ZoomIn sx={{ fontSize: 14, color: '#fff' }} />
                      </IconButton>
                    </ImageListItem>
                  </motion.div>
                ))}
              </AnimatePresence>
            </ImageList>
          ) : (
            <Box sx={{ textAlign: 'center', py: 4, bgcolor: '#f8fafc', borderRadius: 2 }}>
              <Image sx={{ fontSize: 48, color: '#cbd5e1', mb: 1 }} />
              <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                Aucune photo
              </Typography>
            </Box>
          )}
        </Paper>

        {/* Section Plan */}
        <Paper elevation={0} sx={{ p: 2, borderRadius: 2, border: '1px solid #e2e8f0' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#0f172a' }}>
                Plan du logement
              </Typography>
              <Typography variant="caption" sx={{ color: '#64748b' }}>
                Format PDF ou image
              </Typography>
            </Box>
            
            <Button
              component="label"
              variant="outlined"
              startIcon={uploading === 'plan' ? <CircularProgress size={16} /> : <CloudUpload />}
              disabled={uploading === 'plan'}
              size="small"
              sx={{ borderRadius: 2, textTransform: 'none' }}
            >
              {plan ? 'Modifier' : 'Ajouter un plan'}
              <input type="file" accept="image/*,application/pdf" hidden onChange={handlePlanUpload} />
            </Button>
          </Box>

          {plan ? (
            <Box sx={{ position: 'relative' }}>
              <Box
                sx={{
                  height: 200,
                  bgcolor: '#f8fafc',
                  borderRadius: 2,
                  overflow: 'hidden',
                  cursor: 'pointer',
                  border: '1px solid #e2e8f0',
                  position: 'relative'
                }}
                onClick={() => setShowPreview(getImageUrl(plan))}
              >
                {plan.endsWith('.pdf') ? (
                  <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                    <PictureAsPdf sx={{ fontSize: 48, color: '#ef4444' }} />
                    <Typography variant="caption" sx={{ mt: 1, color: '#64748b' }}>Plan PDF</Typography>
                  </Box>
                ) : (
                  <img
                    src={getImageUrl(plan)}
                    alt="Plan du logement"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                )}
              </Box>
              <IconButton
                size="small"
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  bgcolor: 'rgba(0,0,0,0.5)',
                  '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' }
                }}
                onClick={handleDeletePlan}
              >
                <Delete sx={{ fontSize: 16, color: '#fff' }} />
              </IconButton>
            </Box>
          ) : (
            <Box
              sx={{
                height: 150,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                bgcolor: '#f8fafc',
                borderRadius: 2,
                border: '1px dashed #cbd5e1',
                cursor: 'pointer'
              }}
              onClick={() => document.getElementById('plan-upload-input')?.click()}
            >
              <Description sx={{ fontSize: 32, color: '#94a3b8', mb: 1 }} />
              <Typography variant="body2" sx={{ color: '#64748b' }}>
                Aucun plan disponible
              </Typography>
              <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                Cliquez pour ajouter un plan
              </Typography>
              <input id="plan-upload-input" type="file" accept="image/*,application/pdf" hidden onChange={handlePlanUpload} />
            </Box>
          )}
        </Paper>

        {/* Modal de prévisualisation */}
        <Dialog open={!!showPreview} onClose={() => setShowPreview(null)} maxWidth="lg" fullWidth>
          <Box sx={{ position: 'relative', bgcolor: '#000', minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img src={showPreview || ''} alt="Prévisualisation" style={{ maxWidth: '100%', maxHeight: '70vh', objectFit: 'contain' }} />
            <IconButton
              sx={{ position: 'absolute', top: 16, right: 16, bgcolor: 'rgba(0,0,0,0.5)', color: '#fff' }}
              onClick={() => setShowPreview(null)}
            >
              <Close />
            </IconButton>
          </Box>
        </Dialog>
      </Box>
    </Fade>
  );
}