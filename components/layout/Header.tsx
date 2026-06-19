// 'use client';
// import { useState, useEffect } from 'react';
// import {
//   AppBar,
//   Toolbar,
//   IconButton,
//   Typography,
//   Badge,
//   Avatar,
//   Menu,
//   MenuItem,
//   Box,
//   alpha,
//   Chip,
//   Skeleton,
//   Button,
//   useMediaQuery,
//   useTheme,
//   Tooltip,
// } from '@mui/material';
// import {
//   Notifications as NotificationsIcon,
//   Person as PersonIcon,
//   Settings as SettingsIcon,
//   Logout as LogoutIcon,
//   Menu as MenuIcon,
//   Dashboard as DashboardIcon,
//   DoneAll as DoneAllIcon,
//   CheckCircle as CheckCircleIcon,
//   Circle as CircleIcon,
//   Refresh as RefreshIcon,
// } from '@mui/icons-material';
// import { useAuth } from '@/contexts/AuthContext';
// import api from '@/lib/api';

// interface HeaderProps {
//   onMenuClick?: () => void;
// }

// interface Notification {
//   id: number;
//   message: string;
//   created_at: string;
//   read: boolean;
//   categorie?: string;
// }

// export default function Header({ onMenuClick }: HeaderProps) {
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
//   const isTablet = useMediaQuery(theme.breakpoints.down('md'));
//   const { user, logout } = useAuth();
//   const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
//   const [notifAnchorEl, setNotifAnchorEl] = useState<null | HTMLElement>(null);
//   const [notifications, setNotifications] = useState<Notification[]>([]);
//   const [notifLoading, setNotifLoading] = useState(true);

//   useEffect(() => {
//     fetchNotifications();
//   }, []);

//   const fetchNotifications = async () => {
//     try {
//       const response = await api.get('/notifications/historique?limit=5');
//       let data = response.data?.data || response.data || [];
//       const formatted = (Array.isArray(data) ? data : []).map((n: any) => ({
//         id: n.id,
//         message: n.message || n.sujet || 'Notification',
//         created_at: n.created_at || n.date_envoi || new Date().toISOString(),
//         read: n.statut === 'lu' || n.lu === true,
//         categorie: n.categorie,
//       }));
//       setNotifications(formatted);
//     } catch (error) {
//       console.error('Erreur notifications:', error);
//     } finally {
//       setNotifLoading(false);
//     }
//   };

//   const markAsRead = async (id: number) => {
//     try {
//       await api.put(`/notifications/${id}/read`);
//       setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
//     } catch (error) {
//       setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
//     }
//   };

//   const markAllAsRead = async () => {
//     const unreadCount = notifications.filter(n => !n.read).length;
//     if (unreadCount === 0) return;
//     try {
//       await api.post('/notifications/mark-all-read');
//       setNotifications(prev => prev.map(n => ({ ...n, read: true })));
//     } catch (error) {
//       setNotifications(prev => prev.map(n => ({ ...n, read: true })));
//     }
//   };

//   const refreshNotifications = () => {
//     setNotifLoading(true);
//     fetchNotifications();
//   };

//   const handleNotificationClick = async (notif: Notification) => {
//     if (!notif.read) await markAsRead(notif.id);
//     setNotifAnchorEl(null);
//   };

//   const formatTime = (date: string) => {
//     if (!date) return '';
//     const diff = Date.now() - new Date(date).getTime();
//     const mins = Math.floor(diff / 60000);
//     if (mins < 1) return 'à l\'instant';
//     if (mins < 60) return `${mins} min`;
//     const hours = Math.floor(mins / 60);
//     if (hours < 24) return `${hours} h`;
//     const days = Math.floor(hours / 24);
//     if (days < 7) return `${days} j`;
//     return new Date(date).toLocaleDateString('fr-FR');
//   };

//   const unreadCount = notifications.filter(n => !n.read).length;
  
