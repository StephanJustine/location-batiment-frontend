// src/components/paiements/PaiementStats.tsx
'use client';

import { useState, useEffect } from 'react';
import { Box, Grid, Card, CardContent, Typography, CircularProgress, Chip, Divider } from '@mui/material';
import { 
  TrendingUp, TrendingDown, AttachMoney, Warning, 
  CheckCircle, Schedule, Receipt, CalendarToday 
} from '@mui/icons-material';
import { paiementService } from '@/services/paiementService';
import { StatistiquesPaiements } from '@/types/paiement';

export default function PaiementStats() {
  const [stats, setStats] = useState<StatistiquesPaiements | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await paiementService.getStatistiques();
        setStats(data);
      } catch (error) {
        console.error('Erreur chargement stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress size={32} />
      </Box>
    );
  }

  const items = [
    { 
      label: 'Total encaissé ce mois', 
      value: stats?.total_encaisse_mois || 0, 
      icon: <AttachMoney />, 
      color: '#2e7d32',
      prefix: 'Ar',
      trend: 'up'
    },
    { 
      label: 'Total impayés', 
      value: stats?.total_impayes || 0, 
      icon: <Warning />, 
      color: '#d32f2f',
      prefix: 'Ar',
      trend: 'down'
    },
    { 
      label: 'Nombre de paiements', 
      value: stats?.nombre_paiements_mois || 0, 
      icon: <Receipt />, 
      color: '#1976d2',
      trend: 'up'
    },
    { 
      label: "Taux de recouvrement", 
      value: stats?.taux_recouvrement || 0, 
      icon: <TrendingUp />, 
      color: '#f57c00',
      suffix: '%',
      trend: stats?.taux_recouvrement > 70 ? 'up' : 'down'
    }
  ];

  return (
    <Grid container spacing={2}>
      {items.map((item, i) => (
        <Grid size={{ xs: 12, sm: 6, md: 3 }} key={i}>
          <Card sx={{ borderRadius: 2, border: '1px solid #e2e8f0', height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography variant="caption" color="text.secondary">{item.label}</Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700, mt: 0.5 }}>
                    {typeof item.value === 'number' ? item.value.toLocaleString() : item.value}
                    {item.prefix && <Typography component="span" variant="caption" sx={{ ml: 0.5 }}>{item.prefix}</Typography>}
                    {item.suffix && <Typography component="span" variant="caption" sx={{ ml: 0.5 }}>{item.suffix}</Typography>}
                  </Typography>
                </Box>
                <Box sx={{ p: 1, bgcolor: `${item.color}15`, borderRadius: 2, color: item.color }}>
                  {item.icon}
                </Box>
              </Box>
              <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                {item.trend === 'up' ? (
                  <TrendingUp sx={{ fontSize: 12, color: '#2e7d32' }} />
                ) : (
                  <TrendingDown sx={{ fontSize: 12, color: '#d32f2f' }} />
                )}
                <Chip 
                  label={`${item.trend === 'up' ? '+' : ''}${Math.abs(item.value)}`}
                  size="small"
                  sx={{ height: 20, fontSize: '0.65rem' }}
                  color={item.trend === 'up' ? 'success' : 'error'}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}