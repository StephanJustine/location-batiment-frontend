// 'use client';

// import React, { useState, useEffect, JSX } from 'react';
// import {
//   Box, Button, Card, CardContent, Typography,
//   Toolbar, Container, Chip, Fade, CircularProgress,
//   Paper, Alert, Grid, IconButton,
//   Tooltip, LinearProgress, Tabs, Tab, Badge,
//   TablePagination, Stack, Skeleton, Avatar, Divider,
//   Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
//   Dialog, DialogTitle, DialogContent, DialogActions,
//   Menu, MenuItem, ListItemIcon, ListItemText,
//   TextField, InputAdornment, FormControl, InputLabel, Select
// } from '@mui/material';
// import { 
//   Add, Refresh, AttachMoney, CheckCircle,
//   Schedule, Warning, Receipt, ReceiptLong, 
//   Assessment, ChevronLeft, ChevronRight, People, 
//   Payment, TrendingUp, Close, FilterList, 
//   Download, Print, Email, MoreVert, Search,
//   WaterDrop, ElectricBolt, Apartment, Cancel
// } from '@mui/icons-material';
// import { useRouter } from 'next/navigation';
// import Sidebar from '@/components/layout/Sidebar';
// import Header from '@/components/layout/Header';
// import { paiementGroupService } from '@/services/paiementGroupService';
// import { paiementService, PaiementParLocataire } from '@/services/paiementService';
// import { PaiementMensuel, PaiementGlobalStats } from '@/types/paiementGroup';
// import PaiementForm from '@/components/paiements/PaiementForm';
// import { formatCurrency } from '@/utils/formatters';

// interface TabPanelProps {
//   children?: React.ReactNode;
//   index: number;
//   value: number;
// }

// function TabPanel({ children, index, value }: TabPanelProps) {
//   return (
//     <Box sx={{ display: value === index ? 'block' : 'none', mt: 2 }}>
//       {children}
//     </Box>
//   );
// }

// function StatCard({ label, value, icon, color, subtext }: { label: string; value: string | number; icon: JSX.Element; color: string; subtext?: string }) {
//   return (
//     <Paper sx={{ p: 1.5, borderRadius: 2, boxShadow: 'none', border: '1px solid #e2e8f0' }}>
//       <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
//         <Box sx={{ color }}>{icon}</Box>
//         <Typography variant="caption" color="text.secondary">{label}</Typography>
//       </Box>
//       <Typography variant="h6" sx={{ fontWeight: 700 }}>{value}</Typography>
//       {subtext && <Typography variant="caption" color="text.secondary">{subtext}</Typography>}
//     </Paper>
//   );
// }

// function StatsRow({ label, value, color }: { label: string; value: string | number; color?: string }) {
//   return (
//     <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//       <Typography variant="body2" color="text.secondary">{label}</Typography>
//       <Typography variant="body2" sx={{ fontWeight: 600, color: color || '#0f172a' }}>{value}</Typography>
//     </Box>
//   );
// }

// function InfoRow({ label, value }: { label: string; value: string }) {
//   return (
//     <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
//       <Typography variant="caption" color="text.secondary">{label}</Typography>
//       <Typography variant="caption" sx={{ fontWeight: 500 }}>{value}</Typography>
//     </Box>
//   );
// }

// export default function PaiementsPage() {
//   const router = useRouter();
//   const [mobileOpen, setMobileOpen] = useState(false);
//   const [tab, setTab] = useState(0);
//   const [loading, setLoading] = useState(false);
//   const [showForm, setShowForm] = useState(false);
//   const [annee, setAnnee] = useState(new Date().getFullYear());
//   const [paiementsGroup, setPaiementsGroup] = useState<PaiementMensuel[]>([]);
//   const [globalStats, setGlobalStats] = useState<PaiementGlobalStats | null>(null);
//   const [impayes, setImpayes] = useState<any[]>([]);
//   const [paiementsParLocataire, setPaiementsParLocataire] = useState<PaiementParLocataire[]>([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filterType, setFilterType] = useState('all');
//   const [success, setSuccess] = useState('');
//   const [error, setError] = useState('');
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(12);
//   const [openLocataireDetail, setOpenLocataireDetail] = useState(false);
//   const [selectedLocataire, setSelectedLocataire] = useState<PaiementParLocataire | null>(null);
//   const [detailsLoading, setDetailsLoading] = useState(false);
//   const [relevesJIRAMA, setRelevesJIRAMA] = useState<any[]>([]);
//   const [loadingReleves, setLoadingReleves] = useState(false);

//   useEffect(() => {
//     fetchData();
//     fetchImpayes();
//     fetchPaiementsParLocataire();
//   }, [annee]);

//   const fetchData = async () => {
//     setLoading(true);
//     try {
//       const [grouped, stats] = await Promise.all([
//         paiementGroupService.getGroupedByMonth(annee),
//         paiementGroupService.getGlobalStats()
//       ]);
//       setPaiementsGroup(Array.isArray(grouped) ? grouped : []);
//       setGlobalStats(stats);
//     } catch (err) {
//       setError('Erreur lors du chargement');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchImpayes = async () => {
//     try {
//       const data = await paiementGroupService.getImpayes();
//       setImpayes(Array.isArray(data) ? data : []);
//     } catch (err) {
//       console.error('Erreur:', err);
//     }
//   };

//   const fetchPaiementsParLocataire = async () => {
//     try {
//       const data = await paiementService.getGroupedByLocataire(annee);
//       // Filtrer les doublons par locataire_id
//       const uniqueData = (Array.isArray(data) ? data : []).filter((item, index, self) =>
//         index === self.findIndex((t) => t.locataire_id === item.locataire_id)
//       );
//       setPaiementsParLocataire(uniqueData);
//     } catch (err) {
//       console.error('Erreur chargement paiements par locataire:', err);
//       setPaiementsParLocataire([]);
//     }
//   };

//   const fetchRelevesJIRAMA = async () => {
//     setLoadingReleves(true);
//     try {
//       // Appel API pour les relevés JIRAMA
//       const response = await paiementService.getRelevesJIRAMA(annee);
//       setRelevesJIRAMA(Array.isArray(response) ? response : []);
//     } catch (err) {
//       console.error('Erreur chargement relevés JIRAMA:', err);
//     } finally {
//       setLoadingReleves(false);
//     }
//   };

//   const handleOpenLocataireDetail = async (locataire: PaiementParLocataire) => {
//     setSelectedLocataire(locataire);
//     setOpenLocataireDetail(true);
    
//     if (!locataire.paiements_mensuels && locataire.locataire_id) {
//       setDetailsLoading(true);
//       try {
//         const details = await paiementService.getByLocataire(locataire.locataire_id, annee);
//         if (details && details.paiements_mensuels) {
//           setSelectedLocataire(prev => prev ? { ...prev, paiements_mensuels: details.paiements_mensuels } : prev);
//         }
//       } catch (err) {
//         console.error('Erreur chargement détails:', err);
//       } finally {
//         setDetailsLoading(false);
//       }
//     }
//   };

//   const getMonthStatus = (estComplet: boolean, montantPaye: number) => {
//     if (estComplet) return { label: 'Payé', color: '#22c55e', bg: '#f0fdf4' };
//     if (montantPaye > 0) return { label: 'Partiel', color: '#f59e0b', bg: '#fffbeb' };
//     return { label: 'Impayé', color: '#ef4444', bg: '#fef2f2' };
//   };

//   const totalImpayesMontant = impayes.reduce((sum: number, i: any) => sum + (i.montant_restant || 0), 0);
//   const totalPayeAnnee = paiementsGroup.reduce((sum, m) => sum + (m.montant_paye || 0), 0);
//   const totalDuAnnee = paiementsGroup.reduce((sum, m) => sum + (m.montant_du || 0), 0);
//   const tauxRecouvrement = totalDuAnnee > 0 ? Math.round((totalPayeAnnee / totalDuAnnee) * 100) : 0;

//   // Filtrer les locataires
//   const filteredLocataires = paiementsParLocataire.filter(locataire => {
//     const matchesSearch = searchTerm === '' || 
//       `${locataire.locataire_nom} ${locataire.locataire_prenom}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       locataire.logement_numero?.toLowerCase().includes(searchTerm.toLowerCase());
    
//     if (filterType === 'paye') return matchesSearch && locataire.montant_paye >= (locataire.loyer_mensuel + (locataire.charges_mensuelles || 0)) * 11;
//     if (filterType === 'impaye') return matchesSearch && locataire.mois_impayes > 6;
//     if (filterType === 'partiel') return matchesSearch && locataire.mois_impayes > 0 && locataire.mois_impayes <= 6;
//     return matchesSearch;
//   });

//   if (loading) {
//     return (
//       <Box sx={{ display: 'flex', bgcolor: '#f8fafc', minHeight: '100vh' }}>
//         <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
//         <Box component="main" sx={{ flexGrow: 1 }}>
//           <Header onMenuClick={() => setMobileOpen(!mobileOpen)} />
//           <Toolbar />
//           <Container maxWidth="xl" sx={{ px: 3, py: 3 }}>
//             <Skeleton variant="rectangular" height={80} sx={{ mb: 3, borderRadius: 2 }} />
//             <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 2 }} />
//           </Container>
//         </Box>
//       </Box>
//     );
//   }

