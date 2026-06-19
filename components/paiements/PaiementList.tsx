// // src/components/paiements/PaiementList.tsx
// 'use client';

// import { useState, useEffect } from 'react';
// import {
//   Box, Paper, Table, TableBody, TableCell, TableContainer,
//   TableHead, TableRow, Chip, IconButton, Typography,
//   TablePagination, CircularProgress, Alert, Button,
//   Card, CardContent, Stack, Collapse, Tooltip,
//   Dialog, DialogTitle, DialogContent, DialogActions,
//   Divider
// } from '@mui/material';
// import { 
//   Visibility, PictureAsPdf, Refresh, Receipt,
//   ExpandMore, ExpandLess, Description, Close
// } from '@mui/icons-material';
// import { Paiement, StatutPaiement, TypePaiement } from '@/types/paiement';
// import { paiementService } from '@/services/paiementService';
// import { formatCurrency } from '@/utils/formatters';

// interface Props {
//   bailId?: number;
//   paiements?: Paiement[];
//   loading?: boolean;
//   onView?: (paiement: Paiement) => void;
//   onRefresh?: () => void;
//   variant?: 'table' | 'cards';
// }

// const statutColors: Record<string, 'success' | 'warning' | 'error' | 'default' | 'info'> = {
//   [StatutPaiement.PAYE]: 'success',
//   [StatutPaiement.EN_ATTENTE]: 'warning',
//   [StatutPaiement.EN_RETARD]: 'error',
//   [StatutPaiement.ANNULE]: 'default',
//   [StatutPaiement.REMBOURSE]: 'info'
// };

// const statutLabels: Record<string, string> = {
//   [StatutPaiement.PAYE]: 'Payé',
//   [StatutPaiement.EN_ATTENTE]: 'En attente',
//   [StatutPaiement.EN_RETARD]: 'En retard',
//   [StatutPaiement.ANNULE]: 'Annulé',
//   [StatutPaiement.REMBOURSE]: 'Remboursé'
// };

// const typeLabels: Record<string, string> = {
//   [TypePaiement.LOYER]: 'Loyer',
//   [TypePaiement.CHARGE]: 'Charge',
//   [TypePaiement.CAUTION]: 'Caution',
//   [TypePaiement.PENALITE]: 'Pénalité',
//   [TypePaiement.REGULARISATION]: 'Régularisation',
//   [TypePaiement.AUTRE]: 'Autre'
// };

// const typeColors: Record<string, string> = {
//   [TypePaiement.LOYER]: '#059669',
//   [TypePaiement.CHARGE]: '#7c3aed',
//   [TypePaiement.CAUTION]: '#2563eb',
//   [TypePaiement.PENALITE]: '#dc2626',
//   [TypePaiement.REGULARISATION]: '#f59e0b',
//   [TypePaiement.AUTRE]: '#64748b'
// };

// export default function PaiementList({ 
//   bailId, 
//   paiements: externalPaiements, 
//   loading: externalLoading, 
//   onView, 
//   onRefresh,
//   variant = 'table'
// }: Props) {
//   const [internalLoading, setInternalLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [internalPaiements, setInternalPaiements] = useState<Paiement[]>([]);
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(10);
//   const [expandedRow, setExpandedRow] = useState<number | null>(null);
//   const [detailOpen, setDetailOpen] = useState(false);
//   const [selectedPaiement, setSelectedPaiement] = useState<Paiement | null>(null);

//   const isExternalMode = externalPaiements !== undefined;
//   const loading = isExternalMode ? (externalLoading || false) : internalLoading;
//   const paiements = isExternalMode ? (externalPaiements || []) : internalPaiements;

//   const fetchPaiements = async () => {
//     if (!bailId || isExternalMode) return;
    
//     setInternalLoading(true);
//     setError(null);
    
//     try {
//       const response = await paiementService.getByBail(bailId);
      
//       let paiementsData: Paiement[] = [];
      
//       if (response && typeof response === 'object') {
//         if (Array.isArray(response)) {
//           paiementsData = response;
//         } else if (response.data && Array.isArray(response.data)) {
//           paiementsData = response.data;
//         } else if (response.items && Array.isArray(response.items)) {
//           paiementsData = response.items;
//         } else if (response.results && Array.isArray(response.results)) {
//           paiementsData = response.results;
//         } else if (response.paiements && Array.isArray(response.paiements)) {
//           paiementsData = response.paiements;
//         } else {
//           const arrayKey = Object.keys(response).find(key => Array.isArray(response[key]));
//           if (arrayKey && response[arrayKey]) {
//             paiementsData = response[arrayKey];
//           }
//         }
//       }
      
