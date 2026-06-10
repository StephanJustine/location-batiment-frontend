// src/components/baux/BailCard.tsx
'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardActions, Typography, Box, Chip, IconButton, Tooltip, Menu, MenuItem, ListItemIcon } from '@mui/material';
import { Edit, Description, Home, Person, AttachMoney, CalendarToday, MoreVert, CheckCircle, Block, Archive, Article } from '@mui/icons-material';
import { Bail } from '@/types/models';
import { formatCurrency, formatDate } from '@/utils/formatters';

const cfg: Record<string, any> = {
  actif: { c: 'success', bg: '#43a047', l: 'Actif', icon: <CheckCircle /> },
  brouillon: { c: 'warning', bg: '#f57c00', l: 'Brouillon', icon: <Article /> },
  resilie: { c: 'error', bg: '#e53935', l: 'Résilié', icon: <Block /> },
  termine: { c: 'default', bg: '#757575', l: 'Terminé', icon: <Archive /> },
  expired: { c: 'error', bg: '#c62828', l: 'Expiré', icon: <Block /> }
};
const tl: Record<string, string> = { habitation: '🏠', commercial: '🏪', professionnel: '💼', saisonnier: '🏖️' };

interface Props { bail: Bail; onView: (id: number) => void; onEdit: (id: number) => void; onStatusChange?: (id: number, s: string) => void; }

export default function BailCard({ bail, onView, onEdit, onStatusChange }: Props) {
  const [anchor, setAnchor] = useState<null | HTMLElement>(null);
  const s = cfg[bail.statut] || cfg.termine;
  const j = Math.max(0, Math.ceil((new Date(bail.date_fin).getTime() - Date.now()) / 86400000));

  // 🔥 Utiliser les objets imbriqués logement/locataire (prioritaires)
  const log = bail.logement as any || {};
  const loc = bail.locataire as any || {};
  const lieu = [log?.batiment_nom, log?.numero ? `N°${log.numero}` : null].filter(Boolean).join(' · ') || bail.logement_adresse || `#${bail.logement_id}`;
  const locFull = [loc?.nom || bail.locataire_nom, loc?.prenom || bail.locataire_prenom].filter(Boolean).join(' ') || 'Locataire';

  return (
    <Card sx={{
      height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 2.5, overflow: 'hidden',
      bgcolor: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,.05)', border: '1px solid #e8edf2',
      transition: 'all .2s ease', '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 8px 25px rgba(0,0,0,.08)' }
    }}>
      <Box sx={{ height: 4, bgcolor: s.bg }} />
      <CardContent sx={{ flex: 1, p: 2, cursor: 'pointer' }} onClick={() => onView(bail.id)}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.2 }}>
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 700, fontSize: '0.8rem' }} noWrap>{bail.numero_contrat}</Typography>
            <Chip label={`${tl[bail.type_bail] || ''} ${bail.type_bail}`} size="small" variant="outlined" sx={{ mt: 0.3, height: 18, fontSize: '0.6rem' }} />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
            <Chip label={s.l} color={s.c} size="small" sx={{ height: 18, fontSize: '0.6rem', fontWeight: 600 }} />
            {onStatusChange && <IconButton size="small" onClick={e => { e.stopPropagation(); setAnchor(e.currentTarget); }}><MoreVert sx={{ fontSize: 14 }} /></IconButton>}
          </Box>
        </Box>
        <Row icon={<Home sx={{ fontSize: 14, color: 'text.disabled' }} />} label={lieu} />
        <Row icon={<Person sx={{ fontSize: 14, color: 'text.disabled' }} />} label={locFull} />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.4 }}>
          <AttachMoney sx={{ fontSize: 14, color: 'success.main' }} />
          <Typography variant="body2" sx={{ fontWeight: 700, color: 'success.main', fontSize: '0.8rem' }}>{formatCurrency(bail.loyer_mensuel)}</Typography>
          <Typography variant="caption" color="text.disabled">/mois</Typography>
        </Box>
        <Row icon={<CalendarToday sx={{ fontSize: 13, color: 'text.disabled' }} />} label={`${formatDate(bail.date_debut)} → ${formatDate(bail.date_fin)}`} />
        {bail.statut === 'actif' && j <= 30 && <Chip label={`⚠️ Expire dans ${j}j`} size="small" color="warning" sx={{ mt: 1, height: 20, fontSize: '0.6rem', fontWeight: 600, width: '100%' }} />}
      </CardContent>
      <CardActions sx={{ justifyContent: 'space-between', px: 1.5, py: 0.8, borderTop: '1px solid #f0f0f0' }}>
        <Typography variant="caption" color="text.disabled" sx={{ fontSize: '0.6rem' }}>#{bail.id}</Typography>
        <Box sx={{ display: 'flex', gap: 0.2 }}>
          <Tooltip title="Modifier"><IconButton size="small" onClick={e => { e.stopPropagation(); onEdit(bail.id); }}><Edit sx={{ fontSize: 15 }} /></IconButton></Tooltip>
          <Tooltip title="Détails"><IconButton size="small" onClick={e => { e.stopPropagation(); onView(bail.id); }}><Description sx={{ fontSize: 15 }} /></IconButton></Tooltip>
        </Box>
      </CardActions>
      {onStatusChange && (
        <Menu anchorEl={anchor} open={Boolean(anchor)} onClose={() => setAnchor(null)} onClick={e => e.stopPropagation()}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }} anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          slotProps={{ paper: { sx: { borderRadius: 2, minWidth: 160, mt: 0.5, boxShadow: '0 8px 25px rgba(0,0,0,.1)' } } }}>
          <Typography variant="caption" color="text.disabled" sx={{ px: 2, py: 0.8, display: 'block', fontWeight: 600, fontSize: '0.7rem' }}>Statut</Typography>
          {Object.entries(cfg).map(([k, v]) => (
            <MenuItem key={k} dense onClick={() => { setAnchor(null); onStatusChange(bail.id, k); }} selected={k === bail.statut}>
              <ListItemIcon sx={{ minWidth: 26 }}>{v.icon}</ListItemIcon>
              <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>{v.l}</Typography>
              {k === bail.statut && <CheckCircle sx={{ fontSize: 14, color: 'success.main', ml: 'auto' }} />}
            </MenuItem>
          ))}
        </Menu>
      )}
    </Card>
  );
}

function Row({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.4 }}>
      {icon}
      <Typography variant="caption" color="text.secondary" noWrap sx={{ fontSize: '0.7rem' }}>{label}</Typography>
    </Box>
  );
}