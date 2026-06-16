// // src/app/batiments/[id]/page.tsx
// 'use client';

// import { JSX, useEffect, useState } from 'react';
// import { useParams, useRouter } from 'next/navigation';
// import {
//   Box, Container, Typography, IconButton, Chip, Grid,
//   Card, CardContent, Divider, CircularProgress, Alert,
//   Button, LinearProgress, Dialog, DialogContent,
//   IconButton as MuiIconButton, Paper, Stack, Tabs, Tab,
//   Table, TableBody, TableCell, TableContainer, TableHead,
//   TableRow, Avatar, Tooltip
// } from '@mui/material';
// import {
//   ArrowBack, Edit, LocationOn, Business, SquareFoot,
//   CalendarToday, Category, Apartment, Home,
//   Build, Elevator, LocalParking, Wc, Security,
//   Close, ZoomIn, ImageNotSupported, CheckCircle,
//   TrendingUp, People, MeetingRoom, Add, Visibility,
//   Bed, Bathtub, Dashboard
// } from '@mui/icons-material';
// import Sidebar from '@/components/layout/Sidebar';
// import Header from '@/components/layout/Header';
// import { batimentService, Batiment } from '@/services/batimentService';
// import { Logement, logementService } from '@/services/logementService';
// // import { Logement } from '@/types/logement';
// import { formatCurrency } from '@/utils/formatters';

// interface TabPanelProps {
//   children?: React.ReactNode;
//   index: number;
//   value: number;
// }

// function TabPanel({ children, index, value }: TabPanelProps) {
//   return (
//     <Box sx={{ display: value === index ? 'block' : 'none', pt: 2 }}>
//       {children}
//     </Box>
//   );
// }

// export default function BatimentDetailPage() {
//   const { id } = useParams();
//   const router = useRouter();
//   const [batiment, setBatiment] = useState<Batiment | null>(null);
//   const [logements, setLogements] = useState<Logement[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [loadingLogements, setLoadingLogements] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [mobileOpen, setMobileOpen] = useState(false);
//   const [openLightbox, setOpenLightbox] = useState(false);
//   const [selectedImageIndex, setSelectedImageIndex] = useState(0);
//   const [tabValue, setTabValue] = useState(0);

//   useEffect(() => {
//     fetchBatiment();
//     fetchLogements();
//   }, [id]);

//   const fetchBatiment = async () => {
//     try {
//       setLoading(true);
//       const data = await batimentService.getById(Number(id));
//       setBatiment(data);
//     } catch (err) { 
//       setError("Bâtiment non trouvé"); 
//     } finally { 
//       setLoading(false); 
//     }
//   };

//   const fetchLogements = async () => {
//     try {
//       setLoadingLogements(true);
//       const data = await logementService.getByBatiment(Number(id));
//       setLogements(Array.isArray(data) ? data : []);
//     } catch (err) { 
//       console.error("Erreur chargement logements:", err);
//     } finally { 
//       setLoadingLogements(false); 
//     }
//   };

//   const typeLabels: Record<string, { label: string; icon: JSX.Element; color: string }> = { 
//     residential: { label: 'Résidentiel', icon: <Home sx={{ fontSize: 14 }} />, color: '#059669' }, 
//     commercial: { label: 'Commercial', icon: <Business sx={{ fontSize: 14 }} />, color: '#2563eb' }, 
//     mixte: { label: 'Mixte', icon: <Apartment sx={{ fontSize: 14 }} />, color: '#7c3aed' } 
//   };

//   const getStatutChip = (statut: string) => {
//     switch (statut) {
//       case 'libre':
//         return { label: 'Libre', color: '#22c55e', bg: '#f0fdf4' };
//       case 'occupe':
//         return { label: 'Occupé', color: '#3b82f6', bg: '#eff6ff' };
//       case 'reserve':
//         return { label: 'Réservé', color: '#f59e0b', bg: '#fffbeb' };
//       default:
//         return { label: statut || 'Inconnu', color: '#6b7280', bg: '#f3f4f6' };
//     }
//   };

//   const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'http://localhost:8000';
  
//   const getImageUrl = (path: string | null | undefined) => {
//     if (!path) return '';
//     if (path.startsWith('http')) return path;
//     if (path.startsWith('/uploads/')) return `${API_BASE_URL}${path}`;
//     if (path.startsWith('/static/')) return `${API_BASE_URL}${path}`;
//     return `${API_BASE_URL}/uploads/${path}`;
//   };

//   const photosList = batiment?.photos && Array.isArray(batiment.photos) ? batiment.photos : [];
//   const equipementsList = batiment?.equipements && Array.isArray(batiment.equipements) ? batiment.equipements : [];

//   const tauxOccupation = batiment?.nb_logements_total && batiment.nb_logements_total > 0 
//     ? Math.round(((batiment.nb_logements_occupes || 0) / batiment.nb_logements_total) * 100) 
//     : 0;

//   const logementsLibres = logements.filter(l => l.statut === 'libre').length;
//   const logementsOccupes = logements.filter(l => l.statut === 'occupe').length;
//   const loyerMoyen = logements.length > 0 
//     ? logements.reduce((sum, l) => sum + (l.loyer_mensuel || 0), 0) / logements.length 
//     : 0;

//   if (loading) {
//     return (
//       <Box sx={{ display: 'flex', bgcolor: '#f8fafc', minHeight: '100vh' }}>
//         <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
//         <Box component="main" sx={{ flexGrow: 1 }}>
//           <Header onMenuClick={() => setMobileOpen(!mobileOpen)} />
//           <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
//             <CircularProgress size={40} sx={{ color: '#059669' }} />
//           </Box>
//         </Box>
//       </Box>
//     );
//   }

//   if (error || !batiment) {
//     return (
//       <Box sx={{ display: 'flex', bgcolor: '#f8fafc', minHeight: '100vh' }}>
//         <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
//         <Box component="main" sx={{ flexGrow: 1 }}>
//           <Header onMenuClick={() => setMobileOpen(!mobileOpen)} />
//           <Container sx={{ py: 4 }}>
//             <Alert severity="error" sx={{ borderRadius: 2 }}>{error || "Bâtiment non trouvé"}</Alert>
//             <Button startIcon={<ArrowBack />} onClick={() => router.push('/batiments')} sx={{ mt: 2 }}>Retour</Button>
//           </Container>
//         </Box>
//       </Box>
//     );
//   }

//   const typeInfo = typeLabels[batiment.type_batiment] || { label: batiment.type_batiment || 'Non défini', icon: <Apartment sx={{ fontSize: 14 }} />, color: '#64748b' };

//   return (
//     <Box sx={{ display: 'flex', bgcolor: '#f8fafc', minHeight: '100vh' }}>
//       <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
//       <Box component="main" sx={{ flexGrow: 1, overflowX: 'hidden' }}>
//         <Header onMenuClick={() => setMobileOpen(!mobileOpen)} />
        
//         {/* Hero section */}
//         <Box sx={{ position: 'relative', height: { xs: 200, sm: 280, md: 320 }, width: '100%', overflow: 'hidden', bgcolor: '#1a1a1a' }}>
//           {photosList.length > 0 ? (
//             <>
//               <img 
//                 src={getImageUrl(photosList[0])} 
//                 alt={batiment.nom}
//                 style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85 }}
//                 onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
//               />
//               <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.6), rgba(0,0,0,0.2))' }} />
//             </>
//           ) : (
//             <Box sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#334155' }}>
//               <Apartment sx={{ fontSize: 64, color: '#64748b' }} />
//             </Box>
//           )}
          