//       setInternalPaiements(paiementsData);
//     } catch (err: any) {
//       console.error('Erreur:', err);
//       setError(err?.message || 'Erreur de chargement');
//       setInternalPaiements([]);
//     } finally {
//       setInternalLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (!isExternalMode && bailId) {
//       fetchPaiements();
//     }
//   }, [bailId, isExternalMode]);

//   const handleRefresh = () => {
//     if (isExternalMode) {
//       onRefresh?.();
//     } else {
//       fetchPaiements();
//     }
//   };

//   const handleViewDetails = (paiement: Paiement) => {
//     setSelectedPaiement(paiement);
//     setDetailOpen(true);
//     onView?.(paiement);
//   };

//   const toggleRow = (id: number) => {
//     setExpandedRow(expandedRow === id ? null : id);
//   };

//   const hasNotes = (notes?: string) => notes && notes.trim() !== '';

//   if (loading) {
//     return (
//       <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
//         <CircularProgress size={32} />
//       </Box>
//     );
//   }

//   if (error) {
//     return (
//       <Alert 
//         severity="error" 
//         action={
//           <Button color="inherit" size="small" onClick={handleRefresh}>
//             Réessayer
//           </Button>
//         }
//       >
//         {error}
//       </Alert>
//     );
//   }

//   const safePaiements = Array.isArray(paiements) ? paiements : [];
//   const paginatedPaiements = safePaiements.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

//   if (safePaiements.length === 0) {
//     return (
//       <Box sx={{ textAlign: 'center', py: 4 }}>
//         <Receipt sx={{ fontSize: 48, color: 'action.disabled', mb: 1 }} />
//         <Typography variant="body2" color="text.secondary">
//           Aucun paiement trouvé
//         </Typography>
//       </Box>
//     );
//   }

//   // Mode Cartes
//   if (variant === 'cards') {
//     return (
//       <Box>
//         <Box sx={{ 
//           display: 'grid', 
//           gridTemplateColumns: { 
//             xs: 'repeat(2, 1fr)', 
//             sm: 'repeat(2, 1fr)', 
//             md: 'repeat(3, 1fr)',
//             lg: 'repeat(4, 1fr)' 
//           }, 
//           gap: 1.5 
//         }}>
//           {paginatedPaiements.map((paiement) => (
//             <Card key={paiement.id} sx={{ borderRadius: 1.5, border: '1px solid #e8edf2', boxShadow: 'none' }}>
//               <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
//                 <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
//                   <Box>
//                     <Typography variant="caption" color="text.secondary">
//                       {paiement.numero_quittance || 'Quittance'}
//                     </Typography>
//                     <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: '0.9rem' }}>
//                       {formatCurrency(paiement.montant)}
//                     </Typography>
//                   </Box>
//                   <Chip 
//                     label={statutLabels[paiement.statut] || paiement.statut} 
//                     size="small"
//                     sx={{ height: 20, fontSize: '0.6rem' }}
//                     color={statutColors[paiement.statut] || 'default'}
//                   />
//                 </Box>
                
//                 <Stack spacing={0.5} sx={{ mt: 1 }}>
//                   <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
//                     <Typography variant="caption" color="text.secondary">Échéance:</Typography>
//                     <Typography variant="caption">
//                       {paiement.date_echeance ? new Date(paiement.date_echeance).toLocaleDateString() : '-'}
//                     </Typography>
//                   </Box>
//                   {paiement.date_paiement && (
//                     <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
//                       <Typography variant="caption" color="success.main">Payé le:</Typography>
//                       <Typography variant="caption" color="success.main">
//                         {new Date(paiement.date_paiement).toLocaleDateString()}
//                       </Typography>
//                     </Box>
//                   )}
//                   <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
//                     <Typography variant="caption" color="text.secondary">Mode:</Typography>
//                     <Typography variant="caption">{paiement.mode_paiement || '-'}</Typography>
//                   </Box>
//                   {paiement.notes && (
//                     <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
//                       <Typography variant="caption" color="text.secondary">Notes:</Typography>
//                       <Typography variant="caption" sx={{ maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
//                         {paiement.notes}
//                       </Typography>
//                     </Box>
//                   )}
//                 </Stack>

//                 <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5, mt: 1 }}>
//                   <IconButton size="small" onClick={() => handleViewDetails(paiement)} sx={{ p: 0.5 }}>
//                     <Visibility fontSize="small" sx={{ fontSize: 16 }} />
//                   </IconButton>
//                   {paiement.quittance_pdf_url && (
//                     <IconButton size="small" sx={{ p: 0.5 }}>
//                       <PictureAsPdf fontSize="small" sx={{ fontSize: 16 }} color="error" />
//                     </IconButton>
//                   )}
//                 </Box>
//               </CardContent>
//             </Card>
//           ))}
//         </Box>
        
