'use client';
import { JSX, useState } from 'react';
import { Card, CardContent, Typography, Box, Chip, IconButton, alpha, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Skeleton } from '@mui/material';
import { Apartment, Edit, Delete, LocationOn, Business, SquareFoot, ChevronLeft, ChevronRight, TrendingUp } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { Batiment } from '@/services/batimentService';

interface Props {
  batiment: Batiment;
  onDelete: (id: number) => void;
}

export default function BatimentCard({ batiment, onDelete }: Props) {
  const router = useRouter();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imgLoading, setImgLoading] = useState(true);
  const [imgErrors, setImgErrors] = useState<Record<number, boolean>>({});
  
  const photos = batiment.photos || [];
  const hasPhotos = photos.length > 0;
  const currentPhoto = hasPhotos ? photos[currentImageIndex] : null;
  
  const photoBaseUrl = process.env.NEXT_PUBLIC_PHOTO_URL || 'http://localhost:8000';
  
  const getImageUrl = (path: string) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    if (path.startsWith('/static')) return `${photoBaseUrl}${path}`;
    return `${photoBaseUrl}/static/${path}`;
  };

  const imageUrl = currentPhoto ? getImageUrl(currentPhoto) : null;
  const hasError = imgErrors[currentImageIndex] || false;

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % photos.length);
    setImgLoading(true);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + photos.length) % photos.length);
    setImgLoading(true);
  };

  const getType = (type: string) => {
    const types: Record<string, { bg: string; color: string; label: string; icon: JSX.Element }> = {
      residential: { bg: '#e8f5e9', color: '#2e7d32', label: 'Résidentiel', icon: <Apartment sx={{ fontSize: 12 }} /> },
      commercial: { bg: '#e3f2fd', color: '#1565c0', label: 'Commercial', icon: <Business sx={{ fontSize: 12 }} /> },
      mixte: { bg: '#fff3e0', color: '#e65100', label: 'Mixte', icon: <TrendingUp sx={{ fontSize: 12 }} /> },
    };
    return types[type] || { bg: '#f5f5f5', color: '#616161', label: type, icon: <Apartment sx={{ fontSize: 12 }} /> };
  };
  
  const typeInfo = getType(batiment.type_batiment);

  return (
    <>
      <Card sx={{ 
        borderRadius: 2.5, 
        border: '1px solid rgba(0,0,0,0.08)', 
        overflow: 'hidden', 
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: 'pointer',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        background: 'linear-gradient(135deg, #fff 0%, #f8fafc 100%)',
        '&:hover': { 
          transform: 'translateY(-6px)', 
          boxShadow: '0 20px 35px -12px rgba(0,0,0,0.15)', 
          borderColor: '#2e7d32'
        } 
      }}>
        {/* Section image */}
        <Box 
          onClick={() => router.push(`/batiments/${batiment.id}`)} 
          sx={{ 
            height: 145, 
            position: 'relative', 
            overflow: 'hidden',
            backgroundColor: '#f0f2f5'
          }}
        >
          {imgLoading && hasPhotos && !hasError && (
            <Skeleton variant="rectangular" width="100%" height={145} animation="wave" />
          )}
          
          {hasPhotos && !hasError ? (
            <>
              <Box
                component="img"
                src={imageUrl || ''}
                alt={batiment.nom}
                onLoad={() => setImgLoading(false)}
                onError={() => {
                  setImgLoading(false);
                  setImgErrors(prev => ({ ...prev, [currentImageIndex]: true }));
                }}
                sx={{ 
                  width: '100%', 
                  height: 145, 
                  objectFit: 'cover',
                  display: imgLoading ? 'none' : 'block',
                  transition: 'transform 0.5s ease',
                  filter: 'brightness(0.95)',
                  '&:hover': { transform: 'scale(1.08)', filter: 'brightness(1)' }
                }}
              />
              
              {/* Gradient overlay */}
              <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 60, background: 'linear-gradient(to top, rgba(0,0,0,0.4), transparent)' }} />
              
              {photos.length > 1 && (
                <>
                  <IconButton size="small" onClick={prevImage} sx={{ position: 'absolute', left: 6, top: '50%', transform: 'translateY(-50%)', bgcolor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', color: '#fff', width: 28, height: 28, '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' }, zIndex: 2 }}>
                    <ChevronLeft sx={{ fontSize: 18 }} />
                  </IconButton>
                  <IconButton size="small" onClick={nextImage} sx={{ position: 'absolute', right: 6, top: '50%', transform: 'translateY(-50%)', bgcolor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', color: '#fff', width: 28, height: 28, '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' }, zIndex: 2 }}>
                    <ChevronRight sx={{ fontSize: 18 }} />
                  </IconButton>
                </>
              )}
              
              {/* Photo counter badge */}
              {photos.length > 1 && (
                <Chip 
                  label={`${currentImageIndex + 1}/${photos.length}`}
                  size="small"
                  sx={{ 
                    position: 'absolute', 
                    bottom: 8, 
                    right: 8,
                    bgcolor: 'rgba(0,0,0,0.6)',
                    backdropFilter: 'blur(4px)',
                    color: '#fff',
                    fontSize: '0.55rem',
                    height: 20,
                    zIndex: 2,
                    '& .MuiChip-label': { px: 1 }
                  }}
                />
              )}
            </>
          ) : (
            <Box sx={{ height: 145, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', bgcolor: '#f8f9fa' }}>
              <Apartment sx={{ fontSize: 42, color: '#cbd5e0', mb: 0.5 }} />
              <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 500 }}>Aucune photo</Typography>
            </Box>
          )}
          
          {/* Type badge modern */}
          <Chip 
            icon={typeInfo.icon}
            label={typeInfo.label} 
            size="small" 
            sx={{ 
              position: 'absolute', 
              top: 10, 
              left: 10, 
              bgcolor: typeInfo.bg, 
              color: typeInfo.color, 
              fontSize: '0.6rem', 
              height: 24,
              fontWeight: 600,
              backdropFilter: 'blur(4px)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              zIndex: 2,
              '& .MuiChip-icon': { color: 'inherit', fontSize: 14 }
            }} 
          />
        </Box>

        {/* Content */}
        <CardContent sx={{ p: 1.5, flex: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 0.8 }}>
            <Typography 
              variant="body1" 
              sx={{ 
                fontWeight: 700, 
                flex: 1, 
                cursor: 'pointer', 
                fontSize: '0.9rem',
                color: '#1e293b',
                lineHeight: 1.3,
                '&:hover': { color: '#2e7d32' } 
              }} 
              onClick={() => router.push(`/batiments/${batiment.id}`)}
            >
              {batiment.nom.length > 25 ? batiment.nom.substring(0, 25) + '...' : batiment.nom}
            </Typography>
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              <IconButton size="small" onClick={(e) => { e.stopPropagation(); router.push(`/batiments/${batiment.id}/edit`); }} sx={{ p: 0.5, bgcolor: '#f8f9fa', '&:hover': { bgcolor: '#e8f5e9' } }}>
                <Edit sx={{ fontSize: 14, color: '#64748b' }} />
              </IconButton>
              <IconButton size="small" onClick={(e) => { e.stopPropagation(); setConfirmOpen(true); }} sx={{ p: 0.5, bgcolor: '#f8f9fa', '&:hover': { bgcolor: '#ffebee' } }}>
                <Delete sx={{ fontSize: 14, color: '#94a3b8' }} />
              </IconButton>
            </Box>
          </Box>

          {/* Location */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6, mb: 1 }}>
            <LocationOn sx={{ fontSize: 12, color: '#94a3b8' }} />
            <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.7rem', fontWeight: 500 }}>
              {batiment.ville}
            </Typography>
          </Box>

          {/* Stats row */}
          <Box sx={{ display: 'flex', gap: 2, mb: 1, py: 0.5, borderTop: '1px solid #f1f5f9', borderBottom: '1px solid #f1f5f9' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Business sx={{ fontSize: 13, color: '#94a3b8' }} />
              <Typography variant="caption" sx={{ color: '#475569', fontSize: '0.7rem', fontWeight: 600 }}>
                {batiment.nb_etages || 0} étages
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <SquareFoot sx={{ fontSize: 13, color: '#94a3b8' }} />
              <Typography variant="caption" sx={{ color: '#475569', fontSize: '0.7rem', fontWeight: 600 }}>
                {batiment.surface_totale?.toLocaleString() || 0} m²
              </Typography>
            </Box>
          </Box>

          {/* Status badge */}
          <Chip 
            label={batiment.statut === 'actif' ? 'Actif' : 'Inactif'} 
            size="small" 
            sx={{ 
              height: 22, 
              fontSize: '0.6rem', 
              fontWeight: 600,
              borderRadius: '12px',
              bgcolor: batiment.statut === 'actif' ? alpha('#22c55e', 0.12) : alpha('#ef4444', 0.12), 
              color: batiment.statut === 'actif' ? '#16a34a' : '#dc2626'
            }} 
          />
        </CardContent>
      </Card>

      {/* Dialog corrigé avec slotProps */}
      <Dialog 
        open={confirmOpen} 
        onClose={() => setConfirmOpen(false)} 
        maxWidth="xs" 
        fullWidth
        slotProps={{
          paper: {
            sx: { borderRadius: 3 }
          }
        }}
      >
        <DialogTitle sx={{ pb: 1, fontWeight: 700, fontSize: '1rem' }}>Confirmer la suppression</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ fontSize: '0.85rem', color: '#64748b' }}>
            Voulez-vous vraiment supprimer <strong>{batiment.nom}</strong> ? Cette action est irréversible.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button onClick={() => setConfirmOpen(false)} variant="outlined" size="small" sx={{ borderRadius: 2, textTransform: 'none' }}>
            Annuler
          </Button>
          <Button 
            onClick={() => { onDelete(batiment.id); setConfirmOpen(false); }} 
            color="error" 
            variant="contained" 
            size="small" 
            sx={{ borderRadius: 2, textTransform: 'none', boxShadow: 'none' }}
          >
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}