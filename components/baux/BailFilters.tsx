// src/components/baux/BailFilters.tsx
'use client';

import React from 'react';
import { Box, Card, CardContent, TextField, MenuItem, Button, InputAdornment } from '@mui/material';
import { Search, FilterList } from '@mui/icons-material';

interface Props {
  filters: { search: string; statut: string; type_bail: string; locataire_id: string };
  onChange: (f: any) => void;
  onApply: () => void;
}

export default function BailFilters({ filters, onChange, onApply }: Props) {
  return (
    <Card sx={{ boxShadow: 'none', border: '1px solid #e8edf2', borderRadius: 2, mb: 2 }}>
      <CardContent sx={{ p: 1.5, display: 'flex', flexWrap: 'wrap', gap: 1.5, alignItems: 'center' }}>
        <TextField size="small" placeholder="N° contrat..." value={filters.search}
          onChange={e => onChange({ ...filters, search: e.target.value })}
          sx={{ flex: 1, minWidth: 200 }}
          slotProps={{ input: { startAdornment: <InputAdornment position="start"><Search sx={{ fontSize: 18 }} /></InputAdornment> } }} />
        <TextField size="small" select label="Statut" value={filters.statut} onChange={e => onChange({ ...filters, statut: e.target.value })} sx={{ width: 130 }}>
          {['', 'actif', 'brouillon', 'resilie', 'termine'].map(s => <MenuItem key={s} value={s}>{s || 'Tous'}</MenuItem>)}
        </TextField>
        <TextField size="small" select label="Type" value={filters.type_bail} onChange={e => onChange({ ...filters, type_bail: e.target.value })} sx={{ width: 130 }}>
          {['', 'habitation', 'commercial', 'professionnel', 'saisonnier'].map(t => <MenuItem key={t} value={t}>{t || 'Tous'}</MenuItem>)}
        </TextField>
        <Button variant="contained" size="small" startIcon={<FilterList />} onClick={onApply} sx={{ textTransform: 'none' }}>Filtrer</Button>
      </CardContent>
    </Card>
  );
}