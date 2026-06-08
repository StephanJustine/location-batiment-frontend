'use client';
import { useState } from 'react';
import { Card, CardContent, Typography, Box, Chip, IconButton, alpha, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Skeleton, Menu, MenuItem } from '@mui/material';
import { Home, Edit, Delete, LocationOn, SquareFoot, Bathtub, Bed, MeetingRoom, MoreVert, CheckCircle, Cancel } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { Logement } from '@/services/logementService';

interface Props {
  logement: Logement;
  onDelete: (id: number) => void;
  onStatutChange?: (id: number, statut: string) => void;
}

const statutColors: Record<string, { bg: string; color: string; label: string }> = {
  libre: { bg: '#e8f5e9', color: '#2e7d32', label: 'Libre' },
  occupe: { bg: '#e3f2fd', color: '#1565c0', label: 'Occupé' },
  reserve: { bg: '#fff3e0', color: '#e65100', label: 'Réservé' },
  en_maintenance: { bg: '#ffebee', color: '#c62828', label: 'Maintenance' },
  en_renovation: { bg: '#f3e5f5', color: '#6a1b9a', label: 'Rénovation' },
};

const typeLabels: Record<string, string> = {
  studio: 'Studio', t1: 'T1', t2: 'T2', t3: 'T3', t4: 'T4', t5: 'T5',
  duplex: 'Duplex', villa: 'Villa', magasin: 'Magasin', bureau: 'Bureau'
};

export default function LogementCard({ logement, onDelete, onStatutChange }: Props) {
  const router = useRouter();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imgLoading, setImgLoading] = useState(true);

  const photos = logement.photos || [];
  const hasPhotos = photos.length > 0;
  
  const photoBaseUrl = process.env.NEXT_PUBLIC_PHOTO_URL || 'http://localhost:8000';
  const getImageUrl = (path: string) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return `${photoBaseUrl}${path}`;
  };

  const statutInfo = statutColors[logement.statut] || { bg: '#f5f5f5', color: '#616161', label: logement.statut };
  const typeLabel = typeLabels[logement.type] || logement.type;

  const handleStatutChange = (newStatut: string) => {
    if (onStatutChange) onStatutChange(logement.id, newStatut);
    setAnchorEl(null);
  };

  return (
    <>
      <Card sx={{ 
        borderRadius: 2.5, border: '1px solid rgba(0,0,0,0.08)', overflow: 'hidden',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', cursor: 'pointer',
        height: '100%', display: 'flex', flexDirection: 'column',
        background: 'linear-gradient(135deg, #fff 0%, #f8fafc 100%)',
        '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 12px 24px -8px rgba(0,0,0,0.15)', borderColor: '#2e7d32' }
      }}>
        {/* Image */}
        <Box onClick={() => router.push(`/logements/${logement.id}`)} sx={{ height: 140, position: 'relative', overflow: 'hidden', bgcolor: '#f0f2f5' }}>
          {imgLoading && hasPhotos && <Skeleton variant="rectangular" width="100%" height={140} animation="wave" />}
          {hasPhotos ? (
            <>
              <Box component="img" src={getImageUrl(photos[0]) || ''} alt={logement.numero}
                onLoad={() => setImgLoading(false)}
                sx={{ width: '100%', height: 140, objectFit: 'cover', transition: 'transform 0.5s ease', '&:hover': { transform: 'scale(1.08)' } }} />
              <Chip label={typeLabel} size="small" sx={{ position: 'absolute', top: 10, left: 10, bgcolor: '#2e7d32', color: '#fff', fontSize: '0.6rem', height: 22, fontWeight: 600, zIndex: 2 }} />
            </>
          ) : (
            <Box sx={{ height: 140, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#f8f9fa' }}>
              <Home sx={{ fontSize: 42, color: '#cbd5e0' }} />
            </Box>
          )}
          <Chip label={statutInfo.label} size="small" sx={{ position: 'absolute', bottom: 8, right: 8, bgcolor: statutInfo.bg, color: statutInfo.color, fontSize: '0.6rem', height: 22, fontWeight: 600, zIndex: 2 }} />
        </Box>

        <CardContent sx={{ p: 1.5, flex: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 0.8 }}>
            <Typography variant="body1" sx={{ fontWeight: 700, fontSize: '0.9rem', color: '#1e293b', cursor: 'pointer', '&:hover': { color: '#2e7d32' } }} onClick={() => router.push(`/logements/${logement.id}`)}>
              Logement {logement.numero}
            </Typography>
            <IconButton size="small" onClick={(e) => { e.stopPropagation(); setAnchorEl(e.currentTarget); }} sx={{ p: 0.3 }}>
              <MoreVert sx={{ fontSize: 16, color: '#64748b' }} />
            </IconButton>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6, mb: 1 }}>
            <LocationOn sx={{ fontSize: 12, color: '#94a3b8' }} />
            <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.7rem' }}>Étage {logement.etage}, Porte {logement.porte || '-'}</Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 1.5, mb: 1, py: 0.5, borderTop: '1px solid #f1f5f9', borderBottom: '1px solid #f1f5f9' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}><SquareFoot sx={{ fontSize: 13, color: '#94a3b8' }} /><Typography variant="caption" sx={{ fontSize: '0.7rem', fontWeight: 600 }}>{logement.surface} m²</Typography></Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}><Bed sx={{ fontSize: 13, color: '#94a3b8' }} /><Typography variant="caption" sx={{ fontSize: '0.7rem', fontWeight: 600 }}>{logement.nb_chambres}</Typography></Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}><Bathtub sx={{ fontSize: 13, color: '#94a3b8' }} /><Typography variant="caption" sx={{ fontSize: '0.7rem', fontWeight: 600 }}>{logement.nb_sdb}</Typography></Box>
          </Box>

          <Typography variant="body2" sx={{ color: '#2e7d32', fontWeight: 700, fontSize: '0.85rem' }}>
            {logement.loyer_base.toLocaleString()} Ar <Typography component="span" sx={{ color: '#64748b', fontSize: '0.65rem', fontWeight: 400 }}>/ mois</Typography>
          </Typography>
        </CardContent>
      </Card>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
        <MenuItem onClick={() => router.push(`/logements/${logement.id}/edit`)}><Edit sx={{ fontSize: 16, mr: 1 }} />Modifier</MenuItem>
        <MenuItem onClick={() => handleStatutChange('libre')}><CheckCircle sx={{ fontSize: 16, mr: 1, color: '#2e7d32' }} />Marquer libre</MenuItem>
        <MenuItem onClick={() => handleStatutChange('occupe')}><CheckCircle sx={{ fontSize: 16, mr: 1, color: '#1565c0' }} />Marquer occupé</MenuItem>
        <MenuItem onClick={() => handleStatutChange('en_maintenance')}><Cancel sx={{ fontSize: 16, mr: 1, color: '#c62828' }} />Marquer maintenance</MenuItem>
        <MenuItem onClick={() => setConfirmOpen(true)} sx={{ color: '#f44336' }}><Delete sx={{ fontSize: 16, mr: 1 }} />Supprimer</MenuItem>
      </Menu>

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)} maxWidth="xs" fullWidth slotProps={{ paper: { sx: { borderRadius: 3 } } }}>
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent><DialogContentText>Supprimer le logement {logement.numero} ? Cette action est irréversible.</DialogContentText></DialogContent>
        <DialogActions><Button onClick={() => setConfirmOpen(false)}>Annuler</Button><Button onClick={() => { onDelete(logement.id); setConfirmOpen(false); }} color="error">Supprimer</Button></DialogActions>
      </Dialog>
    </>
  );
}