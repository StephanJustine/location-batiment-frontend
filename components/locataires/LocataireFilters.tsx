// src/components/locataires/LocataireFilters.tsx
'use client';

import React from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  MenuItem,
  Button,
  IconButton,
  Tooltip,
  Chip,
  Typography,
  InputAdornment
} from '@mui/material';
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  FilterList as FilterListIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';

interface LocataireFiltersProps {
  filters: {
    search: string;
    statut: string;
    nationalite: string;
    hasGarant: string;
  };
  onFilterChange: (filters: LocataireFiltersProps['filters']) => void;
  onReset: () => void;
  onSearch?: () => void;
  loading?: boolean;
}

export default function LocataireFilters({ 
  filters, 
  onFilterChange, 
  onReset,
  onSearch,
  loading = false
}: LocataireFiltersProps) {
  const activeFiltersCount = Object.values(filters).filter(v => v !== '').length;

  const handleChange = (key: keyof typeof filters, value: string) => {
    onFilterChange({ ...filters, [key]: value });
  };

  return (
    <Card>
      <CardContent>
        {/* En-tête des filtres */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 2,
          flexWrap: 'wrap',
          gap: 1
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <FilterListIcon color="action" />
            <Typography variant="subtitle2" sx={{ fontWeight: 'medium' }}>
                Filtres
            </Typography>
            {activeFiltersCount > 0 && (
                <Chip 
                label={`${activeFiltersCount} actif${activeFiltersCount > 1 ? 's' : ''}`} 
                size="small" 
                color="primary" 
                variant="filled"
                />
            )}
            </Box>
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            {activeFiltersCount > 0 && (
              <Button
                size="small"
                startIcon={<ClearIcon />}
                onClick={onReset}
                color="inherit"
              >
                Réinitialiser
              </Button>
            )}
            {onSearch && (
              <Tooltip title="Rechercher">
                <IconButton 
                  size="small" 
                  onClick={onSearch}
                  disabled={loading}
                  color="primary"
                >
                  <RefreshIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        </Box>
        
        {/* Champs de filtres */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          {/* Recherche */}
          <Box sx={{ flex: '1 1 300px', minWidth: 250 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Rechercher par nom, prénom, CIN, email..."
              value={filters.search}
              onChange={(e) => handleChange('search', e.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                }
              }}
            />
          </Box>

          {/* Statut */}
          <Box sx={{ flex: '0 1 180px', minWidth: 150 }}>
            <TextField
              fullWidth
              size="small"
              select
              label="Statut"
              value={filters.statut}
              onChange={(e) => handleChange('statut', e.target.value)}
            >
              <MenuItem value="">Tous les statuts</MenuItem>
              <MenuItem value="actif">✅ Actif</MenuItem>
              <MenuItem value="archive">📦 Archivé</MenuItem>
              <MenuItem value="blacklist">🚫 Blacklisté</MenuItem>
            </TextField>
          </Box>

          {/* Nationalité */}
          <Box sx={{ flex: '0 1 180px', minWidth: 150 }}>
            <TextField
              fullWidth
              size="small"
              select
              label="Nationalité"
              value={filters.nationalite}
              onChange={(e) => handleChange('nationalite', e.target.value)}
            >
              <MenuItem value="">Toutes</MenuItem>
              <MenuItem value="MALAGASY">🇲🇬 Malagasy</MenuItem>
              <MenuItem value="FRANCAISE">🇫🇷 Française</MenuItem>
              <MenuItem value="COMORIENNE">🇰🇲 Comorienne</MenuItem>
              <MenuItem value="AUTRE">🌍 Autre</MenuItem>
            </TextField>
          </Box>

          {/* Garant */}
          <Box sx={{ flex: '0 1 180px', minWidth: 150 }}>
            <TextField
              fullWidth
              size="small"
              select
              label="Garant"
              value={filters.hasGarant}
              onChange={(e) => handleChange('hasGarant', e.target.value)}
            >
              <MenuItem value="">Indifférent</MenuItem>
              <MenuItem value="oui">👤 Avec garant</MenuItem>
              <MenuItem value="non">Sans garant</MenuItem>
            </TextField>
          </Box>
        </Box>

        {/* Filtres actifs */}
        {activeFiltersCount > 0 && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 2 }}>
            {filters.search && (
              <Chip 
                label={`Recherche: "${filters.search}"`}
                size="small"
                onDelete={() => handleChange('search', '')}
                variant="outlined"
              />
            )}
            {filters.statut && (
              <Chip 
                label={`Statut: ${filters.statut}`}
                size="small"
                onDelete={() => handleChange('statut', '')}
                variant="outlined"
              />
            )}
            {filters.nationalite && (
              <Chip 
                label={`Nationalité: ${filters.nationalite}`}
                size="small"
                onDelete={() => handleChange('nationalite', '')}
                variant="outlined"
              />
            )}
            {filters.hasGarant && (
              <Chip 
                label={`Garant: ${filters.hasGarant === 'oui' ? 'Avec' : 'Sans'}`}
                size="small"
                onDelete={() => handleChange('hasGarant', '')}
                variant="outlined"
              />
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  );
}