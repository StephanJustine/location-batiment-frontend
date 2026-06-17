// components/layout/Sidebar.tsx
'use client';

import { useState, useEffect } from 'react';
import {
  Drawer, List, ListItemButton, ListItemIcon, ListItemText,
  Box, Typography, Collapse, Avatar, IconButton,
  useMediaQuery, useTheme, Tooltip, alpha,
} from '@mui/material';
import {
  Dashboard as DashboardIcon, Apartment as ApartmentIcon,
  Home as HomeIcon, People as PeopleIcon, Payment as PaymentIcon,
  Assessment as AssessmentIcon, Settings as SettingsIcon,
  Logout as LogoutIcon, ExpandLess, ExpandMore,
  Receipt as ReceiptIcon, Warning as WarningIcon,
  ChevronLeft as ChevronLeftIcon, Description as DescriptionIcon,
  WaterDrop, AttachMoney, Calculate, History,
  Notifications as NotificationsIcon,
} from '@mui/icons-material';
import BuildIcon from '@mui/icons-material/Build';
import GroupsIcon from '@mui/icons-material/Groups';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

const drawerWidth = 260;
const collapsedWidth = 72;

interface SidebarProps {
  mobileOpen?: boolean;
  onClose?: () => void;
}

const menuItems = [
  { text: 'Accueil', icon: <DashboardIcon />, path: '/' },
  { 
    text: 'Biens', icon: <ApartmentIcon />,
    children: [
      { text: 'Bâtiments', icon: <ApartmentIcon />, path: '/batiments' },
      { text: 'Logements', icon: <HomeIcon />, path: '/logements' },
    ]
  },
  { 
    text: 'Travaux', icon: <BuildIcon />,
    children: [{ text: 'Tous les travaux', icon: <BuildIcon />, path: '/travaux' }]
  },
  { 
    text: 'Employés', icon: <GroupsIcon />,
    children: [
      { text: 'Tous les employés', icon: <GroupsIcon />, path: '/employes' },
      // { text: 'Nouvel employé', icon: <PersonAddIcon />, path: '/employes/nouveau' },
      // { text: 'Statistiques', icon: <AssessmentIcon />, path: '/employes/stats' },
    ]
  },
  { 
    text: 'Locataires', icon: <PeopleIcon />,
    children: [
      { text: 'Locataires', icon: <PeopleIcon />, path: '/locataires' },
      { text: 'Baux', icon: <ReceiptIcon />, path: '/baux' },
      { text: 'Contrats', icon: <DescriptionIcon />, path: '/contrats' },
    ]
  },
  { 
    text: 'Relevés', icon: <WaterDrop />,
    children: [
      { text: 'Liste', icon: <History />, path: '/releves' },
      { text: 'Tarifs', icon: <AttachMoney />, path: '/tarifs' },
      // { text: 'Décompte', icon: <AssessmentIcon />, path: '/decompte-annuel' },
      // { text: 'Charges', icon: <Calculate />, path: '/charges-communes' },
    ]
  },
  { 
    text: 'Finances', icon: <PaymentIcon />,
    children: [
      { text: 'Paiements', icon: <PaymentIcon />, path: '/paiements' },
      // { text: 'Impayés', icon: <WarningIcon />, path: '/impayes' },
      { text: 'Rapports', icon: <AssessmentIcon />, path: '/rapports' },
    ]
  },
  { 
    text: 'Config', icon: <SettingsIcon />,
    children: [
      { text: 'Profil', icon: <SettingsIcon />, path: '/profil' },
      { text: 'Notifications', icon: <NotificationsIcon />, path: '/notifications' },
    ]
  },
];

