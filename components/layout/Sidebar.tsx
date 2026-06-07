// 'use client';
// import { useState } from 'react';
// import {
//   Drawer,
//   List,
//   ListItem,
//   ListItemButton,
//   ListItemIcon,
//   ListItemText,
//   Toolbar,
//   Box,
//   Typography,
//   Divider,
//   Collapse,
//   Avatar,
//   Badge,
//   alpha,
// } from '@mui/material';
// import {
//   Dashboard as DashboardIcon,
//   Apartment as ApartmentIcon,
//   Home as HomeIcon,
//   People as PeopleIcon,
//   Payment as PaymentIcon,
//   Assessment as AssessmentIcon,
//   Notifications as NotificationsIcon,
//   Settings as SettingsIcon,
//   Logout as LogoutIcon,
//   ExpandLess,
//   ExpandMore,
//   Receipt as ReceiptIcon,
//   Warning as WarningIcon,
//   Security as SecurityIcon,
// } from '@mui/icons-material';
// import Link from 'next/link';
// import { usePathname, useRouter } from 'next/navigation';
// import { useAuth } from '@/contexts/AuthContext';

// const drawerWidth = 280;

// const menuItems = [
//   { text: 'Tableau de bord', icon: <DashboardIcon />, path: '/', iconBg: '#e8f5e9' },
//   { 
//     text: 'Gestion des biens', icon: <ApartmentIcon />, iconBg: '#e3f2fd',
//     children: [
//       { text: 'Bâtiments', icon: <ApartmentIcon />, path: '/batiments' },
//       { text: 'Logements', icon: <HomeIcon />, path: '/logements' },
//     ]
//   },
//   { 
//     text: 'Gestion locative', icon: <PeopleIcon />, iconBg: '#fce4ec',
//     children: [
//       { text: 'Locataires', icon: <PeopleIcon />, path: '/locataires' },
//       { text: 'Baux', icon: <ReceiptIcon />, path: '/baux' },
//     ]
//   },
//   { 
//     text: 'Finances', icon: <PaymentIcon />, iconBg: '#fff3e0',
//     children: [
//       { text: 'Paiements', icon: <PaymentIcon />, path: '/paiements' },
//       { text: 'Impayés', icon: <WarningIcon />, path: '/impayes' },
//       { text: 'Rapports', icon: <AssessmentIcon />, path: '/rapports' },
//     ]
//   },
//   { 
//     text: 'Paramètres', icon: <SettingsIcon />, iconBg: '#f3e5f5',
//     children: [
//       { text: 'Profil', icon: <SecurityIcon />, path: '/profil' },
//       { text: 'Notifications', icon: <NotificationsIcon />, path: '/notifications' },
//     ]
//   },
// ];

// export default function Sidebar() {
//   const pathname = usePathname();
//   const router = useRouter();
//   const { user, logout } = useAuth();
//   const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({});

//   const handleMenuClick = (text: string) => {
//     setOpenMenus((prev) => ({ ...prev, [text]: !prev[text] }));
//   };

//   const handleLogout = async () => {
//     await logout();
//     router.push('/login');
//   };

//   const isActive = (path?: string) => pathname === path;
//   const isParentActive = (children: any[]) => children.some(child => pathname === child.path);

//   return (
//     <Drawer
//       variant="permanent"
//       sx={{
//         width: drawerWidth,
//         flexShrink: 0,
//         [`& .MuiDrawer-paper`]: {
//           width: drawerWidth,
//           boxSizing: 'border-box',
//           backgroundColor: '#1a1a1a',
//           borderRight: 'none',
//           boxShadow: '4px 0 20px rgba(0,0,0,0.08)',
//         },
//       }}
//     >
//       <Toolbar sx={{ backgroundColor: '#2e7d32', py: 2, minHeight: '80px !important' }}>
//         <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
//           <Avatar sx={{ bgcolor: '#ffffff', width: 45, height: 45 }}>
//             <ApartmentIcon sx={{ color: '#2e7d32', fontSize: 28 }} />
//           </Avatar>
//           <Box>
//             <Typography variant="h6" sx={{ color: '#ffffff', fontWeight: 700, fontSize: '1.1rem' }}>
//               Gestion Locative
//             </Typography>
//             <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>
//               Madagascar
//             </Typography>
//           </Box>
//         </Box>
//       </Toolbar>

