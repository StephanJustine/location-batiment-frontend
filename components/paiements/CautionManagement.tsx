// // src/components/paiements/CautionManagement.tsx
// 'use client';

// import { useState } from 'react';
// import {
//   Box, Card, CardContent, Typography, TextField,
//   Button, Grid, Alert, Dialog, DialogTitle,
//   DialogContent, DialogActions, CircularProgress
// } from '@mui/material';
// import { AccountBalanceWallet, Payment, Refresh } from '@mui/icons-material';
// import { paiementService } from '@/services/paiementService';

// interface Props {
//   bailId: number;
//   cautionMontant: number;
//   onSuccess?: () => void;
// }

// export default function CautionManagement({ bailId, cautionMontant, onSuccess }: Props) {
//   const [openEncaissement, setOpenEncaissement] = useState(false);
//   const [openRestitution, setOpenRestitution] = useState(false);
//   const [montant, setMontant] = useState(cautionMontant);
//   const [retenues, setRetenues] = useState(0);
//   const [motif, setMotif] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');

//   const handleEncaisser = async () => {
//     setLoading(true);
//     setError('');
//     try {
//       await paiementService.encaisserCaution(bailId, montant);
//       setSuccess('Caution encaissée avec succès');
//       setOpenEncaissement(false);
//       onSuccess?.();
//     } catch (err: any) {
//       setError(err.response?.data?.detail || 'Erreur lors de l\'encaissement');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleRestituer = async () => {
//     setLoading(true);
//     setError('');
//     try {
//       const montantNet = montant - retenues;
//       await paiementService.restituerCaution(bailId, montantNet, retenues, motif);
//       setSuccess('Caution restituée avec succès');
//       setOpenRestitution(false);
//       onSuccess?.();
//     } catch (err: any) {
//       setError(err.response?.data?.detail || 'Erreur lors de la restitution');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Box>
//       <Card sx={{ borderRadius: 2 }}>
//         <CardContent>
//           <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
//             Gestion de la caution
//           </Typography>
//           <Typography variant="h4" sx={{ fontWeight: 700, color: '#2e7d32', mb: 2 }}>
//             {cautionMontant.toLocaleString()} Ar
//           </Typography>
//           <Box sx={{ display: 'flex', gap: 2 }}>
//             <Button
//               variant="contained"
//               startIcon={<Payment />}
//               onClick={() => setOpenEncaissement(true)}
//               size="small"
//             >
//               Encaisser
//             </Button>
//             <Button
//               variant="outlined"
//               startIcon={<Refresh />}
//               onClick={() => setOpenRestitution(true)}
//               size="small"
//               color="warning"
//             >
//               Restituer
//             </Button>
//           </Box>
//         </CardContent>
//       </Card>

//       {success && (
//         <Alert severity="success" sx={{ mt: 2 }} onClose={() => setSuccess('')}>
//           {success}
//         </Alert>
//       )}

//       {/* Dialog Encaissement */}
//       <Dialog open={openEncaissement} onClose={() => setOpenEncaissement(false)} maxWidth="xs" fullWidth>
//         <DialogTitle>Encaissement de la caution</DialogTitle>
//         <DialogContent>
//           {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
//           <TextField
//             fullWidth
//             label="Montant (Ar)"
//             type="number"
//             value={montant}
//             onChange={(e) => setMontant(Number(e.target.value))}
//             sx={{ mt: 1 }}
//           />
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setOpenEncaissement(false)}>Annuler</Button>
//           <Button onClick={handleEncaisser} variant="contained" disabled={loading}>
//             {loading ? <CircularProgress size={20} /> : 'Encaisser'}
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* Dialog Restitution */}
//       <Dialog open={openRestitution} onClose={() => setOpenRestitution(false)} maxWidth="sm" fullWidth>
//         <DialogTitle>Restitution de la caution</DialogTitle>
//         <DialogContent>
//           {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
//           <Grid container spacing={2} sx={{ mt: 0.5 }}>
//             <Grid size={{ xs: 12 }}>
//               <TextField
//                 fullWidth
//                 label="Montant initial (Ar)"
//                 type="number"
//                 value={montant}
//                 onChange={(e) => setMontant(Number(e.target.value))}
//               />
//             </Grid>
//             <Grid size={{ xs: 12 }}>
//               <TextField
//                 fullWidth
//                 label="Retenues (Ar)"
//                 type="number"
//                 value={retenues}
//                 onChange={(e) => setRetenues(Number(e.target.value))}
//               />
//             </Grid>
//             <Grid size={{ xs: 12 }}>
//               <TextField
//                 fullWidth
//                 label="Montant net à restituer (Ar)"
//                 value={(montant - retenues).toLocaleString()}
//                 disabled
//               />
//             </Grid>
//             <Grid size={{ xs: 12 }}>
//               <TextField
//                 fullWidth
//                 label="Motif des retenues"
//                 multiline
//                 rows={3}
//                 value={motif}
//                 onChange={(e) => setMotif(e.target.value)}
//               />
//             </Grid>
//           </Grid>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setOpenRestitution(false)}>Annuler</Button>
//           <Button onClick={handleRestituer} variant="contained" color="warning" disabled={loading}>
//             {loading ? <CircularProgress size={20} /> : 'Restituer'}
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Box>
//   );
// }


