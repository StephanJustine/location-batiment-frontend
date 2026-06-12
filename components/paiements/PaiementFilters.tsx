// src/components/paiements/PaiementFilters.tsx
'use client';

import { useState } from 'react';
import {
  Box, TextField, MenuItem, FormControl, InputLabel,
  Select, Button, Chip, Stack, IconButton, Paper
} from '@mui/material';
import { FilterList, Clear, Search, CalendarToday } from '@mui/icons-material';
import { ModePaiement, StatutPaiement, TypePaiement } from '@/types/paiement';

interface Filters {
  statut?: string;
  type?: string;
  mode?: string;
  dateDebut?: string;
  dateFin?: string;
  search?: string;
}

interface Props {
  onFilter: (filters: Filters) => void;
  initialFilters?: Filters;
}

export default function PaiementFilters({ onFilter, initialFilters }: Props) {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<Filters>(initialFilters || {});

  const handleApply = () => {
    onFilter(filters);
  };

  const handleReset = () => {
    const resetFilters = {};
    setFilters(resetFilters);
    onFilter(resetFilters);
  };

  const activeFiltersCount = Object.values(filters).filter(v => v && v !== '').length;

  return (
    <Paper sx={{ p: 2, mb: 2, borderRadius: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
        <TextField
          size="small"
          placeholder="Rechercher..."
          value={filters.search || ''}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          sx={{ minWidth: 250 }}
          InputProps={{
            startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} fontSize="small" />
          }}
        />
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant={showFilters ? 'contained' : 'outlined'}
            startIcon={<FilterList />}
            onClick={() => setShowFilters(!showFilters)}
            size="small"
          >
            Filtres {activeFiltersCount > 0 && `(${activeFiltersCount})`}
          </Button>
          {(activeFiltersCount > 0 || filters.search) && (
            <Button startIcon={<Clear />} onClick={handleReset} size="small">
              Effacer
            </Button>
          )}
        </Box>
      </Box>

      {showFilters && (
        <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Statut</InputLabel>
            <Select
              value={filters.statut || ''}
              label="Statut"
              onChange={(e) => setFilters({ ...filters, statut: e.target.value })}
            >
              <MenuItem value="">Tous</MenuItem>
              {Object.values(StatutPaiement).map(s => (
                <MenuItem key={s} value={s}>{s}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Type</InputLabel>
            <Select
              value={filters.type || ''}
              label="Type"
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
            >
              <MenuItem value="">Tous</MenuItem>
              {Object.values(TypePaiement).map(t => (
                <MenuItem key={t} value={t}>{t}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Mode</InputLabel>
            <Select
              value={filters.mode || ''}
              label="Mode"
              onChange={(e) => setFilters({ ...filters, mode: e.target.value })}
            >
              <MenuItem value="">Tous</MenuItem>
              {Object.values(ModePaiement).map(m => (
                <MenuItem key={m} value={m}>{m}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            size="small"
            type="date"
            label="Date début"
            value={filters.dateDebut || ''}
            onChange={(e) => setFilters({ ...filters, dateDebut: e.target.value })}
            slotProps={{ inputLabel: { shrink: true } }}
          />

          <TextField
            size="small"
            type="date"
            label="Date fin"
            value={filters.dateFin || ''}
            onChange={(e) => setFilters({ ...filters, dateFin: e.target.value })}
            slotProps={{ inputLabel: { shrink: true } }}
          />

          <Button variant="contained" onClick={handleApply} size="small">
            Appliquer
          </Button>
        </Box>
      )}

      {/* Filtres actifs sous forme de chips */}
      {activeFiltersCount > 0 && (
        <Stack direction="row" spacing={1} sx={{ mt: 2, flexWrap: 'wrap', gap: 1 }}>
          {filters.statut && (
            <Chip label={`Statut: ${filters.statut}`} size="small" onDelete={() => setFilters({ ...filters, statut: '' })} />
          )}
          {filters.type && (
            <Chip label={`Type: ${filters.type}`} size="small" onDelete={() => setFilters({ ...filters, type: '' })} />
          )}
          {filters.mode && (
            <Chip label={`Mode: ${filters.mode}`} size="small" onDelete={() => setFilters({ ...filters, mode: '' })} />
          )}
          {filters.dateDebut && (
            <Chip label={`Du: ${filters.dateDebut}`} size="small" onDelete={() => setFilters({ ...filters, dateDebut: '' })} />
          )}
          {filters.dateFin && (
            <Chip label={`Au: ${filters.dateFin}`} size="small" onDelete={() => setFilters({ ...filters, dateFin: '' })} />
          )}
        </Stack>
      )}
    </Paper>
  );
}