//   return (
//     <Box sx={{ display: 'flex', bgcolor: '#f8fafc', minHeight: '100vh' }}>
//       <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
//       <Box component="main" sx={{ flexGrow: 1 }}>
//         <Header onMenuClick={() => setMobileOpen(!mobileOpen)} />
//         <Toolbar />
//         <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3 }, py: 2.5 }}>
//           {/* En-tête */}
//           <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5, flexWrap: 'wrap', gap: 1.5 }}>
//             <Box>
//               <Typography variant="h5" sx={{ fontWeight: 700 }}>Gestion des paiements</Typography>
//               <Typography variant="caption" color="text.secondary">Suivi des loyers, charges et JIRAMA</Typography>
//             </Box>
//             <Box sx={{ display: 'flex', gap: 1 }}>
//               <Button variant="outlined" size="small" startIcon={<Refresh />} onClick={() => { fetchData(); fetchImpayes(); fetchPaiementsParLocataire(); }} sx={{ borderRadius: 2, textTransform: 'none' }}>
//                 Rafraîchir
//               </Button>
//               {!showForm && (
//                 <Button variant="contained" size="small" startIcon={<Add />} onClick={() => setShowForm(true)} sx={{ borderRadius: 2, textTransform: 'none', bgcolor: '#059669', '&:hover': { bgcolor: '#047857' } }}>
//                   Nouveau paiement
//                 </Button>
//               )}
//             </Box>
//           </Box>

//           {/* Stats principales */}
//           <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2,1fr)', sm: 'repeat(4,1fr)', md: 'repeat(6,1fr)' }, gap: 1.5, mb: 2.5 }}>
//             <StatCard label="Total dû" value={formatCurrency(totalDuAnnee)} icon={<AttachMoney />} color="#059669" />
//             <StatCard label="Total payé" value={formatCurrency(totalPayeAnnee)} icon={<CheckCircle />} color="#22c55e" />
//             <StatCard label="Reste à payer" value={formatCurrency(totalDuAnnee - totalPayeAnnee)} icon={<Warning />} color="#ef4444" />
//             <StatCard label="Taux recouvrement" value={`${tauxRecouvrement}%`} icon={<TrendingUp />} color="#3b82f6" />
//             <StatCard label="Mois traités" value={`${paiementsGroup.filter(m => m.est_complet).length}/12`} icon={<Receipt />} color="#8b5cf6" />
//             <StatCard label="Locataires" value={paiementsParLocataire.length} icon={<People />} color="#ec489a" />
//           </Box>

//           {/* Formulaire */}
//           {showForm && (
//             <Fade in={showForm}>
//               <Box sx={{ mb: 2.5 }}>
//                 <PaiementForm 
//                   onSubmit={async () => { 
//                     await fetchData(); 
//                     await fetchImpayes(); 
//                     await fetchPaiementsParLocataire();
//                     setShowForm(false); 
//                     setSuccess('Paiement enregistré avec succès');
//                     setTimeout(() => setSuccess(''), 3000);
//                   }} 
//                   onCancel={() => setShowForm(false)} 
//                   loading={loading} 
//                 />
//               </Box>
//             </Fade>
//           )}

//           {/* Messages */}
//           {success && <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }} onClose={() => setSuccess('')}>{success}</Alert>}
//           {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }} onClose={() => setError('')}>{error}</Alert>}

//           {/* Tabs */}
//           <Paper sx={{ borderRadius: 2, overflow: 'hidden', boxShadow: 'none', border: '1px solid #e2e8f0' }}>
//             <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ borderBottom: 1, borderColor: '#e2e8f0', bgcolor: '#fff', minHeight: 44 }}>
//               <Tab icon={<ReceiptLong sx={{ fontSize: 18 }} />} iconPosition="start" label="Vue mensuelle" sx={{ textTransform: 'none', fontWeight: 500 }} />
//               <Tab icon={<People sx={{ fontSize: 18 }} />} iconPosition="start" label="Par locataire" sx={{ textTransform: 'none', fontWeight: 500 }} />
//               <Tab icon={<Warning sx={{ fontSize: 18 }} />} iconPosition="start" label={
//                 <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
//                   Impayés
//                   {impayes.length > 0 && <Badge badgeContent={impayes.length} color="error" sx={{ '& .MuiBadge-badge': { fontSize: '0.6rem', height: 16, minWidth: 16 } }} />}
//                 </Box>
//               } sx={{ textTransform: 'none', fontWeight: 500 }} />
//               <Tab icon={<WaterDrop sx={{ fontSize: 18 }} />} iconPosition="start" label="JIRAMA" sx={{ textTransform: 'none', fontWeight: 500 }} />
//               <Tab icon={<Assessment sx={{ fontSize: 18 }} />} iconPosition="start" label="Statistiques" sx={{ textTransform: 'none', fontWeight: 500 }} />
//             </Tabs>

//             <Box sx={{ p: 2.5, bgcolor: '#fff' }}>
//               {/* Tab 0: Vue mensuelle */}
//               <TabPanel value={tab} index={0}>
//                 <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1, mb: 2.5 }}>
//                   <IconButton onClick={() => setAnnee(annee - 1)} size="small" sx={{ bgcolor: '#f1f5f9', borderRadius: 1 }}>
//                     <ChevronLeft fontSize="small" />
//                   </IconButton>
//                   <Typography variant="h6" sx={{ fontWeight: 600 }}>{annee}</Typography>
//                   <IconButton onClick={() => setAnnee(annee + 1)} size="small" sx={{ bgcolor: '#f1f5f9', borderRadius: 1 }}>
//                     <ChevronRight fontSize="small" />
//                   </IconButton>
//                 </Box>

//                 {paiementsGroup.length === 0 ? (
//                   <Box sx={{ textAlign: 'center', py: 6 }}>
//                     <Receipt sx={{ fontSize: 48, color: '#cbd5e1' }} />
//                     <Typography variant="body2" color="text.secondary">Aucune donnée pour {annee}</Typography>
//                   </Box>
//                 ) : (
//                   <>
//                     <Grid container spacing={1.5}>
//                       {paiementsGroup.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((month) => {
//                         const status = getMonthStatus(month.est_complet, month.montant_paye);
//                         const pourcentage = month.montant_du > 0 ? (month.montant_paye / month.montant_du) * 100 : 0;
//                         return (
//                           <Grid size={{ xs: 6, sm: 4, md: 3, lg: 2 }} key={`month-${month.mois}-${month.annee}`}>
//                             <Card 
//                               sx={{ 
//                                 borderRadius: 2, 
//                                 border: '1px solid #e2e8f0', 
//                                 boxShadow: 'none', 
//                                 cursor: 'pointer', 
//                                 transition: '0.2s', 
//                                 '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }
//                               }} 
//                               onClick={() => router.push(`/paiements/mois/${month.annee}/${month.mois}`)}
//                             >
//                               <CardContent sx={{ p: 1.5, textAlign: 'center' }}>
//                                 <Typography variant="body2" sx={{ fontWeight: 600 }}>{month.mois_nom.substring(0, 3)}</Typography>
//                                 <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: '0.85rem' }}>{formatCurrency(month.montant_paye)}</Typography>
//                                 <Typography variant="caption" sx={{ color: '#94a3b8', fontSize: '0.6rem' }}>/ {formatCurrency(month.montant_du)}</Typography>
//                                 <LinearProgress variant="determinate" value={pourcentage} sx={{ height: 3, borderRadius: 2, my: 1, bgcolor: '#e2e8f0' }} />
//                                 <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5, mt: 0.5 }}>
//                                   <Tooltip title="Locataires">
//                                     <Chip icon={<People sx={{ fontSize: 10 }} />} label={month.nombre_locataires} size="small" variant="outlined" sx={{ height: 18, fontSize: '0.55rem' }} />
//                                   </Tooltip>
//                                   <Tooltip title="Paiements">
//                                     <Chip icon={<Payment sx={{ fontSize: 10 }} />} label={month.nombre_paiements} size="small" variant="outlined" sx={{ height: 18, fontSize: '0.55rem' }} />
//                                   </Tooltip>
//                                 </Box>
//                                 <Chip label={status.label} size="small" sx={{ mt: 1, height: 20, fontSize: '0.6rem', bgcolor: status.bg, color: status.color }} />
//                               </CardContent>
//                             </Card>
//                           </Grid>
//                         );
//                       })}
//                     </Grid>
//                     {paiementsGroup.length > rowsPerPage && (
//                       <TablePagination 
//                         rowsPerPageOptions={[12, 24, 36]} 
//                         component="div" 
//                         count={paiementsGroup.length} 
//                         rowsPerPage={rowsPerPage} 
//                         page={page} 
//                         onPageChange={(_, p) => setPage(p)} 
//                         onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }} 
//                         sx={{ mt: 2, border: 'none' }} 
//                       />
//                     )}
//                   </>
//                 )}
//               </TabPanel>