//   const getRoleLabel = (role?: string) => {
//     if (role === 'admin') return 'Admin';
//     if (role === 'gestionnaire') return 'Gest';
//     return 'User';
//   };

//   const getUserInitials = () => {
//     if (user?.nom && user?.prenom) {
//       return `${user.nom.charAt(0)}${user.prenom.charAt(0)}`.toUpperCase();
//     }
//     if (user?.nom) return user.nom.charAt(0).toUpperCase();
//     return <PersonIcon sx={{ fontSize: 18 }} />;
//   };

//   return (
//     <AppBar
//       position="fixed"
//       sx={{
//         bgcolor: '#fff',
//         boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
//         zIndex: 1200,
//         width: { sm: `calc(100% - 260px)` },
//         ml: { sm: '260px' },
//       }}
//     >
//       <Toolbar sx={{ minHeight: { xs: 56, sm: 60 }, px: { xs: 1.5, sm: 2 } }}>
//         {/* Menu button mobile */}
//         <IconButton 
//           onClick={onMenuClick} 
//           sx={{ 
//             mr: 1, 
//             display: { sm: 'none' }, 
//             color: '#2e7d32',
//             p: 0.5
//           }}
//         >
//           <MenuIcon sx={{ fontSize: 22 }} />
//         </IconButton>

//         {/* Logo / Title mobile */}
//         {isMobile && (
//           <Typography sx={{ 
//             flex: 1, 
//             fontWeight: 600, 
//             fontSize: '0.85rem', 
//             color: '#2e7d32',
//             letterSpacing: '0.5px'
//           }}>
//             Location MG
//           </Typography>
//         )}

//         {/* Actions */}
//         <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 1 }, ml: 'auto' }}>
//           {/* Notifications */}
//           <Tooltip title="Notifications">
//             <IconButton 
//               onClick={(e) => setNotifAnchorEl(e.currentTarget)} 
//               sx={{ color: '#2e7d32', p: 0.5 }}
//               size="small"
//             >
//               <Badge 
//                 badgeContent={unreadCount} 
//                 color="error" 
//                 sx={{ 
//                   '& .MuiBadge-badge': { 
//                     fontSize: 9, 
//                     height: 16, 
//                     minWidth: 16,
//                     fontWeight: 600
//                   } 
//                 }}
//               >
//                 <NotificationsIcon sx={{ fontSize: 20 }} />
//               </Badge>
//             </IconButton>
//           </Tooltip>

//           {/* User chip (desktop only) */}
//           {!isTablet && (
//             <Chip
//               label={getRoleLabel(user?.role)}
//               size="small"
//               sx={{ 
//                 ml: 0.5, 
//                 bgcolor: '#e8f5e9', 
//                 color: '#2e7d32', 
//                 height: 24, 
//                 fontSize: '0.65rem',
//                 fontWeight: 500
//               }}
//             />
//           )}

//           {/* Avatar */}
//           <Tooltip title={user?.nom || 'Profil'}>
//             <IconButton 
//               onClick={(e) => setAnchorEl(e.currentTarget)} 
//               size="small"
//               sx={{ p: 0.5 }}
//             >
//               <Avatar sx={{ bgcolor: '#2e7d32', width: 32, height: 32, fontSize: '0.8rem' }}>
//                 {getUserInitials()}
//               </Avatar>
//             </IconButton>
//           </Tooltip>
//         </Box>

