'use client';
import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Box,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Warning as WarningIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { dashboardService } from '@/lib/api';

export default function AlertesList() {
  const [alertes, setAlertes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAlertes = async () => {
      try {
        console.log('🔄 Début chargement alertes...');
        
        const response = await dashboardService.getAlertes();
        console.log('📊 Alertes - Réponse brute:', response);
        console.log('📊 Type de réponse:', typeof response);
        
        let allAlertes = [];
        
        // Vérifier les différents formats possibles
        if (response?.data) {
          console.log('✅ Format: response.data');
          const data = response.data;
          if (data?.urgent) allAlertes.push(...data.urgent);
          if (data?.moyen) allAlertes.push(...data.moyen);
          if (data?.faible) allAlertes.push(...data.faible);
        }
        else if (response?.urgent) {
          console.log('✅ Format: response direct avec urgent/moyen/faible');
          if (response.urgent) allAlertes.push(...response.urgent);
          if (response.moyen) allAlertes.push(...response.moyen);
          if (response.faible) allAlertes.push(...response.faible);
        }
        else if (Array.isArray(response)) {
          console.log('✅ Format: Array direct');
          allAlertes = response;
        }
        else if (response && typeof response === 'object') {
          // Chercher des tableaux dans l'objet
          console.log('⚠️ Recherche de tableaux dans l\'objet...');
          for (const key in response) {
            if (Array.isArray(response[key])) {
              console.log(`✅ Tableau trouvé dans la clé: ${key}`);
              allAlertes = response[key];
              break;
            }
          }
        }
        
        console.log(`📋 Nombre d'alertes chargées: ${allAlertes.length}`);
        if (allAlertes.length > 0) {
          console.log('📋 Première alerte:', allAlertes[0]);
        }
        
        setAlertes(allAlertes);
      } catch (error) {
        console.error('❌ Erreur chargement alertes:', error);
        setError('Impossible de charger les alertes');
      } finally {
        setLoading(false);
        console.log('🏁 Fin chargement alertes');
      }
    };
    fetchAlertes();
  }, []);

  const getIcon = (niveau: string) => {
    switch (niveau?.toLowerCase()) {
      case 'urgent': return <ErrorIcon sx={{ color: '#f44336', fontSize: 20 }} />;
      case 'moyen': return <WarningIcon sx={{ color: '#ff9800', fontSize: 20 }} />;
      default: return <InfoIcon sx={{ color: '#2196f3', fontSize: 20 }} />;
    }
  };

  const getChipColor = (niveau: string): 'error' | 'warning' | 'info' => {
    switch (niveau?.toLowerCase()) {
      case 'urgent': return 'error';
      case 'moyen': return 'warning';
      default: return 'info';
    }
  };

  if (loading) {
    return (
      <Card sx={{ borderRadius: 2, border: '0.5px solid #e0e0e0' }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
            <CircularProgress size={30} sx={{ color: '#2e7d32' }} />
          </Box>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card sx={{ borderRadius: 2, border: '0.5px solid #e0e0e0' }}>
        <CardContent>
          <Alert severity="error">{error}</Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ borderRadius: 2, border: '0.5px solid #e0e0e0' }}>
      <CardContent sx={{ p: 1.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
          <Typography variant="subtitle1" sx={{ color: '#1a1a1a', fontWeight: 600, fontSize: '0.9rem' }}>
            Alertes
          </Typography>
          <Chip
            label={`${alertes.length}`}
            size="small"
            sx={{ ml: 1, backgroundColor: '#e8f5e9', color: '#2e7d32', height: 20, fontSize: '0.7rem' }}
          />
        </Box>
        
        {alertes.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 2 }}>
            <CheckCircleIcon sx={{ fontSize: 40, color: '#4caf50', mb: 1 }} />
            <Typography sx={{ color: '#757575', fontSize: '0.8rem' }}>Aucune alerte</Typography>
          </Box>
        ) : (
          <List sx={{ p: 0 }}>
            {alertes.slice(0, 5).map((alerte: any, index: number) => (
              <ListItem key={index} sx={{ px: 0, py: 0.5 }}>
                <ListItemIcon sx={{ minWidth: 32 }}>{getIcon(alerte.niveau)}</ListItemIcon>
                <ListItemText
                  primary={<Typography variant="body2" sx={{ fontSize: '0.8rem', fontWeight: 500 }}>{alerte.message}</Typography>}
                  secondary={<Typography variant="caption" sx={{ fontSize: '0.7rem' }}>{alerte.locataire_nom || alerte.date}</Typography>}
                />
                <Chip label={alerte.niveau} size="small" color={getChipColor(alerte.niveau)} sx={{ height: 20, fontSize: '0.6rem' }} />
              </ListItem>
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  );
}