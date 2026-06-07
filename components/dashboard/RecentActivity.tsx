'use client';
import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Box,
  Chip,
  CircularProgress,
  Divider,
  Button,
  alpha,
} from '@mui/material';
import {
  Payment as PaymentIcon,
  PersonAdd as PersonAddIcon,
  Home as HomeIcon,
  TrendingUp as TrendingUpIcon,
  Receipt as ReceiptIcon,
  MoreHoriz as MoreHorizIcon,
  Login as LoginIcon,
  Logout as LogoutIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import api from '@/lib/api';

interface Activity {
  id: number;
  action_type?: string;
  message?: string;
  created_at: string;
  username?: string;
  user_role?: string;
  module?: string;
  target_name?: string;
  ip_address?: string;
}

export default function RecentActivity() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        console.log('🔄 Début chargement activités récentes...');
        
        const response = await api.get('/logs/recent?limit=20');
        
        console.log('📊 Activités - Réponse brute:', response);
        console.log('📊 Activités - response.data:', response.data);
        console.log('📊 Type de response.data:', typeof response.data);
        
        let data = [];
        
        // Vérifier le format de la réponse
        if (response.data?.data && Array.isArray(response.data.data)) {
          console.log('✅ Format: response.data.data');
          data = response.data.data;
        } 
        else if (Array.isArray(response.data)) {
          console.log('✅ Format: Array direct');
          data = response.data;
        } 
        else if (response.data?.items && Array.isArray(response.data.items)) {
          console.log('✅ Format: response.data.items');
          data = response.data.items;
        }
        else if (response.data && typeof response.data === 'object') {
          // Essayer de trouver un tableau dans l'objet
          console.log('⚠️ Format objet, recherche d\'un tableau...');
          for (const key in response.data) {
            if (Array.isArray(response.data[key])) {
              console.log(`✅ Tableau trouvé dans la clé: ${key}`);
              data = response.data[key];
              break;
            }
          }
        }
        
        console.log(`📋 Nombre d'activités chargées: ${data.length}`);
        if (data.length > 0) {
          console.log('📋 Première activité:', data[0]);
          console.log('📋 Structure des données:', Object.keys(data[0]));
        }
        
        setActivities(data);
      } catch (error) {
        console.error('❌ Erreur chargement activités:', error);
        setActivities([]);
      } finally {
        setLoading(false);
        console.log('🏁 Fin chargement activités');
      }
    };
    
    fetchActivities();
  }, []);

  const getIconFromAction = (actionType?: string) => {
    if (!actionType) return <TrendingUpIcon />;
    const action = actionType.toLowerCase();
    if (action.includes('login') || action.includes('connexion')) return <LoginIcon />;
    if (action.includes('logout') || action.includes('déconnexion')) return <LogoutIcon />;
    if (action.includes('create') || action.includes('création')) return <PersonAddIcon />;
    if (action.includes('update') || action.includes('modification')) return <EditIcon />;
    if (action.includes('delete') || action.includes('suppression')) return <DeleteIcon />;
    if (action.includes('payment') || action.includes('paiement')) return <PaymentIcon />;
    if (action.includes('bail') || action.includes('contrat')) return <ReceiptIcon />;
    if (action.includes('logement') || action.includes('batiment')) return <HomeIcon />;
    return <TrendingUpIcon />;
  };

  const getColorFromAction = (actionType?: string) => {
    if (!actionType) return '#757575';
    const action = actionType.toLowerCase();
    if (action.includes('login')) return '#4caf50';
    if (action.includes('logout')) return '#f44336';
    if (action.includes('create')) return '#2196f3';
    if (action.includes('update')) return '#ff9800';
    if (action.includes('delete')) return '#f44336';
    if (action.includes('payment')) return '#4caf50';
    if (action.includes('bail')) return '#9c27b0';
    if (action.includes('logement')) return '#ff9800';
    return '#757575';
  };

  const formatTime = (dateString: string) => {
    if (!dateString) return 'Récemment';
    try {
      const now = new Date();
      const activityDate = new Date(dateString);
      const diffMs = now.getTime() - activityDate.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 1) return 'À l\'instant';
      if (diffMins < 60) return `Il y a ${diffMins} min`;
      if (diffHours < 24) return `Il y a ${diffHours} h`;
      if (diffDays < 7) return `Il y a ${diffDays} j`;
      return activityDate.toLocaleDateString('fr-FR');
    } catch {
      return dateString;
    }
  };

  const getMessage = (activity: Activity) => {
    if (activity.message) return activity.message;
    const user = activity.username || 'Utilisateur';
    const action = activity.action_type || 'action';
    const target = activity.target_name ? ` sur ${activity.target_name}` : '';
    return `${user} a effectué : ${action}${target}`;
  };

  const displayedActivities = showAll ? activities : activities.slice(0, 5);

  if (loading) {
    return (
      <Card sx={{ 
        backgroundColor: '#ffffff', 
        border: '1px solid #e0e0e0', 
        borderRadius: 2,
      }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress sx={{ color: '#2e7d32' }} />
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card sx={{ 
        backgroundColor: '#ffffff', 
        border: '1px solid #e0e0e0', 
        borderRadius: 2,
        overflow: 'hidden'
      }}>
        <Box sx={{ 
          p: 1.5, 
          borderBottom: '1px solid #f0f0f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="subtitle1" sx={{ color: '#1a1a1a', fontWeight: 600, fontSize: '0.9rem' }}>
              Activités récentes
            </Typography>
            {activities.length > 0 && (
              <Chip 
                label={activities.length} 
                size="small" 
                sx={{ backgroundColor: '#e8f5e9', color: '#2e7d32', fontWeight: 600, height: 20, fontSize: '0.7rem' }}
              />
            )}
          </Box>
          {activities.length > 5 && (
            <Button
              size="small"
              onClick={() => setShowAll(!showAll)}
              endIcon={<MoreHorizIcon />}
              sx={{ color: '#2e7d32', textTransform: 'none', fontSize: '0.7rem' }}
            >
              {showAll ? 'Voir moins' : 'Voir tout'}
            </Button>
          )}
        </Box>

        <CardContent sx={{ p: 0 }}>
          {activities.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4, px: 2 }}>
              <Typography variant="body2" sx={{ color: '#757575' }}>
                Aucune activité récente
              </Typography>
            </Box>
          ) : (
            <List sx={{ p: 0 }}>
              {displayedActivities.map((activity, index) => (
                <motion.div
                  key={activity.id || index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <>
                    <ListItem sx={{ px: 1.5, py: 1, '&:hover': { backgroundColor: '#fafafa' } }}>
                      <ListItemAvatar>
                        <Avatar 
                          sx={{ 
                            bgcolor: alpha(getColorFromAction(activity.action_type), 0.1),
                            color: getColorFromAction(activity.action_type),
                            width: 32,
                            height: 32,
                          }}
                        >
                          {getIconFromAction(activity.action_type)}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography variant="body2" sx={{ color: '#1a1a1a', fontWeight: 500, fontSize: '0.8rem' }}>
                            {getMessage(activity)}
                          </Typography>
                        }
                        secondary={
                          <Typography variant="caption" component="span" sx={{ color: '#9e9e9e', fontSize: '0.7rem' }}>
                            {formatTime(activity.created_at)}
                            {activity.username && ` • ${activity.username}`}
                          </Typography>
                        }
                      />
                      {activity.user_role && (
                        <Chip 
                          label={activity.user_role === 'admin' ? 'Admin' : activity.user_role} 
                          size="small" 
                          sx={{ 
                            backgroundColor: activity.user_role === 'admin' ? '#f44336' : '#e8f5e9',
                            color: activity.user_role === 'admin' ? '#fff' : '#2e7d32',
                            height: 20,
                            fontSize: '0.6rem'
                          }} 
                        />
                      )}
                    </ListItem>
                    {index < displayedActivities.length - 1 && <Divider sx={{ mx: 1.5 }} />}
                  </>
                </motion.div>
              ))}
            </List>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}