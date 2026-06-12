// src/components/paiements/PaiementDashboard.tsx
'use client';

import { useState, useEffect } from 'react';
import { Box, Grid, Card, CardContent, Typography, CircularProgress } from '@mui/material';
import { AttachMoney, Warning, Home, TrendingUp } from '@mui/icons-material';
import { paiementService } from '@/services/paiementService';
import { TableauBordFinancier } from '@/types/paiement';

export default function PaiementDashboard() {
  const [data, setData] = useState<TableauBordFinancier | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const stats = await paiementService.getTableauBord();
        setData(stats);
      } catch (error) {
        console.error('Erreur:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  const cards = [
    { title: 'CA Mensuel', value: data?.ca_mensuel || 0, icon: <AttachMoney />, color: '#2e7d32', prefix: 'Ar' },
    { title: 'Impayés', value: data?.impayes_total || 0, icon: <Warning />, color: '#d32f2f', prefix: 'Ar' },
    { title: "Taux d'occupation", value: data?.taux_occupation || 0, icon: <Home />, color: '#1976d2', suffix: '%' },
  ];

  return (
    <Grid container spacing={2}>
      {cards.map((card, i) => (
        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={i}>
          <Card sx={{ borderRadius: 2, border: '1px solid #e2e8f0' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="caption" color="text.secondary">{card.title}</Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    {card.value.toLocaleString()}{card.prefix || ''}{card.suffix || ''}
                  </Typography>
                </Box>
                <Box sx={{ p: 1, bgcolor: `${card.color}15`, borderRadius: 2, color: card.color }}>
                  {card.icon}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}