// // src/components/paiements/PaiementCalendar.tsx
// 'use client';

// import { useState, useEffect } from 'react';
// import {
//   Box, Card, CardContent, Typography, Chip, Button,
//   CircularProgress, Alert, IconButton, Dialog, DialogTitle,
//   DialogContent, DialogActions, TextField, MenuItem, Snackbar,
//   Grid, LinearProgress, Tooltip, Stack, Divider,
//   Paper
// } from '@mui/material';
// import {
//   CheckCircle, Warning, Schedule, Receipt, AttachMoney,
//   ChevronLeft, ChevronRight, Refresh, PictureAsPdf, Close,
//   Autorenew, Download, TrendingUp, TrendingDown
// } from '@mui/icons-material';
// import { formatCurrency, formatDate } from '@/utils/formatters';
// import { paiementSessionService } from '@/services/paiementSessionService';
// import { PaiementSession, PaiementSessionStats } from '@/types/paiementSession';

// interface Props {
//   bailId: number;
//   loyerMensuel: number;
//   chargesMensuelles: number;
//   onRefresh?: () => void;
// }

// const moisNoms = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
// const modesPaiement = [
//   { value: 'especes', label: '💵 Espèces' },
//   { value: 'cheque', label: '📝 Chèque' },
//   { value: 'virement', label: '🏦 Virement' },
//   { value: 'mobile_money', label: '📱 Mobile Money' },
//   { value: 'carte', label: '💳 Carte' }
// ];

// export default function PaiementCalendar({ bailId, loyerMensuel, chargesMensuelles, onRefresh }: Props) {
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [sessions, setSessions] = useState<PaiementSession[]>([]);
//   const [stats, setStats] = useState<PaiementSessionStats | null>(null);
//   const [annee, setAnnee] = useState(new Date().getFullYear());
//   const [openPayDialog, setOpenPayDialog] = useState(false);
//   const [selectedSession, setSelectedSession] = useState<PaiementSession | null>(null);
//   const [payData, setPayData] = useState({
//     montant: 0,
//     mode_paiement: 'especes',
//     reference_paiement: ''
//   });
//   const [submitting, setSubmitting] = useState(false);
//   const [success, setSuccess] = useState('');
//   const [generating, setGenerating] = useState(false);
//   const [generatingQuittance, setGeneratingQuittance] = useState<number | null>(null);
//   const [autoReference, setAutoReference] = useState('');
//   const [openGenerateDialog, setOpenGenerateDialog] = useState(false);
//   const [generateData, setGenerateData] = useState({ mois: 12, force: false });
//   const [restant, setRestant] = useState(0);

//   // Calculer le montant restant quand la session change
//   useEffect(() => {
//     if (selectedSession) {
//       const dejaPaye = selectedSession.montant_paye || 0;
//       const total = selectedSession.montant_total;
//       const reste = total - dejaPaye;
//       setRestant(reste);
//       setPayData(prev => ({ ...prev, montant: reste }));
//     }
//   }, [selectedSession]);

//   // Générer référence auto
//   useEffect(() => {
//     if (selectedSession && openPayDialog) {
//       generateReference();
//     }
//   }, [selectedSession, openPayDialog]);

//   const generateReference = async () => {
//     try {
//       const ref = await paiementSessionService.generateReference(bailId);
//       setAutoReference(ref);
//       setPayData(prev => ({ ...prev, reference_paiement: ref }));
//     } catch (err) {
//       const fallbackRef = `PAY-${bailId}-${Date.now()}`;
//       setAutoReference(fallbackRef);
//       setPayData(prev => ({ ...prev, reference_paiement: fallbackRef }));
//     }
//   };

//   const fetchSessions = async () => {
//     if (!bailId) return;
//     setLoading(true);
//     setError(null);
//     try {
//       const data = await paiementSessionService.getByBail(bailId, { annee });
//       setSessions(data);
//       const statsData = await paiementSessionService.getStats(bailId);
//       setStats(statsData);
//     } catch (err: any) {
//       setError(err?.response?.data?.detail || 'Erreur lors du chargement');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleGenerateEcheances = async () => {
//     setGenerating(true);
//     try {
//       await paiementSessionService.generateEcheances(bailId, { mois: generateData.mois, force: generateData.force });
//       await fetchSessions();
//       setSuccess('Échéances générées avec succès');
//       setOpenGenerateDialog(false);
//       onRefresh?.();
//     } catch (err: any) {
//       setError(err?.response?.data?.detail || 'Erreur lors de la génération');
//     } finally {
//       setGenerating(false);
//     }
//   };

//   const handlePaySession = async () => {
//     if (!selectedSession) return;
    
//     if (payData.montant <= 0) {
//       setError('Le montant doit être supérieur à 0');
//       return;
//     }
    