//         {safePaiements.length > rowsPerPage && (
//           <TablePagination
//             rowsPerPageOptions={[5, 10, 25]}
//             component="div"
//             count={safePaiements.length}
//             rowsPerPage={rowsPerPage}
//             page={page}
//             onPageChange={(_, newPage) => setPage(newPage)}
//             onRowsPerPageChange={(e) => {
//               setRowsPerPage(parseInt(e.target.value, 10));
//               setPage(0);
//             }}
//           />
//         )}
//       </Box>
//     );
//   }

//   // Mode Tableau
//   return (
//     <Box>
//       <TableContainer component={Paper} sx={{ borderRadius: 1.5 }}>
//         <Table size="small">
//           <TableHead sx={{ bgcolor: '#f5f5f5' }}>
//             <TableRow>
//               <TableCell sx={{ py: 1 }}>N° Quittance</TableCell>
//               <TableCell sx={{ py: 1, fontWeight: 600 }}>Date</TableCell>
//               <TableCell sx={{ py: 1, fontWeight: 600 }}>Montant</TableCell>
//               <TableCell sx={{ py: 1, fontWeight: 600 }}>Type</TableCell>
//               <TableCell sx={{ py: 1, fontWeight: 600 }}>Mode</TableCell>
//               <TableCell sx={{ py: 1, fontWeight: 600 }}>Mois/Année</TableCell>
//               <TableCell sx={{ py: 1, fontWeight: 600 }}>Statut</TableCell>
//               <TableCell sx={{ py: 1, fontWeight: 600, width: '25%' }}>Notes</TableCell>
//               <TableCell align="center" sx={{ py: 1, fontWeight: 600 }}>Actions</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {paginatedPaiements.map((paiement) => {
//               const hasNote = hasNotes(paiement.notes);
//               return (
//                 <>
//                   <TableRow key={paiement.id} hover>
//                     <TableCell>{paiement.numero_quittance || '-'}</TableCell>
//                     <TableCell>
//                       {paiement.date_echeance ? new Date(paiement.date_echeance).toLocaleDateString() : '-'}
//                     </TableCell>
//                     <TableCell sx={{ fontWeight: 600, color: '#059669' }}>
//                       {formatCurrency(paiement.montant)}
//                     </TableCell>
//                     <TableCell>
//                       <Chip 
//                         label={typeLabels[paiement.type_paiement] || paiement.type_paiement}
//                         size="small"
//                         sx={{ 
//                           bgcolor: `${typeColors[paiement.type_paiement] || '#64748b'}15`,
//                           color: typeColors[paiement.type_paiement] || '#64748b',
//                           fontSize: '0.65rem'
//                         }}
//                       />
//                     </TableCell>
//                     <TableCell>
//                       <Chip label={paiement.mode_paiement || '-'} size="small" variant="outlined" sx={{ fontSize: '0.65rem' }} />
//                     </TableCell>
//                     <TableCell>
//                       {paiement.mois_concerne && paiement.annee_concernee ? 
//                         `${paiement.mois_concerne}/${paiement.annee_concernee}` : 
//                         '-'
//                       }
//                     </TableCell>
//                     <TableCell>
//                       <Chip 
//                         label={statutLabels[paiement.statut] || paiement.statut} 
//                         size="small"
//                         sx={{ height: 22, fontSize: '0.65rem' }}
//                         color={statutColors[paiement.statut] || 'default'}
//                       />
//                     </TableCell>
//                     <TableCell>
//                       {hasNote ? (
//                         <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                           <Typography 
//                             variant="caption" 
//                             sx={{ 
//                               color: '#64748b', 
//                               display: '-webkit-box',
//                               WebkitLineClamp: 2,
//                               WebkitBoxOrient: 'vertical',
//                               overflow: 'hidden',
//                               maxWidth: 180
//                             }}
//                           >
//                             {paiement.notes}
//                           </Typography>
//                           <Tooltip title={expandedRow === paiement.id ? "Masquer" : "Voir tout"}>
//                             <IconButton size="small" onClick={() => toggleRow(paiement.id)}>
//                               {expandedRow === paiement.id ? <ExpandLess fontSize="small" /> : <ExpandMore fontSize="small" />}
//                             </IconButton>
//                           </Tooltip>
//                         </Box>
//                       ) : (
//                         <Typography variant="caption" color="text.secondary">-</Typography>
//                       )}
//                     </TableCell>
//                     <TableCell align="center">
//                       <Tooltip title="Voir détails">
//                         <IconButton size="small" onClick={() => handleViewDetails(paiement)}>
//                           <Visibility fontSize="small" />
//                         </IconButton>
//                       </Tooltip>
//                     </TableCell>
//                   </TableRow>
                  