//           <Container maxWidth="xl" sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, pb: { xs: 2, sm: 3 }, px: { xs: 2, sm: 3 } }}>
//             <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 2 }}>
//               <Box>
//                 <Chip 
//                   label={batiment.statut === 'actif' ? 'ACTIF' : 'INACTIF'} 
//                   size="small" 
//                   sx={{ mb: 1, bgcolor: batiment.statut === 'actif' ? '#22c55e' : '#ef4444', color: '#fff', fontWeight: 500 }} 
//                 />
//                 <Typography variant="h3" sx={{ fontWeight: 700, color: '#fff', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
//                   {batiment.nom}
//                 </Typography>
//                 <Typography variant="body2" sx={{ color: '#e2e8f0', display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
//                   <LocationOn sx={{ fontSize: 14 }} /> {batiment.adresse}, {batiment.ville}
//                 </Typography>
//               </Box>
//               <Button 
//                 variant="contained" 
//                 startIcon={<Edit />} 
//                 onClick={() => router.push(`/batiments/${batiment.id}/edit`)}
//                 sx={{ borderRadius: 2, textTransform: 'none', bgcolor: '#fff', color: '#0f172a', '&:hover': { bgcolor: '#f1f5f9' }, px: 3 }}
//               >
//                 Modifier
//               </Button>
//             </Box>
//           </Container>
//         </Box>

//         <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3 }, py: { xs: 3, sm: 4 } }}>
          
//           {/* Stats rapides */}
//           <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(4, 1fr)' }, gap: 2, mb: 4 }}>
//             <StatCard icon={<SquareFoot sx={{ fontSize: 22 }} />} label="Surface totale" value={`${batiment.surface_totale?.toLocaleString() || 0} m²`} color="#059669" />
//             <StatCard icon={<MeetingRoom sx={{ fontSize: 22 }} />} label="Logements" value={`${batiment.nb_logements || 0}`} color="#2563eb" />
//             <StatCard icon={<LocalParking sx={{ fontSize: 22 }} />} label="Parkings" value={`${batiment.nb_parkings || 0}`} color="#7c3aed" />
//             <StatCard icon={<TrendingUp sx={{ fontSize: 22 }} />} label="Occupation" value={`${tauxOccupation}%`} color="#f59e0b" />
//           </Box>

//           {/* Tabs */}
//           <Paper sx={{ borderRadius: 2, overflow: 'hidden', mb: 3 }}>
//             <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)} sx={{ borderBottom: 1, borderColor: '#e2e8f0', bgcolor: '#fff' }}>
//               <Tab label="Informations" icon={<Business sx={{ fontSize: 18 }} />} iconPosition="start" />
//               <Tab label="Logements" icon={<MeetingRoom sx={{ fontSize: 18 }} />} iconPosition="start" />
//               <Tab label="Photos" icon={<ZoomIn sx={{ fontSize: 18 }} />} iconPosition="start" />
//             </Tabs>

//             <Box sx={{ p: 3 }}>
//               {/* Tab 0 - Informations */}
//               <TabPanel value={tabValue} index={0}>
//                 <Grid container spacing={3}>
//                   <Grid size={{ xs: 12, md: 6 }}>
//                     <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#059669', mb: 2 }}>Caractéristiques</Typography>
//                     <Stack spacing={2}>
//                       <InfoItem icon={<Category />} label="Type" value={typeInfo.label} />
//                       <InfoItem icon={<CalendarToday />} label="Année construction" value={batiment.annee_construction || '-'} />
//                       <InfoItem icon={<Business />} label="Nombre d'étages" value={batiment.nb_etages || '0'} />
//                       <InfoItem icon={<Elevator />} label="Ascenseurs" value={batiment.nb_ascenseurs || '0'} />
//                       <InfoItem icon={<Wc />} label="Sanitaires" value={batiment.nb_sanitaires || '0'} />
//                       <InfoItem icon={<People />} label="Capacité" value={`${batiment.capacite || '-'} personnes`} />
//                     </Stack>
//                   </Grid>
//                   <Grid size={{ xs: 12, md: 6 }}>
//                     <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#059669', mb: 2 }}>Adresse & description</Typography>
//                     <Paper sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: 2, mb: 2 }}>
//                       <Typography variant="body2" sx={{ fontWeight: 500 }}>{batiment.adresse || 'Non renseignée'}</Typography>
//                       <Typography variant="caption" sx={{ color: '#64748b' }}>{batiment.ville || ''} {batiment.commune && `- ${batiment.commune}`}</Typography>
//                       {batiment.code_postal && <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>Code postal: {batiment.code_postal}</Typography>}
//                     </Paper>
//                     {batiment.description && (
//                       <Typography variant="body2" sx={{ color: '#475569', lineHeight: 1.6 }}>{batiment.description}</Typography>
//                     )}
//                   </Grid>
//                 </Grid>

//                 {/* Équipements */}
//                 {equipementsList.length > 0 && (
//                   <Box sx={{ mt: 3 }}>
//                     <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#059669', mb: 2 }}>Équipements</Typography>
//                     <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
//                       {equipementsList.map((eq: string, idx: number) => (
//                         <Chip key={idx} label={eq} icon={<CheckCircle sx={{ fontSize: 14 }} />} sx={{ borderRadius: 2 }} />
//                       ))}
//                     </Box>
//                   </Box>
//                 )}

//                 {/* Surveillance */}
//                 {batiment.surveillance && (
//                   <Box sx={{ mt: 3, display: 'flex', alignItems: 'center', gap: 1, p: 1.5, bgcolor: '#eff6ff', borderRadius: 2 }}>
//                     <Security sx={{ color: '#3b82f6' }} />
//                     <Typography variant="body2" sx={{ color: '#3b82f6', fontWeight: 500 }}>Surveillance 24h/24 et système de sécurité</Typography>
//                   </Box>
//                 )}
//               </TabPanel>

//               {/* Tab 1 - Logements */}
//               <TabPanel value={tabValue} index={1}>
//                 <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
//                   <Box sx={{ display: 'flex', gap: 2 }}>
//                     <Chip label={`${logements.length} logements`} color="primary" />
//                     <Chip label={`${logementsLibres} libres`} sx={{ bgcolor: '#f0fdf4', color: '#22c55e' }} />
//                     <Chip label={`${logementsOccupes} occupés`} sx={{ bgcolor: '#eff6ff', color: '#3b82f6' }} />
//                     <Chip label={`Loyer moyen: ${formatCurrency(loyerMoyen)}`} variant="outlined" />
//                   </Box>
//                   <Button 
//                     variant="contained" 
//                     startIcon={<Add />} 
//                     onClick={() => router.push(`/logements/create?batiment_id=${batiment.id}`)}
//                     sx={{ borderRadius: 2, textTransform: 'none', bgcolor: '#059669' }}
//                     size="small"
//                   >
//                     Ajouter un logement
//                   </Button>
//                 </Box>