//     if (payData.montant > restant) {
//       setError(`Le montant ne peut pas dépasser le reste à payer (${formatCurrency(restant)})`);
//       return;
//     }
    
//     setSubmitting(true);
//     try {
//       const result = await paiementSessionService.paySession(selectedSession.id, {
//         montant: payData.montant,
//         mode_paiement: payData.mode_paiement,
//         reference_paiement: payData.reference_paiement || autoReference
//       });
      
//       const nouveauPaye = (selectedSession.montant_paye || 0) + payData.montant;
//       const estComplet = nouveauPaye >= selectedSession.montant_total;
      
//       setSuccess(estComplet 
//         ? `Paiement complet de ${formatCurrency(payData.montant)} enregistré` 
//         : `Paiement partiel de ${formatCurrency(payData.montant)} enregistré. Reste: ${formatCurrency(restant - payData.montant)}`);
      
//       setOpenPayDialog(false);
//       fetchSessions();
//       onRefresh?.();
//     } catch (err: any) {
//       setError(err?.response?.data?.detail || 'Erreur lors du paiement');
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const handleGenerateQuittance = async (session: PaiementSession) => {
//     setGeneratingQuittance(session.id);
//     try {
//       const blob = await paiementSessionService.generateQuittance(session.id);
//       const url = URL.createObjectURL(blob);
//       window.open(url, '_blank');
//       URL.revokeObjectURL(url);
//       setSuccess('Quittance générée avec succès');
//     } catch (err) {
//       setError('Erreur lors de la génération de la quittance');
//     } finally {
//       setGeneratingQuittance(null);
//     }
//   };

//   useEffect(() => {
//     fetchSessions();
//   }, [bailId, annee]);

//   const getStatutIcon = (statut: string) => {
//     switch (statut) {
//       case 'paye': return <CheckCircle sx={{ fontSize: 20, color: '#4caf50' }} />;
//       case 'en_retard': return <Warning sx={{ fontSize: 20, color: '#f44336' }} />;
//       case 'partiel': return <AttachMoney sx={{ fontSize: 20, color: '#ff9800' }} />;
//       default: return <Schedule sx={{ fontSize: 20, color: '#9e9e9e' }} />;
//     }
//   };

//   const getStatutColor = (statut: string) => {
//     switch (statut) {
//       case 'paye': return '#4caf50';
//       case 'en_retard': return '#f44336';
//       case 'partiel': return '#ff9800';
//       default: return '#9e9e9e';
//     }
//   };

//   const getStatutLabel = (statut: string) => {
//     switch (statut) {
//       case 'paye': return 'Payé';
//       case 'en_retard': return 'En retard';
//       case 'partiel': return 'Partiel';
//       default: return 'En attente';
//     }
//   };

//   if (loading) {
//     return (
//       <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
//         <CircularProgress size={40} />
//       </Box>
//     );
//   }

//   if (sessions.length === 0 && !loading) {
//     return (
//       <Box sx={{ textAlign: 'center', py: 6 }}>
//         <Receipt sx={{ fontSize: 64, color: 'action.disabled', mb: 2 }} />
//         <Typography variant="h6" color="text.secondary" gutterBottom>
//           Aucune échéance pour {annee}
//         </Typography>
//         <Button variant="contained" onClick={() => setOpenGenerateDialog(true)} startIcon={<Autorenew />}>
//           Générer les échéances
//         </Button>

//         <Dialog open={openGenerateDialog} onClose={() => setOpenGenerateDialog(false)} maxWidth="sm" fullWidth>
//           <DialogTitle>Générer les échéances</DialogTitle>
//           <DialogContent>
//             <Box sx={{ mt: 2 }}>
//               <TextField
//                 fullWidth
//                 type="number"
//                 label="Nombre de mois"
//                 value={generateData.mois}
//                 onChange={(e) => setGenerateData({ ...generateData, mois: parseInt(e.target.value) || 12 })}
//                 helperText="Générer les échéances pour les X prochains mois"
//                 sx={{ mb: 2 }}
//               />
//               <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                 <input type="checkbox" checked={generateData.force} onChange={(e) => setGenerateData({ ...generateData, force: e.target.checked })} />
//                 <Typography variant="body2">Forcer la régénération (supprime les anciennes)</Typography>
//               </Box>
//             </Box>
//           </DialogContent>
//           <DialogActions>
//             <Button onClick={() => setOpenGenerateDialog(false)}>Annuler</Button>
//             <Button variant="contained" onClick={handleGenerateEcheances} disabled={generating}>
//               {generating ? 'Génération...' : 'Générer'}
//             </Button>
//           </DialogActions>
//         </Dialog>
//       </Box>
//     );
//   }

//   return (
//     <Box>
//       {/* Stats */}
//       {stats && (
//         <Grid container spacing={1.5} sx={{ mb: 3 }}>
//           <Grid size={{ xs: 6, sm: 3 }}>
//             <Card sx={{ bgcolor: '#e8f5e9', borderRadius: 2 }}>
//               <CardContent sx={{ p: 1.5, textAlign: 'center' }}>
//                 <Typography variant="caption" color="text.secondary">Mois payés</Typography>
//                 <Typography variant="h6" sx={{ fontWeight: 700, color: '#2e7d32' }}>
//                   {stats.mois_payes}/{stats.total_mois}
//                 </Typography>
//               </CardContent>
//             </Card>
//           </Grid>
//           <Grid size={{ xs: 6, sm: 3 }}>
//             <Card sx={{ bgcolor: '#e3f2fd', borderRadius: 2 }}>
//               <CardContent sx={{ p: 1.5, textAlign: 'center' }}>
//                 <Typography variant="caption" color="text.secondary">Total payé</Typography>
//                 <Typography variant="h6" sx={{ fontWeight: 700, color: '#1565c0' }}>
//                   {formatCurrency(stats.total_paye)}
//                 </Typography>
//               </CardContent>
//             </Card>
//           </Grid>
//           <Grid size={{ xs: 6, sm: 3 }}>
//             <Card sx={{ bgcolor: '#ffebee', borderRadius: 2 }}>
//               <CardContent sx={{ p: 1.5, textAlign: 'center' }}>
//                 <Typography variant="caption" color="text.secondary">Reste à payer</Typography>
//                 <Typography variant="h6" sx={{ fontWeight: 700, color: '#c62828' }}>
//                   {formatCurrency(stats.total_impaye)}
//                 </Typography>
//               </CardContent>
//             </Card>
//           </Grid>
//           <Grid size={{ xs: 6, sm: 3 }}>
//             <Card sx={{ bgcolor: '#fff3e0', borderRadius: 2 }}>
//               <CardContent sx={{ p: 1.5, textAlign: 'center' }}>
//                 <Typography variant="caption" color="text.secondary">Taux paiement</Typography>
//                 <Typography variant="h6" sx={{ fontWeight: 700, color: '#f57c00' }}>
//                   {stats.taux_paiement}%
//                 </Typography>
//                 <LinearProgress variant="determinate" value={stats.taux_paiement} sx={{ mt: 0.5, height: 4 }} />
//               </CardContent>
//             </Card>
//           </Grid>
//         </Grid>
//       )}

//       {/* Navigation année */}
//       <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
//         <IconButton onClick={() => setAnnee(annee - 1)} size="small"><ChevronLeft /></IconButton>
//         <Typography variant="h6">{annee}</Typography>
//         <IconButton onClick={() => setAnnee(annee + 1)} size="small"><ChevronRight /></IconButton>
//         <IconButton onClick={fetchSessions} size="small"><Refresh /></IconButton>
//       </Box>

//       {/* Grille 6 cartes */}
//       <Grid container spacing={1.5}>
//         {sessions.map((session) => {
//           const moisIndex = session.mois - 1;
//           const dejaPaye = session.montant_paye || 0;
//           const reste = session.montant_total - dejaPaye;
//           const pourcentagePaye = (dejaPaye / session.montant_total) * 100;
//           const estComplet = session.statut === 'paye';
//           const estPartiel = session.statut === 'partiel' || (dejaPaye > 0 && !estComplet);

//           return (
//             <Grid size={{ xs: 6, sm: 4, md: 3, lg: 2 }} key={session.id}>
//               <Card sx={{ 
//                 borderRadius: 1.5, 
//                 border: `1px solid ${getStatutColor(session.statut)}40`,
//                 bgcolor: estComplet ? '#fafafa' : 'white',
//                 cursor: 'pointer',
//                 transition: 'all 0.2s',
//                 '&:hover': { transform: 'translateY(-2px)', boxShadow: 1 }
//               }}>
//                 <CardContent sx={{ p: 1.5, textAlign: 'center' }}>
//                   <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
//                     <Typography variant="caption" sx={{ fontWeight: 600 }}>
//                       {moisNoms[moisIndex].substring(0, 3)}
//                     </Typography>
//                     {getStatutIcon(session.statut)}
//                   </Box>
                  
//                   <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
//                     {formatCurrency(session.montant_total)}
//                   </Typography>
                  
//                   <LinearProgress 
//                     variant="determinate" 
//                     value={pourcentagePaye}
//                     sx={{ height: 4, borderRadius: 2, my: 1 }}
//                   />
                  
//                   <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
//                     <Typography variant="caption" color="success.main" sx={{ fontSize: '0.6rem' }}>
//                       Payé: {formatCurrency(dejaPaye)}
//                     </Typography>
//                     <Typography variant="caption" color="error" sx={{ fontSize: '0.6rem' }}>
//                       Reste: {formatCurrency(reste)}
//                     </Typography>
//                   </Box>
                  
//                   <Chip
//                     label={estComplet ? 'Payé' : (estPartiel ? `Partiel (${Math.round(pourcentagePaye)}%)` : 'Impayé')}
//                     size="small"
//                     sx={{ mt: 1, height: 20, fontSize: '0.6rem', bgcolor: getStatutColor(session.statut) + '20' }}
//                   />
                  
//                   {!estComplet && reste > 0 && (
//                     <Button
//                       size="small"
//                       variant="contained"
//                       startIcon={<AttachMoney sx={{ fontSize: 14 }} />}
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         setSelectedSession(session);
//                         setOpenPayDialog(true);
//                       }}
//                       sx={{ mt: 1, fontSize: '0.6rem', py: 0.3, bgcolor: getStatutColor(session.statut) }}
//                     >
//                       Payer {formatCurrency(reste)}
//                     </Button>
//                   )}
                  
//                   {estComplet && (
//                     <Button
//                       size="small"
//                       variant="outlined"
//                       startIcon={generatingQuittance === session.id ? <CircularProgress size={12} /> : <PictureAsPdf sx={{ fontSize: 14 }} />}
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         handleGenerateQuittance(session);
//                       }}
//                       disabled={generatingQuittance === session.id}
//                       sx={{ mt: 1, fontSize: '0.6rem', py: 0.3 }}
//                     >
//                       Quittance
//                     </Button>
//                   )}
//                 </CardContent>
//               </Card>
//             </Grid>
//           );
//         })}
//       </Grid>

//       {/* Dialog de paiement avec gestion du reste */}
//       <Dialog open={openPayDialog} onClose={() => setOpenPayDialog(false)} maxWidth="sm" fullWidth>
//         <DialogTitle>
//           Paiement - {selectedSession && `${moisNoms[selectedSession.mois - 1]} ${selectedSession.annee}`}
//         </DialogTitle>
//         <Dialog open={openPayDialog} onClose={() => setOpenPayDialog(false)} maxWidth="sm" fullWidth>
//           <DialogTitle>
//             Paiement - {selectedSession && `${moisNoms[selectedSession.mois - 1]} ${selectedSession.annee}`}
//           </DialogTitle>
//           <DialogContent>
//             <Box sx={{ mt: 2 }}>
//               {/* Résumé des montants */}
//               <Paper sx={{ p: 2, mb: 3, bgcolor: '#f8f9fa' }}>
//                 <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
//                   <Typography variant="body2" color="text.secondary">Montant total</Typography>
//                   <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
//                     {formatCurrency(selectedSession?.montant_total || 0)}
//                   </Typography>
//                 </Box>
//                 <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
//                   <Typography variant="body2" color="success.main">Déjà payé</Typography>
//                   <Typography variant="subtitle1" color="success.main">
//                     {formatCurrency(selectedSession?.montant_paye || 0)}
//                   </Typography>
//                 </Box>
//                 <Divider sx={{ my: 1 }} />
//                 <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
//                   <Typography variant="body2" color="error.main">Reste à payer</Typography>
//                   <Typography variant="h6" color="error.main">
//                     {formatCurrency(restant)}
//                   </Typography>
//                 </Box>
//               </Paper>

//               {/* Champ Référence - CORRIGÉ */}
//               <TextField
//                 fullWidth
//                 label="Référence de paiement"
//                 value={payData.reference_paiement}
//                 onChange={(e) => setPayData({ ...payData, reference_paiement: e.target.value })}
//                 placeholder="Référence auto-générée"
//                 helperText="La référence est générée automatiquement"
//                 sx={{ mb: 2 }}
//                 slotProps={{
//                   input: {
//                     startAdornment: <Autorenew sx={{ mr: 1, color: 'text.secondary' }} />
//                   }
//                 }}
//               />
              
//               {/* Champ Montant - CORRIGÉ */}
//               <TextField
//                 fullWidth
//                 type="number"
//                 label="Montant à payer"
//                 value={payData.montant}
//                 onChange={(e) => {
//                   const value = parseFloat(e.target.value) || 0;
//                   if (value <= restant) {
//                     setPayData({ ...payData, montant: value });
//                   }
//                 }}
//                 helperText={`Maximum: ${formatCurrency(restant)}`}
//                 sx={{ mb: 2 }}
//                 slotProps={{
//                   htmlInput: { max: restant, min: 0 }
//                 }}
//               />
              
//               {/* Champ Mode de paiement */}
//               <TextField
//                 select
//                 fullWidth
//                 label="Mode de paiement"
//                 value={payData.mode_paiement}
//                 onChange={(e) => setPayData({ ...payData, mode_paiement: e.target.value })}
//               >
//                 {modesPaiement.map(opt => (
//                   <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
//                 ))}
//               </TextField>

//               {payData.montant > 0 && payData.montant < restant && (
//                 <Alert severity="info" sx={{ mt: 2 }}>
//                   Paiement partiel. Il restera {formatCurrency(restant - payData.montant)} à payer.
//                 </Alert>
//               )}
              
//               {payData.montant === restant && restant > 0 && (
//                 <Alert severity="success" sx={{ mt: 2 }}>
//                   Paiement complet du solde restant.
//                 </Alert>
//               )}
//             </Box>
//           </DialogContent>
//           <DialogActions>
//             <Button onClick={() => setOpenPayDialog(false)}>Annuler</Button>
//             <Button 
//               variant="contained" 
//               onClick={handlePaySession} 
//               disabled={submitting || payData.montant <= 0 || payData.montant > restant}
//             >
//               {submitting ? 'Traitement...' : `Payer ${formatCurrency(payData.montant)}`}
//             </Button>
//           </DialogActions>
//         </Dialog>
//         <DialogActions>
//           <Button onClick={() => setOpenPayDialog(false)}>Annuler</Button>
//           <Button 
//             variant="contained" 
//             onClick={handlePaySession} 
//             disabled={submitting || payData.montant <= 0 || payData.montant > restant}
//           >
//             {submitting ? 'Traitement...' : `Payer ${formatCurrency(payData.montant)}`}
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* Snackbar */}
//       <Snackbar open={!!success} autoHideDuration={3000} onClose={() => setSuccess('')}>
//         <Alert severity="success">{success}</Alert>
//       </Snackbar>
//       <Snackbar open={!!error} autoHideDuration={4000} onClose={() => setError(null)}>
//         <Alert severity="error">{error}</Alert>
//       </Snackbar>
//     </Box>
//   );
// }

