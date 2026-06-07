'use client';
import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Chip,
  Box,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Person as PersonIcon, EmojiEvents as EmojiEventsIcon } from '@mui/icons-material';
import { dashboardService } from '@/lib/api';

export default function TopLocataires() {
  const [locataires, setLocataires] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTopLocataires = async () => {
      try {
        console.log('🔄 Début chargement top locataires...');
        
        const response = await dashboardService.getTopLocataires(10);
        console.log('📊 Top locataires - Réponse brute:', response);
        console.log('📊 Type de réponse:', typeof response);
        
        let data = [];
        
        // Vérifier les différents formats possibles
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
          // Chercher un tableau dans l'objet
          for (const key in response) {
            if (Array.isArray(response[key])) {
              console.log(`✅ Tableau trouvé dans la clé: ${key}`);
              data = response[key];
              break;
            }
          }
          // Si toujours pas de données, essayer de convertir l'objet en tableau
          if (data.length === 0 && Object.values(response).some(v => typeof v === 'object')) {
            console.log('⚠️ Tentative de conversion de l\'objet...');
            const possibleData = Object.values(response).find(v => Array.isArray(v));
            if (possibleData) {
              data = possibleData;
              console.log('✅ Données extraites avec succès');
            }
          }
        }
        
        console.log(`📋 Nombre de locataires chargés: ${data.length}`);
        if (data.length > 0) {
          console.log('📋 Premier locataire:', data[0]);
          console.log('📋 Clés disponibles:', Object.keys(data[0]));
          console.log('📋 Exemple de nom:', data[0].nom || data[0].locataire_nom || data[0].name);
          console.log('📋 Exemple montant:', data[0].total_paye || data[0].montant_total || data[0].total);
        }
        
        setLocataires(data);
      } catch (error) {
        console.error('❌ Erreur chargement top locataires:', error);
        setError('Impossible de charger les données');
      } finally {
        setLoading(false);
        console.log('🏁 Fin chargement top locataires');
      }
    };
    fetchTopLocataires();
  }, []);

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

  return (
    <Card sx={{ borderRadius: 2, border: '0.5px solid #e0e0e0' }}>
      <CardContent sx={{ p: 1.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
          <EmojiEventsIcon sx={{ color: '#ffc107', fontSize: 20, mr: 1 }} />
          <Typography variant="subtitle1" sx={{ color: '#1a1a1a', fontWeight: 600, fontSize: '0.9rem' }}>
            Top Locataires
          </Typography>
          <Chip
            label="Meilleurs payeurs"
            size="small"
            sx={{ ml: 1, backgroundColor: '#e8f5e9', color: '#2e7d32', height: 20, fontSize: '0.65rem' }}
          />
        </Box>

        {locataires.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 3 }}>
            <Typography sx={{ color: '#757575', fontSize: '0.8rem' }}>
              Aucune donnée disponible
            </Typography>
          </Box>
        ) : (
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableCell sx={{ fontSize: '0.75rem', fontWeight: 600, py: 1 }}>#</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem', fontWeight: 600, py: 1 }}>Locataire</TableCell>
                  <TableCell sx={{ fontSize: '0.75rem', fontWeight: 600, py: 1 }}>Téléphone</TableCell>
                  <TableCell align="right" sx={{ fontSize: '0.75rem', fontWeight: 600, py: 1 }}>Total payé</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {locataires.slice(0, 5).map((locataire: any, index: number) => (
                  <TableRow key={locataire.locataire_id || index} hover>
                    <TableCell sx={{ py: 1 }}>
                      <Chip
                        label={`${index + 1}`}
                        size="small"
                        sx={{
                          backgroundColor: index === 0 ? '#ffd700' : index === 1 ? '#c0c0c0' : index === 2 ? '#cd7f32' : '#e0e0e0',
                          color: '#000000',
                          fontWeight: 600,
                          width: 28,
                          height: 22,
                          fontSize: '0.7rem'
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ py: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar sx={{ bgcolor: '#e8f5e9', width: 28, height: 28 }}>
                          <PersonIcon sx={{ color: '#2e7d32', fontSize: 16 }} />
                        </Avatar>
                        <Typography sx={{ color: '#1a1a1a', fontWeight: 500, fontSize: '0.8rem' }}>
                          {locataire.nom || locataire.locataire_nom || locataire.name || 'Inconnu'}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ color: '#757575', fontSize: '0.75rem', py: 1 }}>
                      {locataire.telephone || '-'}
                    </TableCell>
                    <TableCell align="right" sx={{ color: '#2e7d32', fontWeight: 600, fontSize: '0.8rem', py: 1 }}>
                      {(locataire.total_paye || locataire.montant_total || locataire.total || 0).toLocaleString()} Ar
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </CardContent>
    </Card>
  );
}