//                 {loadingLogements ? (
//                   <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
//                     <CircularProgress size={32} />
//                   </Box>
//                 ) : logements.length === 0 ? (
//                   <Box sx={{ textAlign: 'center', py: 6 }}>
//                     <MeetingRoom sx={{ fontSize: 48, color: '#cbd5e1' }} />
//                     <Typography variant="body1" sx={{ mt: 2, color: '#64748b' }}>Aucun logement dans ce bâtiment</Typography>
//                     <Button 
//                       variant="outlined" 
//                       startIcon={<Add />} 
//                       onClick={() => router.push(`/logements/create?batiment_id=${batiment.id}`)}
//                       sx={{ mt: 2 }}
//                     >
//                       Ajouter un logement
//                     </Button>
//                   </Box>
//                 ) : (
//                   <TableContainer component={Paper} sx={{ borderRadius: 2, border: '1px solid #e2e8f0', boxShadow: 'none' }}>
//                     <Table size="medium">
//                       <TableHead sx={{ bgcolor: '#f8fafc' }}>
//                         <TableRow>
//                           <TableCell sx={{ fontWeight: 600 }}>N° logement</TableCell>
//                           <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
//                           <TableCell sx={{ fontWeight: 600 }}>Surface</TableCell>
//                           <TableCell sx={{ fontWeight: 600 }}>Pièces</TableCell>
//                           <TableCell sx={{ fontWeight: 600 }}>Loyer</TableCell>
//                           <TableCell sx={{ fontWeight: 600 }}>Statut</TableCell>
//                           <TableCell sx={{ fontWeight: 600 }}>Locataire</TableCell>
//                           <TableCell align="center" sx={{ fontWeight: 600 }}>Actions</TableCell>
//                         </TableRow>
//                       </TableHead>
//                       <TableBody>
//                         {logements.map((logement) => {
//                           const statut = getStatutChip(logement.statut);
//                           return (
//                             <TableRow key={logement.id} hover>
//                               <TableCell>
//                                 <Typography variant="body2" sx={{ fontWeight: 600 }}>{logement.numero}</Typography>
//                               </TableCell>
//                               <TableCell>{logement.type_logement || '-'}</TableCell>
//                               <TableCell>{logement.surface} m²</TableCell>
//                               <TableCell>{logement.nb_pieces} pièces</TableCell>
//                               <TableCell sx={{ fontWeight: 600, color: '#059669' }}>{formatCurrency(logement.loyer_mensuel)}</TableCell>
//                               <TableCell>
//                                 <Chip label={statut.label} size="small" sx={{ bgcolor: statut.bg, color: statut.color }} />
//                               </TableCell>
//                               <TableCell>
//                                 {logement.locataire_nom ? (
//                                   <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                                     <Avatar sx={{ width: 28, height: 28, bgcolor: '#e2e8f0', fontSize: '0.7rem' }}>
//                                       {logement.locataire_nom?.[0]}
//                                     </Avatar>
//                                     <Typography variant="caption">{logement.locataire_nom}</Typography>
//                                   </Box>
//                                 ) : (
//                                   <Typography variant="caption" color="text.secondary">-</Typography>
//                                 )}
//                               </TableCell>
//                               <TableCell align="center">
//                                 <Tooltip title="Voir détails">
//                                   <IconButton size="small" onClick={() => router.push(`/logements/${logement.id}`)}>
//                                     <Visibility fontSize="small" />
//                                   </IconButton>
//                                 </Tooltip>
//                               </TableCell>
//                             </TableRow>
//                           );
//                         })}
//                       </TableBody>
//                     </Table>
//                   </TableContainer>
//                 )}
//               </TabPanel>

//               {/* Tab 2 - Photos */}
//               <TabPanel value={tabValue} index={2}>
//                 {photosList.length > 0 ? (
//                   <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', md: 'repeat(4, 1fr)' }, gap: 1.5 }}>
//                     {photosList.map((photo, idx) => (
//                       <Box 
//                         key={idx}
//                         sx={{ 
//                           position: 'relative', 
//                           aspectRatio: '16/9', 
//                           borderRadius: 2, 
//                           overflow: 'hidden',
//                           cursor: 'pointer',
//                           transition: '0.2s',
//                           '&:hover': { transform: 'scale(1.02)', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }
//                         }}
//                         onClick={() => { setSelectedImageIndex(idx); setOpenLightbox(true); }}
//                       >
//                         <img 
//                           src={getImageUrl(photo)} 
//                           alt={`${batiment.nom} - ${idx + 1}`}
//                           style={{ width: '100%', height: '100%', objectFit: 'cover' }}
//                           onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/400x225?text=Image+non+disponible'; }}
//                         />
//                         <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, bgcolor: 'rgba(0,0,0,0.5)', p: 0.5 }}>
//                           <Typography variant="caption" sx={{ color: '#fff', display: 'block', textAlign: 'center' }}>Photo {idx + 1}</Typography>
//                         </Box>
//                       </Box>
//                     ))}
//                   </Box>
//                 ) : (
//                   <Box sx={{ textAlign: 'center', py: 6 }}>
//                     <ImageNotSupported sx={{ fontSize: 48, color: '#cbd5e1' }} />
//                     <Typography variant="body1" sx={{ mt: 2, color: '#64748b' }}>Aucune photo disponible</Typography>
//                   </Box>
//                 )}
//               </TabPanel>
//             </Box>
//           </Paper>

//           {/* Lightbox */}
//           <Dialog open={openLightbox} onClose={() => setOpenLightbox(false)} maxWidth="lg" fullWidth>
//             <DialogContent sx={{ p: 0, bgcolor: '#000', position: 'relative', minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//               <MuiIconButton 
//                 onClick={() => setOpenLightbox(false)} 
//                 sx={{ position: 'absolute', top: 10, right: 10, zIndex: 10, bgcolor: 'rgba(0,0,0,0.5)', color: '#fff' }}
//               >
//                 <Close />
//               </MuiIconButton>
//               {photosList[selectedImageIndex] && (
//                 <img 
//                   src={getImageUrl(photosList[selectedImageIndex])} 
//                   alt="Photo"
//                   style={{ width: '100%', height: 'auto', maxHeight: '85vh', objectFit: 'contain' }}
//                 />
//               )}
//               <Box sx={{ position: 'absolute', bottom: 20, left: 0, right: 0, textAlign: 'center' }}>
//                 <Typography variant="caption" sx={{ color: '#fff', bgcolor: 'rgba(0,0,0,0.5)', px: 2, py: 0.5, borderRadius: 2 }}>
//                   {selectedImageIndex + 1} / {photosList.length}
//                 </Typography>
//               </Box>
//             </DialogContent>
//           </Dialog>
//         </Container>
//       </Box>
//     </Box>
//   );
// }

// // Composants réutilisables
// function StatCard({ icon, label, value, color }: { icon: JSX.Element; label: string; value: string | number; color: string }) {
//   return (
//     <Paper sx={{ p: 2, textAlign: 'center', borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
//       <Box sx={{ mb: 1, color }}>{icon}</Box>
//       <Typography variant="h6" sx={{ fontWeight: 700, color: '#0f172a' }}>{value}</Typography>
//       <Typography variant="caption" sx={{ color: '#64748b' }}>{label}</Typography>
//     </Paper>
//   );
// }

// function InfoItem({ icon, label, value }: { icon: JSX.Element; label: string; value: string | number }) {
//   return (
//     <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
//       <Box sx={{ color: '#94a3b8', display: 'flex', alignItems: 'center', minWidth: 32 }}>{icon}</Box>
//       <Typography variant="caption" sx={{ color: '#64748b', minWidth: 120 }}>{label}</Typography>
//       <Typography variant="body2" sx={{ fontWeight: 500, color: '#0f172a' }}>{value || '-'}</Typography>
//     </Box>
//   );
// }

'use client';

import { JSX, SetStateAction, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Box, Container, Typography, IconButton, Chip, Grid,
  Card, CardContent, Divider, CircularProgress, Alert,
  Button, LinearProgress, Dialog, DialogContent,
  IconButton as MuiIconButton, Paper, Stack, Tabs, Tab,
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Avatar, Tooltip, DialogTitle, DialogActions,
  TextField, MenuItem, FormControl, InputLabel, Select,
  Switch, FormControlLabel, Badge
} from '@mui/material';
import {
  ArrowBack, Edit, LocationOn, Business, SquareFoot,
  CalendarToday, Category, Apartment, Home,
  Build, Elevator, LocalParking, Wc, Security,
  Close, ZoomIn, ImageNotSupported, CheckCircle,
  TrendingUp, People, MeetingRoom, Add, Visibility,
  Bed, Bathtub, Dashboard, Engineering, Inventory,
  Handyman, CleaningServices, Delete, Save, Cancel,
  PersonAdd, Work, Receipt, EventNote, Phone
} from '@mui/icons-material';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { batimentService, Batiment } from '@/services/batimentService';
import { Logement, logementService } from '@/services/logementService';
import { employeService, Employe, TypeEmploye, StatutEmploye } from '@/services/employeService';
import { materielService, MaterielStock, CategorieMateriel } from '@/services/materielService';
import { formatCurrency } from '@/utils/formatters';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel({ children, index, value }: TabPanelProps) {
  return (
    <Box sx={{ display: value === index ? 'block' : 'none', pt: 2 }}>
      {children}
    </Box>
  );
}

