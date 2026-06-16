// components/travaux/TravauxStats.tsx
'use client';

import React from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Avatar,
  LinearProgress,
  Divider,
  Chip,
  Card,
  CardContent
} from '@mui/material';
import {
  Construction,
  CheckCircle,
  Pending,
  Schedule,
  Cancel,
  AttachMoney,
  Assessment,
  TrendingUp,
  Warning
} from '@mui/icons-material';
import { Travaux, StatutTravaux, TypeTravaux } from '@/types/travaux';

interface TravauxStatsProps {
  travaux: Travaux[];
}

const TravauxStats: React.FC<TravauxStatsProps> = ({ travaux }) => {
  const total = travaux.length;
  
  const statsByStatut = Object.values(StatutTravaux).reduce((acc, statut) => {
    acc[statut] = travaux.filter(t => t.statut === statut).length;
    return acc;
  }, {} as Record<string, number>);

  const statsByType = Object.values(TypeTravaux).reduce((acc, type) => {
    acc[type] = travaux.filter(t => t.type_travaux === type).length;
    return acc;
  }, {} as Record<string, number>);

  const coutEstimeTotal = travaux.reduce((sum, t) => sum + (t.cout_estime || 0), 0);
  const coutReelTotal = travaux.reduce((sum, t) => sum + (t.cout_reel || 0), 0);
  
  const travauxEnCours = statsByStatut[StatutTravaux.EN_COURS] || 0;
  const travauxTermines = statsByStatut[StatutTravaux.TERMINE] || 0;
  const travauxPlanifies = statsByStatut[StatutTravaux.PLANIFIE] || 0;
  
  const tauxCompletion = total > 0 ? Math.round((travauxTermines / total) * 100) : 0;

  const statutConfig: Record<string, { color: string; bg: string; icon: JSX.Element; label: string }> = {
    [StatutTravaux.PLANIFIE]: {
      color: '#f57c00',
      bg: '#fff3e0',
      icon: <Schedule sx={{ fontSize: 14 }} />,
      label: 'Planifiés'
    },
    [StatutTravaux.EN_COURS]: {
      color: '#1976d2',
      bg: '#e3f2fd',
      icon: <Pending sx={{ fontSize: 14 }} />,
      label: 'En cours'
    },
    [StatutTravaux.TERMINE]: {
      color: '#2e7d32',
      bg: '#e8f5e9',
      icon: <CheckCircle sx={{ fontSize: 14 }} />,
      label: 'Terminés'
    },
    [StatutTravaux.ANNULE]: {
      color: '#c62828',
      bg: '#ffebee',
      icon: <Cancel sx={{ fontSize: 14 }} />,
      label: 'Annulés'
    }
  };

  const typeLabels: Record<string, string> = {
    [TypeTravaux.MAINTENANCE]: 'Maintenance',
    [TypeTravaux.RENOVATION]: 'Rénovation',
    [TypeTravaux.URGENCE]: 'Urgence',
    [TypeTravaux.ELECTRIQUE]: 'Électrique',
    [TypeTravaux.PLOMBERIE]: 'Plomberie',
    [TypeTravaux.PEINTURE]: 'Peinture',
    [TypeTravaux.AUTRE]: 'Autre'
  };

  return (
    <Box>
      {/* Cartes principales */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 6, sm: 3 }}>
          <Card sx={{ borderRadius: 2, border: '1px solid #e2e8f0' }}>
            <CardContent sx={{ p: 2 }}>
              <Box display="flex" alignItems="center" gap={1.5}>
                <Avatar sx={{ bgcolor: '#e8f5e9', width: 40, height: 40 }}>
                  <Construction sx={{ color: '#2e7d32' }} />
                </Avatar>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: '#0f172a' }}>
                    {total}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#64748b' }}>
                    Total travaux
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 6, sm: 3 }}>
          <Card sx={{ borderRadius: 2, border: '1px solid #e2e8f0' }}>
            <CardContent sx={{ p: 2 }}>
              <Box display="flex" alignItems="center" gap={1.5}>
                <Avatar sx={{ bgcolor: '#fff3e0', width: 40, height: 40 }}>
                  <Schedule sx={{ color: '#f57c00' }} />
                </Avatar>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: '#f57c00' }}>
                    {travauxPlanifies}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#64748b' }}>
                    Planifiés
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 6, sm: 3 }}>
          <Card sx={{ borderRadius: 2, border: '1px solid #e2e8f0' }}>
            <CardContent sx={{ p: 2 }}>
              <Box display="flex" alignItems="center" gap={1.5}>
                <Avatar sx={{ bgcolor: '#e3f2fd', width: 40, height: 40 }}>
                  <Pending sx={{ color: '#1976d2' }} />
                </Avatar>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: '#1976d2' }}>
                    {travauxEnCours}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#64748b' }}>
                    En cours
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 6, sm: 3 }}>
          <Card sx={{ borderRadius: 2, border: '1px solid #e2e8f0' }}>
            <CardContent sx={{ p: 2 }}>
              <Box display="flex" alignItems="center" gap={1.5}>
                <Avatar sx={{ bgcolor: '#e8f5e9', width: 40, height: 40 }}>
                  <CheckCircle sx={{ color: '#2e7d32' }} />
                </Avatar>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: '#2e7d32' }}>
                    {travauxTermines}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#64748b' }}>
                    Terminés
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Progression et coûts */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 2, borderRadius: 2, border: '1px solid #e2e8f0' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#0f172a', mb: 1 }}>
              Taux d'avancement
            </Typography>
            <Box display="flex" alignItems="center" gap={2}>
              <Box flex={1}>
                <LinearProgress
                  variant="determinate"
                  value={tauxCompletion}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    bgcolor: '#e2e8f0',
                    '& .MuiLinearProgress-bar': {
                      bgcolor: tauxCompletion > 70 ? '#2e7d32' : tauxCompletion > 40 ? '#f57c00' : '#1976d2'
                    }
                  }}
                />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 700, minWidth: 50, textAlign: 'right' }}>
                {tauxCompletion}%
              </Typography>
            </Box>
            <Box display="flex" gap={2} mt={1}>
              {Object.entries(statutConfig).map(([statut, config]) => (
                <Chip
                  key={statut}
                  icon={config.icon}
                  label={`${config.label}: ${statsByStatut[statut] || 0}`}
                  size="small"
                  sx={{
                    bgcolor: config.bg,
                    color: config.color,
                    '& .MuiChip-icon': { color: config.color }
                  }}
                />
              ))}
            </Box>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 2, borderRadius: 2, border: '1px solid #e2e8f0' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#0f172a', mb: 1 }}>
              Coûts
            </Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs: 6 }}>
                <Box>
                  <Typography variant="caption" sx={{ color: '#64748b' }}>
                    Coût estimé total
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#0f172a' }}>
                    {coutEstimeTotal.toLocaleString()} Ar
                  </Typography>
                </Box>
              </Grid>
              <Grid size={{ xs: 6 }}>
                <Box>
                  <Typography variant="caption" sx={{ color: '#64748b' }}>
                    Coût réel total
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#2e7d32' }}>
                    {coutReelTotal.toLocaleString()} Ar
                  </Typography>
                </Box>
              </Grid>
            </Grid>
            <Divider sx={{ my: 1.5 }} />
            <Box display="flex" justifyContent="space-between">
              <Typography variant="caption" sx={{ color: '#64748b' }}>
                Écart
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 600,
                  color: coutReelTotal <= coutEstimeTotal ? '#2e7d32' : '#c62828'
                }}
              >
                {coutReelTotal <= coutEstimeTotal ? '✅ ' : '⚠️ '}
                {(coutReelTotal - coutEstimeTotal).toLocaleString()} Ar
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Répartition par type */}
      <Paper sx={{ p: 2, borderRadius: 2, border: '1px solid #e2e8f0' }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#0f172a', mb: 2 }}>
          Répartition par type
        </Typography>
        <Grid container spacing={2}>
          {Object.entries(typeLabels).map(([type, label]) => {
            const count = statsByType[type] || 0;
            const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
            
            return (
              <Grid size={{ xs: 6, sm: 4, md: 3 }} key={type}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ flex: 1 }}>
                    <Box display="flex" justifyContent="space-between">
                      <Typography variant="caption" sx={{ color: '#64748b' }}>
                        {label}
                      </Typography>
                      <Typography variant="caption" sx={{ fontWeight: 600, color: '#0f172a' }}>
                        {count}
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={percentage}
                      sx={{
                        height: 4,
                        borderRadius: 2,
                        bgcolor: '#e2e8f0',
                        '& .MuiLinearProgress-bar': {
                          bgcolor: percentage > 30 ? '#2e7d32' : percentage > 15 ? '#1976d2' : '#94a3b8'
                        }
                      }}
                    />
                  </Box>
                  <Typography variant="caption" sx={{ color: '#94a3b8', minWidth: 30 }}>
                    {percentage}%
                  </Typography>
                </Box>
              </Grid>
            );
          })}
        </Grid>
      </Paper>
    </Box>
  );
};

export default TravauxStats;