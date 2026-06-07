'use client';
import { useEffect, useState } from 'react';
import { Grid, Card, CardContent, Typography, Box, CircularProgress, Tooltip } from '@mui/material';
import {
  Apartment as ApartmentIcon,
  Home as HomeIcon,
  People as PeopleIcon,
  Euro as EuroIcon,
  TrendingUp as TrendingUpIcon,
  Warning as WarningIcon,
  Receipt as ReceiptIcon,
} from '@mui/icons-material';
import { dashboardService } from '@/lib/api';

const StatCard = ({ title, value, icon, suffix = '', color = '#2e7d32', bgColor = '#e8f5e9' }: any) => (
  <Card sx={{ 
    bgcolor: '#ffffff', 
    border: '0.5px solid #e0e0e0', 
    borderRadius: 1.5,
    transition: 'all 0.2s',
    '&:hover': { 
      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      borderColor: '#2e7d32'
    }
  }}>
    <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography sx={{ color: '#9e9e9e', fontSize: 10, fontWeight: 500, mb: 0.5, letterSpacing: '0.3px' }}>
            {title}
          </Typography>
          <Typography sx={{ color: '#1a1a1a', fontWeight: 700, fontSize: '1.25rem', lineHeight: 1.2 }}>
            {typeof value === 'number' ? value.toLocaleString() : value}{suffix}
          </Typography>
        </Box>
        <Box sx={{ bgcolor: bgColor, borderRadius: 1, p: 0.75 }}>
          {icon}
        </Box>
      </Box>
    </CardContent>
  </Card>
);

export default function StatsCards() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await dashboardService.getStats();
        const data = response?.data || response || {};
        setStats(data);
      } catch (error) {
        console.error('Erreur:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <Grid container spacing={1}>
        {[1, 2, 3, 4, 5, 6, 7, 8].map((_, i) => (
          <Grid size={{ xs: 6, sm: 4, md: 3, lg: 1.5 }} key={i}>
            <Card sx={{ p: 1.5, border: '0.5px solid #e0e0e0', borderRadius: 1.5 }}>
              <CircularProgress size={24} sx={{ color: '#2e7d32' }} />
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  }

  const cards = [
    { title: 'Bâtiments', value: stats.total_batiments || 0, icon: <ApartmentIcon sx={{ fontSize: 18, color: '#2e7d32' }} /> },
    { title: 'Logements', value: stats.total_logements || 0, icon: <HomeIcon sx={{ fontSize: 18, color: '#2e7d32' }} /> },
    { title: 'Taux occupation', value: stats.taux_occupation || 0, icon: <TrendingUpIcon sx={{ fontSize: 18, color: '#2196f3' }} />, suffix: '%', color: '#2196f3', bgColor: '#e3f2fd' },
    { title: 'Locataires', value: stats.total_locataires || 0, icon: <PeopleIcon sx={{ fontSize: 18, color: '#2e7d32' }} /> },
    { title: 'Baux actifs', value: stats.baux_actifs || 0, icon: <ReceiptIcon sx={{ fontSize: 18, color: '#9c27b0' }} />, color: '#9c27b0', bgColor: '#f3e5f5' },
    { title: 'CA Mensuel', value: ((stats.chiffre_affaires_mois || 0) / 1000).toFixed(0), icon: <EuroIcon sx={{ fontSize: 18, color: '#ff9800' }} />, suffix: 'k', color: '#ff9800', bgColor: '#fff3e0' },
    { title: 'Impayés', value: ((stats.impayes_total || 0) / 1000).toFixed(0), icon: <WarningIcon sx={{ fontSize: 18, color: '#f44336' }} />, suffix: 'k', color: '#f44336', bgColor: '#ffebee' },
    { title: 'Taux recouvrement', value: stats.taux_recouvrement || 0, icon: <TrendingUpIcon sx={{ fontSize: 18, color: '#4caf50' }} />, suffix: '%', color: '#4caf50', bgColor: '#e8f5e9' },
  ];

  return (
    <Grid container spacing={1}>
      {cards.map((card, i) => (
        <Grid size={{ xs: 6, sm: 4, md: 3, lg: 1.5 }} key={i}>
          <StatCard {...card} />
        </Grid>
      ))}
    </Grid>
  );
}