//       <Box sx={{ p: 3, backgroundColor: '#252525', mx: 2, my: 2, borderRadius: 3 }}>
//         <Badge
//           overlap="circular"
//           anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
//           variant="dot"
//           sx={{ '& .MuiBadge-badge': { backgroundColor: '#4caf50' } }}
//         >
//           <Avatar sx={{ bgcolor: '#2e7d32', width: 50, height: 50 }}>
//             <PeopleIcon />
//           </Avatar>
//         </Badge>
//         <Box sx={{ mt: 1 }}>
//           <Typography variant="body2" sx={{ color: '#ffffff', fontWeight: 600 }}>
//             {user?.nom} {user?.prenom}
//           </Typography>
//           <Typography variant="caption" sx={{ color: '#a5d6a7', fontSize: '0.7rem' }}>
//             {user?.role === 'admin' ? 'Administrateur' : 'Gestionnaire'}
//           </Typography>
//         </Box>
//       </Box>

//       <Box sx={{ overflow: 'auto', px: 2 }}>
//         <List>
//           {menuItems.map((item) => (
//             <Box key={item.text}>
//               {item.children ? (
//                 <>
//                   <ListItem disablePadding sx={{ mb: 0.5 }}>
//                     <ListItemButton
//                       onClick={() => handleMenuClick(item.text)}
//                       sx={{
//                         borderRadius: 2,
//                         backgroundColor: openMenus[item.text] || isParentActive(item.children) 
//                           ? alpha('#2e7d32', 0.1) : 'transparent',
//                         '&:hover': { backgroundColor: alpha('#2e7d32', 0.15) },
//                       }}
//                     >
//                       <ListItemIcon sx={{ 
//                         color: openMenus[item.text] || isParentActive(item.children) ? '#2e7d32' : '#a0a0a0',
//                         minWidth: 40
//                       }}>
//                         {item.icon}
//                       </ListItemIcon>
//                       <ListItemText 
//                         primary={item.text}
//                         sx={{
//                           '& .MuiListItemText-primary': {
//                             color: '#ffffff',
//                             fontWeight: openMenus[item.text] || isParentActive(item.children) ? 600 : 400,
//                             fontSize: '0.9rem'
//                           }
//                         }}
//                       />
//                       {openMenus[item.text] ? <ExpandLess sx={{ color: '#a0a0a0' }} /> : <ExpandMore sx={{ color: '#a0a0a0' }} />}
//                     </ListItemButton>
//                   </ListItem>
//                   <Collapse in={openMenus[item.text]} timeout="auto">
//                     <List component="div" disablePadding>
//                       {item.children.map((child) => (
//                         <ListItemButton
//                           key={child.text}
//                           component={Link}
//                           href={child.path || '#'}
//                           sx={{
//                             pl: 6,
//                             borderRadius: 2,
//                             ml: 2,
//                             mb: 0.5,
//                             backgroundColor: isActive(child.path) ? alpha('#2e7d32', 0.15) : 'transparent',
//                             '&:hover': { backgroundColor: alpha('#2e7d32', 0.1) },
//                           }}
//                         >
//                           <ListItemIcon sx={{ 
//                             color: isActive(child.path) ? '#2e7d32' : '#a0a0a0',
//                             minWidth: 35
//                           }}>
//                             {child.icon}
//                           </ListItemIcon>
//                           <ListItemText 
//                             primary={child.text}
//                             sx={{
//                               '& .MuiListItemText-primary': {
//                                 color: isActive(child.path) ? '#ffffff' : '#c0c0c0',
//                                 fontWeight: isActive(child.path) ? 600 : 400,
//                                 fontSize: '0.85rem'
//                               }
//                             }}
//                           />
//                         </ListItemButton>
//                       ))}
//                     </List>
//                   </Collapse>
//                 </>
//               ) : (
//                 <ListItem disablePadding sx={{ mb: 0.5 }}>
//                   <ListItemButton
//                     component={Link}
//                     href={item.path || '#'}
//                     sx={{
//                       borderRadius: 2,
//                       backgroundColor: isActive(item.path) ? alpha('#2e7d32', 0.15) : 'transparent',
//                       '&:hover': { backgroundColor: alpha('#2e7d32', 0.1) },
//                     }}
//                   >
//                     <ListItemIcon sx={{ color: isActive(item.path) ? '#2e7d32' : '#a0a0a0', minWidth: 40 }}>
//                       {item.icon}
//                     </ListItemIcon>
//                     <ListItemText 
//                       primary={item.text}
//                       sx={{
//                         '& .MuiListItemText-primary': {
//                           color: '#ffffff',
//                           fontWeight: isActive(item.path) ? 600 : 400,
//                           fontSize: '0.9rem'
//                         }
//                       }}
//                     />
//                   </ListItemButton>
//                 </ListItem>
//               )}
//             </Box>
//           ))}
//         </List>

