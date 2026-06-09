// src/components/locataires/LocataireCard.tsx
'use client';

import React, { useState } from 'react';
import {
  Card, CardContent, CardActions, Typography, Box, Chip, Avatar,
  IconButton, Tooltip, Stack, Menu, MenuItem, ListItemIcon, Divider
} from '@mui/material';
import {
  Edit, Delete, Phone, Email, CheckCircle, Block, Apartment, MoreVert
} from '@mui/icons-material';
import { Locataire } from '@/types/models';

interface Props {
  locataire: Locataire;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onView: (id: number) => void;
  onStatusChange?: (id: number, newStatus: string) => void;
}

const statusList = [
  { value: 'actif', icon: <CheckCircle />, color: 'success' as const, label: 'Actif', bg: 'linear-gradient(135deg, #43a047, #66bb6a)' },
  { value: 'archive', icon: <Apartment />, color: 'default' as const, label: 'Archivé', bg: 'linear-gradient(135deg, #78909c, #90a4ae)' },
  { value: 'blacklist', icon: <Block />, color: 'error' as const, label: 'Blacklisté', bg: 'linear-gradient(135deg, #e53935, #ef5350)' }
];

const getStatus = (s: string) => statusList.find(x => x.value === s) || statusList[1];

export default function LocataireCard({ locataire, onEdit, onDelete, onView, onStatusChange }: Props) {
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const st = getStatus(locataire.statut);
  const photo = (locataire as any).photo_url || null;
  const initials = `${locataire.prenom?.[0] || ''}${locataire.nom?.[0] || ''}`;

  const handleMenuOpen = (e: React.MouseEvent<HTMLElement>) => { e.stopPropagation(); setMenuAnchor(e.currentTarget); };
  const handleMenuClose = () => setMenuAnchor(null);

  const handleStatusChange = (newStatus: string) => {
    setMenuAnchor(null);
    if (newStatus !== locataire.statut && onStatusChange) onStatusChange(locataire.id, newStatus);
  };

  return (
    <Card sx={{
      height: '100%', display: 'flex', flexDirection: 'column',
      borderRadius: 3, overflow: 'hidden',
      transition: 'all .25s ease',
      boxShadow: '0 2px 8px rgba(0,0,0,.06)',
      '&:hover': { transform: 'translateY(-6px)', boxShadow: '0 8px 30px rgba(0,0,0,.12)' }
    }}>
      <Box sx={{ height: 4, bgcolor: `${st.color}.main` }} />

      <CardContent sx={{ flexGrow: 1, cursor: 'pointer', p: 2.5 }} onClick={() => onView(locataire.id)}>
        <Box sx={{ display: 'flex', gap: 1.5, mb: 2 }}>
          <Avatar src={photo || undefined} sx={{ width: 52, height: 52, fontSize: 20, fontWeight: 700, background: photo ? 'none' : st.bg, boxShadow: '0 4px 12px rgba(0,0,0,.15)' }}>
            {!photo && initials}
          </Avatar>
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, lineHeight: 1.2, mb: 0.5 }} noWrap>
              {locataire.prenom} {locataire.nom}
            </Typography>
            <Chip icon={st.icon as React.ReactElement} label={st.label} color={st.color} size="small" sx={{ height: 20, fontSize: '0.65rem', fontWeight: 600 }} />
          </Box>
          {onStatusChange && (
            <IconButton size="small" onClick={handleMenuOpen} sx={{ alignSelf: 'flex-start' }}>
              <MoreVert sx={{ fontSize: 18 }} />
            </IconButton>
          )}
        </Box>

        <Stack spacing={0.5} sx={{ mb: 1.5 }}>
          {locataire.telephone && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Phone sx={{ fontSize: 14, color: 'text.disabled' }} />
              <Typography variant="caption" color="text.secondary" noWrap>{locataire.telephone}</Typography>
            </Box>
          )}
          {locataire.email && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Email sx={{ fontSize: 14, color: 'text.disabled' }} />
              <Typography variant="caption" color="text.secondary" noWrap>{locataire.email}</Typography>
            </Box>
          )}
        </Stack>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
          {locataire.cin && <Chip label={locataire.cin} size="small" variant="outlined" sx={{ fontSize: '0.6rem', height: 18 }} />}
          {locataire.nationalite && locataire.nationalite !== 'MALAGASY' && (
            <Chip label={locataire.nationalite} size="small" variant="outlined" sx={{ fontSize: '0.6rem', height: 18 }} />
          )}
        </Box>
      </CardContent>

      <CardActions sx={{ justifyContent: 'space-between', px: 1.5, pb: 1 }}>
        <Typography variant="caption" color="text.disabled" sx={{ fontSize: '0.6rem' }}>ID: {locataire.id}</Typography>
        <Box>
          <Tooltip title="Modifier">
            <IconButton size="small" onClick={e => { e.stopPropagation(); onEdit(locataire.id); }}>
              <Edit sx={{ fontSize: 16 }} />
            </IconButton>
          </Tooltip>
          {locataire.statut !== 'blacklist' && (
            <Tooltip title="Archiver">
              <IconButton size="small" color="error" onClick={e => { e.stopPropagation(); onDelete(locataire.id); }}>
                <Delete sx={{ fontSize: 16 }} />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </CardActions>

      {/* Menu 3 points */}
      <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={handleMenuClose}
        onClick={e => e.stopPropagation()}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        slotProps={{ paper: { sx: { borderRadius: 2, mt: 0.5, minWidth: 180 } } }}>
        <MenuItem dense onClick={() => { handleMenuClose(); onEdit(locataire.id); }}>
          <ListItemIcon><Edit sx={{ fontSize: 18 }} /></ListItemIcon>
          <Typography variant="body2">Modifier</Typography>
        </MenuItem>
        <Divider />
        <Typography variant="caption" color="text.disabled" sx={{ px: 2, py: 0.5, display: 'block' }}>
          Changer le statut
        </Typography>
        {statusList.map(s => (
          <MenuItem key={s.value} dense onClick={() => handleStatusChange(s.value)} selected={s.value === locataire.statut} sx={{ gap: 1 }}>
            <ListItemIcon sx={{ minWidth: 28 }}>{s.icon}</ListItemIcon>
            <Typography variant="body2">{s.label}</Typography>
            {s.value === locataire.statut && <CheckCircle sx={{ fontSize: 16, color: 'success.main', ml: 'auto' }} />}
          </MenuItem>
        ))}
      </Menu>
    </Card>
  );
}