//                   {/* Ligne expandée pour les notes */}
//                   {hasNote && (
//                     <TableRow>
//                       <TableCell colSpan={8} sx={{ py: 0 }}>
//                         <Collapse in={expandedRow === paiement.id} timeout="auto" unmountOnExit>
//                           <Box sx={{ 
//                             p: 2, 
//                             bgcolor: '#f8fafc', 
//                             borderRadius: 1, 
//                             my: 1,
//                             border: '1px solid #e2e8f0'
//                           }}>
//                             <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#64748b', mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
//                               <Description sx={{ fontSize: 14 }} />
//                               Notes
//                             </Typography>
//                             <Typography 
//                               variant="body2" 
//                               sx={{ 
//                                 whiteSpace: 'pre-wrap', 
//                                 fontFamily: 'monospace', 
//                                 fontSize: '0.8rem',
//                                 color: '#0f172a',
//                                 lineHeight: 1.6
//                               }}
//                             >
//                               {paiement.notes}
//                             </Typography>
//                           </Box>
//                         </Collapse>
//                       </TableCell>
//                     </TableRow>
//                   )}
//                 </>
//               );
//             })}
//           </TableBody>
//         </Table>
//       </TableContainer>
      
//       {safePaiements.length > rowsPerPage && (
//         <TablePagination
//           rowsPerPageOptions={[5, 10, 25]}
//           component="div"
//           count={safePaiements.length}
//           rowsPerPage={rowsPerPage}
//           page={page}
//           onPageChange={(_, newPage) => setPage(newPage)}
//           onRowsPerPageChange={(e) => {
//             setRowsPerPage(parseInt(e.target.value, 10));
//             setPage(0);
//           }}
//         />
//       )}

//       {/* Dialog Détails */}
//       <Dialog open={detailOpen} onClose={() => setDetailOpen(false)} maxWidth="sm" fullWidth>
//         {selectedPaiement && (
//           <>
//             <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//               <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                 <Receipt sx={{ color: '#059669' }} />
//                 <Typography variant="h6">Détail du paiement</Typography>
//                 <Chip 
//                   label={typeLabels[selectedPaiement.type_paiement] || selectedPaiement.type_paiement}
//                   size="small"
//                   sx={{ 
//                     bgcolor: `${typeColors[selectedPaiement.type_paiement] || '#64748b'}15`,
//                     color: typeColors[selectedPaiement.type_paiement] || '#64748b'
//                   }}
//                 />
//               </Box>
//               <IconButton onClick={() => setDetailOpen(false)}>
//                 <Close />
//               </IconButton>
//             </DialogTitle>
            
//             <DialogContent dividers>
//               <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
//                 <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
//                   <Typography variant="caption" color="text.secondary">Montant</Typography>
//                   <Typography variant="body1" sx={{ fontWeight: 600, color: '#059669' }}>
//                     {formatCurrency(selectedPaiement.montant)}
//                   </Typography>
//                 </Box>
//                 <Divider />
                
//                 <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
//                   <Typography variant="caption" color="text.secondary">Type</Typography>
//                   <Typography variant="body2">{typeLabels[selectedPaiement.type_paiement] || selectedPaiement.type_paiement}</Typography>
//                 </Box>
//                 <Divider />
                
//                 <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
//                   <Typography variant="caption" color="text.secondary">Mode</Typography>
//                   <Typography variant="body2">{selectedPaiement.mode_paiement || '-'}</Typography>
//                 </Box>
//                 <Divider />
                
//                 <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
//                   <Typography variant="caption" color="text.secondary">Date d'échéance</Typography>
//                   <Typography variant="body2">
//                     {selectedPaiement.date_echeance ? new Date(selectedPaiement.date_echeance).toLocaleDateString() : '-'}
//                   </Typography>
//                 </Box>
//                 <Divider />
                
//                 <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
//                   <Typography variant="caption" color="text.secondary">Date de paiement</Typography>
//                   <Typography variant="body2">
//                     {selectedPaiement.date_paiement ? new Date(selectedPaiement.date_paiement).toLocaleDateString() : '-'}
//                   </Typography>
//                 </Box>
//                 <Divider />
                
//                 <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
//                   <Typography variant="caption" color="text.secondary">Mois/Année</Typography>
//                   <Typography variant="body2">
//                     {selectedPaiement.mois_concerne && selectedPaiement.annee_concernee ?
//                       `${selectedPaiement.mois_concerne}/${selectedPaiement.annee_concernee}` :
//                       '-'
//                     }
//                   </Typography>
//                 </Box>
//                 <Divider />
                
//                 <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
//                   <Typography variant="caption" color="text.secondary">Statut</Typography>
//                   <Chip 
//                     label={statutLabels[selectedPaiement.statut] || selectedPaiement.statut} 
//                     size="small"
//                     color={statutColors[selectedPaiement.statut] || 'default'}
//                   />
//                 </Box>
                