//               {/* Tab 1: Par locataire */}
//               <TabPanel value={tab} index={1}>
//                 {/* Filtres */}
//                 <Box sx={{ display: 'flex', gap: 2, mb: 2.5, flexWrap: 'wrap' }}>
//                   <TextField
//                     size="small"
//                     placeholder="Rechercher un locataire..."
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                     sx={{ minWidth: 250 }}
//                     slotProps={{
//                       input: {
//                         startAdornment: (
//                           <InputAdornment position="start">
//                             <Search fontSize="small" />
//                           </InputAdornment>
//                         ),
//                       },
//                     }}
//                   />
//                   <FormControl size="small" sx={{ minWidth: 150 }}>
//                     <InputLabel>Situation</InputLabel>
//                     <Select
//                       value={filterType}
//                       label="Situation"
//                       onChange={(e) => setFilterType(e.target.value)}
//                     >
//                       <MenuItem value="all">Tous</MenuItem>
//                       <MenuItem value="paye">À jour</MenuItem>
//                       <MenuItem value="partiel">Partiel</MenuItem>
//                       <MenuItem value="impaye">Impayé</MenuItem>
//                     </Select>
//                   </FormControl>
//                 </Box>

//                 {filteredLocataires.length === 0 ? (
//                   <Box sx={{ textAlign: 'center', py: 6 }}>
//                     <People sx={{ fontSize: 48, color: '#cbd5e1' }} />
//                     <Typography variant="body2" color="text.secondary">Aucun locataire trouvé</Typography>
//                   </Box>
//                 ) : (
//                   <Stack spacing={1.5}>
//                     {filteredLocataires.map((locataire, index) => {
//                       const totalMensuel = locataire.loyer_mensuel + (locataire.charges_mensuelles || 0);
//                       const totalAnnuel = totalMensuel * 12;
//                       const taux = totalAnnuel > 0 ? (locataire.montant_paye / totalAnnuel) * 100 : 0;
//                       const uniqueKey = `${locataire.locataire_id}-${annee}-${index}`;
//                       return (
//                         <Card 
//                           key={uniqueKey}
//                           sx={{ 
//                             borderRadius: 2, 
//                             border: '1px solid #e2e8f0', 
//                             boxShadow: 'none',
//                             cursor: 'pointer',
//                             transition: '0.2s',
//                             '&:hover': { bgcolor: '#f8fafc' }
//                           }}
//                           onClick={() => handleOpenLocataireDetail(locataire)}
//                         >
//                           <CardContent sx={{ p: 2 }}>
//                             <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 1 }}>
//                               <Box>
//                                 <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
//                                   {locataire.locataire_nom} {locataire.locataire_prenom}
//                                 </Typography>
//                                 <Typography variant="caption" color="text.secondary">
//                                   {locataire.logement_numero} - {locataire.logement_type}
//                                 </Typography>
//                               </Box>
//                               <Box sx={{ textAlign: 'right' }}>
//                                 <Typography variant="caption" color="text.secondary">Loyer mensuel</Typography>
//                                 <Typography variant="body2" sx={{ fontWeight: 600, color: '#059669' }}>
//                                   {formatCurrency(totalMensuel)}
//                                 </Typography>
//                               </Box>
//                             </Box>

//                             <Box sx={{ mt: 1.5 }}>
//                               <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
//                                 <Typography variant="caption" color="text.secondary">
//                                   Payé {formatCurrency(locataire.montant_paye)} / {formatCurrency(totalAnnuel)}
//                                 </Typography>
//                                 <Typography variant="caption" sx={{ fontWeight: 500, color: taux >= 90 ? '#22c55e' : taux >= 50 ? '#f59e0b' : '#ef4444' }}>
//                                   {Math.round(taux)}%
//                                 </Typography>
//                               </Box>
//                               <LinearProgress variant="determinate" value={taux} sx={{ height: 4, borderRadius: 2 }} />
//                             </Box>

//                             <Box sx={{ display: 'flex', gap: 2, mt: 1.5 }}>
//                               <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
//                                 <CheckCircle sx={{ fontSize: 12, color: '#22c55e' }} />
//                                 <Typography variant="caption">{locataire.mois_payes || 0} mois payés</Typography>
//                               </Box>
//                               <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
//                                 <Warning sx={{ fontSize: 12, color: '#ef4444' }} />
//                                 <Typography variant="caption">{locataire.mois_impayes || 0} mois impayés</Typography>
//                               </Box>
//                             </Box>
//                           </CardContent>
//                         </Card>
//                       );
//                     })}
//                   </Stack>
//                 )}
//               </TabPanel>

//               {/* Tab 2: Impayés */}
//               <TabPanel value={tab} index={2}>
//                 {impayes.length === 0 ? (
//                   <Box sx={{ textAlign: 'center', py: 6 }}>
//                     <CheckCircle sx={{ fontSize: 48, color: '#22c55e' }} />
//                     <Typography variant="body1" sx={{ mt: 1, color: '#22c55e', fontWeight: 500 }}>Aucun impayé !</Typography>
//                     <Typography variant="caption" color="text.secondary">Tous les paiements sont à jour</Typography>
//                   </Box>
//                 ) : (
//                   <>
//                     <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, p: 1.5, bgcolor: '#fef2f2', borderRadius: 2, border: '1px solid #fecaca' }}>
//                       <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                         <Warning sx={{ color: '#ef4444' }} />
//                         <Typography variant="caption" sx={{ fontWeight: 600, color: '#ef4444' }}>Total impayés</Typography>
//                       </Box>
//                       <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#ef4444' }}>{formatCurrency(totalImpayesMontant)}</Typography>
//                       <Button size="small" variant="outlined" color="error" startIcon={<Email />}>Envoyer relance générale</Button>
//                     </Box>
//                     <Grid container spacing={1.5}>
//                       {impayes.map((impaye: any, idx: number) => (
//                         <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={`impaye-${impaye.mois}-${impaye.annee}-${idx}`}>
//                           <Card sx={{ borderRadius: 2, border: '1px solid #fecaca', cursor: 'pointer', transition: '0.2s', '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' } }} onClick={() => router.push(`/paiements/mois/${impaye.annee}/${impaye.mois}`)}>
//                             <CardContent sx={{ p: 1.5 }}>
//                               <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
//                                 <Typography variant="body2" sx={{ fontWeight: 600 }}>{impaye.mois_nom} {impaye.annee}</Typography>
//                                 <Chip label="Impayé" size="small" color="error" sx={{ height: 18, fontSize: '0.55rem' }} />
//                               </Box>
//                               <Typography variant="caption" color="text.secondary">Payé: {formatCurrency(impaye.montant_paye || 0)}</Typography>
//                               <Typography variant="caption" color="error" sx={{ display: 'block', fontWeight: 500 }}>Reste: {formatCurrency(impaye.montant_restant || 0)}</Typography>
//                               <LinearProgress variant="determinate" value={(impaye.montant_paye / impaye.montant_du) * 100} sx={{ height: 3, borderRadius: 2, mt: 1 }} />
//                             </CardContent>
//                           </Card>
//                         </Grid>
//                       ))}
//                     </Grid>
//                   </>
//                 )}
//               </TabPanel>

//               {/* Tab 3: JIRAMA */}
//               <TabPanel value={tab} index={3}>
//                 <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
//                   <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#059669' }}>Relevés Eau & Électricité</Typography>
//                   <Button size="small" variant="outlined" startIcon={<Refresh />} onClick={fetchRelevesJIRAMA}>
//                     Actualiser
//                   </Button>
//                 </Box>

//                 {loadingReleves ? (
//                   <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
//                     <CircularProgress size={24} />
//                   </Box>
//                 ) : relevesJIRAMA.length === 0 ? (
//                   <Box sx={{ textAlign: 'center', py: 6 }}>
//                     <WaterDrop sx={{ fontSize: 48, color: '#cbd5e1' }} />
//                     <Typography variant="body2" color="text.secondary">Aucun relevé JIRAMA pour {annee}</Typography>
//                     <Button variant="outlined" sx={{ mt: 2 }}>Ajouter un relevé</Button>
//                   </Box>
//                 ) : (
//                   <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 1.5 }}>
//                     <Table size="small">
//                       <TableHead sx={{ bgcolor: '#f8fafc' }}>
//                         <TableRow>
//                           <TableCell sx={{ fontWeight: 600 }}>Logement</TableCell>
//                           <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
//                           <TableCell sx={{ fontWeight: 600 }}>Période</TableCell>
//                           <TableCell sx={{ fontWeight: 600 }}>Index ancien</TableCell>
//                           <TableCell sx={{ fontWeight: 600 }}>Index nouveau</TableCell>
//                           <TableCell sx={{ fontWeight: 600 }}>Consommation</TableCell>
//                           <TableCell sx={{ fontWeight: 600 }}>Montant</TableCell>
//                           <TableCell sx={{ fontWeight: 600 }}>Statut</TableCell>
//                         </TableRow>
//                       </TableHead>
//                       <TableBody>
//                         {relevesJIRAMA.map((releve, idx) => (
//                           <TableRow key={idx} hover>
//                             <TableCell>{releve.logement_numero}</TableCell>
//                             <TableCell>
//                               <Chip 
//                                 size="small" 
//                                 icon={releve.type_releve === 'eau' ? <WaterDrop sx={{ fontSize: 12 }} /> : <ElectricBolt sx={{ fontSize: 12 }} />}
//                                 label={releve.type_releve === 'eau' ? 'Eau' : 'Électricité'} 
//                                 sx={{ height: 20, fontSize: '0.6rem' }} 
//                               />
//                             </TableCell>
//                             <TableCell>{releve.mois_nom} {releve.annee}</TableCell>
//                             <TableCell>{releve.index_ancien}</TableCell>
//                             <TableCell>{releve.index_nouveau}</TableCell>
//                             <TableCell>{releve.consommation} {releve.type_releve === 'eau' ? 'm³' : 'kWh'}</TableCell>
//                             <TableCell sx={{ fontWeight: 600, color: '#059669' }}>{formatCurrency(releve.montant)}</TableCell>
//                             <TableCell>
//                               <Chip 
//                                 label={releve.est_facture ? 'Facturé' : 'En attente'} 
//                                 size="small" 
//                                 sx={{ height: 18, fontSize: '0.55rem', bgcolor: releve.est_facture ? '#f0fdf4' : '#fffbeb', color: releve.est_facture ? '#22c55e' : '#f59e0b' }} 
//                               />
//                             </TableCell>
//                           </TableRow>
//                         ))}
//                       </TableBody>
//                     </Table>
//                   </TableContainer>
//                 )}
//               </TabPanel>