// components/paiements/CautionManagement.tsx
'use client';

import { useState } from 'react';
import {
  Box, Card, CardContent, Typography, TextField,
  Button, Grid, Alert, Dialog, DialogTitle,
  DialogContent, DialogActions, CircularProgress,
  FormControl, InputLabel, Select, MenuItem,
  InputAdornment, Chip, Divider, Stack
} from '@mui/material';
import { 
  AccountBalanceWallet, Payment, Refresh, 
  Description, AttachMoney, Receipt,
  Note, Save, Close, Warning
} from '@mui/icons-material';
import { paiementService } from '@/services/paiementService';
import { TypePaiement, ModePaiement } from '@/types/paiement';

interface Props {
  bailId: number;
  cautionMontant: number;
  onSuccess?: () => void;
}

export default function CautionManagement({ bailId, cautionMontant, onSuccess }: Props) {
  const [openEncaissement, setOpenEncaissement] = useState(false);
  const [openRestitution, setOpenRestitution] = useState(false);
  const [montant, setMontant] = useState(cautionMontant);
  const [retenues, setRetenues] = useState(0);
  const [motif, setMotif] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Nouveaux champs pour l'encaissement
  const [typePaiement, setTypePaiement] = useState<TypePaiement>(TypePaiement.CAUTION);
  const [modePaiement, setModePaiement] = useState<ModePaiement>(ModePaiement.VIREMENT);
  const [notes, setNotes] = useState('');
  const [datePaiement, setDatePaiement] = useState(new Date().toISOString().split('T')[0]);
  const [reference, setReference] = useState('');

  const getTypeLabel = (type: TypePaiement) => {
    const labels = {
      [TypePaiement.LOYER]: 'Loyer',
      [TypePaiement.CHARGE]: 'Charge',
      [TypePaiement.CAUTION]: 'Caution',
      [TypePaiement.PENALITE]: 'Pénalité',
      [TypePaiement.REGULARISATION]: 'Régularisation',
      [TypePaiement.AUTRE]: 'Autre'
    };
    return labels[type] || type;
  };

  const getTypeColor = (type: TypePaiement) => {
    const colors = {
      [TypePaiement.LOYER]: '#059669',
      [TypePaiement.CHARGE]: '#7c3aed',
      [TypePaiement.CAUTION]: '#2563eb',
      [TypePaiement.PENALITE]: '#dc2626',
      [TypePaiement.REGULARISATION]: '#f59e0b',
      [TypePaiement.AUTRE]: '#64748b'
    };
    return colors[type] || '#64748b';
  };

  const modeOptions = [
    { value: ModePaiement.VIREMENT, label: 'Virement bancaire' },
    { value: ModePaiement.ESPECES, label: 'Espèces' },
    { value: ModePaiement.CHEQUE, label: 'Chèque' },
    { value: ModePaiement.MVOLA, label: 'MVola' },
    { value: ModePaiement.ORANGE_MONEY, label: 'Orange Money' },
    { value: ModePaiement.AIRTEL_MONEY, label: 'Airtel Money' }
  ];

  const handleEncaisser = async () => {
    if (montant <= 0) {
      setError('Le montant doit être supérieur à 0');
      return;
    }

    setLoading(true);
    setError('');
    try {
      // Construire les notes avec les détails
      let noteComplete = notes || '';
      if (typePaiement === TypePaiement.CAUTION) {
        noteComplete = `💰 CAUTION\nMontant: ${montant.toLocaleString()} Ar\nMode: ${modePaiement}\nDate: ${datePaiement}\n${notes ? `\n📝 ${notes}` : ''}`;
      } else {
        noteComplete = `📋 PAIEMENT\nType: ${getTypeLabel(typePaiement)}\nMontant: ${montant.toLocaleString()} Ar\nMode: ${modePaiement}\nDate: ${datePaiement}\n${notes ? `\n📝 ${notes}` : ''}`;
      }

      const data = {
        bail_id: bailId,
        montant: montant,
        type_paiement: typePaiement,
        mode_paiement: modePaiement,
        date_echeance: `${datePaiement}T00:00:00`,
        reference_paiement: reference || `CAUT-${Date.now()}`,
        notes: noteComplete,
        mois_concerne: new Date().getMonth() + 1,
        annee_concernee: new Date().getFullYear()
      };

      await paiementService.create(data);
      setSuccess('Paiement enregistré avec succès');
      setOpenEncaissement(false);
      onSuccess?.();
      
      // Réinitialiser
      setMontant(cautionMontant);
      setNotes('');
      setReference('');
      setTypePaiement(TypePaiement.CAUTION);
      setModePaiement(ModePaiement.VIREMENT);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Erreur lors de l\'encaissement');
    } finally {
      setLoading(false);
    }
  };

  const handleRestituer = async () => {
    if (montant <= 0) {
      setError('Le montant doit être supérieur à 0');
      return;
    }

    setLoading(true);
    setError('');
    try {
      // Pour la restitution, on utilise le type CAUTION avec mention restitution
      const noteComplete = `🔄 RESTITUTION DE CAUTION\nMontant initial: ${(montant + retenues).toLocaleString()} Ar\nRetenues: ${retenues.toLocaleString()} Ar\nMontant net: ${(montant - retenues).toLocaleString()} Ar\nMotif: ${motif || 'Aucun motif'}\n${notes ? `\n📝 ${notes}` : ''}`;

      const data = {
        bail_id: bailId,
        montant: montant - retenues,
        type_paiement: TypePaiement.CAUTION,
        mode_paiement: modePaiement,
        date_echeance: `${datePaiement}T00:00:00`,
        reference_paiement: reference || `REST-${Date.now()}`,
        notes: noteComplete,
        mois_concerne: new Date().getMonth() + 1,
        annee_concernee: new Date().getFullYear()
      };

      await paiementService.create(data);
      setSuccess('Caution restituée avec succès');
      setOpenRestitution(false);
      onSuccess?.();
      
      // Réinitialiser
      setMontant(cautionMontant);
      setRetenues(0);
      setMotif('');
      setNotes('');
      setReference('');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Erreur lors de la restitution');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setMontant(cautionMontant);
    setNotes('');
    setReference('');
    setTypePaiement(TypePaiement.CAUTION);
    setModePaiement(ModePaiement.VIREMENT);
    setError('');
    setSuccess('');
  };

  return (
    <Box>
      <Card sx={{ borderRadius: 2, border: '1px solid #e2e8f0' }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
              <AccountBalanceWallet sx={{ color: '#2e7d32' }} />
              Gestion de la caution et Charges
            </Typography>
            <Chip 
              label={`${cautionMontant.toLocaleString()} Ar`} 
              color="primary" 
              size="small" 
            />
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
            <Button
              variant="contained"
              startIcon={<Payment />}
              onClick={() => {
                resetForm();
                setOpenEncaissement(true);
              }}
              size="small"
              sx={{ textTransform: 'none' }}
            >
              Encaisser
            </Button>
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={() => {
                resetForm();
                setOpenRestitution(true);
              }}
              size="small"
              color="warning"
              sx={{ textTransform: 'none' }}
            >
              Restituer
            </Button>
          </Box>
        </CardContent>
      </Card>

      {success && (
        <Alert severity="success" sx={{ mt: 2 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      {/* Dialog Encaissement */}
      <Dialog open={openEncaissement} onClose={() => setOpenEncaissement(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Payment sx={{ color: '#2e7d32' }} />
            <Typography variant="h6">Encaissement de la caution et Charges</Typography>
          </Box>
          <Button size="small" onClick={() => setOpenEncaissement(false)}>Fermer</Button>
        </DialogTitle>
        
        <DialogContent dividers>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          
          <Stack spacing={2.5} sx={{ mt: 1 }}>
            {/* Type de paiement */}
            <FormControl fullWidth size="small">
              <InputLabel>Type de paiement *</InputLabel>
              <Select
                value={typePaiement}
                onChange={(e) => setTypePaiement(e.target.value as TypePaiement)}
                label="Type de paiement *"
              >
                {Object.values(TypePaiement).map((type) => (
                  <MenuItem key={type} value={type} sx={{ color: getTypeColor(type) }}>
                    {type === TypePaiement.CAUTION && <AttachMoney sx={{ mr: 1, fontSize: 16 }} />}
                    {type === TypePaiement.CHARGE && <Description sx={{ mr: 1, fontSize: 16 }} />}
                    {type === TypePaiement.LOYER && <Receipt sx={{ mr: 1, fontSize: 16 }} />}
                    {getTypeLabel(type)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Montant */}
            <TextField
              fullWidth
              size="small"
              label="Montant (Ar)"
              type="number"
              value={montant}
              onChange={(e) => setMontant(Number(e.target.value))}
              required
              slotProps={{
                htmlInput: { min: 0, step: 100 },
                input: { startAdornment: <InputAdornment position="start">Ar</InputAdornment> }
              }}
            />

            {/* Mode de paiement */}
            <FormControl fullWidth size="small">
              <InputLabel>Mode de paiement *</InputLabel>
              <Select
                value={modePaiement}
                onChange={(e) => setModePaiement(e.target.value as ModePaiement)}
                label="Mode de paiement *"
              >
                {modeOptions.map((mode) => (
                  <MenuItem key={mode.value} value={mode.value}>{mode.label}</MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Date de paiement */}
            <TextField
              fullWidth
              size="small"
              label="Date de paiement"
              type="date"
              value={datePaiement}
              onChange={(e) => setDatePaiement(e.target.value)}
              slotProps={{ inputLabel: { shrink: true } }}
            />

            {/* Notes */}
            <TextField
              fullWidth
              size="small"
              label="Notes"
              multiline
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Notes supplémentaires..."
              slotProps={{
                input: { 
                  startAdornment: <InputAdornment position="start"><Note sx={{ color: '#94a3b8', fontSize: 18 }} /></InputAdornment>
                }
              }}
            />
          </Stack>
        </DialogContent>
        
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenEncaissement(false)} disabled={loading}>
            Annuler
          </Button>
          <Button 
            onClick={handleEncaisser} 
            variant="contained" 
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Save />}
            sx={{ bgcolor: '#2e7d32', '&:hover': { bgcolor: '#1b5e20' } }}
          >
            {loading ? 'Enregistrement...' : 'Encaisser'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog Restitution */}
      <Dialog open={openRestitution} onClose={() => setOpenRestitution(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Refresh sx={{ color: '#f59e0b' }} />
            <Typography variant="h6">Restitution de la caution</Typography>
          </Box>
          <Button size="small" onClick={() => setOpenRestitution(false)}>Fermer</Button>
        </DialogTitle>
        
        <DialogContent dividers>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          
          <Stack spacing={2.5} sx={{ mt: 1 }}>
            {/* Montant initial */}
            <TextField
              fullWidth
              size="small"
              label="Montant initial (Ar)"
              type="number"
              value={montant}
              onChange={(e) => setMontant(Number(e.target.value))}
              slotProps={{
                htmlInput: { min: 0 },
                input: { startAdornment: <InputAdornment position="start">Ar</InputAdornment> }
              }}
            />

            {/* Retenues */}
            <TextField
              fullWidth
              size="small"
              label="Retenues (Ar)"
              type="number"
              value={retenues}
              onChange={(e) => setRetenues(Number(e.target.value))}
              slotProps={{
                htmlInput: { min: 0 },
                input: { startAdornment: <InputAdornment position="start">Ar</InputAdornment> }
              }}
            />

            {/* Montant net */}
            <Box sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: 2 }}>
              <Typography variant="caption" color="text.secondary">Montant net à restituer</Typography>
              <Typography variant="h5" sx={{ fontWeight: 700, color: '#059669' }}>
                {(montant - retenues).toLocaleString()} Ar
              </Typography>
            </Box>

            {/* Motif des retenues */}
            <TextField
              fullWidth
              size="small"
              label="Motif des retenues"
              multiline
              rows={3}
              value={motif}
              onChange={(e) => setMotif(e.target.value)}
              placeholder="Détail des retenues..."
              slotProps={{
                input: { startAdornment: <InputAdornment position="start"><Warning sx={{ color: '#94a3b8', fontSize: 18 }} /></InputAdornment> }
              }}
            />

            {/* Mode de paiement pour la restitution */}
            <FormControl fullWidth size="small">
              <InputLabel>Mode de paiement</InputLabel>
              <Select
                value={modePaiement}
                onChange={(e) => setModePaiement(e.target.value as ModePaiement)}
                label="Mode de paiement"
              >
                {modeOptions.map((mode) => (
                  <MenuItem key={mode.value} value={mode.value}>{mode.label}</MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Date de restitution */}
            <TextField
              fullWidth
              size="small"
              label="Date de restitution"
              type="date"
              value={datePaiement}
              onChange={(e) => setDatePaiement(e.target.value)}
              slotProps={{ inputLabel: { shrink: true } }}
            />

            {/* Notes supplémentaires */}
            <TextField
              fullWidth
              size="small"
              label="Notes supplémentaires"
              multiline
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Informations complémentaires..."
              slotProps={{
                input: { 
                  startAdornment: <InputAdornment position="start"><Note sx={{ color: '#94a3b8', fontSize: 18 }} /></InputAdornment>
                }
              }}
            />
          </Stack>
        </DialogContent>
        
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenRestitution(false)} disabled={loading}>
            Annuler
          </Button>
          <Button 
            onClick={handleRestituer} 
            variant="contained" 
            color="warning"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Refresh />}
          >
            {loading ? 'Enregistrement...' : 'Restituer'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}