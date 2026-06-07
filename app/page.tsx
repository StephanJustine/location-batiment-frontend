// 'use client';
// import { useState } from 'react';
// import { Box, Toolbar, Container, useMediaQuery, useTheme, Grid } from '@mui/material';
// import Sidebar from '@/components/layout/Sidebar';
// import Header from '@/components/layout/Header';
// import StatsCards from '@/components/dashboard/StatsCards';
// import Charts from '@/components/dashboard/Charts';
// import AlertesList from '@/components/dashboard/AlertesList';
// import TopLocataires from '@/components/dashboard/TopLocataires';
// import RecentActivity from '@/components/dashboard/RecentActivity';

// export default function DashboardPage() {
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
//   const [mobileOpen, setMobileOpen] = useState(false);

//   const handleDrawerToggle = () => {
//     setMobileOpen(!mobileOpen);
//   };

//   return (
//     <Box sx={{ display: 'flex', bgcolor: '#f5f7fa', minHeight: '100vh' }}>
//       <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
//       <Box component="main" sx={{ flexGrow: 1, width: { sm: `calc(100% - 260px)` } }}>
//         <Header onMenuClick={handleDrawerToggle} />
//         <Toolbar />
//         <Container maxWidth={false} sx={{ px: { xs: 2, sm: 3 }, py: 3 }}>
//           {/* Statistiques */}
//           <StatsCards />

//           {/* Graphique */}
//           <Box sx={{ mt: 4 }}>
//             <Charts />
//           </Box>

//           {/* Alertes et Top Locataires */}
//           <Grid container spacing={3} sx={{ mt: 1 }}>
//             <Grid size={{ xs: 12, md: 6 }}>
//               <AlertesList />
//             </Grid>
//             <Grid size={{ xs: 12, md: 6 }}>
//               <TopLocataires />
//             </Grid>
//           </Grid>

//           {/* Activités récentes */}
//           <Box sx={{ mt: 3 }}>
//             <RecentActivity />
//           </Box>
//         </Container>
//       </Box>
//     </Box>
//   );
// }

'use client';
import { useState } from 'react';
import { Box, Toolbar, Container, useMediaQuery, useTheme, Grid, Paper, Typography, IconButton } from '@mui/material';
import {
  Refresh as RefreshIcon,
  Download as DownloadIcon,
  FilterList as FilterListIcon,
} from '@mui/icons-material';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import StatsCards from '@/components/dashboard/StatsCards';
import Charts from '@/components/dashboard/Charts';
import AlertesList from '@/components/dashboard/AlertesList';
import TopLocataires from '@/components/dashboard/TopLocataires';
import RecentActivity from '@/components/dashboard/RecentActivity';

export default function DashboardPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: 'flex', bgcolor: '#f5f7fa', minHeight: '100vh' }}>
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <Box component="main" sx={{ flexGrow: 1, width: { sm: `calc(100% - 260px)` } }}>
        <Header onMenuClick={handleDrawerToggle} />
        <Toolbar />
        <Container maxWidth={false} sx={{ px: { xs: 2, sm: 3 }, py: 3 }}>
          {/* En-tête avec actions */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            mb: 3,
            flexWrap: 'wrap',
            gap: 2
          }}>
            <Typography variant="h5" sx={{ fontWeight: 600, color: '#1a1a1a' }}>
              Tableau de bord
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton size="small" sx={{ bgcolor: '#fff', borderRadius: 1, boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                <FilterListIcon sx={{ fontSize: 18, color: '#757575' }} />
              </IconButton>
              <IconButton size="small" sx={{ bgcolor: '#fff', borderRadius: 1, boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                <DownloadIcon sx={{ fontSize: 18, color: '#757575' }} />
              </IconButton>
              <IconButton size="small" sx={{ bgcolor: '#fff', borderRadius: 1, boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                <RefreshIcon sx={{ fontSize: 18, color: '#757575' }} />
              </IconButton>
            </Box>
          </Box>

          {/* Statistiques */}
          <StatsCards />

          {/* Graphique */}
          <Box sx={{ mt: 4 }}>
            <Charts />
          </Box>

          {/* Alertes et Top Locataires */}
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid size={{ xs: 12, md: 6 }}>
              <AlertesList />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TopLocataires />
            </Grid>
          </Grid>

          {/* Activités récentes */}
          <Box sx={{ mt: 3 }}>
            <RecentActivity />
          </Box>
        </Container>
      </Box>
    </Box>
  );
}