export default function Sidebar({ mobileOpen, onClose }: SidebarProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [collapsed, setCollapsed] = useState(false);
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const isActive = (path?: string) => path ? pathname === path || pathname.startsWith(path + '/') : false;
  const isParentActive = (children: any[]) => children.some(child => isActive(child.path));

  useEffect(() => {
    const newOpen: Record<string, boolean> = {};
    menuItems.forEach(item => {
      if (item.children && isParentActive(item.children)) {
        newOpen[item.text] = true;
      }
    });
    setOpenMenus(prev => ({ ...prev, ...newOpen }));
  }, [pathname]);

  const handleMenuClick = (text: string) => {
    setOpenMenus(prev => ({ ...prev, [text]: !prev[text] }));
  };

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const renderMenuItem = (item: any) => {
    if (item.children) {
      const isOpen = openMenus[item.text] || isParentActive(item.children);
      return (
        <Box key={item.text}>
          <ListItemButton
            onClick={() => handleMenuClick(item.text)}
            sx={{
              borderRadius: 1.5,
              mb: 0.5,
              justifyContent: collapsed ? 'center' : 'flex-start',
              px: collapsed ? 1 : 2,
              py: 1,
              bgcolor: isOpen ? alpha('#2e7d32', 0.08) : 'transparent',
              '&:hover': { bgcolor: alpha('#2e7d32', 0.05) },
            }}
          >
            <ListItemIcon sx={{ color: isOpen ? '#2e7d32' : '#64748b', minWidth: collapsed ? 'auto' : 36, mr: collapsed ? 0 : 1 }}>
              {item.icon}
            </ListItemIcon>
            {!collapsed && (
              <>
                <ListItemText 
                  primary={item.text} 
                  sx={{ '& .MuiListItemText-primary': { fontSize: '0.82rem', fontWeight: isOpen ? 600 : 400, color: isOpen ? '#0f172a' : '#475569' } }} 
                />
                {isOpen ? <ExpandLess sx={{ fontSize: 18, color: '#94a3b8' }} /> : <ExpandMore sx={{ fontSize: 18, color: '#94a3b8' }} />}
              </>
            )}
          </ListItemButton>
          {!collapsed && (
            <Collapse in={isOpen} timeout="auto">
              <List disablePadding>
                {item.children.map((child: any) => (
                  <ListItemButton
                    key={child.text}
                    component={Link}
                    href={child.path}
                    sx={{
                      pl: 5.5,
                      borderRadius: 1.5,
                      ml: 1,
                      mb: 0.5,
                      bgcolor: isActive(child.path) ? alpha('#2e7d32', 0.1) : 'transparent',
                      '&:hover': { bgcolor: alpha('#2e7d32', 0.05) },
                    }}
                  >
                    <ListItemIcon sx={{ color: isActive(child.path) ? '#2e7d32' : '#94a3b8', minWidth: 32 }}>
                      {child.icon}
                    </ListItemIcon>
                    <ListItemText 
                      primary={child.text}
                      sx={{ 
                        '& .MuiListItemText-primary': { 
                          fontSize: '0.78rem',
                          fontWeight: isActive(child.path) ? 500 : 400,
                          color: isActive(child.path) ? '#0f172a' : '#64748b'
                        }
                      }}
                    />
                    {isActive(child.path) && (
                      <Box sx={{ width: 3, height: 20, bgcolor: '#2e7d32', borderRadius: 2 }} />
                    )}
                  </ListItemButton>
                ))}
              </List>
            </Collapse>
          )}
        </Box>
      );
    }

    return (
      <Tooltip key={item.text} title={collapsed ? item.text : ''} placement="right">
        <ListItemButton
          component={Link}
          href={item.path}
          sx={{
            borderRadius: 1.5,
            mb: 0.5,
            justifyContent: collapsed ? 'center' : 'flex-start',
            px: collapsed ? 1 : 2,
            py: 1,
            bgcolor: isActive(item.path) ? alpha('#2e7d32', 0.1) : 'transparent',
            '&:hover': { bgcolor: alpha('#2e7d32', 0.05) },
          }}
        >
          <ListItemIcon sx={{ color: isActive(item.path) ? '#2e7d32' : '#64748b', minWidth: collapsed ? 'auto' : 36, mr: collapsed ? 0 : 1 }}>
            {item.icon}
          </ListItemIcon>
          {!collapsed && (
            <>
              <ListItemText 
                primary={item.text} 
                sx={{ 
                  '& .MuiListItemText-primary': { 
                    fontSize: '0.82rem',
                    fontWeight: isActive(item.path) ? 600 : 400,
                    color: isActive(item.path) ? '#0f172a' : '#475569'
                  }
                }} 
              />
              {isActive(item.path) && (
                <Box sx={{ width: 3, height: 20, bgcolor: '#2e7d32', borderRadius: 2 }} />
              )}
            </>
          )}
        </ListItemButton>
      </Tooltip>
    );
  };

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#fff' }}>
      {/* Header */}
      <Box sx={{ 
        p: collapsed ? 1.5 : 2, 
        borderBottom: '1px solid #f1f5f9',
        display: 'flex',
        alignItems: 'center',
        justifyContent: collapsed ? 'center' : 'space-between'
      }}>
        {!collapsed ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
            <Box sx={{ 
              width: 40, height: 40, borderRadius: '12px',
              background: 'linear-gradient(135deg, #2e7d32, #4caf50)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(46,125,50,0.2)'
            }}>
              <ApartmentIcon sx={{ fontSize: 20, color: '#fff' }} />
            </Box>
            <Box>
              <Typography sx={{ fontWeight: 800, fontSize: '0.85rem', color: '#0f172a' }}>
                Gestion Locative
              </Typography>
              <Typography sx={{ fontSize: '0.55rem', color: '#94a3b8', fontWeight: 500 }}>
                Madagascar
              </Typography>
            </Box>
          </Box>
        ) : (
          <Tooltip title="Gestion Locative" placement="right">
            <Box sx={{ 
              width: 40, height: 40, borderRadius: '12px',
              background: 'linear-gradient(135deg, #2e7d32, #4caf50)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <ApartmentIcon sx={{ fontSize: 20, color: '#fff' }} />
            </Box>
          </Tooltip>
        )}
        {!isMobile && (
          <IconButton 
            size="small" 
            onClick={() => setCollapsed(!collapsed)}
            sx={{ bgcolor: '#f1f5f9', '&:hover': { bgcolor: '#e2e8f0' }, width: 28, height: 28 }}
          >
            <ChevronLeftIcon sx={{ fontSize: 16, transform: collapsed ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
          </IconButton>
        )}
      </Box>

      {/* Profil */}
      {!collapsed ? (
        <Box sx={{ p: 1.5, mx: 1.5, my: 1.5, borderRadius: 2, bgcolor: '#f8fafc' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Avatar sx={{ bgcolor: '#2e7d32', width: 40, height: 40 }}>
              {user?.nom ? user.nom.charAt(0).toUpperCase() : <PeopleIcon sx={{ fontSize: 20 }} />}
            </Avatar>
            <Box>
              <Typography sx={{ fontWeight: 600, fontSize: '0.8rem', color: '#0f172a' }}>
                {user?.nom || 'Utilisateur'}
              </Typography>
              <Typography sx={{ 
                color: '#2e7d32', fontSize: '0.6rem', fontWeight: 500,
                bgcolor: '#e8f5e9', display: 'inline-block', px: 0.8, py: 0.2, borderRadius: 1
              }}>
                {user?.role === 'admin' ? 'Admin' : user?.role === 'gestionnaire' ? 'Gestionnaire' : 'User'}
              </Typography>
            </Box>
          </Box>
        </Box>
      ) : (
        <Box sx={{ py: 1.5, display: 'flex', justifyContent: 'center' }}>
          <Tooltip title={user?.nom || 'Utilisateur'} placement="right">
            <Avatar sx={{ bgcolor: '#2e7d32', width: 38, height: 38 }}>
              {user?.nom ? user.nom.charAt(0).toUpperCase() : <PeopleIcon />}
            </Avatar>
          </Tooltip>
        </Box>
      )}

      {/* Menu */}
      <Box sx={{ flex: 1, overflow: 'auto', py: 1 }}>
        <List sx={{ px: collapsed ? 1 : 1.5 }}>
          {menuItems.map(item => renderMenuItem(item))}
        </List>
      </Box>

      {/* Déconnexion */}
      <Box sx={{ borderTop: '1px solid #f1f5f9', p: collapsed ? 1 : 1.5 }}>
        <Tooltip title={collapsed ? 'Déconnexion' : ''} placement="right">
          <ListItemButton 
            onClick={handleLogout} 
            sx={{ 
              borderRadius: 1.5,
              justifyContent: collapsed ? 'center' : 'flex-start',
              px: collapsed ? 1 : 2,
              py: 1,
              '&:hover': { bgcolor: alpha('#f44336', 0.08) }
            }}
          >
            <ListItemIcon sx={{ color: '#f44336', minWidth: collapsed ? 'auto' : 36, mr: collapsed ? 0 : 1 }}>
              <LogoutIcon />
            </ListItemIcon>
            {!collapsed && (
              <ListItemText 
                primary="Déconnexion" 
                sx={{ '& .MuiListItemText-primary': { fontSize: '0.8rem', color: '#f44336', fontWeight: 500 } }} 
              />
            )}
          </ListItemButton>
        </Tooltip>
      </Box>
    </Box>
  );

  return (
    <>
      <Drawer
        variant="permanent"
        sx={{
          width: collapsed ? collapsedWidth : drawerWidth,
          flexShrink: 0,
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': {
            width: collapsed ? collapsedWidth : drawerWidth,
            boxSizing: 'border-box',
            borderRight: '1px solid #f1f5f9',
            transition: 'width 0.2s ease',
            overflowX: 'hidden',
          },
        }}
      >
        {drawerContent}
      </Drawer>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onClose}
        sx={{ 
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { width: drawerWidth, borderRight: '1px solid #f1f5f9' }
        }}
      >
        {drawerContent}
      </Drawer>
    </>
  );
}