//                 {/* Notes */}
//                 {selectedPaiement.notes && (
//                   <>
//                     <Divider />
//                     <Box>
//                       <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                         <Description sx={{ fontSize: 14 }} /> Notes
//                       </Typography>
//                       <Paper sx={{ 
//                         p: 2, 
//                         bgcolor: '#f8fafc', 
//                         borderRadius: 1, 
//                         mt: 1,
//                         border: '1px solid #e2e8f0'
//                       }}>
//                         <Typography 
//                           variant="body2" 
//                           sx={{ 
//                             whiteSpace: 'pre-wrap', 
//                             fontFamily: 'monospace',
//                             fontSize: '0.8rem',
//                             lineHeight: 1.6
//                           }}
//                         >
//                           {selectedPaiement.notes}
//                         </Typography>
//                       </Paper>
//                     </Box>
//                   </>
//                 )}
                
//                 <Divider />
//                 <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
//                   <Typography variant="caption" color="text.secondary">Créé le</Typography>
//                   <Typography variant="caption">{new Date(selectedPaiement.created_at).toLocaleString()}</Typography>
//                 </Box>
//               </Box>
//             </DialogContent>
            
//             <DialogActions>
//               <Button startIcon={<PictureAsPdf />} onClick={() => window.print()}>Imprimer</Button>
//               <Button onClick={() => setDetailOpen(false)}>Fermer</Button>
//             </DialogActions>
//           </>
//         )}
//       </Dialog>
//     </Box>
//   );
// }

// src/components/paiements/PaiementList.tsx
'use client';

import { useState, useEffect } from 'react';
import {
  Box, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Chip, IconButton, Typography,
  TablePagination, CircularProgress, Alert, Button,
  Card, CardContent, Stack, Collapse, Tooltip,
  Dialog, DialogTitle, DialogContent, DialogActions,
  Divider
} from '@mui/material';
import { 
  Visibility, PictureAsPdf, Refresh, Receipt,
  ExpandMore, ExpandLess, Description, Close,
  AttachMoney
} from '@mui/icons-material';
import { Paiement, StatutPaiement, TypePaiement } from '@/types/paiement';
import { paiementService } from '@/services/paiementService';
import { formatCurrency } from '@/utils/formatters';

interface Props {
  bailId?: number;
  paiements?: Paiement[];
  loading?: boolean;
  onView?: (paiement: Paiement) => void;
  onRefresh?: () => void;
  variant?: 'table' | 'cards';
}

const statutColors: Record<string, 'success' | 'warning' | 'error' | 'default' | 'info'> = {
  [StatutPaiement.PAYE]: 'success',
  [StatutPaiement.EN_ATTENTE]: 'warning',
  [StatutPaiement.EN_RETARD]: 'error',
  [StatutPaiement.ANNULE]: 'default',
  [StatutPaiement.REMBOURSE]: 'info'
};

const statutLabels: Record<string, string> = {
  [StatutPaiement.PAYE]: 'Payé',
  [StatutPaiement.EN_ATTENTE]: 'En attente',
  [StatutPaiement.EN_RETARD]: 'En retard',
  [StatutPaiement.ANNULE]: 'Annulé',
  [StatutPaiement.REMBOURSE]: 'Remboursé'
};

const typeLabels: Record<string, string> = {
  [TypePaiement.LOYER]: 'Loyer',
  [TypePaiement.CHARGE]: 'Charge',
  [TypePaiement.CAUTION]: 'Caution',
  [TypePaiement.PENALITE]: 'Pénalité',
  [TypePaiement.REGULARISATION]: 'Régularisation',
  [TypePaiement.AUTRE]: 'Autre'
};

const typeColors: Record<string, string> = {
  [TypePaiement.LOYER]: '#059669',
  [TypePaiement.CHARGE]: '#7c3aed',
  [TypePaiement.CAUTION]: '#2563eb',
  [TypePaiement.PENALITE]: '#dc2626',
  [TypePaiement.REGULARISATION]: '#f59e0b',
  [TypePaiement.AUTRE]: '#64748b'
};