//         {/* User Menu */}
//         <Menu
//           anchorEl={anchorEl}
//           open={Boolean(anchorEl)}
//           onClose={() => setAnchorEl(null)}
//           anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
//           transformOrigin={{ vertical: 'top', horizontal: 'right' }}
//           slotProps={{ 
//             paper: { 
//               sx: { 
//                 mt: 1, 
//                 minWidth: 200, 
//                 borderRadius: 2,
//                 boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
//               } 
//             } 
//           }}
//         >
//           <Box sx={{ px: 2, py: 1.2, borderBottom: '1px solid #f0f0f0' }}>
//             <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.85rem' }}>
//               {user?.nom} {user?.prenom}
//             </Typography>
//             <Typography variant="caption" sx={{ color: '#9e9e9e', fontSize: '0.7rem', display: 'block', mt: 0.3 }}>
//               {user?.email}
//             </Typography>
//           </Box>
//           <MenuItem onClick={() => setAnchorEl(null)} sx={{ py: 1, px: 2 }}>
//             <DashboardIcon sx={{ mr: 1.5, fontSize: 18, color: '#2e7d32' }} />
//             <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>Tableau de bord</Typography>
//           </MenuItem>
//           <MenuItem onClick={() => setAnchorEl(null)} sx={{ py: 1, px: 2 }}>
//             <PersonIcon sx={{ mr: 1.5, fontSize: 18, color: '#2e7d32' }} />
//             <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>Mon profil</Typography>
//           </MenuItem>
//           <MenuItem onClick={() => setAnchorEl(null)} sx={{ py: 1, px: 2 }}>
//             <SettingsIcon sx={{ mr: 1.5, fontSize: 18, color: '#2e7d32' }} />
//             <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>Paramètres</Typography>
//           </MenuItem>
//           <MenuItem onClick={logout} sx={{ py: 1, px: 2, color: '#f44336' }}>
//             <LogoutIcon sx={{ mr: 1.5, fontSize: 18 }} />
//             <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>Déconnexion</Typography>
//           </MenuItem>
//         </Menu>

//         {/* Notifications Menu */}
//         <Menu
//           anchorEl={notifAnchorEl}
//           open={Boolean(notifAnchorEl)}
//           onClose={() => setNotifAnchorEl(null)}
//           anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
//           transformOrigin={{ vertical: 'top', horizontal: 'right' }}
//           slotProps={{ 
//             paper: { 
//               sx: { 
//                 mt: 1, 
//                 width: { xs: 320, sm: 360 }, 
//                 maxHeight: 450, 
//                 borderRadius: 2,
//                 boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
//               } 
//             } 
//           }}
//         >
//           <Box sx={{ p: 1.2, borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//             <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: '0.8rem' }}>
//               Notifications
//             </Typography>
//             <Box sx={{ display: 'flex', gap: 0.5 }}>
//               <Tooltip title="Actualiser">
//                 <IconButton size="small" onClick={refreshNotifications} sx={{ p: 0.5 }}>
//                   <RefreshIcon sx={{ fontSize: 16, color: '#757575' }} />
//                 </IconButton>
//               </Tooltip>
//               {unreadCount > 0 && (
//                 <Button 
//                   size="small" 
//                   startIcon={<DoneAllIcon sx={{ fontSize: 14 }} />} 
//                   onClick={markAllAsRead} 
//                   sx={{ fontSize: '0.65rem', color: '#2e7d32', textTransform: 'none', minWidth: 'auto', p: 0.5 }}
//                 >
//                   Tout lire
//                 </Button>
//               )}
//             </Box>
//           </Box>