// src/components/paiements/PaiementCalendar.tsx
'use client';

import { useState, useEffect } from 'react';
import {
  Box, Card, CardContent, Typography, Chip, Button,
  CircularProgress, Alert, IconButton, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, MenuItem, Snackbar,
  Grid, LinearProgress, Tooltip, Stack, Divider, Paper
} from '@mui/material';
import {
  CheckCircle, Warning, Schedule, Receipt, AttachMoney,
  ChevronLeft, ChevronRight, Refresh, PictureAsPdf, Close,
  Autorenew, Download, TrendingUp, TrendingDown
} from '@mui/icons-material';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { paiementSessionService } from '@/services/paiementSessionService';
import { PaiementSession, PaiementSessionStats } from '@/types/paiementSession';

interface Props {
  bailId: number;
  loyerMensuel: number;
  chargesMensuelles: number;
  onRefresh?: () => void;
}

const moisNoms = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
const modesPaiement = [
  { value: 'especes', label: '💵 Espèces' },
  { value: 'cheque', label: '📝 Chèque' },
  { value: 'virement', label: '🏦 Virement' },
  { value: 'mobile_money', label: '📱 Mobile Money' },
  { value: 'carte', label: '💳 Carte' }
];

export default function PaiementCalendar({ bailId, loyerMensuel, chargesMensuelles, onRefresh }: Props) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sessions, setSessions] = useState<PaiementSession[]>([]);
  const [stats, setStats] = useState<PaiementSessionStats | null>(null);
  const [annee, setAnnee] = useState(new Date().getFullYear());
  const [openPayDialog, setOpenPayDialog] = useState(false);
  const [selectedSession, setSelectedSession] = useState<PaiementSession | null>(null);
  const [payData, setPayData] = useState({
    montant: 0,
    mode_paiement: 'especes',
    reference_paiement: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');
  const [generating, setGenerating] = useState(false);
  const [generatingQuittance, setGeneratingQuittance] = useState<number | null>(null);
  const [autoReference, setAutoReference] = useState('');
  const [openGenerateDialog, setOpenGenerateDialog] = useState(false);
  const [generateData, setGenerateData] = useState({ mois: 12, force: false });
  const [restant, setRestant] = useState(0);
  const [dejaPaye, setDejaPaye] = useState(0);

  // 🔥 Calculer le montant restant et déjà payé quand la session change
  useEffect(() => {
    if (selectedSession) {
      const total = selectedSession.montant_total;
      const paye = selectedSession.montant_paye || 0;
      const reste = total - paye;
      setDejaPaye(paye);
      setRestant(reste);
      setPayData(prev => ({ ...prev, montant: reste }));
    }
  }, [selectedSession]);

  // Générer référence auto
  useEffect(() => {
    if (selectedSession && openPayDialog) {
      generateReference();
    }
  }, [selectedSession, openPayDialog]);

  const generateReference = async () => {
    try {
      const ref = await paiementSessionService.generateReference(bailId);
      setAutoReference(ref);
      setPayData(prev => ({ ...prev, reference_paiement: ref }));
    } catch (err) {
      const fallbackRef = `PAY-${bailId}-${Date.now()}`;
      setAutoReference(fallbackRef);
      setPayData(prev => ({ ...prev, reference_paiement: fallbackRef }));
    }
  };

  const fetchSessions = async () => {
    if (!bailId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await paiementSessionService.getByBail(bailId, { annee });
      setSessions(data);
      const statsData = await paiementSessionService.getStats(bailId);
      setStats(statsData);
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateEcheances = async () => {
    setGenerating(true);
    try {
      await paiementSessionService.generateEcheances(bailId, { mois: generateData.mois, force: generateData.force });
      await fetchSessions();
      setSuccess('Échéances générées avec succès');
      setOpenGenerateDialog(false);
      onRefresh?.();
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Erreur lors de la génération');
    } finally {
      setGenerating(false);
    }
  };

  // 🔥 CORRECTION: Gestion du paiement avec mise à jour correcte
  const handlePaySession = async () => {
    if (!selectedSession) return;
    
    if (payData.montant <= 0) {
      setError('Le montant doit être supérieur à 0');
      return;
    }
    
    if (payData.montant > restant) {
      setError(`Le montant ne peut pas dépasser le reste à payer (${formatCurrency(restant)})`);
      return;
    }
    
    setSubmitting(true);
    try {
      const result = await paiementSessionService.paySession(selectedSession.id, {
        montant: payData.montant,
        mode_paiement: payData.mode_paiement,
        reference_paiement: payData.reference_paiement || autoReference
      });
      
      // 🔥 Recharger les données pour avoir les valeurs à jour
      await fetchSessions();
      
      const nouveauTotalPaye = dejaPaye + payData.montant;
      const nouveauReste = selectedSession.montant_total - nouveauTotalPaye;
      const estComplet = nouveauTotalPaye >= selectedSession.montant_total;
      
      setSuccess(estComplet 
        ? `✅ Paiement complet de ${formatCurrency(payData.montant)} enregistré. Total payé: ${formatCurrency(selectedSession.montant_total)}`
        : `💰 Paiement partiel de ${formatCurrency(payData.montant)} enregistré. Total payé: ${formatCurrency(nouveauTotalPaye)}. Reste: ${formatCurrency(nouveauReste)}`);
      
      setOpenPayDialog(false);
      onRefresh?.();
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Erreur lors du paiement');
    } finally {
      setSubmitting(false);
    }
  };

  const handleGenerateQuittance = async (session: PaiementSession) => {
    setGeneratingQuittance(session.id);
    try {
      const blob = await paiementSessionService.generateQuittance(session.id);
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
      URL.revokeObjectURL(url);
      setSuccess('Quittance générée avec succès');
    } catch (err) {
      setError('Erreur lors de la génération de la quittance');
    } finally {
      setGeneratingQuittance(null);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, [bailId, annee]);

  const getStatutIcon = (statut: string) => {
    switch (statut) {
      case 'paye': return <CheckCircle sx={{ fontSize: 20, color: '#4caf50' }} />;
      case 'en_retard': return <Warning sx={{ fontSize: 20, color: '#f44336' }} />;
      case 'partiel': return <AttachMoney sx={{ fontSize: 20, color: '#ff9800' }} />;
      default: return <Schedule sx={{ fontSize: 20, color: '#9e9e9e' }} />;
    }
  };

  const getStatutColor = (statut: string) => {
    switch (statut) {
      case 'paye': return '#4caf50';
      case 'en_retard': return '#f44336';
      case 'partiel': return '#ff9800';
      default: return '#9e9e9e';
    }
  };

  const getStatutLabel = (statut: string) => {
    switch (statut) {
      case 'paye': return 'Payé';
      case 'en_retard': return 'En retard';
      case 'partiel': return 'Partiel';
      default: return 'En attente';
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
        <CircularProgress size={40} />
      </Box>
    );
  }

  if (sessions.length === 0 && !loading) {
    return (
      <Box sx={{ textAlign: 'center', py: 6 }}>
        <Receipt sx={{ fontSize: 64, color: 'action.disabled', mb: 2 }} />
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Aucune échéance pour {annee}
        </Typography>
        <Button variant="contained" onClick={() => setOpenGenerateDialog(true)} startIcon={<Autorenew />}>
          Générer les échéances
        </Button>

        <Dialog open={openGenerateDialog} onClose={() => setOpenGenerateDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Générer les échéances</DialogTitle>
          <DialogContent>
            <Box sx={{ mt: 2 }}>
              <TextField
                fullWidth
                type="number"
                label="Nombre de mois"
                value={generateData.mois}
                onChange={(e) => setGenerateData({ ...generateData, mois: parseInt(e.target.value) || 12 })}
                helperText="Générer les échéances pour les X prochains mois"
                sx={{ mb: 2 }}
              />
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <input type="checkbox" checked={generateData.force} onChange={(e) => setGenerateData({ ...generateData, force: e.target.checked })} />
                <Typography variant="body2">Forcer la régénération (supprime les anciennes)</Typography>
              </Box>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenGenerateDialog(false)}>Annuler</Button>
            <Button variant="contained" onClick={handleGenerateEcheances} disabled={generating}>
              {generating ? 'Génération...' : 'Générer'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    );
  }

  return (
    <Box>
      {/* Stats */}
      {stats && (
        <Grid container spacing={1.5} sx={{ mb: 3 }}>
          <Grid size={{ xs: 6, sm: 3 }}>
            <Card sx={{ bgcolor: '#e8f5e9', borderRadius: 2 }}>
              <CardContent sx={{ p: 1.5, textAlign: 'center' }}>
                <Typography variant="caption" color="text.secondary">Mois payés</Typography>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#2e7d32' }}>
                  {stats.mois_payes}/{stats.total_mois}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 6, sm: 3 }}>
            <Card sx={{ bgcolor: '#e3f2fd', borderRadius: 2 }}>
              <CardContent sx={{ p: 1.5, textAlign: 'center' }}>
                <Typography variant="caption" color="text.secondary">Total payé</Typography>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#1565c0' }}>
                  {formatCurrency(stats.total_paye)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 6, sm: 3 }}>
            <Card sx={{ bgcolor: '#ffebee', borderRadius: 2 }}>
              <CardContent sx={{ p: 1.5, textAlign: 'center' }}>
                <Typography variant="caption" color="text.secondary">Reste à payer</Typography>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#c62828' }}>
                  {formatCurrency(stats.total_impaye)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 6, sm: 3 }}>
            <Card sx={{ bgcolor: '#fff3e0', borderRadius: 2 }}>
              <CardContent sx={{ p: 1.5, textAlign: 'center' }}>
                <Typography variant="caption" color="text.secondary">Taux paiement</Typography>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#f57c00' }}>
                  {stats.taux_paiement}%
                </Typography>
                <LinearProgress variant="determinate" value={stats.taux_paiement} sx={{ mt: 0.5, height: 4 }} />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Navigation année */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <IconButton onClick={() => setAnnee(annee - 1)} size="small"><ChevronLeft /></IconButton>
        <Typography variant="h6">{annee}</Typography>
        <IconButton onClick={() => setAnnee(annee + 1)} size="small"><ChevronRight /></IconButton>
        <IconButton onClick={fetchSessions} size="small"><Refresh /></IconButton>
      </Box>

      {/* Grille 6 cartes */}
      <Grid container spacing={1.5}>
        {sessions.map((session) => {
          const moisIndex = session.mois - 1;
          const total = session.montant_total;
          const paye = session.montant_paye || 0;
          const reste = total - paye;
          const pourcentagePaye = (paye / total) * 100;
          const estComplet = session.statut === 'paye';
          const estPartiel = session.statut === 'partiel' || (paye > 0 && !estComplet);

          return (
            <Grid size={{ xs: 6, sm: 4, md: 3, lg: 2 }} key={session.id}>
              <Card sx={{ 
                borderRadius: 1.5, 
                border: `1px solid ${getStatutColor(session.statut)}40`,
                bgcolor: estComplet ? '#fafafa' : 'white',
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': { transform: 'translateY(-2px)', boxShadow: 1 }
              }}>
                <CardContent sx={{ p: 1.5, textAlign: 'center' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                    <Typography variant="caption" sx={{ fontWeight: 600 }}>
                      {moisNoms[moisIndex].substring(0, 3)}
                    </Typography>
                    {getStatutIcon(session.statut)}
                  </Box>
                  
                  <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                    {formatCurrency(total)}
                  </Typography>
                  
                  <LinearProgress 
                    variant="determinate" 
                    value={pourcentagePaye}
                    sx={{ height: 4, borderRadius: 2, my: 1 }}
                  />
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                    <Typography variant="caption" color="success.main" sx={{ fontSize: '0.6rem' }}>
                      Payé: {formatCurrency(paye)}
                    </Typography>
                    <Typography variant="caption" color="error" sx={{ fontSize: '0.6rem' }}>
                      Reste: {formatCurrency(reste)}
                    </Typography>
                  </Box>
                  
                  <Chip
                    label={estComplet ? 'Payé' : (estPartiel ? `Partiel (${Math.round(pourcentagePaye)}%)` : 'Impayé')}
                    size="small"
                    sx={{ mt: 1, height: 20, fontSize: '0.6rem', bgcolor: getStatutColor(session.statut) + '20' }}
                  />
                  
                  {!estComplet && reste > 0 && (
                    <Button
                      size="small"
                      variant="contained"
                      startIcon={<AttachMoney sx={{ fontSize: 14 }} />}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedSession(session);
                        setOpenPayDialog(true);
                      }}
                      sx={{ mt: 1, fontSize: '0.6rem', py: 0.3 }}
                    >
                      Payer {formatCurrency(reste)}
                    </Button>
                  )}
                  
                  {estComplet && (
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={generatingQuittance === session.id ? <CircularProgress size={12} /> : <PictureAsPdf sx={{ fontSize: 14 }} />}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleGenerateQuittance(session);
                      }}
                      disabled={generatingQuittance === session.id}
                      sx={{ mt: 1, fontSize: '0.6rem', py: 0.3 }}
                    >
                      Quittance
                    </Button>
                  )}
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Dialog de paiement */}
      <Dialog open={openPayDialog} onClose={() => setOpenPayDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Paiement - {selectedSession && `${moisNoms[selectedSession.mois - 1]} ${selectedSession.annee}`}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Paper sx={{ p: 2, mb: 3, bgcolor: '#f8f9fa' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" color="text.secondary">Montant total</Typography>
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  {formatCurrency(selectedSession?.montant_total || 0)}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" color="success.main">Déjà payé</Typography>
                <Typography variant="subtitle1" color="success.main">
                  {formatCurrency(dejaPaye)}
                </Typography>
              </Box>
              <Divider sx={{ my: 1 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="error.main">Reste à payer</Typography>
                <Typography variant="h6" color="error.main">
                  {formatCurrency(restant)}
                </Typography>
              </Box>
            </Paper>

            <TextField
              fullWidth
              label="Référence de paiement"
              value={payData.reference_paiement}
              onChange={(e) => setPayData({ ...payData, reference_paiement: e.target.value })}
              placeholder="Référence auto-générée"
              helperText="La référence est générée automatiquement"
              sx={{ mb: 2 }}
              slotProps={{
                input: {
                  startAdornment: <Autorenew sx={{ mr: 1, color: 'text.secondary' }} />
                }
              }}
            />
            
            <TextField
              fullWidth
              type="number"
              label="Montant à payer"
              value={payData.montant}
              onChange={(e) => {
                const value = parseFloat(e.target.value) || 0;
                if (value <= restant) {
                  setPayData({ ...payData, montant: value });
                }
              }}
              helperText={`Maximum: ${formatCurrency(restant)}`}
              sx={{ mb: 2 }}
              slotProps={{
                htmlInput: { max: restant, min: 0 }
              }}
            />
            
            <TextField
              select
              fullWidth
              label="Mode de paiement"
              value={payData.mode_paiement}
              onChange={(e) => setPayData({ ...payData, mode_paiement: e.target.value })}
            >
              {modesPaiement.map(opt => (
                <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
              ))}
            </TextField>

            {payData.montant > 0 && payData.montant < restant && (
              <Alert severity="info" sx={{ mt: 2 }}>
                💡 Paiement partiel de {formatCurrency(payData.montant)}. 
                Après paiement: Total payé = {formatCurrency(dejaPaye + payData.montant)} | Reste = {formatCurrency(restant - payData.montant)}
              </Alert>
            )}
            
            {payData.montant === restant && restant > 0 && (
              <Alert severity="success" sx={{ mt: 2 }}>
                ✅ Paiement complet du solde restant de {formatCurrency(restant)}. 
                Total payé final: {formatCurrency(selectedSession?.montant_total || 0)}
              </Alert>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPayDialog(false)}>Annuler</Button>
          <Button 
            variant="contained" 
            onClick={handlePaySession} 
            disabled={submitting || payData.montant <= 0 || payData.montant > restant}
          >
            {submitting ? 'Traitement...' : `Payer ${formatCurrency(payData.montant)}`}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar open={!!success} autoHideDuration={5000} onClose={() => setSuccess('')}>
        <Alert severity="success">{success}</Alert>
      </Snackbar>
      <Snackbar open={!!error} autoHideDuration={4000} onClose={() => setError(null)}>
        <Alert severity="error">{error}</Alert>
      </Snackbar>
    </Box>
  );
}