// src/components/paiements/FinancialDashboard.tsx
'use client';

import { useState, useEffect } from 'react';
import {
  Box, Grid, Card, CardContent, Typography, CircularProgress,
  Paper, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Chip, Divider, LinearProgress
} from '@mui/material';
import {
  AttachMoney, TrendingUp, TrendingDown, Warning,
  AccountBalance, CalendarToday, Receipt, Home
} from '@mui/icons-material';
import { paiementService } from '@/services/paiementService';
import { bailService } from '@/services/bailService';
import { StatistiquesPaiements } from '@/types/paiement';

interface MonthlyData {
  month: string;
  encaisse: number;
  prevu: number;
}

export default function FinancialDashboard() {
  const [stats, setStats] = useState<StatistiquesPaiements | null>(null);
  const [loading, setLoading] = useState(true);
  const [tauxOccupation, setTauxOccupation] = useState(0);
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, tableauBord] = await Promise.all([
          paiementService.getStatistiques(),
          paiementService.getTableauBord()
        ]);
        setStats(statsData);
        setTauxOccupation(tableauBord.taux_occupation);
        
        // Données mensuelles simulées (à adapter avec API réelle)
        const mois = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun'];
        setMonthlyData(mois.map((m, i) => ({
          month: m,
          encaisse: Math.random() * 5000000,
          prevu: 4000000
        })));
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

  const statCards = [
    { 
      title: 'CA Mensuel', 
      value: stats?.total_encaisse_mois || 0, 
      icon: <AttachMoney />, 
      color: '#2e7d32',
      subtitle: '+12% vs mois dernier'
    },
    { 
      title: 'Taux de recouvrement', 
      value: stats?.taux_recouvrement || 0, 
      icon: <TrendingUp />, 
      color: '#1976d2',
      suffix: '%',
      subtitle: `${stats?.taux_recouvrement > 80 ? 'Excellent' : 'À améliorer'}`
    },
    { 
      title: 'Impayés', 
      value: stats?.total_impayes || 0, 
      icon: <Warning />, 
      color: '#d32f2f',
      subtitle: `${stats?.total_impayes?.toLocaleString()} Ar en souffrance`
    },
    { 
      title: 'Taux d\'occupation', 
      value: tauxOccupation, 
      icon: <Home />, 
      color: '#f57c00',
      suffix: '%',
      subtitle: `${tauxOccupation > 90 ? 'Pleine occupation' : 'Disponibilités'}`
    }
  ];

  return (
    <Box>
      {/* Cartes statistiques */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {statCards.map((card, i) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={i}>
            <Card sx={{ borderRadius: 2, border: '1px solid #e2e8f0', height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">{card.title}</Typography>
                    <Typography variant="h4" sx={{ fontWeight: 700, my: 1 }}>
                      {typeof card.value === 'number' ? card.value.toLocaleString() : card.value}
                      {card.suffix && <Typography component="span" variant="body2" sx={{ ml: 0.5 }}>{card.suffix}</Typography>}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {card.subtitle}
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

      {/* Graphique mensuel (version simplifiée en barres) */}
      <Card sx={{ borderRadius: 2, mb: 3 }}>
        <CardContent>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
            Évolution mensuelle
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-end', height: 200 }}>
            {monthlyData.map((data, i) => {
              const maxValue = Math.max(...monthlyData.map(d => d.encaisse), 5000000);
              const height = (data.encaisse / maxValue) * 180;
              return (
                <Box key={i} sx={{ flex: 1, textAlign: 'center' }}>
                  <Box sx={{ height: 200, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                    <Box
                      sx={{
                        height: height,
                        bgcolor: '#2e7d32',
                        borderRadius: 1,
                        transition: 'height 0.3s',
                        mb: 1
                      }}
                    />
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    {data.month}
                  </Typography>
                  <Typography variant="caption" display="block" fontWeight={500}>
                    {(data.encaisse / 1000000).toFixed(1)}M
                  </Typography>
                </Box>
              );
            })}
          </Box>
        </CardContent>
      </Card>

      {/* Détails des impayés */}
      <Card sx={{ borderRadius: 2 }}>
        <CardContent>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
            Détail des impayés
          </Typography>
          
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="caption">Montant total impayés</Typography>
              <Typography variant="caption" fontWeight={500}>
                {(stats?.total_impayes || 0).toLocaleString()} Ar
              </Typography>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={Math.min((stats?.total_impayes || 0) / 10000000 * 100, 100)} 
              sx={{ height: 8, borderRadius: 4 }}
              color="error"
            />
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2, mt: 2 }}>
            <Box>
              <Typography variant="caption" color="text.secondary">Nombre de paiements ce mois</Typography>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {stats?.nombre_paiements_mois || 0}
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">Taux de recouvrement</Typography>
              <Typography variant="h6" sx={{ fontWeight: 600, color: stats?.taux_recouvrement > 70 ? '#2e7d32' : '#d32f2f' }}>
                {stats?.taux_recouvrement || 0}%
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">Rendement mensuel</Typography>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {((stats?.total_encaisse_mois || 0) / 1000000).toFixed(1)} M Ar
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}