//           {notifLoading ? (
//             <Box sx={{ p: 1.5 }}>
//               <Skeleton width="100%" height={30} />
//               <Skeleton width="80%" height={30} sx={{ mt: 1 }} />
//               <Skeleton width="90%" height={30} sx={{ mt: 1 }} />
//             </Box>
//           ) : notifications.length === 0 ? (
//             <Box sx={{ textAlign: 'center', py: 3 }}>
//               <NotificationsIcon sx={{ fontSize: 32, color: '#e0e0e0' }} />
//               <Typography variant="caption" sx={{ color: '#9e9e9e', display: 'block', mt: 0.5 }}>
//                 Aucune notification
//               </Typography>
//             </Box>
//           ) : (
//             <>
//               {notifications.slice(0, 5).map((notif) => (
//                 <MenuItem 
//                   key={notif.id} 
//                   onClick={() => handleNotificationClick(notif)} 
//                   sx={{ 
//                     py: 1, 
//                     px: 1.5, 
//                     flexDirection: 'column', 
//                     alignItems: 'flex-start', 
//                     bgcolor: notif.read ? 'transparent' : alpha('#2e7d32', 0.04),
//                     borderBottom: '1px solid #f0f0f0',
//                     '&:hover': { bgcolor: alpha('#2e7d32', 0.08) },
//                     '&:last-child': { borderBottom: 'none' }
//                   }}
//                 >
//                   <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, width: '100%' }}>
//                     {!notif.read && <CircleIcon sx={{ fontSize: 8, color: '#2e7d32', mt: 0.6 }} />}
//                     <Box sx={{ flex: 1 }}>
//                       <Typography variant="body2" sx={{ 
//                         fontWeight: notif.read ? 400 : 600, 
//                         fontSize: '0.75rem',
//                         lineHeight: 1.3
//                       }}>
//                         {notif.message}
//                       </Typography>
//                       <Typography variant="caption" sx={{ color: '#9e9e9e', fontSize: '0.6rem', display: 'block', mt: 0.3 }}>
//                         {formatTime(notif.created_at)}
//                       </Typography>
//                     </Box>
//                     {notif.read && <CheckCircleIcon sx={{ fontSize: 12, color: '#4caf50' }} />}
//                   </Box>
//                 </MenuItem>
//               ))}
//               {notifications.length > 5 && (
//                 <Box sx={{ p: 1, borderTop: '1px solid #f0f0f0', textAlign: 'center' }}>
//                   <Button 
//                     size="small" 
//                     sx={{ fontSize: '0.65rem', color: '#2e7d32', textTransform: 'none' }}
//                   >
//                     Voir toutes ({notifications.length})
//                   </Button>
//                 </Box>
//               )}
//             </>
//           )}
//         </Menu>
//       </Toolbar>
//     </AppBar>
//   );
// }


// components/layout/Header.tsx
'use client';

import { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Badge,
  Avatar,
  Menu,
  MenuItem,
  Box,
  alpha,
  Chip,
  Skeleton,
  Button,
  useMediaQuery,
  useTheme,
  Tooltip,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  DoneAll as DoneAllIcon,
  CheckCircle as CheckCircleIcon,
  Circle as CircleIcon,
  Refresh as RefreshIcon,
  AdminPanelSettings as AdminIcon,
  Security as SecurityIcon,
  Visibility as VisibilityIcon,
  Home as HomeIcon,
} from '@mui/icons-material';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/api';
import { UserRole } from '@/types/user';
import { useRouter } from 'next/navigation';

interface HeaderProps {
  onMenuClick?: () => void;
}