//         <Divider sx={{ my: 2, backgroundColor: '#333' }} />

//         <List>
//           <ListItem disablePadding>
//             <ListItemButton onClick={handleLogout} sx={{ borderRadius: 2 }}>
//               <ListItemIcon sx={{ color: '#f44336', minWidth: 40 }}>
//                 <LogoutIcon />
//               </ListItemIcon>
//               <ListItemText 
//                 primary="Déconnexion"
//                 sx={{ '& .MuiListItemText-primary': { color: '#f44336', fontWeight: 500, fontSize: '0.9rem' } }}
//               />
//             </ListItemButton>
//           </ListItem>
//         </List>
//       </Box>
//     </Drawer>
//   );
// }


// 'use client';
// import { useState } from 'react';
// import {
//   Drawer,
//   List,
//   ListItem,
//   ListItemButton,
//   ListItemIcon,
//   ListItemText,
//   Toolbar,
//   Box,
//   Typography,
//   Divider,
//   Collapse,
//   Avatar,
//   Badge,
//   alpha,
// } from '@mui/material';
// import {
//   Dashboard as DashboardIcon,
//   Apartment as ApartmentIcon,
//   Home as HomeIcon,
//   People as PeopleIcon,
//   Payment as PaymentIcon,
//   Assessment as AssessmentIcon,
//   Notifications as NotificationsIcon,
//   Settings as SettingsIcon,
//   Logout as LogoutIcon,
//   ExpandLess,
//   ExpandMore,
//   Receipt as ReceiptIcon,
//   Warning as WarningIcon,
//   Security as SecurityIcon,
// } from '@mui/icons-material';
// import Link from 'next/link';
// import { usePathname, useRouter } from 'next/navigation';
// import { useAuth } from '@/contexts/AuthContext';

// const drawerWidth = 280;

// const menuItems = [
//   { text: 'Tableau de bord', icon: <DashboardIcon />, path: '/' },
//   { 
//     text: 'Gestion des biens', icon: <ApartmentIcon />,
//     children: [
//       { text: 'Bâtiments', icon: <ApartmentIcon />, path: '/batiments' },
//       { text: 'Logements', icon: <HomeIcon />, path: '/logements' },
//     ]
//   },
//   { 
//     text: 'Gestion locative', icon: <PeopleIcon />,
//     children: [
//       { text: 'Locataires', icon: <PeopleIcon />, path: '/locataires' },
//       { text: 'Baux', icon: <ReceiptIcon />, path: '/baux' },
//     ]
//   },
//   { 
//     text: 'Finances', icon: <PaymentIcon />,
//     children: [
//       { text: 'Paiements', icon: <PaymentIcon />, path: '/paiements' },
//       { text: 'Impayés', icon: <WarningIcon />, path: '/impayes' },
//       { text: 'Rapports', icon: <AssessmentIcon />, path: '/rapports' },
//     ]
//   },
//   { 
//     text: 'Paramètres', icon: <SettingsIcon />,
//     children: [
//       { text: 'Profil', icon: <SecurityIcon />, path: '/profil' },
//       { text: 'Notifications', icon: <NotificationsIcon />, path: '/notifications' },
//     ]
//   },
// ];