//               {/* Tab 4: Statistiques */}
//               <TabPanel value={tab} index={4}>
//                 <Grid container spacing={2}>
//                   <Grid size={{ xs: 12, md: 6 }}>
//                     <Card sx={{ borderRadius: 2, border: '1px solid #e2e8f0', boxShadow: 'none' }}>
//                       <CardContent sx={{ p: 2 }}>
//                         <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5, color: '#059669' }}>Récapitulatif annuel</Typography>
//                         <Stack spacing={1}>
//                           <StatsRow label="Total des loyers" value={formatCurrency(totalDuAnnee)} />
//                           <StatsRow label="Total payé" value={formatCurrency(totalPayeAnnee)} color="#22c55e" />
//                           <StatsRow label="Reste à payer" value={formatCurrency(totalDuAnnee - totalPayeAnnee)} color="#ef4444" />
//                           <Divider />
//                           <StatsRow label="Mois complets" value={`${paiementsGroup.filter(m => m.est_complet).length}/12`} />
//                           <StatsRow label="Mois partiels" value={`${paiementsGroup.filter(m => m.montant_paye > 0 && !m.est_complet).length}/12`} />
//                           <StatsRow label="Mois impayés" value={`${paiementsGroup.filter(m => m.montant_paye === 0).length}/12`} />
//                           <Divider />
//                           <StatsRow label="Taux de recouvrement" value={`${tauxRecouvrement}%`} />
//                           <StatsRow label="Nombre total de paiements" value={paiementsGroup.reduce((sum, m) => sum + (m.nombre_paiements || 0), 0)} />
//                           <StatsRow label="Locataires actifs" value={paiementsParLocataire.length} />
//                         </Stack>
//                       </CardContent>
//                     </Card>
//                   </Grid>

//                   <Grid size={{ xs: 12, md: 6 }}>
//                     <Card sx={{ borderRadius: 2, border: '1px solid #e2e8f0', boxShadow: 'none' }}>
//                       <CardContent sx={{ p: 2 }}>
//                         <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5, color: '#059669' }}>Par type de paiement</Typography>
//                         <Stack spacing={1}>
//                           <StatsRow label="Loyers" value={formatCurrency(paiementsGroup.reduce((sum, m) => sum + (m.montant_loyer || 0), 0))} />
//                           <StatsRow label="Charges" value={formatCurrency(paiementsGroup.reduce((sum, m) => sum + (m.montant_charges || 0), 0))} />
//                           <StatsRow label="Pénalités" value={formatCurrency(paiementsGroup.reduce((sum, m) => sum + (m.montant_penalites || 0), 0))} color="#f59e0b" />
//                         </Stack>
//                         <Divider sx={{ my: 1.5 }} />
//                         <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5, color: '#059669' }}>Performance</Typography>
//                         <Stack spacing={1}>
//                           <StatsRow label="Meilleur mois" value={paiementsGroup.reduce((max, m) => m.montant_paye > max.montant_paye ? m : max, paiementsGroup[0] || { montant_paye: 0 }).montant_paye} />
//                           <StatsRow label="Moyenne mensuelle" value={formatCurrency(totalPayeAnnee / 12)} />
//                         </Stack>
//                       </CardContent>
//                     </Card>
//                   </Grid>
//                 </Grid>
//               </TabPanel>
//             </Box>
//           </Paper>
//         </Container>

//         {/* Dialog détails locataire */}
//         <Dialog open={openLocataireDetail} onClose={() => setOpenLocataireDetail(false)} maxWidth="md" fullWidth>
//           {selectedLocataire && (
//             <>
//               <DialogTitle sx={{ p: 2, pb: 0 }}>
//                 <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                   <Box>
//                     <Typography variant="h6" sx={{ fontWeight: 600 }}>
//                       {selectedLocataire.locataire_nom} {selectedLocataire.locataire_prenom}
//                     </Typography>
//                     <Typography variant="caption" color="text.secondary">
//                       {selectedLocataire.logement_numero} - {selectedLocataire.logement_type}
//                     </Typography>
//                   </Box>
//                   <IconButton onClick={() => setOpenLocataireDetail(false)}>
//                     <Close />
//                   </IconButton>
//                 </Box>
//               </DialogTitle>
//               <DialogContent dividers sx={{ p: 2 }}>
//                 <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2, mb: 2 }}>
//                   <Card sx={{ borderRadius: 1.5, border: '1px solid #e2e8f0' }}>
//                     <CardContent sx={{ p: 1.5 }}>
//                       <Typography variant="caption" sx={{ fontWeight: 600 }}>Informations</Typography>
//                       <Divider sx={{ my: 1 }} />
//                       <Stack spacing={0.5}>
//                         <InfoRow label="Téléphone" value={selectedLocataire.locataire_telephone || '-'} />
//                         <InfoRow label="Email" value={selectedLocataire.locataire_email || '-'} />
//                         <InfoRow label="Adresse" value={selectedLocataire.locataire_adresse || '-'} />
//                       </Stack>
//                     </CardContent>
//                   </Card>
//                   <Card sx={{ borderRadius: 1.5, border: '1px solid #e2e8f0' }}>
//                     <CardContent sx={{ p: 1.5 }}>
//                       <Typography variant="caption" sx={{ fontWeight: 600 }}>Récapitulatif</Typography>
//                       <Divider sx={{ my: 1 }} />
//                       <Stack spacing={0.5}>
//                         <InfoRow label="Loyer mensuel" value={formatCurrency(selectedLocataire.loyer_mensuel)} />
//                         <InfoRow label="Charges" value={formatCurrency(selectedLocataire.charges_mensuelles || 0)} />
//                         <InfoRow label="Total mensuel" value={formatCurrency(selectedLocataire.loyer_mensuel + (selectedLocataire.charges_mensuelles || 0))} />
//                         <InfoRow label="Total payé (année)" value={formatCurrency(selectedLocataire.montant_paye)} />
//                         <InfoRow label="Solde" value={formatCurrency((selectedLocataire.loyer_mensuel + (selectedLocataire.charges_mensuelles || 0)) * 12 - selectedLocataire.montant_paye)} />
//                       </Stack>
//                     </CardContent>
//                   </Card>
//                 </Box>

//                 <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5 }}>Historique des paiements {annee}</Typography>
//                 {detailsLoading ? (
//                   <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
//                     <CircularProgress size={24} />
//                   </Box>
//                 ) : (
//                   <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 1.5 }}>
//                     <Table size="small">
//                       <TableHead sx={{ bgcolor: '#f8fafc' }}>
//                         <TableRow>
//                           <TableCell sx={{ fontWeight: 600 }}>Période</TableCell>
//                           <TableCell sx={{ fontWeight: 600 }}>Montant dû</TableCell>
//                           <TableCell sx={{ fontWeight: 600 }}>Payé</TableCell>
//                           <TableCell sx={{ fontWeight: 600 }}>Statut</TableCell>
//                           <TableCell align="center" sx={{ fontWeight: 600 }}>Action</TableCell>
//                         </TableRow>
//                       </TableHead>
//                       <TableBody>
//                         {(selectedLocataire.paiements_mensuels || []).map((p, idx) => {
//                           const status = p.est_complet ? 'Payé' : p.montant_paye > 0 ? 'Partiel' : 'Impayé';
//                           const statusColor = p.est_complet ? '#22c55e' : p.montant_paye > 0 ? '#f59e0b' : '#ef4444';
//                           return (
//                             <TableRow key={`${p.mois}-${p.annee}-${idx}`} hover>
//                               <TableCell>{p.mois_nom} {p.annee}</TableCell>
//                               <TableCell>{formatCurrency(p.montant_du)}</TableCell>
//                               <TableCell sx={{ fontWeight: 500 }}>{formatCurrency(p.montant_paye)}</TableCell>
//                               <TableCell>
//                                 <Chip label={status} size="small" sx={{ bgcolor: `${statusColor}15`, color: statusColor, height: 20, fontSize: '0.6rem' }} />
//                               </TableCell>
//                               <TableCell align="center">
//                                 <Button size="small" variant="outlined" onClick={() => router.push(`/paiements/mois/${p.annee}/${p.mois}?locataire=${selectedLocataire.locataire_id}`)}>
//                                   Détail
//                                 </Button>
//                               </TableCell>
//                             </TableRow>
//                           );
//                         })}
//                         {(!selectedLocataire.paiements_mensuels || selectedLocataire.paiements_mensuels.length === 0) && (
//                           <TableRow>
//                             <TableCell colSpan={5} align="center">
//                               <Typography variant="body2" color="text.secondary" sx={{ py: 3 }}>
//                                 Aucun paiement enregistré
//                               </Typography>
//                             </TableCell>
//                           </TableRow>
//                         )}
//                       </TableBody>
//                     </Table>
//                   </TableContainer>
//                 )}
//               </DialogContent>
//               <DialogActions sx={{ p: 2 }}>
//                 <Button onClick={() => setOpenLocataireDetail(false)} variant="outlined">Fermer</Button>
//                 <Button variant="contained" onClick={() => router.push(`/paiements/locataire/${selectedLocataire.locataire_id}`)} sx={{ bgcolor: '#059669' }}>
//                   Voir tous les paiements
//                 </Button>
//               </DialogActions>
//             </>
//           )}
//         </Dialog>
//       </Box>
//     </Box>
//   );
// }