interface Notification {
  id: number;
  message: string;
  created_at: string;
  read: boolean;
  categorie?: string;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const router = useRouter();
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notifAnchorEl, setNotifAnchorEl] = useState<null | HTMLElement>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notifLoading, setNotifLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await api.get('/notifications/historique?limit=5');
      let data = response.data?.data || response.data || [];
      const formatted = (Array.isArray(data) ? data : []).map((n: any) => ({
        id: n.id,
        message: n.message || n.sujet || 'Notification',
        created_at: n.created_at || n.date_envoi || new Date().toISOString(),
        read: n.statut === 'lu' || n.lu === true,
        categorie: n.categorie,
      }));
      setNotifications(formatted);
    } catch (error) {
      console.error('Erreur notifications:', error);
    } finally {
      setNotifLoading(false);
    }
  };

  const markAsRead = async (id: number) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    } catch (error) {
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    }
  };

  const markAllAsRead = async () => {
    const unreadCount = notifications.filter(n => !n.read).length;
    if (unreadCount === 0) return;
    try {
      await api.post('/notifications/mark-all-read');
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (error) {
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    }
  };

  const refreshNotifications = () => {
    setNotifLoading(true);
    fetchNotifications();
  };

  const handleNotificationClick = async (notif: Notification) => {
    if (!notif.read) await markAsRead(notif.id);
    setNotifAnchorEl(null);
  };

  const formatTime = (date: string) => {
    if (!date) return '';
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'à l\'instant';
    if (mins < 60) return `${mins} min`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours} h`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days} j`;
    return new Date(date).toLocaleDateString('fr-FR');
  };

  const unreadCount = notifications.filter(n => !n.read).length;
  
  // ✅ Configuration des rôles avec couleurs et icônes
  const roleConfig = {
    [UserRole.ADMIN]: { 
      label: 'Admin', 
      color: '#dc2626', 
      bg: '#fef2f2', 
      icon: <AdminIcon sx={{ fontSize: 14 }} /> 
    },
    [UserRole.GESTIONNAIRE]: { 
      label: 'Gestionnaire', 
      color: '#2563eb', 
      bg: '#eff6ff', 
      icon: <SecurityIcon sx={{ fontSize: 14 }} /> 
    },
    [UserRole.SUPERVISEUR]: { 
      label: 'Superviseur', 
      color: '#7c3aed', 
      bg: '#f3e8ff', 
      icon: <VisibilityIcon sx={{ fontSize: 14 }} /> 
    },
    [UserRole.LOCATAIRE]: { 
      label: 'Locataire', 
      color: '#059669', 
      bg: '#f0fdf4', 
      icon: <PersonIcon sx={{ fontSize: 14 }} /> 
    }
  };

  const getRoleLabel = (role?: string) => {
    if (!role) return 'User';
    const config = roleConfig[role as UserRole];
    return config?.label || role.charAt(0).toUpperCase() + role.slice(1);
  };

  const getRoleColor = (role?: string) => {
    if (!role) return '#64748b';
    const config = roleConfig[role as UserRole];
    return config?.color || '#64748b';
  };

  const getRoleBg = (role?: string) => {
    if (!role) return '#f1f5f9';
    const config = roleConfig[role as UserRole];
    return config?.bg || '#f1f5f9';
  };

  const getRoleIcon = (role?: string) => {
    if (!role) return <PersonIcon sx={{ fontSize: 14 }} />;
    const config = roleConfig[role as UserRole];
    return config?.icon || <PersonIcon sx={{ fontSize: 14 }} />;
  };

  const getUserInitials = () => {
    if (user?.nom && user?.prenom) {
      return `${user.nom.charAt(0)}${user.prenom.charAt(0)}`.toUpperCase();
    }
    if (user?.nom) return user.nom.charAt(0).toUpperCase();
    return <PersonIcon sx={{ fontSize: 18 }} />;
  };

  const handleNavigate = (path: string) => {
    setAnchorEl(null);
    router.push(path);
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        bgcolor: '#fff',
        boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
        zIndex: 1200,
        width: { sm: `calc(100% - 260px)` },
        ml: { sm: '260px' },
      }}
    >
      <Toolbar sx={{ minHeight: { xs: 56, sm: 60 }, px: { xs: 1.5, sm: 2 } }}>
        {/* Menu button mobile */}
        <IconButton 
          onClick={onMenuClick} 
          sx={{ 
            mr: 1, 
            display: { sm: 'none' }, 
            color: '#2e7d32',
            p: 0.5
          }}
        >
          <MenuIcon sx={{ fontSize: 22 }} />
        </IconButton>

        {/* Logo / Title mobile */}
        {isMobile && (
          <Typography sx={{ 
            flex: 1, 
            fontWeight: 600, 
            fontSize: '0.85rem', 
            color: '#2e7d32',
            letterSpacing: '0.5px'
          }}>
            Location MG
          </Typography>
        )}

        {/* Actions */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 1 }, ml: 'auto' }}>
          {/* Notifications */}
          <Tooltip title="Notifications">
            <IconButton 
              onClick={(e) => setNotifAnchorEl(e.currentTarget)} 
              sx={{ color: '#2e7d32', p: 0.5 }}
              size="small"
            >
              <Badge 
                badgeContent={unreadCount} 
                color="error" 
                sx={{ 
                  '& .MuiBadge-badge': { 
                    fontSize: 9, 
                    height: 16, 
                    minWidth: 16,
                    fontWeight: 600
                  } 
                }}
              >
                <NotificationsIcon sx={{ fontSize: 20 }} />
              </Badge>
            </IconButton>
          </Tooltip>

          {/* Role chip avec icône */}
          {!isTablet && (
            <Chip
              icon={getRoleIcon(user?.role)}
              label={getRoleLabel(user?.role)}
              size="small"
              sx={{ 
                ml: 0.5, 
                bgcolor: getRoleBg(user?.role), 
                color: getRoleColor(user?.role),
                height: 24, 
                fontSize: '0.65rem',
                fontWeight: 500,
                '& .MuiChip-icon': { 
                  color: getRoleColor(user?.role),
                  fontSize: 14
                }
              }}
            />
          )}

          {/* Avatar */}
          <Tooltip title={user?.nom || 'Profil'}>
            <IconButton 
              onClick={(e) => setAnchorEl(e.currentTarget)} 
              size="small"
              sx={{ p: 0.5 }}
            >
              <Avatar sx={{ bgcolor: '#2e7d32', width: 32, height: 32, fontSize: '0.8rem' }}>
                {getUserInitials()}
              </Avatar>
            </IconButton>
          </Tooltip>
        </Box>

        {/* User Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          slotProps={{ 
            paper: { 
              sx: { 
                mt: 1, 
                minWidth: 220, 
                borderRadius: 2,
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              } 
            } 
          }}
        >
          <Box sx={{ px: 2, py: 1.2, borderBottom: '1px solid #f0f0f0' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.85rem' }}>
                {user?.nom} {user?.prenom}
              </Typography>
              <Chip
                icon={getRoleIcon(user?.role)}
                label={getRoleLabel(user?.role)}
                size="small"
                sx={{ 
                  height: 18, 
                  fontSize: '0.55rem',
                  bgcolor: getRoleBg(user?.role), 
                  color: getRoleColor(user?.role),
                  '& .MuiChip-icon': { 
                    color: getRoleColor(user?.role),
                    fontSize: 12
                  }
                }}
              />
            </Box>
            <Typography variant="caption" sx={{ color: '#9e9e9e', fontSize: '0.7rem', display: 'block', mt: 0.3 }}>
              {user?.email}
            </Typography>
          </Box>
          
          <MenuItem onClick={() => handleNavigate('/')} sx={{ py: 1, px: 2 }}>
            <HomeIcon sx={{ mr: 1.5, fontSize: 18, color: '#2e7d32' }} />
            <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>Accueil</Typography>
          </MenuItem>
          
          <MenuItem onClick={() => handleNavigate('/parametres/profil')} sx={{ py: 1, px: 2 }}>
            <PersonIcon sx={{ mr: 1.5, fontSize: 18, color: '#2e7d32' }} />
            <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>Mon profil</Typography>
          </MenuItem>
          
          {/* ✅ Afficher les paramètres seulement pour Admin et Gestionnaire */}
          {(user?.role === UserRole.ADMIN || user?.role === UserRole.GESTIONNAIRE) && (
            <MenuItem onClick={() => handleNavigate('/parametres')} sx={{ py: 1, px: 2 }}>
              <SettingsIcon sx={{ mr: 1.5, fontSize: 18, color: '#2e7d32' }} />
              <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>Paramètres</Typography>
            </MenuItem>
          )}

          <MenuItem onClick={logout} sx={{ py: 1, px: 2, color: '#f44336' }}>
            <LogoutIcon sx={{ mr: 1.5, fontSize: 18 }} />
            <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>Déconnexion</Typography>
          </MenuItem>
        </Menu>

        {/* Notifications Menu */}
        <Menu
          anchorEl={notifAnchorEl}
          open={Boolean(notifAnchorEl)}
          onClose={() => setNotifAnchorEl(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          slotProps={{ 
            paper: { 
              sx: { 
                mt: 1, 
                width: { xs: 320, sm: 360 }, 
                maxHeight: 450, 
                borderRadius: 2,
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              } 
            } 
          }}
        >
          <Box sx={{ p: 1.2, borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: '0.8rem' }}>
              Notifications
            </Typography>
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              <Tooltip title="Actualiser">
                <IconButton size="small" onClick={refreshNotifications} sx={{ p: 0.5 }}>
                  <RefreshIcon sx={{ fontSize: 16, color: '#757575' }} />
                </IconButton>
              </Tooltip>
              {unreadCount > 0 && (
                <Button 
                  size="small" 
                  startIcon={<DoneAllIcon sx={{ fontSize: 14 }} />} 
                  onClick={markAllAsRead} 
                  sx={{ fontSize: '0.65rem', color: '#2e7d32', textTransform: 'none', minWidth: 'auto', p: 0.5 }}
                >
                  Tout lire
                </Button>
              )}
            </Box>
          </Box>

          {notifLoading ? (
            <Box sx={{ p: 1.5 }}>
              <Skeleton width="100%" height={30} />
              <Skeleton width="80%" height={30} sx={{ mt: 1 }} />
              <Skeleton width="90%" height={30} sx={{ mt: 1 }} />
            </Box>
          ) : notifications.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 3 }}>
              <NotificationsIcon sx={{ fontSize: 32, color: '#e0e0e0' }} />
              <Typography variant="caption" sx={{ color: '#9e9e9e', display: 'block', mt: 0.5 }}>
                Aucune notification
              </Typography>
            </Box>
          ) : (
            <>
              {notifications.slice(0, 5).map((notif) => (
                <MenuItem 
                  key={notif.id} 
                  onClick={() => handleNotificationClick(notif)} 
                  sx={{ 
                    py: 1, 
                    px: 1.5, 
                    flexDirection: 'column', 
                    alignItems: 'flex-start', 
                    bgcolor: notif.read ? 'transparent' : alpha('#2e7d32', 0.04),
                    borderBottom: '1px solid #f0f0f0',
                    '&:hover': { bgcolor: alpha('#2e7d32', 0.08) },
                    '&:last-child': { borderBottom: 'none' }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, width: '100%' }}>
                    {!notif.read && <CircleIcon sx={{ fontSize: 8, color: '#2e7d32', mt: 0.6 }} />}
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" sx={{ 
                        fontWeight: notif.read ? 400 : 600, 
                        fontSize: '0.75rem',
                        lineHeight: 1.3
                      }}>
                        {notif.message}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#9e9e9e', fontSize: '0.6rem', display: 'block', mt: 0.3 }}>
                        {formatTime(notif.created_at)}
                      </Typography>
                    </Box>
                    {notif.read && <CheckCircleIcon sx={{ fontSize: 12, color: '#4caf50' }} />}
                  </Box>
                </MenuItem>
              ))}
              {notifications.length > 5 && (
                <Box sx={{ p: 1, borderTop: '1px solid #f0f0f0', textAlign: 'center' }}>
                  <Button 
                    size="small" 
                    sx={{ fontSize: '0.65rem', color: '#2e7d32', textTransform: 'none' }}
                  >
                    Voir toutes ({notifications.length})
                  </Button>
                </Box>
              )}
            </>
          )}
        </Menu>
      </Toolbar>
    </AppBar>
  );
}