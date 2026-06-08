'use client';
import { useState, useEffect } from 'react';
import { Box, Grid, IconButton, ImageList, ImageListItem, CircularProgress, Typography, Button, Alert } from '@mui/material';
import { Delete, CloudUpload, Close } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { batimentService } from '@/services/batimentService';

interface Props {
  batimentId: number;
  onPhotosChange?: (photos: string[]) => void;
}

export default function PhotoManager({ batimentId, onPhotosChange }: Props) {
  const [photos, setPhotos] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPhotos();
  }, [batimentId]);

  const loadPhotos = async () => {
    try {
      setLoading(true);
      const data = await batimentService.getPhotos(batimentId);
      setPhotos(data);
      onPhotosChange?.(data);
    } catch (err) {
      setError("Erreur lors du chargement des photos");
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (path: string) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    if (path.startsWith('/static')) return `http://localhost:8000${path}`;
    return `http://localhost:8000/static/${path}`;
  };

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    setUploading(true);
    setError(null);
    
    try {
      const newPhotos = await batimentService.uploadPhotos(batimentId, files);
      setPhotos([...photos, ...newPhotos]);
      onPhotosChange?.([...photos, ...newPhotos]);
    } catch (err) {
      setError("Erreur lors de l'upload des photos");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (index: number, photoUrl: string) => {
    setDeleting(index);
    try {
      await batimentService.deletePhoto(batimentId, photoUrl);
      const newPhotos = photos.filter((_, i) => i !== index);
      setPhotos(newPhotos);
      onPhotosChange?.(newPhotos);
    } catch (err) {
      setError("Erreur lors de la suppression");
    } finally {
      setDeleting(null);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress size={32} sx={{ color: '#2e7d32' }} />
      </Box>
    );
  }

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Button
          variant="outlined"
          component="label"
          startIcon={uploading ? <CircularProgress size={20} /> : <CloudUpload />}
          disabled={uploading}
          sx={{ borderRadius: 1.5, textTransform: 'none' }}
        >
          {uploading ? 'Upload en cours...' : 'Ajouter des photos'}
          <input type="file" multiple accept="image/*" hidden onChange={handleUpload} />
        </Button>
        <Typography variant="caption" sx={{ color: '#757575' }}>
          {photos.length} photo{photos.length > 1 ? 's' : ''}
        </Typography>
      </Box>

      {photos.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 4, bgcolor: '#fafafa', borderRadius: 2 }}>
          <CloudUpload sx={{ fontSize: 48, color: '#cbd5e0', mb: 1 }} />
          <Typography variant="body2" sx={{ color: '#94a3b8' }}>
            Aucune photo. Cliquez sur "Ajouter des photos" pour commencer.
          </Typography>
        </Box>
      ) : (
        <ImageList cols={4} gap={8} sx={{ mb: 0 }}>
          {photos.map((photo, index) => (
            <ImageListItem key={index} sx={{ position: 'relative', borderRadius: 1, overflow: 'hidden' }}>
              <img
                src={getImageUrl(photo)}
                alt={`Photo ${index + 1}`}
                style={{ height: 100, width: '100%', objectFit: 'cover' }}
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
                onClick={() => handleDelete(index, photo)}
                disabled={deleting === index}
              >
                {deleting === index ? <CircularProgress size={16} sx={{ color: '#fff' }} /> : <Delete sx={{ fontSize: 16, color: '#fff' }} />}
              </IconButton>
            </ImageListItem>
          ))}
        </ImageList>
      )}
    </Box>
  );
}