'use client';

import React, { useState, useEffect, JSX } from 'react';
import {
  Box, Button, Card, CardContent, Typography,
  Toolbar, Container, Chip, Fade, CircularProgress,
  Paper, Alert, Grid, IconButton,
  Tooltip, LinearProgress, Tabs, Tab, Badge,
  TablePagination, Stack, Skeleton, Avatar, Divider,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Dialog, DialogTitle, DialogContent, DialogActions,
  Menu, MenuItem, ListItemIcon, ListItemText,
  TextField, InputAdornment, FormControl, InputLabel, Select,
  Accordion, AccordionSummary, AccordionDetails
} from '@mui/material';
import { 
  Add, Refresh, AttachMoney, CheckCircle,
  Schedule, Warning, Receipt, ReceiptLong, 
  Assessment, ChevronLeft, ChevronRight, People, 
  Payment, TrendingUp, Close, FilterList, 
  Download, Print, Email, MoreVert, Search,
  WaterDrop, ElectricBolt, Apartment, Cancel,
  ExpandMore, Visibility, CalendarMonth
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { paiementGroupService } from '@/services/paiementGroupService';
import { paiementService, PaiementParLocataire } from '@/services/paiementService';
import { PaiementMensuel, PaiementGlobalStats } from '@/types/paiementGroup';
import PaiementForm from '@/components/paiements/PaiementForm';
import { formatCurrency } from '@/utils/formatters';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel({ children, index, value }: TabPanelProps) {
  return (
    <Box sx={{ display: value === index ? 'block' : 'none', mt: 2 }}>
      {children}
    </Box>
  );
}

function StatCard({ label, value, icon, color, subtext }: { label: string; value: string | number; icon: JSX.Element; color: string; subtext?: string }) {
  return (
    <Paper sx={{ p: 1.5, borderRadius: 2, boxShadow: 'none', border: '1px solid #e2e8f0' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
        <Box sx={{ color }}>{icon}</Box>
        <Typography variant="caption" color="text.secondary">{label}</Typography>
      </Box>
      <Typography variant="h6" sx={{ fontWeight: 700 }}>{value}</Typography>
      {subtext && <Typography variant="caption" color="text.secondary">{subtext}</Typography>}
    </Paper>
  );
}

function StatsRow({ label, value, color }: { label: string; value: string | number; color?: string }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Typography variant="body2" color="text.secondary">{label}</Typography>
      <Typography variant="body2" sx={{ fontWeight: 600, color: color || '#0f172a' }}>{value}</Typography>
    </Box>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
      <Typography variant="caption" color="text.secondary">{label}</Typography>
      <Typography variant="caption" sx={{ fontWeight: 500 }}>{value}</Typography>
    </Box>
  );
}

export default function PaiementsPage() {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [tab, setTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [annee, setAnnee] = useState(new Date().getFullYear());
  const [paiementsGroup, setPaiementsGroup] = useState<PaiementMensuel[]>([]);
  const [globalStats, setGlobalStats] = useState<PaiementGlobalStats | null>(null);
  const [impayes, setImpayes] = useState<any[]>([]);
  const [paiementsParLocataire, setPaiementsParLocataire] = useState<PaiementParLocataire[]>([]);
  const [tousPaiements, setTousPaiements] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatut, setFilterStatut] = useState('all');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(12);
  const [openLocataireDetail, setOpenLocataireDetail] = useState(false);
  const [selectedLocataire, setSelectedLocataire] = useState<PaiementParLocataire | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [relevesJIRAMA, setRelevesJIRAMA] = useState<any[]>([]);
  const [loadingReleves, setLoadingReleves] = useState(false);
  const [monthPage, setMonthPage] = useState(0);
  const [monthRowsPerPage, setMonthRowsPerPage] = useState(12);

  useEffect(() => {
    fetchData();
    fetchImpayes();
    fetchPaiementsParLocataire();
    fetchAllPaiements();
  }, [annee]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [grouped, stats] = await Promise.all([
        paiementGroupService.getGroupedByMonth(annee),
        paiementGroupService.getGlobalStats()
      ]);
      setPaiementsGroup(Array.isArray(grouped) ? grouped : []);
      setGlobalStats(stats);
    } catch (err) {
      setError('Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  const fetchImpayes = async () => {
    try {
      const data = await paiementGroupService.getImpayes();
      setImpayes(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Erreur:', err);
    }
  };

  const fetchPaiementsParLocataire = async () => {
    try {
      const data = await paiementService.getGroupedByLocataire(annee);
      const uniqueData = (Array.isArray(data) ? data : []).filter((item, index, self) =>
        index === self.findIndex((t) => t.locataire_id === item.locataire_id)
      );
      setPaiementsParLocataire(uniqueData);
    } catch (err) {
      console.error('Erreur chargement paiements par locataire:', err);
      setPaiementsParLocataire([]);
    }
  };

  const fetchAllPaiements = async () => {
    try {
      const data = await paiementService.getAll({ limit: 500 });
      setTousPaiements(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Erreur chargement tous les paiements:', err);
      setTousPaiements([]);
    }
  };

  const fetchRelevesJIRAMA = async () => {
    setLoadingReleves(true);
    try {
      const response = await paiementService.getRelevesJIRAMA(annee);
      setRelevesJIRAMA(Array.isArray(response) ? response : []);
    } catch (err) {
      console.error('Erreur chargement relevés JIRAMA:', err);
    } finally {
      setLoadingReleves(false);
    }
  };

  const handleOpenLocataireDetail = async (locataire: PaiementParLocataire) => {
    setSelectedLocataire(locataire);
    setOpenLocataireDetail(true);
    
    if (!locataire.paiements_mensuels && locataire.locataire_id) {
      setDetailsLoading(true);
      try {
        const details = await paiementService.getByLocataire(locataire.locataire_id, annee);
        if (details && details.paiements_mensuels) {
          setSelectedLocataire(prev => prev ? { ...prev, paiements_mensuels: details.paiements_mensuels } : prev);
        }
      } catch (err) {
        console.error('Erreur chargement détails:', err);
      } finally {
        setDetailsLoading(false);
      }
    }
  };

  const getMonthStatus = (estComplet: boolean, montantPaye: number) => {
    if (estComplet) return { label: 'Payé', color: '#22c55e', bg: '#f0fdf4' };
    if (montantPaye > 0) return { label: 'Partiel', color: '#f59e0b', bg: '#fffbeb' };
    return { label: 'Impayé', color: '#ef4444', bg: '#fef2f2' };
  };

  const getPaiementStatus = (statut: string) => {
    const statusMap: Record<string, { label: string; color: string; bg: string }> = {
      'paye': { label: 'Payé', color: '#22c55e', bg: '#f0fdf4' },
      'en_attente': { label: 'En attente', color: '#f59e0b', bg: '#fffbeb' },
      'en_retard': { label: 'En retard', color: '#ef4444', bg: '#fef2f2' },
      'annule': { label: 'Annulé', color: '#6b7280', bg: '#f3f4f6' },
      'rembourse': { label: 'Remboursé', color: '#3b82f6', bg: '#eff6ff' }
    };
    return statusMap[statut] || { label: statut, color: '#6b7280', bg: '#f3f4f6' };
  };

  const totalImpayesMontant = impayes.reduce((sum: number, i: any) => sum + (i.montant_restant || 0), 0);
  const totalPayeAnnee = paiementsGroup.reduce((sum, m) => sum + (m.montant_paye || 0), 0);
  const totalDuAnnee = paiementsGroup.reduce((sum, m) => sum + (m.montant_du || 0), 0);
  const tauxRecouvrement = totalDuAnnee > 0 ? Math.round((totalPayeAnnee / totalDuAnnee) * 100) : 0;

  // Filtrer les paiements
  const filteredPaiements = tousPaiements.filter(p => {
    if (filterStatut !== 'all' && p.statut !== filterStatut) return false;
    return true;
  });

  // Filtrer les locataires
  const filteredLocataires = paiementsParLocataire.filter(locataire => {
    const matchesSearch = searchTerm === '' || 
      `${locataire.locataire_nom} ${locataire.locataire_prenom}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      locataire.logement_numero?.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterType === 'paye') return matchesSearch && locataire.montant_paye >= (locataire.loyer_mensuel + (locataire.charges_mensuelles || 0)) * 11;
    if (filterType === 'impaye') return matchesSearch && locataire.mois_impayes > 6;
    if (filterType === 'partiel') return matchesSearch && locataire.mois_impayes > 0 && locataire.mois_impayes <= 6;
    return matchesSearch;
  });

  const paginatedMonths = paiementsGroup.slice(monthPage * monthRowsPerPage, monthPage * monthRowsPerPage + monthRowsPerPage);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', bgcolor: '#f8fafc', minHeight: '100vh' }}>
        <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
        <Box component="main" sx={{ flexGrow: 1 }}>
          <Header onMenuClick={() => setMobileOpen(!mobileOpen)} />
          <Toolbar />
          <Container maxWidth="xl" sx={{ px: 3, py: 3 }}>
            <Skeleton variant="rectangular" height={80} sx={{ mb: 3, borderRadius: 2 }} />
            <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 2 }} />
          </Container>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', bgcolor: '#f8fafc', minHeight: '100vh' }}>
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Header onMenuClick={() => setMobileOpen(!mobileOpen)} />
        <Toolbar />
        <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3 }, py: 2.5 }}>
          {/* En-tête */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5, flexWrap: 'wrap', gap: 1.5 }}>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>Gestion des paiements</Typography>
              <Typography variant="caption" color="text.secondary">Suivi des loyers, charges et JIRAMA</Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button variant="outlined" size="small" startIcon={<Refresh />} onClick={() => { fetchData(); fetchImpayes(); fetchPaiementsParLocataire(); fetchAllPaiements(); }} sx={{ borderRadius: 2, textTransform: 'none' }}>
                Rafraîchir
              </Button>
              {/* {!showForm && (
                <Button variant="contained" size="small" startIcon={<Add />} onClick={() => setShowForm(true)} sx={{ borderRadius: 2, textTransform: 'none', bgcolor: '#059669', '&:hover': { bgcolor: '#047857' } }}>
                  Nouveau paiement
                </Button>
              )} */}
            </Box>
          </Box>

          {/* Stats principales */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2,1fr)', sm: 'repeat(4,1fr)', md: 'repeat(6,1fr)' }, gap: 1.5, mb: 2.5 }}>
            <StatCard label="Total dû" value={formatCurrency(totalDuAnnee)} icon={<AttachMoney />} color="#059669" />
            <StatCard label="Total payé" value={formatCurrency(totalPayeAnnee)} icon={<CheckCircle />} color="#22c55e" />
            <StatCard label="Reste à payer" value={formatCurrency(totalDuAnnee - totalPayeAnnee)} icon={<Warning />} color="#ef4444" />
            <StatCard label="Taux recouvrement" value={`${tauxRecouvrement}%`} icon={<TrendingUp />} color="#3b82f6" />
            <StatCard label="Mois traités" value={`${paiementsGroup.filter(m => m.est_complet).length}/12`} icon={<Receipt />} color="#8b5cf6" />
            <StatCard label="Locataires" value={paiementsParLocataire.length} icon={<People />} color="#ec489a" />
          </Box>

          {/* Formulaire */}
          {showForm && (
            <Fade in={showForm}>
              <Box sx={{ mb: 2.5 }}>
                <PaiementForm 
                  onSubmit={async () => { 
                    await fetchData(); 
                    await fetchImpayes(); 
                    await fetchPaiementsParLocataire();
                    await fetchAllPaiements();
                    setShowForm(false); 
                    setSuccess('Paiement enregistré avec succès');
                    setTimeout(() => setSuccess(''), 3000);
                  }} 
                  onCancel={() => setShowForm(false)} 
                  loading={loading} 
                />
              </Box>
            </Fade>
          )}

          {/* Messages */}
          {success && <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }} onClose={() => setSuccess('')}>{success}</Alert>}
          {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }} onClose={() => setError('')}>{error}</Alert>}

          {/* Tabs - 5 onglets */}
          <Paper sx={{ borderRadius: 2, overflow: 'hidden', boxShadow: 'none', border: '1px solid #e2e8f0' }}>
            <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ borderBottom: 1, borderColor: '#e2e8f0', bgcolor: '#fff', minHeight: 44 }}>
              <Tab icon={<CalendarMonth sx={{ fontSize: 18 }} />} iconPosition="start" label="Vue mensuelle" sx={{ textTransform: 'none', fontWeight: 500 }} />
              <Tab icon={<ReceiptLong sx={{ fontSize: 18 }} />} iconPosition="start" label="Liste des paiements" sx={{ textTransform: 'none', fontWeight: 500 }} />
              <Tab icon={<People sx={{ fontSize: 18 }} />} iconPosition="start" label="Par locataire" sx={{ textTransform: 'none', fontWeight: 500 }} />
              <Tab icon={<Warning sx={{ fontSize: 18 }} />} iconPosition="start" label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  Impayés
                  {impayes.length > 0 && <Badge badgeContent={impayes.length} color="error" sx={{ '& .MuiBadge-badge': { fontSize: '0.6rem', height: 16, minWidth: 16 } }} />}
                </Box>
              } sx={{ textTransform: 'none', fontWeight: 500 }} />
              <Tab icon={<WaterDrop sx={{ fontSize: 18 }} />} iconPosition="start" label="JIRAMA" sx={{ textTransform: 'none', fontWeight: 500 }} />
              <Tab icon={<Assessment sx={{ fontSize: 18 }} />} iconPosition="start" label="Statistiques" sx={{ textTransform: 'none', fontWeight: 500 }} />
            </Tabs>

            <Box sx={{ p: 2.5, bgcolor: '#fff' }}>
              
              {/* ==================== TAB 0: VUE MENSUELLE (CARTES PAR MOIS) ==================== */}
              <TabPanel value={tab} index={0}>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1, mb: 2.5 }}>
                  <IconButton onClick={() => setAnnee(annee - 1)} size="small" sx={{ bgcolor: '#f1f5f9', borderRadius: 1 }}>
                    <ChevronLeft fontSize="small" />
                  </IconButton>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>{annee}</Typography>
                  <IconButton onClick={() => setAnnee(annee + 1)} size="small" sx={{ bgcolor: '#f1f5f9', borderRadius: 1 }}>
                    <ChevronRight fontSize="small" />
                  </IconButton>
                </Box>

                {paiementsGroup.length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 6 }}>
                    <Receipt sx={{ fontSize: 48, color: '#cbd5e1' }} />
                    <Typography variant="body2" color="text.secondary">Aucune donnée pour {annee}</Typography>
                  </Box>
                ) : (
                  <>
                    <Grid container spacing={1.5}>
                      {paginatedMonths.map((month) => {
                        const status = getMonthStatus(month.est_complet, month.montant_paye);
                        const pourcentage = month.montant_du > 0 ? (month.montant_paye / month.montant_du) * 100 : 0;
                        return (
                          <Grid size={{ xs: 6, sm: 4, md: 3, lg: 2 }} key={`month-${month.mois}-${month.annee}`}>
                            <Card 
                              sx={{ 
                                borderRadius: 2, 
                                border: '1px solid #e2e8f0', 
                                boxShadow: 'none', 
                                cursor: 'pointer', 
                                transition: '0.2s', 
                                '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }
                              }} 
                              onClick={() => router.push(`/paiements/mois/${month.annee}/${month.mois}`)}
                            >
                              <CardContent sx={{ p: 1.5, textAlign: 'center' }}>
                                <Typography variant="body2" sx={{ fontWeight: 600 }}>{month.mois_nom.substring(0, 3)}</Typography>
                                <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: '0.85rem' }}>{formatCurrency(month.montant_paye)}</Typography>
                                <Typography variant="caption" sx={{ color: '#94a3b8', fontSize: '0.6rem' }}>/ {formatCurrency(month.montant_du)}</Typography>
                                <LinearProgress variant="determinate" value={pourcentage} sx={{ height: 3, borderRadius: 2, my: 1, bgcolor: '#e2e8f0' }} />
                                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5, mt: 0.5 }}>
                                  <Tooltip title="Locataires">
                                    <Chip icon={<People sx={{ fontSize: 10 }} />} label={month.nombre_locataires} size="small" variant="outlined" sx={{ height: 18, fontSize: '0.55rem' }} />
                                  </Tooltip>
                                  <Tooltip title="Paiements">
                                    <Chip icon={<Payment sx={{ fontSize: 10 }} />} label={month.nombre_paiements} size="small" variant="outlined" sx={{ height: 18, fontSize: '0.55rem' }} />
                                  </Tooltip>
                                </Box>
                                <Chip label={status.label} size="small" sx={{ mt: 1, height: 20, fontSize: '0.6rem', bgcolor: status.bg, color: status.color }} />
                              </CardContent>
                            </Card>
                          </Grid>
                        );
                      })}
                    </Grid>
                    {paiementsGroup.length > monthRowsPerPage && (
                      <TablePagination 
                        rowsPerPageOptions={[12, 24, 36]} 
                        component="div" 
                        count={paiementsGroup.length} 
                        rowsPerPage={monthRowsPerPage} 
                        page={monthPage} 
                        onPageChange={(_, p) => setMonthPage(p)} 
                        onRowsPerPageChange={(e) => { setMonthRowsPerPage(parseInt(e.target.value, 10)); setMonthPage(0); }} 
                        sx={{ mt: 2, border: 'none' }} 
                      />
                    )}
                  </>
                )}
              </TabPanel>

              {/* ==================== TAB 1: LISTE DES PAIEMENTS ==================== */}
              <TabPanel value={tab} index={1}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5, flexWrap: 'wrap', gap: 2 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#059669' }}>
                    Tous les paiements ({filteredPaiements.length})
                  </Typography>
                  <FormControl size="small" sx={{ minWidth: 150 }}>
                    <InputLabel>Statut</InputLabel>
                    <Select value={filterStatut} label="Statut" onChange={(e) => setFilterStatut(e.target.value)}>
                      <MenuItem value="all">Tous</MenuItem>
                      <MenuItem value="paye">Payé</MenuItem>
                      <MenuItem value="en_attente">En attente</MenuItem>
                      <MenuItem value="en_retard">En retard</MenuItem>
                    </Select>
                  </FormControl>
                </Box>

                {filteredPaiements.length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 6 }}>
                    <Receipt sx={{ fontSize: 48, color: '#cbd5e1' }} />
                    <Typography variant="body2" color="text.secondary">Aucun paiement trouvé</Typography>
                  </Box>
                ) : (
                  <>
                    <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 1.5 }}>
                      <Table size="small">
                        <TableHead sx={{ bgcolor: '#f8fafc' }}>
                          <TableRow>
                            <TableCell sx={{ fontWeight: 600 }}>N° Quittance</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Locataire</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Logement</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Période</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Montant</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Mode</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Date paiement</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Statut</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 600 }}>Actions</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {filteredPaiements.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((paiement) => {
                            const status = getPaiementStatus(paiement.statut);
                            return (
                              <TableRow key={paiement.id} hover>
                                <TableCell sx={{ fontFamily: 'monospace' }}>{paiement.numero_quittance || '-'}</TableCell>
                                <TableCell>{paiement.locataire_nom ? `${paiement.locataire_nom} ${paiement.locataire_prenom || ''}` : '-'}</TableCell>
                                <TableCell>{paiement.logement_numero || '-'}</TableCell>
                                <TableCell>{paiement.mois_concerne && paiement.annee_concernee ? `${paiement.mois_concerne}/${paiement.annee_concernee}` : '-'}</TableCell>
                                <TableCell sx={{ fontWeight: 600, color: '#059669' }}>{formatCurrency(paiement.montant)}</TableCell>
                                <TableCell>{paiement.mode_paiement || '-'}</TableCell>
                                <TableCell>{paiement.date_paiement ? new Date(paiement.date_paiement).toLocaleDateString() : '-'}</TableCell>
                                <TableCell><Chip label={status.label} size="small" sx={{ bgcolor: status.bg, color: status.color, height: 22 }} /></TableCell>
                                <TableCell align="center">
                                  <Tooltip title="Voir détails">
                                    <IconButton size="small" onClick={() => router.push(`/paiements/${paiement.id}`)}>
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
                    {filteredPaiements.length > rowsPerPage && (
                      <TablePagination 
                        rowsPerPageOptions={[10, 25, 50]} 
                        component="div" 
                        count={filteredPaiements.length} 
                        rowsPerPage={rowsPerPage} 
                        page={page} 
                        onPageChange={(_, p) => setPage(p)} 
                        onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }} 
                        sx={{ mt: 2, border: 'none' }} 
                      />
                    )}
                  </>
                )}
              </TabPanel>

              {/* ==================== TAB 2: PAR LOCATAIRE ==================== */}
              <TabPanel value={tab} index={2}>
                <Box sx={{ display: 'flex', gap: 2, mb: 2.5, flexWrap: 'wrap' }}>
                  <TextField
                    size="small"
                    placeholder="Rechercher un locataire..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    sx={{ minWidth: 250 }}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <Search fontSize="small" />
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                  <FormControl size="small" sx={{ minWidth: 150 }}>
                    <InputLabel>Situation</InputLabel>
                    <Select value={filterType} label="Situation" onChange={(e) => setFilterType(e.target.value)}>
                      <MenuItem value="all">Tous</MenuItem>
                      <MenuItem value="paye">À jour</MenuItem>
                      <MenuItem value="partiel">Partiel</MenuItem>
                      <MenuItem value="impaye">Impayé</MenuItem>
                    </Select>
                  </FormControl>
                </Box>

                {filteredLocataires.length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 6 }}>
                    <People sx={{ fontSize: 48, color: '#cbd5e1' }} />
                    <Typography variant="body2" color="text.secondary">Aucun locataire trouvé</Typography>
                  </Box>
                ) : (
                  <Stack spacing={1.5}>
                    {filteredLocataires.map((locataire, index) => {
                      const totalMensuel = locataire.loyer_mensuel + (locataire.charges_mensuelles || 0);
                      const totalAnnuel = totalMensuel * 12;
                      const taux = totalAnnuel > 0 ? (locataire.montant_paye / totalAnnuel) * 100 : 0;
                      const uniqueKey = `${locataire.locataire_id}-${annee}-${index}`;
                      return (
                        <Card key={uniqueKey} sx={{ borderRadius: 2, border: '1px solid #e2e8f0', boxShadow: 'none', cursor: 'pointer', transition: '0.2s', '&:hover': { bgcolor: '#f8fafc' } }} onClick={() => handleOpenLocataireDetail(locataire)}>
                          <CardContent sx={{ p: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 1 }}>
                              <Box>
                                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>{locataire.locataire_nom} {locataire.locataire_prenom}</Typography>
                                <Typography variant="caption" color="text.secondary">{locataire.logement_numero} - {locataire.logement_type}</Typography>
                              </Box>
                              <Box sx={{ textAlign: 'right' }}>
                                <Typography variant="caption" color="text.secondary">Loyer mensuel</Typography>
                                <Typography variant="body2" sx={{ fontWeight: 600, color: '#059669' }}>{formatCurrency(totalMensuel)}</Typography>
                              </Box>
                            </Box>
                            <Box sx={{ mt: 1.5 }}>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                <Typography variant="caption" color="text.secondary">Payé {formatCurrency(locataire.montant_paye)} / {formatCurrency(totalAnnuel)}</Typography>
                                <Typography variant="caption" sx={{ fontWeight: 500, color: taux >= 90 ? '#22c55e' : taux >= 50 ? '#f59e0b' : '#ef4444' }}>{Math.round(taux)}%</Typography>
                              </Box>
                              <LinearProgress variant="determinate" value={taux} sx={{ height: 4, borderRadius: 2 }} />
                            </Box>
                            <Box sx={{ display: 'flex', gap: 2, mt: 1.5 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}><CheckCircle sx={{ fontSize: 12, color: '#22c55e' }} /><Typography variant="caption">{locataire.mois_payes || 0} mois payés</Typography></Box>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}><Warning sx={{ fontSize: 12, color: '#ef4444' }} /><Typography variant="caption">{locataire.mois_impayes || 0} mois impayés</Typography></Box>
                            </Box>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </Stack>
                )}
              </TabPanel>

              {/* ==================== TAB 3: IMPAYÉS ==================== */}
              <TabPanel value={tab} index={3}>
                {impayes.length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 6 }}>
                    <CheckCircle sx={{ fontSize: 48, color: '#22c55e' }} />
                    <Typography variant="body1" sx={{ mt: 1, color: '#22c55e', fontWeight: 500 }}>Aucun impayé !</Typography>
                    <Typography variant="caption" color="text.secondary">Tous les paiements sont à jour</Typography>
                  </Box>
                ) : (
                  <>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, p: 1.5, bgcolor: '#fef2f2', borderRadius: 2, border: '1px solid #fecaca' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><Warning sx={{ color: '#ef4444' }} /><Typography variant="caption" sx={{ fontWeight: 600, color: '#ef4444' }}>Total impayés</Typography></Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#ef4444' }}>{formatCurrency(totalImpayesMontant)}</Typography>
                      <Button size="small" variant="outlined" color="error" startIcon={<Email />}>Envoyer relance générale</Button>
                    </Box>
                    <Grid container spacing={1.5}>
                      {impayes.map((impaye: any, idx: number) => (
                        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={`impaye-${impaye.mois}-${impaye.annee}-${idx}`}>
                          <Card sx={{ borderRadius: 2, border: '1px solid #fecaca', cursor: 'pointer', transition: '0.2s', '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' } }} onClick={() => router.push(`/paiements/mois/${impaye.annee}/${impaye.mois}`)}>
                            <CardContent sx={{ p: 1.5 }}>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                                <Typography variant="body2" sx={{ fontWeight: 600 }}>{impaye.mois_nom} {impaye.annee}</Typography>
                                <Chip label="Impayé" size="small" color="error" sx={{ height: 18, fontSize: '0.55rem' }} />
                              </Box>
                              <Typography variant="caption" color="text.secondary">Payé: {formatCurrency(impaye.montant_paye || 0)}</Typography>
                              <Typography variant="caption" color="error" sx={{ display: 'block', fontWeight: 500 }}>Reste: {formatCurrency(impaye.montant_restant || 0)}</Typography>
                              <LinearProgress variant="determinate" value={(impaye.montant_paye / impaye.montant_du) * 100} sx={{ height: 3, borderRadius: 2, mt: 1 }} />
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  </>
                )}
              </TabPanel>

              {/* Tab 4: JIRAMA */}
              <TabPanel value={tab} index={4}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#059669' }}>Relevés Eau & Électricité</Typography>
                  <Button size="small" variant="outlined" startIcon={<Refresh />} onClick={fetchRelevesJIRAMA}>Actualiser</Button>
                </Box>

                {loadingReleves ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                    <CircularProgress size={24} />
                  </Box>
                ) : relevesJIRAMA.length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 6 }}>
                    <WaterDrop sx={{ fontSize: 48, color: '#cbd5e1' }} />
                    <Typography variant="body2" color="text.secondary">Aucun relevé JIRAMA pour {annee}</Typography>
                  </Box>
                ) : (
                  <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 1.5 }}>
                    <Table size="small">
                      <TableHead sx={{ bgcolor: '#f8fafc' }}>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 600 }}>Logement</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Période</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Index ancien</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Index nouveau</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Consommation</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Montant</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Statut</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {relevesJIRAMA.map((releve, idx) => (
                          <TableRow key={idx} hover>
                            <TableCell>{releve.logement_numero}</TableCell>
                            <TableCell>
                              <Chip size="small" icon={releve.type_releve === 'eau' ? <WaterDrop sx={{ fontSize: 12 }} /> : <ElectricBolt sx={{ fontSize: 12 }} />} label={releve.type_releve === 'eau' ? 'Eau' : 'Électricité'} sx={{ height: 20 }} />
                            </TableCell>
                            <TableCell>{releve.mois_nom} {releve.annee}</TableCell>
                            <TableCell>{releve.index_ancien}</TableCell>
                            <TableCell>{releve.index_nouveau}</TableCell>
                            <TableCell>{releve.consommation} {releve.type_releve === 'eau' ? 'm³' : 'kWh'}</TableCell>
                            <TableCell sx={{ fontWeight: 600, color: '#059669' }}>{formatCurrency(releve.montant)}</TableCell>
                            <TableCell>
                              <Chip label={releve.est_facture ? 'Facturé' : 'En attente'} size="small" sx={{ bgcolor: releve.est_facture ? '#f0fdf4' : '#fffbeb', color: releve.est_facture ? '#22c55e' : '#f59e0b' }} />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </TabPanel>


              {/* ==================== TAB 5: STATISTIQUES ==================== */}
              <TabPanel value={tab} index={5}>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Card sx={{ borderRadius: 2, border: '1px solid #e2e8f0', boxShadow: 'none' }}>
                      <CardContent sx={{ p: 2 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5, color: '#059669' }}>Récapitulatif annuel</Typography>
                        <Stack spacing={1}>
                          <StatsRow label="Total des loyers" value={formatCurrency(totalDuAnnee)} />
                          <StatsRow label="Total payé" value={formatCurrency(totalPayeAnnee)} color="#22c55e" />
                          <StatsRow label="Reste à payer" value={formatCurrency(totalDuAnnee - totalPayeAnnee)} color="#ef4444" />
                          <Divider />
                          <StatsRow label="Mois complets" value={`${paiementsGroup.filter(m => m.est_complet).length}/12`} />
                          <StatsRow label="Mois partiels" value={`${paiementsGroup.filter(m => m.montant_paye > 0 && !m.est_complet).length}/12`} />
                          <StatsRow label="Mois impayés" value={`${paiementsGroup.filter(m => m.montant_paye === 0).length}/12`} />
                          <Divider />
                          <StatsRow label="Taux de recouvrement" value={`${tauxRecouvrement}%`} />
                          <StatsRow label="Nombre total de paiements" value={paiementsGroup.reduce((sum, m) => sum + (m.nombre_paiements || 0), 0)} />
                          <StatsRow label="Locataires actifs" value={paiementsParLocataire.length} />
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Card sx={{ borderRadius: 2, border: '1px solid #e2e8f0', boxShadow: 'none' }}>
                      <CardContent sx={{ p: 2 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5, color: '#059669' }}>Par type de paiement</Typography>
                        <Stack spacing={1}>
                          <StatsRow label="Loyers" value={formatCurrency(paiementsGroup.reduce((sum, m) => sum + (m.montant_loyer || 0), 0))} />
                          <StatsRow label="Charges" value={formatCurrency(paiementsGroup.reduce((sum, m) => sum + (m.montant_charges || 0), 0))} />
                          <StatsRow label="Pénalités" value={formatCurrency(paiementsGroup.reduce((sum, m) => sum + (m.montant_penalites || 0), 0))} color="#f59e0b" />
                        </Stack>
                        <Divider sx={{ my: 1.5 }} />
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5, color: '#059669' }}>Performance</Typography>
                        <Stack spacing={1}>
                          <StatsRow label="Meilleur mois" value={paiementsGroup.reduce((max, m) => m.montant_paye > max.montant_paye ? m : max, paiementsGroup[0] || { montant_paye: 0 }).montant_paye} />
                          <StatsRow label="Moyenne mensuelle" value={formatCurrency(totalPayeAnnee / 12)} />
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </TabPanel>
            </Box>
          </Paper>
        </Container>

        {/* Dialog détails locataire */}
        <Dialog open={openLocataireDetail} onClose={() => setOpenLocataireDetail(false)} maxWidth="md" fullWidth>
          {selectedLocataire && (
            <>
              <DialogTitle sx={{ p: 2, pb: 0 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>{selectedLocataire.locataire_nom} {selectedLocataire.locataire_prenom}</Typography>
                    <Typography variant="caption" color="text.secondary">{selectedLocataire.logement_numero} - {selectedLocataire.logement_type}</Typography>
                  </Box>
                  <IconButton onClick={() => setOpenLocataireDetail(false)}><Close /></IconButton>
                </Box>
              </DialogTitle>
              <DialogContent dividers sx={{ p: 2 }}>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2, mb: 2 }}>
                  <Card sx={{ borderRadius: 1.5, border: '1px solid #e2e8f0' }}>
                    <CardContent sx={{ p: 1.5 }}>
                      <Typography variant="caption" sx={{ fontWeight: 600 }}>Informations</Typography>
                      <Divider sx={{ my: 1 }} />
                      <Stack spacing={0.5}>
                        <InfoRow label="Téléphone" value={selectedLocataire.locataire_telephone || '-'} />
                        <InfoRow label="Email" value={selectedLocataire.locataire_email || '-'} />
                        <InfoRow label="Adresse" value={selectedLocataire.locataire_adresse || '-'} />
                      </Stack>
                    </CardContent>
                  </Card>
                  <Card sx={{ borderRadius: 1.5, border: '1px solid #e2e8f0' }}>
                    <CardContent sx={{ p: 1.5 }}>
                      <Typography variant="caption" sx={{ fontWeight: 600 }}>Récapitulatif</Typography>
                      <Divider sx={{ my: 1 }} />
                      <Stack spacing={0.5}>
                        <InfoRow label="Loyer mensuel" value={formatCurrency(selectedLocataire.loyer_mensuel)} />
                        <InfoRow label="Charges" value={formatCurrency(selectedLocataire.charges_mensuelles || 0)} />
                        <InfoRow label="Total mensuel" value={formatCurrency(selectedLocataire.loyer_mensuel + (selectedLocataire.charges_mensuelles || 0))} />
                        <InfoRow label="Total payé (année)" value={formatCurrency(selectedLocataire.montant_paye)} />
                        <InfoRow label="Solde" value={formatCurrency((selectedLocataire.loyer_mensuel + (selectedLocataire.charges_mensuelles || 0)) * 12 - selectedLocataire.montant_paye)} />
                      </Stack>
                    </CardContent>
                  </Card>
                </Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5 }}>Historique des paiements {annee}</Typography>
                {detailsLoading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}><CircularProgress size={24} /></Box>
                ) : (
                  <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 1.5 }}>
                    <Table size="small">
                      <TableHead sx={{ bgcolor: '#f8fafc' }}>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 600 }}>Période</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Montant dû</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Payé</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Statut</TableCell>
                          <TableCell align="center" sx={{ fontWeight: 600 }}>Action</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {(selectedLocataire.paiements_mensuels || []).map((p, idx) => {
                          const status = p.est_complet ? 'Payé' : p.montant_paye > 0 ? 'Partiel' : 'Impayé';
                          const statusColor = p.est_complet ? '#22c55e' : p.montant_paye > 0 ? '#f59e0b' : '#ef4444';
                          return (
                            <TableRow key={`${p.mois}-${p.annee}-${idx}`} hover>
                              <TableCell>{p.mois_nom} {p.annee}</TableCell>
                              <TableCell>{formatCurrency(p.montant_du)}</TableCell>
                              <TableCell sx={{ fontWeight: 500 }}>{formatCurrency(p.montant_paye)}</TableCell>
                              <TableCell><Chip label={status} size="small" sx={{ bgcolor: `${statusColor}15`, color: statusColor, height: 20 }} /></TableCell>
                              <TableCell align="center">
                                <Button size="small" variant="outlined" onClick={() => router.push(`/paiements/mois/${p.annee}/${p.mois}?locataire=${selectedLocataire.locataire_id}`)}>Détail</Button>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </DialogContent>
              <DialogActions sx={{ p: 2 }}>
                <Button onClick={() => setOpenLocataireDetail(false)} variant="outlined">Fermer</Button>
                <Button variant="contained" onClick={() => router.push(`/paiements/locataire/${selectedLocataire.locataire_id}`)} sx={{ bgcolor: '#059669' }}>Voir tous les paiements</Button>
              </DialogActions>
            </>
          )}
        </Dialog>
      </Box>
    </Box>
  );
}