// export default function Sidebar() {
//   const pathname = usePathname();
//   const router = useRouter();
//   const { user, logout } = useAuth();
//   const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({});

//   const handleMenuClick = (text: string) => {
//     setOpenMenus((prev) => ({ ...prev, [text]: !prev[text] }));
//   };

//   const handleLogout = async () => {
//     await logout();
//     router.push('/login');
//   };

//   const isActive = (path?: string) => pathname === path;
//   const isParentActive = (children: any[]) => children.some(child => pathname === child.path);

//   return (
//     <Drawer
//       variant="permanent"
//       sx={{
//         width: drawerWidth,
//         flexShrink: 0,
//         [`& .MuiDrawer-paper`]: {
//           width: drawerWidth,
//           boxSizing: 'border-box',
//           backgroundColor: '#ffffff',
//           borderRight: '1px solid #e8e8e8',
//           boxShadow: 'none',
//         },
//       }}
//     >
//       {/* Header Sidebar */}
//       <Toolbar sx={{ 
//         backgroundColor: '#ffffff', 
//         py: 2, 
//         minHeight: '80px !important',
//         borderBottom: '1px solid #e8e8e8'
//       }}>
//         <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
//           <Avatar sx={{ bgcolor: '#e8f5e9', width: 45, height: 45 }}>
//             <ApartmentIcon sx={{ color: '#2e7d32', fontSize: 28 }} />
//           </Avatar>
//           <Box>
//             <Typography variant="h6" sx={{ color: '#1a1a1a', fontWeight: 700, fontSize: '1rem' }}>
//               Gestion Locative
//             </Typography>
//             <Typography variant="caption" sx={{ color: '#9e9e9e', fontSize: '0.7rem' }}>
//               Madagascar
//             </Typography>
//           </Box>
//         </Box>
//       </Toolbar>

//       {/* Profil utilisateur */}
//       <Box sx={{ 
//         p: 2, 
//         backgroundColor: '#f8f9fa', 
//         mx: 1.5, 
//         my: 2, 
//         borderRadius: 2,
//         display: 'flex',
//         alignItems: 'center',
//         gap: 1.5
//       }}>
//         <Badge
//           overlap="circular"
//           anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
//           variant="dot"
//           sx={{ '& .MuiBadge-badge': { backgroundColor: '#4caf50' } }}
//         >
//           <Avatar sx={{ bgcolor: '#e8f5e9', width: 45, height: 45 }}>
//             <PeopleIcon sx={{ color: '#2e7d32' }} />
//           </Avatar>
//         </Badge>
//         <Box>
//           <Typography variant="body2" sx={{ color: '#1a1a1a', fontWeight: 600 }}>
//             {user?.nom} {user?.prenom}
//           </Typography>
//           <Typography variant="caption" sx={{ color: '#2e7d32', fontSize: '0.7rem', fontWeight: 500 }}>
//             {user?.role === 'admin' ? 'Administrateur' : 'Gestionnaire'}
//           </Typography>
//         </Box>
//       </Box>