export default function PaiementList({ 
  bailId, 
  paiements: externalPaiements, 
  loading: externalLoading, 
  onView, 
  onRefresh,
  variant = 'table'
}: Props) {
  const [internalLoading, setInternalLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [internalPaiements, setInternalPaiements] = useState<Paiement[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedPaiement, setSelectedPaiement] = useState<Paiement | null>(null);

  const isExternalMode = externalPaiements !== undefined;
  const loading = isExternalMode ? (externalLoading || false) : internalLoading;
  const paiements = isExternalMode ? (externalPaiements || []) : internalPaiements;

  // 🔥 Déclarer safePaiements avant son utilisation
  const safePaiements = Array.isArray(paiements) ? paiements : [];
  
  // Calcul du total encaissé
  const totalEncaissé = safePaiements
    .filter(p => p.statut === StatutPaiement.PAYE || p.statut === StatutPaiement.REMBOURSE)
    .reduce((sum, p) => sum + p.montant, 0);

  const paginatedPaiements = safePaiements.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const fetchPaiements = async () => {
    if (!bailId || isExternalMode) return;
    
    setInternalLoading(true);
    setError(null);
    
    try {
      const response = await paiementService.getByBail(bailId);
      
      let paiementsData: Paiement[] = [];
      
      if (response && typeof response === 'object') {
        if (Array.isArray(response)) {
          paiementsData = response;
        } else if ((response as any).data && Array.isArray((response as any).data)) {
          paiementsData = (response as any).data;
        } else if ((response as any).items && Array.isArray((response as any).items)) {
          paiementsData = (response as any).items;
        } else if ((response as any).results && Array.isArray((response as any).results)) {
          paiementsData = (response as any).results;
        } else if ((response as any).paiements && Array.isArray((response as any).paiements)) {
          paiementsData = (response as any).paiements;
        } else {
          const arrayKey = Object.keys(response).find(key => Array.isArray((response as any)[key]));
          if (arrayKey && (response as any)[arrayKey]) {
            paiementsData = (response as any)[arrayKey];
          }
        }
      }
      
      setInternalPaiements(paiementsData);
    } catch (err: any) {
      console.error('Erreur:', err);
      setError(err?.message || 'Erreur de chargement');
      setInternalPaiements([]);
    } finally {
      setInternalLoading(false);
    }
  };

  useEffect(() => {
    if (!isExternalMode && bailId) {
      fetchPaiements();
    }
  }, [bailId, isExternalMode]);

  const handleRefresh = () => {
    if (isExternalMode) {
      onRefresh?.();
    } else {
      fetchPaiements();
    }
  };

  const handleViewDetails = (paiement: Paiement) => {
    setSelectedPaiement(paiement);
    setDetailOpen(true);
    onView?.(paiement);
  };

  const toggleRow = (id: number) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  const hasNotes = (notes?: string) => notes && notes.trim() !== '';

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress size={32} />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert 
        severity="error" 
        action={
          <Button color="inherit" size="small" onClick={handleRefresh}>
            Réessayer
          </Button>
        }
      >
        {error}
      </Alert>
    );
  }

  if (safePaiements.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Receipt sx={{ fontSize: 48, color: 'action.disabled', mb: 1 }} />
        <Typography variant="body2" color="text.secondary">
          Aucun paiement trouvé
        </Typography>
      </Box>
    );
  }

  // Mode Cartes
  if (variant === 'cards') {
    return (
      <Box>
        {/* Total encaissé */}
        <Paper sx={{ p: 2, mb: 2, bgcolor: '#f0fdf4', border: '1px solid #bbf7d0' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <AttachMoney sx={{ color: '#22c55e', fontSize: 28 }} />
            <Box>
              <Typography variant="caption" color="#166534">Total encaissé</Typography>
              <Typography variant="h5" sx={{ fontWeight: 700, color: '#166534' }}>
                {formatCurrency(totalEncaissé)}
              </Typography>
            </Box>
          </Box>
        </Paper>

        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { 
            xs: 'repeat(2, 1fr)', 
            sm: 'repeat(2, 1fr)', 
            md: 'repeat(3, 1fr)',
            lg: 'repeat(4, 1fr)' 
          }, 
          gap: 1.5 
        }}>
          {paginatedPaiements.map((paiement) => (
            <Card key={paiement.id} sx={{ borderRadius: 1.5, border: '1px solid #e8edf2', boxShadow: 'none' }}>
              <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      {paiement.numero_quittance || 'Quittance'}
                    </Typography>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: '0.9rem' }}>
                      {formatCurrency(paiement.montant)}
                    </Typography>
                  </Box>
                  <Chip 
                    label={statutLabels[paiement.statut] || paiement.statut} 
                    size="small"
                    sx={{ height: 20, fontSize: '0.6rem' }}
                    color={statutColors[paiement.statut] || 'default'}
                  />
                </Box>
                
                <Stack spacing={0.5} sx={{ mt: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="caption" color="text.secondary">Échéance:</Typography>
                    <Typography variant="caption">
                      {paiement.date_echeance ? new Date(paiement.date_echeance).toLocaleDateString() : '-'}
                    </Typography>
                  </Box>
                  {paiement.date_paiement && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="caption" color="success.main">Payé le:</Typography>
                      <Typography variant="caption" color="success.main">
                        {new Date(paiement.date_paiement).toLocaleDateString()}
                      </Typography>
                    </Box>
                  )}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="caption" color="text.secondary">Mode:</Typography>
                    <Typography variant="caption">{paiement.mode_paiement || '-'}</Typography>
                  </Box>
                  {paiement.notes && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="caption" color="text.secondary">Notes:</Typography>
                      <Typography variant="caption" sx={{ maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {paiement.notes}
                      </Typography>
                    </Box>
                  )}
                </Stack>

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5, mt: 1 }}>
                  <IconButton size="small" onClick={() => handleViewDetails(paiement)} sx={{ p: 0.5 }}>
                    <Visibility fontSize="small" sx={{ fontSize: 16 }} />
                  </IconButton>
                  {paiement.quittance_pdf_url && (
                    <IconButton size="small" sx={{ p: 0.5 }}>
                      <PictureAsPdf fontSize="small" sx={{ fontSize: 16 }} color="error" />
                    </IconButton>
                  )}
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
        
        {safePaiements.length > rowsPerPage && (
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={safePaiements.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(_, newPage) => setPage(newPage)}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
          />
        )}
      </Box>
    );
  }

  // Mode Tableau
  return (
    <Box>
      {/* Total encaissé */}
      <Paper sx={{ p: 2, mb: 2, bgcolor: '#f0fdf4', border: '1px solid #bbf7d0' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <AttachMoney sx={{ color: '#22c55e', fontSize: 28 }} />
          <Box>
            <Typography variant="caption" color="#166534">Total encaissé</Typography>
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#166534' }}>
              {formatCurrency(totalEncaissé)}
            </Typography>
          </Box>
        </Box>
      </Paper>

      <TableContainer component={Paper} sx={{ borderRadius: 1.5 }}>
        <Table size="small">
          <TableHead sx={{ bgcolor: '#f5f5f5' }}>
            <TableRow>
              <TableCell sx={{ py: 1, fontWeight: 600 }}>N° Quittance</TableCell>
              <TableCell sx={{ py: 1, fontWeight: 600 }}>Date</TableCell>
              <TableCell sx={{ py: 1, fontWeight: 600 }}>Montant</TableCell>
              <TableCell sx={{ py: 1, fontWeight: 600 }}>Type</TableCell>
              <TableCell sx={{ py: 1, fontWeight: 600 }}>Mode</TableCell>
              <TableCell sx={{ py: 1, fontWeight: 600 }}>Mois/Année</TableCell>
              <TableCell sx={{ py: 1, fontWeight: 600 }}>Statut</TableCell>
              <TableCell sx={{ py: 1, fontWeight: 600, width: '25%' }}>Notes</TableCell>
              <TableCell align="center" sx={{ py: 1, fontWeight: 600 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedPaiements.map((paiement) => {
              const hasNote = hasNotes(paiement.notes);
              return (
                <>
                  <TableRow key={paiement.id} hover>
                    <TableCell>{paiement.numero_quittance || '-'}</TableCell>
                    <TableCell>
                      {paiement.date_echeance ? new Date(paiement.date_echeance).toLocaleDateString() : '-'}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#059669' }}>
                      {formatCurrency(paiement.montant)}
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={typeLabels[paiement.type_paiement] || paiement.type_paiement}
                        size="small"
                        sx={{ 
                          bgcolor: `${typeColors[paiement.type_paiement] || '#64748b'}15`,
                          color: typeColors[paiement.type_paiement] || '#64748b',
                          fontSize: '0.65rem'
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip label={paiement.mode_paiement || '-'} size="small" variant="outlined" sx={{ fontSize: '0.65rem' }} />
                    </TableCell>
                    <TableCell>
                      {paiement.mois_concerne && paiement.annee_concernee ? 
                        `${paiement.mois_concerne}/${paiement.annee_concernee}` : 
                        '-'
                      }
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={statutLabels[paiement.statut] || paiement.statut} 
                        size="small"
                        sx={{ height: 22, fontSize: '0.65rem' }}
                        color={statutColors[paiement.statut] || 'default'}
                      />
                    </TableCell>
                    <TableCell>
                      {hasNote ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography 
                            variant="caption" 
                            sx={{ 
                              color: '#64748b', 
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                              maxWidth: 180
                            }}
                          >
                            {paiement.notes}
                          </Typography>
                          <Tooltip title={expandedRow === paiement.id ? "Masquer" : "Voir tout"}>
                            <IconButton size="small" onClick={() => toggleRow(paiement.id)}>
                              {expandedRow === paiement.id ? <ExpandLess fontSize="small" /> : <ExpandMore fontSize="small" />}
                            </IconButton>
                          </Tooltip>
                        </Box>
                      ) : (
                        <Typography variant="caption" color="text.secondary">-</Typography>
                      )}
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="Voir détails">
                        <IconButton size="small" onClick={() => handleViewDetails(paiement)}>
                          <Visibility fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                  
                  {/* Ligne expandée pour les notes */}
                  {hasNote && (
                    <TableRow>
                      <TableCell colSpan={9} sx={{ py: 0 }}>
                        <Collapse in={expandedRow === paiement.id} timeout="auto" unmountOnExit>
                          <Box sx={{ 
                            p: 2, 
                            bgcolor: '#f8fafc', 
                            borderRadius: 1, 
                            my: 1,
                            border: '1px solid #e2e8f0'
                          }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#64748b', mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Description sx={{ fontSize: 14 }} />
                              Notes
                            </Typography>
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                whiteSpace: 'pre-wrap', 
                                fontFamily: 'monospace', 
                                fontSize: '0.8rem',
                                color: '#0f172a',
                                lineHeight: 1.6
                              }}
                            >
                              {paiement.notes}
                            </Typography>
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  )}
                </>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      
      {safePaiements.length > rowsPerPage && (
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={safePaiements.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
        />
      )}

      {/* Dialog Détails */}
      <Dialog open={detailOpen} onClose={() => setDetailOpen(false)} maxWidth="sm" fullWidth>
        {selectedPaiement && (
          <>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Receipt sx={{ color: '#059669' }} />
                <Typography variant="h6">Détail du paiement</Typography>
                <Chip 
                  label={typeLabels[selectedPaiement.type_paiement] || selectedPaiement.type_paiement}
                  size="small"
                  sx={{ 
                    bgcolor: `${typeColors[selectedPaiement.type_paiement] || '#64748b'}15`,
                    color: typeColors[selectedPaiement.type_paiement] || '#64748b'
                  }}
                />
              </Box>
              <IconButton onClick={() => setDetailOpen(false)}>
                <Close />
              </IconButton>
            </DialogTitle>
            
            <DialogContent dividers>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="caption" color="text.secondary">Montant</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600, color: '#059669' }}>
                    {formatCurrency(selectedPaiement.montant)}
                  </Typography>
                </Box>
                <Divider />
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="caption" color="text.secondary">Type</Typography>
                  <Typography variant="body2">{typeLabels[selectedPaiement.type_paiement] || selectedPaiement.type_paiement}</Typography>
                </Box>
                <Divider />
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="caption" color="text.secondary">Mode</Typography>
                  <Typography variant="body2">{selectedPaiement.mode_paiement || '-'}</Typography>
                </Box>
                <Divider />
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="caption" color="text.secondary">Date d'échéance</Typography>
                  <Typography variant="body2">
                    {selectedPaiement.date_echeance ? new Date(selectedPaiement.date_echeance).toLocaleDateString() : '-'}
                  </Typography>
                </Box>
                <Divider />
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="caption" color="text.secondary">Date de paiement</Typography>
                  <Typography variant="body2">
                    {selectedPaiement.date_paiement ? new Date(selectedPaiement.date_paiement).toLocaleDateString() : '-'}
                  </Typography>
                </Box>
                <Divider />
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="caption" color="text.secondary">Mois/Année</Typography>
                  <Typography variant="body2">
                    {selectedPaiement.mois_concerne && selectedPaiement.annee_concernee ?
                      `${selectedPaiement.mois_concerne}/${selectedPaiement.annee_concernee}` :
                      '-'
                    }
                  </Typography>
                </Box>
                <Divider />
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="caption" color="text.secondary">Statut</Typography>
                  <Chip 
                    label={statutLabels[selectedPaiement.statut] || selectedPaiement.statut} 
                    size="small"
                    color={statutColors[selectedPaiement.statut] || 'default'}
                  />
                </Box>
                
                {/* Notes */}
                {selectedPaiement.notes && (
                  <>
                    <Divider />
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Description sx={{ fontSize: 14 }} /> Notes
                      </Typography>
                      <Paper sx={{ 
                        p: 2, 
                        bgcolor: '#f8fafc', 
                        borderRadius: 1, 
                        mt: 1,
                        border: '1px solid #e2e8f0'
                      }}>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            whiteSpace: 'pre-wrap', 
                            fontFamily: 'monospace',
                            fontSize: '0.8rem',
                            lineHeight: 1.6
                          }}
                        >
                          {selectedPaiement.notes}
                        </Typography>
                      </Paper>
                    </Box>
                  </>
                )}
                
                <Divider />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="caption" color="text.secondary">Créé le</Typography>
                  <Typography variant="caption">{new Date(selectedPaiement.created_at).toLocaleString()}</Typography>
                </Box>
              </Box>
            </DialogContent>
            
            <DialogActions>
              <Button startIcon={<PictureAsPdf />} onClick={() => window.print()}>Imprimer</Button>
              <Button onClick={() => setDetailOpen(false)}>Fermer</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
}