export default function BatimentDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [batiment, setBatiment] = useState<Batiment | null>(null);
  const [logements, setLogements] = useState<Logement[]>([]);
  const [employes, setEmployes] = useState<Employe[]>([]);
  const [materielStock, setMaterielStock] = useState<MaterielStock[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingLogements, setLoadingLogements] = useState(false);
  const [loadingEmployes, setLoadingEmployes] = useState(false);
  const [loadingMateriel, setLoadingMateriel] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openLightbox, setOpenLightbox] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [tabValue, setTabValue] = useState(0);
  
  // États pour les dialogues
  const [openEmployeDialog, setOpenEmployeDialog] = useState(false);
  const [openMaterielDialog, setOpenMaterielDialog] = useState(false);
  const [selectedEmploye, setSelectedEmploye] = useState<Employe | null>(null);
  const [selectedMateriel, setSelectedMateriel] = useState<MaterielStock | null>(null);
  
  // Formulaire employé
  const [employeForm, setEmployeForm] = useState({
    nom: '',
    prenom: '',
    telephone: '',
    email: '',
    type_employe: 'gardien' as TypeEmploye,
    salaire_base: 0,
    date_embauche: new Date().toISOString().split('T')[0],
    statut: 'actif' as StatutEmploye
  });

  // Formulaire matériel
  const [materielForm, setMaterielForm] = useState({
    code: '',
    nom: '',
    categorie: 'autre' as CategorieMateriel,
    quantite_stock: 0,
    unite: 'piece',
    prix_unitaire_achat: 0
  });

  useEffect(() => {
    fetchBatiment();
    fetchLogements();
    fetchEmployes();
    fetchMateriel();
  }, [id]);

  const fetchBatiment = async () => {
    try {
      setLoading(true);
      const data = await batimentService.getById(Number(id));
      setBatiment(data);
    } catch (err) { 
      setError("Bâtiment non trouvé"); 
    } finally { 
      setLoading(false); 
    }
  };

  const fetchLogements = async () => {
    try {
      setLoadingLogements(true);
      const data = await logementService.getByBatiment(Number(id));
      setLogements(Array.isArray(data) ? data : []);
    } catch (err) { 
      console.error("Erreur chargement logements:", err);
    } finally { 
      setLoadingLogements(false); 
    }
  };

  const fetchEmployes = async () => {
    try {
      setLoadingEmployes(true);
      const data = await employeService.getByBatiment(Number(id));
      setEmployes(Array.isArray(data) ? data : []);
    } catch (err) { 
      console.error("Erreur chargement employés:", err);
    } finally { 
      setLoadingEmployes(false); 
    }
  };

  const fetchMateriel = async () => {
    try {
      setLoadingMateriel(true);
      const data = await materielService.getByBatiment(Number(id));
      setMaterielStock(Array.isArray(data) ? data : []);
    } catch (err) { 
      console.error("Erreur chargement matériel:", err);
    } finally { 
      setLoadingMateriel(false); 
    }
  };

  const handleCreateEmploye = async () => {
    try {
      const newEmploye = await employeService.create({
        ...employeForm,
        batiment_id: Number(id)
      });
      setEmployes([...employes, newEmploye]);
      setOpenEmployeDialog(false);
      resetEmployeForm();
    } catch (err) {
      console.error("Erreur création employé:", err);
    }
  };

  const handleUpdateEmploye = async () => {
    if (!selectedEmploye) return;
    try {
      const updated = await employeService.update(selectedEmploye.id, employeForm);
      setEmployes(employes.map(e => e.id === updated.id ? updated : e));
      setOpenEmployeDialog(false);
      setSelectedEmploye(null);
      resetEmployeForm();
    } catch (err) {
      console.error("Erreur mise à jour employé:", err);
    }
  };

  const handleDeleteEmploye = async (id: number) => {
    if (confirm("Supprimer cet employé ?")) {
      try {
        await employeService.delete(id);
        setEmployes(employes.filter(e => e.id !== id));
      } catch (err) {
        console.error("Erreur suppression employé:", err);
      }
    }
  };

  const handleCreateMateriel = async () => {
    try {
      const newMateriel = await materielService.create({
        ...materielForm,
        batiment_id: Number(id)
      });
      setMaterielStock([...materielStock, newMateriel]);
      setOpenMaterielDialog(false);
      resetMaterielForm();
    } catch (err) {
      console.error("Erreur création matériel:", err);
    }
  };

  const handleDeleteMateriel = async (id: number) => {
    if (confirm("Supprimer cet article ?")) {
      try {
        await materielService.delete(id);
        setMaterielStock(materielStock.filter(m => m.id !== id));
      } catch (err) {
        console.error("Erreur suppression matériel:", err);
      }
    }
  };

  const resetEmployeForm = () => {
    setEmployeForm({
      nom: '',
      prenom: '',
      telephone: '',
      email: '',
      type_employe: 'gardien',
      salaire_base: 0,
      date_embauche: new Date().toISOString().split('T')[0],
      statut: 'actif'
    });
    setSelectedEmploye(null);
  };

  const resetMaterielForm = () => {
    setMaterielForm({
      code: '',
      nom: '',
      categorie: 'autre',
      quantite_stock: 0,
      unite: 'piece',
      prix_unitaire_achat: 0
    });
    setSelectedMateriel(null);
  };

  const openEditEmploye = (employe: Employe) => {
    setSelectedEmploye(employe);
    setEmployeForm({
      nom: employe.nom,
      prenom: employe.prenom,
      telephone: employe.telephone,
      email: employe.email || '',
      type_employe: employe.type_employe,
      salaire_base: employe.salaire_base,
      date_embauche: employe.date_embauche.split('T')[0],
      statut: employe.statut
    });
    setOpenEmployeDialog(true);
  };

  const typeEmployeLabels: Record<TypeEmploye, { label: string; icon: JSX.Element; color: string }> = {
    gardien: { label: 'Gardien', icon: <Security sx={{ fontSize: 14 }} />, color: '#059669' },
    femme_de_menage: { label: 'Femme de ménage', icon: <CleaningServices sx={{ fontSize: 14 }} />, color: '#7c3aed' },
    jardinier: { label: 'Jardinier', icon: <Agriculture sx={{ fontSize: 14 }} />, color: '#22c55e' },
    technicien: { label: 'Technicien', icon: <Build sx={{ fontSize: 14 }} />, color: '#2563eb' },
    agent_securite: { label: 'Agent sécurité', icon: <Security sx={{ fontSize: 14 }} />, color: '#ef4444' },
    comptable: { label: 'Comptable', icon: <Receipt sx={{ fontSize: 14 }} />, color: '#f59e0b' },
    autre: { label: 'Autre', icon: <PersonAdd sx={{ fontSize: 14 }} />, color: '#64748b' }
  };

  const categorieLabels: Record<CategorieMateriel, string> = {
    ampoule: 'Ampoules',
    robinetterie: 'Robinetterie',
    chasse_eau: 'Chasses d\'eau',
    joint: 'Joints',
    flexible: 'Flexibles',
    prise: 'Prises',
    interrupteur: 'Interrupteurs',
    poignee: 'Poignées',
    vitre: 'Vitres',
    carrelage: 'Carrelage',
    peinture: 'Peinture',
    autre: 'Autre'
  };

  const typeLabels: Record<string, { label: string; icon: JSX.Element; color: string }> = { 
    residential: { label: 'Résidentiel', icon: <Home sx={{ fontSize: 14 }} />, color: '#059669' }, 
    commercial: { label: 'Commercial', icon: <Business sx={{ fontSize: 14 }} />, color: '#2563eb' }, 
    mixte: { label: 'Mixte', icon: <Apartment sx={{ fontSize: 14 }} />, color: '#7c3aed' } 
  };

  const getStatutChip = (statut: string) => {
    switch (statut) {
      case 'libre':
        return { label: 'Libre', color: '#22c55e', bg: '#f0fdf4' };
      case 'occupe':
        return { label: 'Occupé', color: '#3b82f6', bg: '#eff6ff' };
      case 'reserve':
        return { label: 'Réservé', color: '#f59e0b', bg: '#fffbeb' };
      default:
        return { label: statut || 'Inconnu', color: '#6b7280', bg: '#f3f4f6' };
    }
  };

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'http://localhost:8000';
  
  const getImageUrl = (path: string | null | undefined) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    if (path.startsWith('/uploads/')) return `${API_BASE_URL}${path}`;
    if (path.startsWith('/static/')) return `${API_BASE_URL}${path}`;
    return `${API_BASE_URL}/uploads/${path}`;
  };

  const photosList = batiment?.photos && Array.isArray(batiment.photos) ? batiment.photos : [];
  const equipementsList = batiment?.equipements && Array.isArray(batiment.equipements) ? batiment.equipements : [];

  const tauxOccupation = batiment?.nb_logements_total && batiment.nb_logements_total > 0 
    ? Math.round(((batiment.nb_logements_occupes || 0) / batiment.nb_logements_total) * 100) 
    : 0;

  const logementsLibres = logements.filter(l => l.statut === 'libre').length;
  const logementsOccupes = logements.filter(l => l.statut === 'occupe').length;
  const loyerMoyen = logements.length > 0 
    ? logements.reduce((sum, l) => sum + (l.loyer_mensuel || 0), 0) / logements.length 
    : 0;

  const employesActifs = employes.filter(e => e.statut === 'actif').length;
  const stockValeur = materielStock.reduce((sum, m) => sum + ((m.prix_unitaire_achat || 0) * m.quantite_stock), 0);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', bgcolor: '#f8fafc', minHeight: '100vh' }}>
        <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
        <Box component="main" sx={{ flexGrow: 1 }}>
          <Header onMenuClick={() => setMobileOpen(!mobileOpen)} />
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
            <CircularProgress size={40} sx={{ color: '#059669' }} />
          </Box>
        </Box>
      </Box>
    );
  }

  if (error || !batiment) {
    return (
      <Box sx={{ display: 'flex', bgcolor: '#f8fafc', minHeight: '100vh' }}>
        <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
        <Box component="main" sx={{ flexGrow: 1 }}>
          <Header onMenuClick={() => setMobileOpen(!mobileOpen)} />
          <Container sx={{ py: 4 }}>
            <Alert severity="error" sx={{ borderRadius: 2 }}>{error || "Bâtiment non trouvé"}</Alert>
            <Button startIcon={<ArrowBack />} onClick={() => router.push('/batiments')} sx={{ mt: 2 }}>Retour</Button>
          </Container>
        </Box>
      </Box>
    );
  }

  const typeInfo = typeLabels[batiment.type_batiment] || { label: batiment.type_batiment || 'Non défini', icon: <Apartment sx={{ fontSize: 14 }} />, color: '#64748b' };

  return (
    <Box sx={{ display: 'flex', bgcolor: '#f8fafc', minHeight: '100vh' }}>
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <Box component="main" sx={{ flexGrow: 1, overflowX: 'hidden' }}>
        <Header onMenuClick={() => setMobileOpen(!mobileOpen)} />
        
        {/* Hero section */}
        <Box sx={{ position: 'relative', height: { xs: 200, sm: 280, md: 320 }, width: '100%', overflow: 'hidden', bgcolor: '#1a1a1a' }}>
          {photosList.length > 0 ? (
            <>
              <img 
                src={getImageUrl(photosList[0])} 
                alt={batiment.nom}
                style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85 }}
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
              <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.6), rgba(0,0,0,0.2))' }} />
            </>
          ) : (
            <Box sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#334155' }}>
              <Apartment sx={{ fontSize: 64, color: '#64748b' }} />
            </Box>
          )}
          
          <Container maxWidth="xl" sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, pb: { xs: 2, sm: 3 }, px: { xs: 2, sm: 3 } }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 2 }}>
              <Box>
                <Chip 
                  label={batiment.statut === 'actif' ? 'ACTIF' : 'INACTIF'} 
                  size="small" 
                  sx={{ mb: 1, bgcolor: batiment.statut === 'actif' ? '#22c55e' : '#ef4444', color: '#fff', fontWeight: 500 }} 
                />
                <Typography variant="h3" sx={{ fontWeight: 700, color: '#fff', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
                  {batiment.nom}
                </Typography>
                <Typography variant="body2" sx={{ color: '#e2e8f0', display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                  <LocationOn sx={{ fontSize: 14 }} /> {batiment.adresse}, {batiment.ville}
                </Typography>
              </Box>
              <Button 
                variant="contained" 
                startIcon={<Edit />} 
                onClick={() => router.push(`/batiments/${batiment.id}/edit`)}
                sx={{ borderRadius: 2, textTransform: 'none', bgcolor: '#fff', color: '#0f172a', '&:hover': { bgcolor: '#f1f5f9' }, px: 3 }}
              >
                Modifier
              </Button>
            </Box>
          </Container>
        </Box>

        <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3 }, py: { xs: 3, sm: 4 } }}>
          
          {/* Stats rapides */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(4, 1fr)' }, gap: 2, mb: 4 }}>
            <StatCard icon={<SquareFoot sx={{ fontSize: 22 }} />} label="Surface totale" value={`${batiment.surface_totale?.toLocaleString() || 0} m²`} color="#059669" />
            <StatCard icon={<MeetingRoom sx={{ fontSize: 22 }} />} label="Logements" value={`${batiment.nb_logements || 0}`} color="#2563eb" />
            <StatCard icon={<Engineering sx={{ fontSize: 22 }} />} label="Employés" value={`${employesActifs}`} color="#7c3aed" />
            <StatCard icon={<Inventory sx={{ fontSize: 22 }} />} label="Stock valeur" value={formatCurrency(stockValeur)} color="#f59e0b" />
          </Box>

          {/* Tabs */}
          <Paper sx={{ borderRadius: 2, overflow: 'hidden', mb: 3 }}>
            <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)} sx={{ borderBottom: 1, borderColor: '#e2e8f0', bgcolor: '#fff' }}>
              <Tab label="Informations" icon={<Business sx={{ fontSize: 18 }} />} iconPosition="start" />
              <Tab label="Logements" icon={<MeetingRoom sx={{ fontSize: 18 }} />} iconPosition="start" />
              <Tab label="Employés" icon={<Engineering sx={{ fontSize: 18 }} />} iconPosition="start" />
              <Tab label="Matériel" icon={<Inventory sx={{ fontSize: 18 }} />} iconPosition="start" />
              <Tab label="Photos" icon={<ZoomIn sx={{ fontSize: 18 }} />} iconPosition="start" />
            </Tabs>

            <Box sx={{ p: 3 }}>
              {/* Tab 0 - Informations */}
              <TabPanel value={tabValue} index={0}>
                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#059669', mb: 2 }}>Caractéristiques</Typography>
                    <Stack spacing={2}>
                      <InfoItem icon={<Category />} label="Type" value={typeInfo.label} />
                      <InfoItem icon={<CalendarToday />} label="Année construction" value={batiment.annee_construction || '-'} />
                      <InfoItem icon={<Business />} label="Nombre d'étages" value={batiment.nb_etages || '0'} />
                      <InfoItem icon={<Elevator />} label="Ascenseurs" value={batiment.nb_ascenseurs || '0'} />
                      <InfoItem icon={<Wc />} label="Sanitaires" value={batiment.nb_sanitaires || '0'} />
                      <InfoItem icon={<People />} label="Capacité" value={`${batiment.capacite || '-'} personnes`} />
                    </Stack>
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#059669', mb: 2 }}>Adresse & description</Typography>
                    <Paper sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: 2, mb: 2 }}>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>{batiment.adresse || 'Non renseignée'}</Typography>
                      <Typography variant="caption" sx={{ color: '#64748b' }}>{batiment.ville || ''} {batiment.commune && `- ${batiment.commune}`}</Typography>
                      {batiment.code_postal && <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>Code postal: {batiment.code_postal}</Typography>}
                    </Paper>
                    {batiment.description && (
                      <Typography variant="body2" sx={{ color: '#475569', lineHeight: 1.6 }}>{batiment.description}</Typography>
                    )}
                  </Grid>
                </Grid>

                {/* Équipements */}
                {equipementsList.length > 0 && (
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#059669', mb: 2 }}>Équipements</Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {equipementsList.map((eq: string, idx: number) => (
                        <Chip key={idx} label={eq} icon={<CheckCircle sx={{ fontSize: 14 }} />} sx={{ borderRadius: 2 }} />
                      ))}
                    </Box>
                  </Box>
                )}

                {/* Surveillance */}
                {batiment.surveillance && (
                  <Box sx={{ mt: 3, display: 'flex', alignItems: 'center', gap: 1, p: 1.5, bgcolor: '#eff6ff', borderRadius: 2 }}>
                    <Security sx={{ color: '#3b82f6' }} />
                    <Typography variant="body2" sx={{ color: '#3b82f6', fontWeight: 500 }}>Surveillance 24h/24 et système de sécurité</Typography>
                  </Box>
                )}
              </TabPanel>

              {/* Tab 1 - Logements */}
              <TabPanel value={tabValue} index={1}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Chip label={`${logements.length} logements`} color="primary" />
                    <Chip label={`${logementsLibres} libres`} sx={{ bgcolor: '#f0fdf4', color: '#22c55e' }} />
                    <Chip label={`${logementsOccupes} occupés`} sx={{ bgcolor: '#eff6ff', color: '#3b82f6' }} />
                    <Chip label={`Loyer moyen: ${formatCurrency(loyerMoyen)}`} variant="outlined" />
                  </Box>
                  <Button 
                    variant="contained" 
                    startIcon={<Add />} 
                    onClick={() => router.push(`/logements/create?batiment_id=${batiment.id}`)}
                    sx={{ borderRadius: 2, textTransform: 'none', bgcolor: '#059669' }}
                    size="small"
                  >
                    Ajouter un logement
                  </Button>
                </Box>

                {loadingLogements ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                    <CircularProgress size={32} />
                  </Box>
                ) : logements.length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 6 }}>
                    <MeetingRoom sx={{ fontSize: 48, color: '#cbd5e1' }} />
                    <Typography variant="body1" sx={{ mt: 2, color: '#64748b' }}>Aucun logement dans ce bâtiment</Typography>
                    <Button 
                      variant="outlined" 
                      startIcon={<Add />} 
                      onClick={() => router.push(`/logements/create?batiment_id=${batiment.id}`)}
                      sx={{ mt: 2 }}
                    >
                      Ajouter un logement
                    </Button>
                  </Box>
                ) : (
                  <LogementsTable logements={logements} onView={(id: any) => router.push(`/logements/${id}`)} getStatutChip={getStatutChip} formatCurrency={formatCurrency} />
                )}
              </TabPanel>

              {/* Tab 2 - Employés */}
              <TabPanel value={tabValue} index={2}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Chip label={`${employes.length} employés`} color="primary" />
                    <Chip label={`${employesActifs} actifs`} sx={{ bgcolor: '#f0fdf4', color: '#22c55e' }} />
                  </Box>
                  <Button 
                    variant="contained" 
                    startIcon={<PersonAdd />} 
                    onClick={() => { resetEmployeForm(); setOpenEmployeDialog(true); }}
                    sx={{ borderRadius: 2, textTransform: 'none', bgcolor: '#7c3aed' }}
                    size="small"
                  >
                    Ajouter un employé
                  </Button>
                </Box>

                {loadingEmployes ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                    <CircularProgress size={32} />
                  </Box>
                ) : employes.length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 6 }}>
                    <Engineering sx={{ fontSize: 48, color: '#cbd5e1' }} />
                    <Typography variant="body1" sx={{ mt: 2, color: '#64748b' }}>Aucun employé dans ce bâtiment</Typography>
                    <Button 
                      variant="outlined" 
                      startIcon={<PersonAdd />} 
                      onClick={() => { resetEmployeForm(); setOpenEmployeDialog(true); }}
                      sx={{ mt: 2 }}
                    >
                      Ajouter un employé
                    </Button>
                  </Box>
                ) : (
                  <EmployesTable 
                    employes={employes} 
                    typeLabels={typeEmployeLabels} 
                    onEdit={openEditEmploye} 
                    onDelete={handleDeleteEmploye}
                    formatCurrency={formatCurrency}
                  />
                )}
              </TabPanel>

              {/* Tab 3 - Matériel */}
              <TabPanel value={tabValue} index={3}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Chip label={`${materielStock.length} articles`} color="primary" />
                    <Chip label={`Stock: ${formatCurrency(stockValeur)}`} variant="outlined" />
                  </Box>
                  <Button 
                    variant="contained" 
                    startIcon={<Add />} 
                    onClick={() => { resetMaterielForm(); setOpenMaterielDialog(true); }}
                    sx={{ borderRadius: 2, textTransform: 'none', bgcolor: '#f59e0b' }}
                    size="small"
                  >
                    Ajouter du matériel
                  </Button>
                </Box>

                {loadingMateriel ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                    <CircularProgress size={32} />
                  </Box>
                ) : materielStock.length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 6 }}>
                    <Inventory sx={{ fontSize: 48, color: '#cbd5e1' }} />
                    <Typography variant="body1" sx={{ mt: 2, color: '#64748b' }}>Aucun matériel en stock</Typography>
                    <Button 
                      variant="outlined" 
                      startIcon={<Add />} 
                      onClick={() => { resetMaterielForm(); setOpenMaterielDialog(true); }}
                      sx={{ mt: 2 }}
                    >
                      Ajouter du matériel
                    </Button>
                  </Box>
                ) : (
                  <MaterielTable 
                    materiel={materielStock} 
                    categorieLabels={categorieLabels}
                    onDelete={handleDeleteMateriel}
                    formatCurrency={formatCurrency}
                  />
                )}
              </TabPanel>

              {/* Tab 4 - Photos */}
              <TabPanel value={tabValue} index={4}>
                {photosList.length > 0 ? (
                  <PhotosGrid photos={photosList} batimentNom={batiment.nom} getImageUrl={getImageUrl} onImageClick={(idx: SetStateAction<number>) => { setSelectedImageIndex(idx); setOpenLightbox(true); }} />
                ) : (
                  <Box sx={{ textAlign: 'center', py: 6 }}>
                    <ImageNotSupported sx={{ fontSize: 48, color: '#cbd5e1' }} />
                    <Typography variant="body1" sx={{ mt: 2, color: '#64748b' }}>Aucune photo disponible</Typography>
                  </Box>
                )}
              </TabPanel>
            </Box>
          </Paper>

          {/* Dialog Employé */}
          <Dialog open={openEmployeDialog} onClose={() => setOpenEmployeDialog(false)} maxWidth="sm" fullWidth>
            <DialogTitle>{selectedEmploye ? 'Modifier l\'employé' : 'Ajouter un employé'}</DialogTitle>
            <DialogContent>
              <Stack spacing={2} sx={{ mt: 1 }}>
                <TextField
                  fullWidth
                  label="Nom"
                  value={employeForm.nom}
                  onChange={(e) => setEmployeForm({ ...employeForm, nom: e.target.value })}
                />
                <TextField
                  fullWidth
                  label="Prénom"
                  value={employeForm.prenom}
                  onChange={(e) => setEmployeForm({ ...employeForm, prenom: e.target.value })}
                />
                <TextField
                  fullWidth
                  label="Téléphone"
                  value={employeForm.telephone}
                  onChange={(e) => setEmployeForm({ ...employeForm, telephone: e.target.value })}
                />
                <TextField
                  fullWidth
                  label="Email"
                  value={employeForm.email}
                  onChange={(e) => setEmployeForm({ ...employeForm, email: e.target.value })}
                />
                <FormControl fullWidth>
                  <InputLabel>Type d'employé</InputLabel>
                  <Select
                    value={employeForm.type_employe}
                    label="Type d'employé"
                    onChange={(e) => setEmployeForm({ ...employeForm, type_employe: e.target.value as TypeEmploye })}
                  >
                    <MenuItem value="gardien">Gardien</MenuItem>
                    <MenuItem value="femme_de_menage">Femme de ménage</MenuItem>
                    <MenuItem value="jardinier">Jardinier</MenuItem>
                    <MenuItem value="technicien">Technicien</MenuItem>
                    <MenuItem value="agent_securite">Agent de sécurité</MenuItem>
                    <MenuItem value="comptable">Comptable</MenuItem>
                    <MenuItem value="autre">Autre</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  fullWidth
                  type="number"
                  label="Salaire de base (Ar)"
                  value={employeForm.salaire_base}
                  onChange={(e) => setEmployeForm({ ...employeForm, salaire_base: parseFloat(e.target.value) || 0 })}
                />
                <TextField
                  fullWidth
                  type="date"
                  label="Date d'embauche"
                  value={employeForm.date_embauche}
                  onChange={(e) => setEmployeForm({ ...employeForm, date_embauche: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                />
                <FormControl fullWidth>
                  <InputLabel>Statut</InputLabel>
                  <Select
                    value={employeForm.statut}
                    label="Statut"
                    onChange={(e) => setEmployeForm({ ...employeForm, statut: e.target.value as StatutEmploye })}
                  >
                    <MenuItem value="actif">Actif</MenuItem>
                    <MenuItem value="conge">Congé</MenuItem>
                    <MenuItem value="arret_maladie">Arrêt maladie</MenuItem>
                    <MenuItem value="termine">Terminé</MenuItem>
                  </Select>
                </FormControl>
              </Stack>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenEmployeDialog(false)} startIcon={<Cancel />}>Annuler</Button>
              <Button onClick={selectedEmploye ? handleUpdateEmploye : handleCreateEmploye} variant="contained" startIcon={<Save />} sx={{ bgcolor: '#059669' }}>
                {selectedEmploye ? 'Modifier' : 'Créer'}
              </Button>
            </DialogActions>
          </Dialog>

          {/* Dialog Matériel */}
          <Dialog open={openMaterielDialog} onClose={() => setOpenMaterielDialog(false)} maxWidth="sm" fullWidth>
            <DialogTitle>Ajouter du matériel</DialogTitle>
            <DialogContent>
              <Stack spacing={2} sx={{ mt: 1 }}>
                <TextField
                  fullWidth
                  label="Code article"
                  value={materielForm.code}
                  onChange={(e) => setMaterielForm({ ...materielForm, code: e.target.value })}
                  helperText="Code unique pour identifier l'article"
                />
                <TextField
                  fullWidth
                  label="Nom"
                  value={materielForm.nom}
                  onChange={(e) => setMaterielForm({ ...materielForm, nom: e.target.value })}
                />
                <FormControl fullWidth>
                  <InputLabel>Catégorie</InputLabel>
                  <Select
                    value={materielForm.categorie}
                    label="Catégorie"
                    onChange={(e) => setMaterielForm({ ...materielForm, categorie: e.target.value as CategorieMateriel })}
                  >
                    <MenuItem value="ampoule">Ampoules</MenuItem>
                    <MenuItem value="robinetterie">Robinetterie</MenuItem>
                    <MenuItem value="chasse_eau">Chasse d'eau</MenuItem>
                    <MenuItem value="joint">Joints</MenuItem>
                    <MenuItem value="flexible">Flexibles</MenuItem>
                    <MenuItem value="prise">Prises</MenuItem>
                    <MenuItem value="interrupteur">Interrupteurs</MenuItem>
                    <MenuItem value="poignee">Poignées</MenuItem>
                    <MenuItem value="vitre">Vitres</MenuItem>
                    <MenuItem value="carrelage">Carrelage</MenuItem>
                    <MenuItem value="peinture">Peinture</MenuItem>
                    <MenuItem value="autre">Autre</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  fullWidth
                  type="number"
                  label="Quantité en stock"
                  value={materielForm.quantite_stock}
                  onChange={(e) => setMaterielForm({ ...materielForm, quantite_stock: parseFloat(e.target.value) || 0 })}
                />
                <FormControl fullWidth>
                  <InputLabel>Unité</InputLabel>
                  <Select
                    value={materielForm.unite}
                    label="Unité"
                    onChange={(e) => setMaterielForm({ ...materielForm, unite: e.target.value })}
                  >
                    <MenuItem value="piece">Pièce</MenuItem>
                    <MenuItem value="metre">Mètre</MenuItem>
                    <MenuItem value="metre_carre">Mètre carré</MenuItem>
                    <MenuItem value="kilogramme">Kilogramme</MenuItem>
                    <MenuItem value="litre">Litre</MenuItem>
                    <MenuItem value="rouleau">Rouleau</MenuItem>
                    <MenuItem value="boite">Boîte</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  fullWidth
                  type="number"
                  label="Prix unitaire d'achat (Ar)"
                  value={materielForm.prix_unitaire_achat}
                  onChange={(e) => setMaterielForm({ ...materielForm, prix_unitaire_achat: parseFloat(e.target.value) || 0 })}
                />
              </Stack>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenMaterielDialog(false)} startIcon={<Cancel />}>Annuler</Button>
              <Button onClick={handleCreateMateriel} variant="contained" startIcon={<Save />} sx={{ bgcolor: '#f59e0b' }}>
                Ajouter
              </Button>
            </DialogActions>
          </Dialog>

          {/* Lightbox */}
          <Dialog open={openLightbox} onClose={() => setOpenLightbox(false)} maxWidth="lg" fullWidth>
            <DialogContent sx={{ p: 0, bgcolor: '#000', position: 'relative', minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <MuiIconButton 
                onClick={() => setOpenLightbox(false)} 
                sx={{ position: 'absolute', top: 10, right: 10, zIndex: 10, bgcolor: 'rgba(0,0,0,0.5)', color: '#fff' }}
              >
                <Close />
              </MuiIconButton>
              {photosList[selectedImageIndex] && (
                <img 
                  src={getImageUrl(photosList[selectedImageIndex])} 
                  alt="Photo"
                  style={{ width: '100%', height: 'auto', maxHeight: '85vh', objectFit: 'contain' }}
                />
              )}
              <Box sx={{ position: 'absolute', bottom: 20, left: 0, right: 0, textAlign: 'center' }}>
                <Typography variant="caption" sx={{ color: '#fff', bgcolor: 'rgba(0,0,0,0.5)', px: 2, py: 0.5, borderRadius: 2 }}>
                  {selectedImageIndex + 1} / {photosList.length}
                </Typography>
              </Box>
            </DialogContent>
          </Dialog>
        </Container>
      </Box>
    </Box>
  );
}

// Composants réutilisables
function StatCard({ icon, label, value, color }: { icon: JSX.Element; label: string; value: string | number; color: string }) {
  return (
    <Paper sx={{ p: 2, textAlign: 'center', borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
      <Box sx={{ mb: 1, color }}>{icon}</Box>
      <Typography variant="h6" sx={{ fontWeight: 700, color: '#0f172a' }}>{value}</Typography>
      <Typography variant="caption" sx={{ color: '#64748b' }}>{label}</Typography>
    </Paper>
  );
}

function InfoItem({ icon, label, value }: { icon: JSX.Element; label: string; value: string | number }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
      <Box sx={{ color: '#94a3b8', display: 'flex', alignItems: 'center', minWidth: 32 }}>{icon}</Box>
      <Typography variant="caption" sx={{ color: '#64748b', minWidth: 120 }}>{label}</Typography>
      <Typography variant="body2" sx={{ fontWeight: 500, color: '#0f172a' }}>{value || '-'}</Typography>
    </Box>
  );
}

function LogementsTable({ logements, onView, getStatutChip, formatCurrency }: any) {
  return (
    <TableContainer component={Paper} sx={{ borderRadius: 2, border: '1px solid #e2e8f0', boxShadow: 'none' }}>
      <Table size="medium">
        <TableHead sx={{ bgcolor: '#f8fafc' }}>
          <TableRow>
            <TableCell sx={{ fontWeight: 600 }}>N° logement</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Surface</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Pièces</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Loyer</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Statut</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Locataire</TableCell>
            <TableCell align="center" sx={{ fontWeight: 600 }}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {logements.map((logement: Logement) => {
            const statut = getStatutChip(logement.statut);
            return (
              <TableRow key={logement.id} hover>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{logement.numero}</Typography>
                </TableCell>
                <TableCell>{logement.type_logement || '-'}</TableCell>
                <TableCell>{logement.surface} m²</TableCell>
                <TableCell>{logement.nb_pieces} pièces</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#059669' }}>{formatCurrency(logement.loyer_mensuel)}</TableCell>
                <TableCell>
                  <Chip label={statut.label} size="small" sx={{ bgcolor: statut.bg, color: statut.color }} />
                </TableCell>
                <TableCell>
                  {logement.locataire_nom ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar sx={{ width: 28, height: 28, bgcolor: '#e2e8f0', fontSize: '0.7rem' }}>
                        {logement.locataire_nom?.[0]}
                      </Avatar>
                      <Typography variant="caption">{logement.locataire_nom}</Typography>
                    </Box>
                  ) : (
                    <Typography variant="caption" color="text.secondary">-</Typography>
                  )}
                </TableCell>
                <TableCell align="center">
                  <Tooltip title="Voir détails">
                    <IconButton size="small" onClick={() => onView(logement.id)}>
                      <Visibility fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function EmployesTable({ employes, typeLabels, onEdit, onDelete, formatCurrency }: any) {
  return (
    <TableContainer component={Paper} sx={{ borderRadius: 2, border: '1px solid #e2e8f0', boxShadow: 'none' }}>
      <Table size="medium">
        <TableHead sx={{ bgcolor: '#f8fafc' }}>
          <TableRow>
            <TableCell sx={{ fontWeight: 600 }}>Nom & Prénom</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Téléphone</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Salaire</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Date embauche</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Statut</TableCell>
            <TableCell align="center" sx={{ fontWeight: 600 }}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {employes.map((employe: Employe) => {
            const type = typeLabels[employe.type_employe] || { label: employe.type_employe, icon: <Work />, color: '#64748b' };
            return (
              <TableRow key={employe.id} hover>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>{employe.prenom} {employe.nom}</Typography>
                </TableCell>
                <TableCell>
                  <Chip 
                    label={type.label} 
                    size="small" 
                    icon={type.icon}
                    sx={{ bgcolor: `${type.color}15`, color: type.color, borderRadius: 1 }} 
                  />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Phone sx={{ fontSize: 12, color: '#94a3b8' }} />
                    <Typography variant="caption">{employe.telephone}</Typography>
                  </Box>
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#059669' }}>{formatCurrency(employe.salaire_base)}</TableCell>
                <TableCell>{new Date(employe.date_embauche).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Chip 
                    label={employe.statut === 'actif' ? 'Actif' : employe.statut === 'conge' ? 'Congé' : employe.statut} 
                    size="small"
                    sx={{ 
                      bgcolor: employe.statut === 'actif' ? '#f0fdf4' : employe.statut === 'conge' ? '#fffbeb' : '#fef2f2',
                      color: employe.statut === 'actif' ? '#22c55e' : employe.statut === 'conge' ? '#f59e0b' : '#ef4444'
                    }}
                  />
                </TableCell>
                <TableCell align="center">
                  <Tooltip title="Modifier">
                    <IconButton size="small" onClick={() => onEdit(employe)} sx={{ mr: 1 }}>
                      <Edit fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Supprimer">
                    <IconButton size="small" onClick={() => onDelete(employe.id)} color="error">
                      <Delete fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function MaterielTable({ materiel, categorieLabels, onDelete, formatCurrency }: any) {
  return (
    <TableContainer component={Paper} sx={{ borderRadius: 2, border: '1px solid #e2e8f0', boxShadow: 'none' }}>
      <Table size="medium">
        <TableHead sx={{ bgcolor: '#f8fafc' }}>
          <TableRow>
            <TableCell sx={{ fontWeight: 600 }}>Code</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Nom</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Catégorie</TableCell>
            <TableCell align="center" sx={{ fontWeight: 600 }}>Quantité</TableCell>
            <TableCell align="right" sx={{ fontWeight: 600 }}>Prix unitaire</TableCell>
            <TableCell align="right" sx={{ fontWeight: 600 }}>Valeur totale</TableCell>
            <TableCell align="center" sx={{ fontWeight: 600 }}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {materiel.map((item: MaterielStock) => {
            const valeurTotale = (item.prix_unitaire_achat || 0) * item.quantite_stock;
            const alerte = item.quantite_stock <= (item.quantite_minimale || 1);
            return (
              <TableRow key={item.id} hover sx={{ bgcolor: alerte ? '#fef2f2' : 'inherit' }}>
                <TableCell>
                  <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>{item.code}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>{item.nom}</Typography>
                </TableCell>
                <TableCell>
                  <Chip label={categorieLabels[item.categorie] || item.categorie} size="small" />
                </TableCell>
                <TableCell align="center">
                  <Badge badgeContent={alerte ? 'Stock bas' : 0} color="error">
                    <Typography variant="body2" sx={{ fontWeight: alerte ? 700 : 400, color: alerte ? '#ef4444' : 'inherit' }}>
                      {item.quantite_stock} {item.unite}
                    </Typography>
                  </Badge>
                </TableCell>
                <TableCell align="right">{formatCurrency(item.prix_unitaire_achat)}</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600, color: '#059669' }}>{formatCurrency(valeurTotale)}</TableCell>
                <TableCell align="center">
                  <Tooltip title="Supprimer">
                    <IconButton size="small" onClick={() => onDelete(item.id)} color="error">
                      <Delete fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function PhotosGrid({ photos, batimentNom, getImageUrl, onImageClick }: any) {
  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', md: 'repeat(4, 1fr)' }, gap: 1.5 }}>
      {photos.map((photo: string, idx: number) => (
        <Box 
          key={idx}
          sx={{ 
            position: 'relative', 
            aspectRatio: '16/9', 
            borderRadius: 2, 
            overflow: 'hidden',
            cursor: 'pointer',
            transition: '0.2s',
            '&:hover': { transform: 'scale(1.02)', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }
          }}
          onClick={() => onImageClick(idx)}
        >
          <img 
            src={getImageUrl(photo)} 
            alt={`${batimentNom} - ${idx + 1}`}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/400x225?text=Image+non+disponible'; }}
          />
          <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, bgcolor: 'rgba(0,0,0,0.5)', p: 0.5 }}>
            <Typography variant="caption" sx={{ color: '#fff', display: 'block', textAlign: 'center' }}>Photo {idx + 1}</Typography>
          </Box>
        </Box>
      ))}
    </Box>
  );
}

// Composant pour l'icône Agriculture (si non importé)
function Agriculture(props: any) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M12 2v4M8 8l-4 4M16 8l4 4M3 16h18M5 20h14M12 12v6" stroke="currentColor" strokeLinecap="round"/>
      <circle cx="12" cy="16" r="2" stroke="currentColor"/>
    </svg>
  );
}