//       {/* Menu de navigation */}
//       <Box sx={{ overflow: 'auto', px: 1.5 }}>
//         <List>
//           {menuItems.map((item) => (
//             <Box key={item.text}>
//               {item.children ? (
//                 <>
//                   <ListItem disablePadding sx={{ mb: 0.5 }}>
//                     <ListItemButton
//                       onClick={() => handleMenuClick(item.text)}
//                       sx={{
//                         borderRadius: 1.5,
//                         backgroundColor: openMenus[item.text] || isParentActive(item.children) 
//                           ? alpha('#2e7d32', 0.08) : 'transparent',
//                         '&:hover': { backgroundColor: alpha('#2e7d32', 0.05) },
//                       }}
//                     >
//                       <ListItemIcon sx={{ 
//                         color: openMenus[item.text] || isParentActive(item.children) ? '#2e7d32' : '#757575',
//                         minWidth: 40
//                       }}>
//                         {item.icon}
//                       </ListItemIcon>
//                       <ListItemText 
//                         primary={item.text}
//                         sx={{
//                           '& .MuiListItemText-primary': {
//                             color: '#1a1a1a',
//                             fontWeight: openMenus[item.text] || isParentActive(item.children) ? 600 : 400,
//                             fontSize: '0.85rem'
//                           }
//                         }}
//                       />
//                       {openMenus[item.text] ? 
//                         <ExpandLess sx={{ color: '#757575', fontSize: 18 }} /> : 
//                         <ExpandMore sx={{ color: '#757575', fontSize: 18 }} />
//                       }
//                     </ListItemButton>
//                   </ListItem>
//                   <Collapse in={openMenus[item.text]} timeout="auto">
//                     <List component="div" disablePadding>
//                       {item.children.map((child) => (
//                         <ListItemButton
//                           key={child.text}
//                           component={Link}
//                           href={child.path || '#'}
//                           sx={{
//                             pl: 5.5,
//                             borderRadius: 1.5,
//                             ml: 1.5,
//                             mb: 0.5,
//                             backgroundColor: isActive(child.path) ? alpha('#2e7d32', 0.08) : 'transparent',
//                             '&:hover': { backgroundColor: alpha('#2e7d32', 0.05) },
//                           }}
//                         >
//                           <ListItemIcon sx={{ 
//                             color: isActive(child.path) ? '#2e7d32' : '#9e9e9e',
//                             minWidth: 35
//                           }}>
//                             {child.icon}
//                           </ListItemIcon>
//                           <ListItemText 
//                             primary={child.text}
//                             sx={{
//                               '& .MuiListItemText-primary': {
//                                 color: isActive(child.path) ? '#1a1a1a' : '#757575',
//                                 fontWeight: isActive(child.path) ? 600 : 400,
//                                 fontSize: '0.8rem'
//                               }
//                             }}
//                           />
//                         </ListItemButton>
//                       ))}
//                     </List>
//                   </Collapse>
//                 </>
//               ) : (
//                 <ListItem disablePadding sx={{ mb: 0.5 }}>
//                   <ListItemButton
//                     component={Link}
//                     href={item.path || '#'}
//                     sx={{
//                       borderRadius: 1.5,
//                       backgroundColor: isActive(item.path) ? alpha('#2e7d32', 0.08) : 'transparent',
//                       '&:hover': { backgroundColor: alpha('#2e7d32', 0.05) },
//                     }}
//                   >
//                     <ListItemIcon sx={{ 
//                       color: isActive(item.path) ? '#2e7d32' : '#757575', 
//                       minWidth: 40 
//                     }}>
//                       {item.icon}
//                     </ListItemIcon>
//                     <ListItemText 
//                       primary={item.text}
//                       sx={{
//                         '& .MuiListItemText-primary': {
//                           color: '#1a1a1a',
//                           fontWeight: isActive(item.path) ? 600 : 400,
//                           fontSize: '0.85rem'
//                         }
//                       }}
//                     />
//                   </ListItemButton>
//                 </ListItem>
//               )}
//             </Box>
//           ))}
//         </List>

//         <Divider sx={{ my: 2, backgroundColor: '#e8e8e8' }} />

