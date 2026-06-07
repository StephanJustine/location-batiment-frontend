'use client';
import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  FormControl,
  Select,
  MenuItem,
  Alert,
} from '@mui/material';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { dashboardService } from '@/lib/api';

export default function Charts() {
  const [evolution, setEvolution] = useState<any[]>([]);
  const [chartType, setChartType] = useState<'ca' | 'impayes' | 'occupation'>('ca');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvolution = async () => {
      try {
        console.log('🔄 Début chargement évolution...');
        
        const response = await dashboardService.getEvolution(12);
        console.log('📊 Évolution - Réponse brute:', response);
        console.log('📊 Type de réponse:', typeof response);
        
        let data = [];
        
        if (Array.isArray(response)) {
          console.log('✅ Format: Array direct');
          data = response;
        } 
        else if (response?.data && Array.isArray(response.data)) {
          console.log('✅ Format: response.data');
          data = response.data;
        } 
        else if (response?.items && Array.isArray(response.items)) {
          console.log('✅ Format: response.items');
          data = response.items;
        }
        else if (response && typeof response === 'object') {
          console.log('⚠️ Recherche d\'un tableau dans l\'objet...');
          for (const key in response) {
            if (Array.isArray(response[key])) {
              console.log(`✅ Tableau trouvé dans la clé: ${key}`);
              data = response[key];
              break;
            }
          }
        }
        
        console.log(`📋 Nombre de données: ${data.length}`);
        if (data.length > 0) {
          console.log('📋 Première donnée:', data[0]);
          console.log('📋 Clés disponibles:', Object.keys(data[0]));
        }
        
        setEvolution(data);
      } catch (error) {
        console.error('❌ Erreur chargement evolution:', error);
        setError('Impossible de charger les données');
      } finally {
        setLoading(false);
        console.log('🏁 Fin chargement évolution');
      }
    };
    fetchEvolution();
  }, []);

  const getChartData = () => {
    if (!evolution || evolution.length === 0) {
      return {
        title: 'Aucune donnée disponible',
        data: [],
        color: '#2e7d32',
        label: '',
      };
    }

    if (chartType === 'ca') {
      return {
        title: 'Évolution du Chiffre d\'Affaires',
        data: evolution.map((e: any) => ({ 
          mois: e.mois || e.month || e.periode || e.label || '-', 
          valeur: (e.ca || e.chiffre_affaires || e.total || e.montant || 0) / 1000 
        })),
        color: '#2e7d32',
        label: 'CA (k Ar)',
      };
    } else if (chartType === 'impayes') {
      return {
        title: 'Évolution des Impayés',
        data: evolution.map((e: any) => ({ 
          mois: e.mois || e.month || e.periode || e.label || '-', 
          valeur: (e.impayes || e.impayes_total || e.impaye || 0) / 1000 
        })),
        color: '#f44336',
        label: 'Impayés (k Ar)',
      };
    } else {
      return {
        title: "Taux d'Occupation (%)",
        data: evolution.map((e: any) => ({ 
          mois: e.mois || e.month || e.periode || e.label || '-', 
          valeur: e.taux_occupation || e.occupation || e.taux || 0 
        })),
        color: '#2196f3',
        label: 'Occupation (%)',
      };
    }
  };

  if (loading) {
    return (
      <Card sx={{ borderRadius: 2, border: '0.5px solid #e0e0e0' }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress sx={{ color: '#2e7d32' }} />
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

  const chartData = getChartData();

  if (chartData.data.length === 0) {
    return (
      <Card sx={{ borderRadius: 2, border: '0.5px solid #e0e0e0' }}>
        <CardContent>
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography sx={{ color: '#757575' }}>Aucune donnée disponible</Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ borderRadius: 2, border: '0.5px solid #e0e0e0' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="subtitle1" sx={{ color: '#1a1a1a', fontWeight: 600, fontSize: '0.9rem' }}>
            {chartData.title}
          </Typography>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <Select
              value={chartType}
              onChange={(e) => setChartType(e.target.value as any)}
              sx={{ fontSize: '0.8rem', height: 32 }}
            >
              <MenuItem value="ca">Chiffre d'affaires</MenuItem>
              <MenuItem value="impayes">Impayés</MenuItem>
              <MenuItem value="occupation">Taux d'occupation</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData.data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="mois" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Area
              type="monotone"
              dataKey="valeur"
              name={chartData.label}
              stroke={chartData.color}
              fill={chartData.color}
              fillOpacity={0.3}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}