//         {/* Déconnexion */}
//         <List>
//           <ListItem disablePadding>
//             <ListItemButton onClick={handleLogout} sx={{ borderRadius: 1.5 }}>
//               <ListItemIcon sx={{ color: '#f44336', minWidth: 40 }}>
//                 <LogoutIcon />
//               </ListItemIcon>
//               <ListItemText 
//                 primary="Déconnexion"
//                 sx={{ '& .MuiListItemText-primary': { color: '#f44336', fontWeight: 500, fontSize: '0.85rem' } }}
//               />
//             </ListItemButton>
//           </ListItem>
//         </List>
//       </Box>
//     </Drawer>
//   );
// }

'use client';
import { useState } from 'react';
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  Divider,
  Collapse,
  Avatar,
  IconButton,
  useMediaQuery,
  useTheme,
  Tooltip,
  alpha,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Apartment as ApartmentIcon,
  Home as HomeIcon,
  People as PeopleIcon,
  Payment as PaymentIcon,
  Assessment as AssessmentIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  ExpandLess,
  ExpandMore,
  Receipt as ReceiptIcon,
  Warning as WarningIcon,
  ChevronLeft as ChevronLeftIcon,
  Menu as MenuIcon,
} from '@mui/icons-material';
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
    text: 'Locataires', icon: <PeopleIcon />,
    children: [
      { text: 'Locataires', icon: <PeopleIcon />, path: '/locataires' },
      { text: 'Baux', icon: <ReceiptIcon />, path: '/baux' },
    ]
  },
  { 
    text: 'Finances', icon: <PaymentIcon />,
    children: [
      { text: 'Paiements', icon: <PaymentIcon />, path: '/paiements' },
      { text: 'Impayés', icon: <WarningIcon />, path: '/impayes' },
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
  const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({});
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleMenuClick = (text: string) => {
    if (!collapsed) {
      setOpenMenus((prev) => ({ ...prev, [text]: !prev[text] }));
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const isActive = (path?: string) => pathname === path;
  const isParentActive = (children: any[]) => children.some(child => pathname === child.path);

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#fff' }}>
      {/* Header avec logo animé */}
      <Box sx={{ 
        p: collapsed ? 1.5 : 2, 
        borderBottom: '1px solid #f0f0f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: collapsed ? 'center' : 'space-between',
        transition: 'all 0.2s ease'
      }}>
        {!collapsed && (
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1.2,
            position: 'relative',
            cursor: 'pointer',
            '&:hover': {
              '& .logo-icon': {
                transform: 'scale(1.05)',
                boxShadow: '0 6px 16px rgba(46,125,50,0.3)'
              }
            }
          }}>
            {/* Logo animé */}
            <Box
              className="logo-icon"
              sx={{
                width: 42,
                height: 42,
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #2e7d32 0%, #4caf50 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(46,125,50,0.2)',
                transition: 'all 0.2s ease',
              }}
            >
              <ApartmentIcon sx={{ fontSize: 22, color: '#fff' }} />
            </Box>
            
            <Box>
              <Typography sx={{ 
                fontWeight: 800, 
                fontSize: '0.9rem',
                color: '#1a1a1a',
                letterSpacing: '-0.3px',
                background: 'linear-gradient(135deg, #2e7d32, #1b5e20)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                Gestion Locative
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.2 }}>
                <Box sx={{ 
                  width: 5, 
                  height: 5, 
                  borderRadius: '50%', 
                  bgcolor: '#4caf50',
                  animation: 'pulse 2s infinite',
                  '@keyframes pulse': {
                    '0%': { opacity: 0.5, transform: 'scale(0.8)' },
                    '50%': { opacity: 1, transform: 'scale(1.2)' },
                    '100%': { opacity: 0.5, transform: 'scale(0.8)' }
                  }
                }} />
                <Typography sx={{ fontSize: '0.6rem', color: '#9e9e9e', fontWeight: 500 }}>
                  Madagascar
                </Typography>
              </Box>
            </Box>
          </Box>
        )}
        
        {collapsed && (
          <Tooltip title="Gestion Locative" placement="right">
            <Box
              sx={{
                width: 42,
                height: 42,
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #2e7d32 0%, #4caf50 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                '&:hover': {
                  transform: 'scale(1.05)',
                  boxShadow: '0 4px 12px rgba(46,125,50,0.3)'
                }
              }}
            >
              <ApartmentIcon sx={{ fontSize: 22, color: '#fff' }} />
            </Box>
          </Tooltip>
        )}
        
        {!isMobile && (
          <IconButton 
            size="small" 
            onClick={() => setCollapsed(!collapsed)}
            sx={{ 
              bgcolor: '#f5f5f5',
              '&:hover': { bgcolor: '#e8e8e8' }
            }}
          >
            <ChevronLeftIcon sx={{ fontSize: 16, transform: collapsed ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
          </IconButton>
        )}
      </Box>

      {/* Profil utilisateur */}
      {!collapsed && (
        <Box sx={{ 
          p: 2, 
          mx: 1.5, 
          my: 2, 
          borderRadius: 2,
          bgcolor: '#f8f9fa',
          transition: 'all 0.2s ease',
          '&:hover': { bgcolor: '#f0f2f5' }
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Avatar sx={{ 
              bgcolor: '#2e7d32', 
              width: 44, 
              height: 44,
              boxShadow: '0 2px 8px rgba(46,125,50,0.2)'
            }}>
              {user?.nom ? user.nom.charAt(0).toUpperCase() : <PeopleIcon sx={{ fontSize: 22 }} />}
            </Avatar>
            <Box>
              <Typography sx={{ fontWeight: 600, fontSize: '0.85rem', color: '#1a1a1a' }}>
                {user?.nom || 'Utilisateur'}
              </Typography>
              <Typography sx={{ 
                color: '#2e7d32', 
                fontSize: '0.65rem', 
                fontWeight: 500,
                bgcolor: '#e8f5e9',
                display: 'inline-block',
                px: 1,
                py: 0.2,
                borderRadius: 1,
                mt: 0.3
              }}>
                {user?.role === 'admin' ? 'Administrateur' : user?.role === 'gestionnaire' ? 'Gestionnaire' : 'Utilisateur'}
              </Typography>
            </Box>
          </Box>
        </Box>
      )}

      {collapsed && (
        <Box sx={{ py: 2, display: 'flex', justifyContent: 'center' }}>
          <Tooltip title={user?.nom || 'Utilisateur'} placement="right">
            <Avatar sx={{ 
              bgcolor: '#2e7d32', 
              width: 42, 
              height: 42,
              boxShadow: '0 2px 8px rgba(46,125,50,0.2)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              '&:hover': { transform: 'scale(1.05)' }
            }}>
              {user?.nom ? user.nom.charAt(0).toUpperCase() : <PeopleIcon />}
            </Avatar>
          </Tooltip>
        </Box>
      )}

      {/* Menu de navigation */}
      <Box sx={{ flex: 1, overflow: 'auto', py: 1 }}>
        <List sx={{ px: collapsed ? 1 : 1.5 }}>
          {menuItems.map((item) => (
            <Box key={item.text}>
              {item.children ? (
                <>
                  <ListItemButton
                    onClick={() => handleMenuClick(item.text)}
                    sx={{
                      borderRadius: 1.5,
                      mb: 0.5,
                      justifyContent: collapsed ? 'center' : 'flex-start',
                      px: collapsed ? 1 : 2,
                      py: 1,
                      bgcolor: openMenus[item.text] || isParentActive(item.children) 
                        ? alpha('#2e7d32', 0.08) : 'transparent',
                      '&:hover': { bgcolor: alpha('#2e7d32', 0.05) },
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <ListItemIcon sx={{ 
                      color: openMenus[item.text] || isParentActive(item.children) ? '#2e7d32' : '#757575', 
                      minWidth: collapsed ? 'auto' : 36,
                      mr: collapsed ? 0 : 1
                    }}>
                      {item.icon}
                    </ListItemIcon>
                    {!collapsed && (
                      <>
                        <ListItemText 
                          primary={item.text} 
                          sx={{ 
                            '& .MuiListItemText-primary': { 
                              fontSize: '0.8rem',
                              fontWeight: openMenus[item.text] || isParentActive(item.children) ? 600 : 400
                            } 
                          }}
                        />
                        {openMenus[item.text] ? 
                          <ExpandLess sx={{ fontSize: 18, color: '#757575' }} /> : 
                          <ExpandMore sx={{ fontSize: 18, color: '#757575' }} />
                        }
                      </>
                    )}
                  </ListItemButton>
                  {!collapsed && (
                    <Collapse in={openMenus[item.text]} timeout="auto">
                      <List disablePadding>
                        {item.children.map((child) => (
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
                              transition: 'all 0.2s ease'
                            }}
                          >
                            <ListItemIcon sx={{ 
                              color: isActive(child.path) ? '#2e7d32' : '#9e9e9e',
                              minWidth: 32
                            }}>
                              {child.icon}
                            </ListItemIcon>
                            <ListItemText 
                              primary={child.text}
                              sx={{ 
                                '& .MuiListItemText-primary': { 
                                  fontSize: '0.75rem',
                                  color: isActive(child.path) ? '#1a1a1a' : '#757575',
                                  fontWeight: isActive(child.path) ? 500 : 400
                                }
                              }}
                            />
                          </ListItemButton>
                        ))}
                      </List>
                    </Collapse>
                  )}
                </>
              ) : (
                <Tooltip title={collapsed ? item.text : ''} placement="right">
                  <ListItemButton
                    component={Link}
                    href={item.path || '#'}
                    sx={{
                      borderRadius: 1.5,
                      mb: 0.5,
                      justifyContent: collapsed ? 'center' : 'flex-start',
                      px: collapsed ? 1 : 2,
                      py: 1,
                      bgcolor: isActive(item.path) ? alpha('#2e7d32', 0.1) : 'transparent',
                      '&:hover': { bgcolor: alpha('#2e7d32', 0.05) },
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <ListItemIcon sx={{ 
                      color: isActive(item.path) ? '#2e7d32' : '#757575', 
                      minWidth: collapsed ? 'auto' : 36,
                      mr: collapsed ? 0 : 1
                    }}>
                      {item.icon}
                    </ListItemIcon>
                    {!collapsed && (
                      <ListItemText 
                        primary={item.text}
                        sx={{ 
                          '& .MuiListItemText-primary': { 
                            fontSize: '0.8rem',
                            fontWeight: isActive(item.path) ? 600 : 400
                          }
                        }}
                      />
                    )}
                  </ListItemButton>
                </Tooltip>
              )}
            </Box>
          ))}
        </List>
      </Box>

      {/* Déconnexion */}
      <Box sx={{ borderTop: '1px solid #f0f0f0', p: collapsed ? 1 : 1.5 }}>
        <Tooltip title={collapsed ? 'Déconnexion' : ''} placement="right">
          <ListItemButton
            onClick={handleLogout}
            sx={{
              borderRadius: 1.5,
              justifyContent: collapsed ? 'center' : 'flex-start',
              px: collapsed ? 1 : 2,
              py: 1,
              transition: 'all 0.2s ease',
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
      {/* Desktop Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          width: collapsed ? collapsedWidth : drawerWidth,
          flexShrink: 0,
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': {
            width: collapsed ? collapsedWidth : drawerWidth,
            boxSizing: 'border-box',
            borderRight: '1px solid #f0f0f0',
            transition: 'width 0.2s ease',
            overflowX: 'hidden',
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onClose}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { width: drawerWidth },
        }}
      >
        {drawerContent}
      </Drawer>
    </>
  );
}