// // src/components/paiements/PaiementForm.tsx
// 'use client';

// import { useState, useEffect } from 'react';
// import { useForm, Controller } from 'react-hook-form';
// import { 
//   Box, Button, Card, CardContent, TextField, Typography, 
//   MenuItem, CircularProgress, Alert, Grid, FormControl,
//   InputLabel, Select
// } from '@mui/material';
// import { Save, Cancel } from '@mui/icons-material';
// import { paiementService } from '@/services/paiementService';
// import { bailService } from '@/services/bailService';
// import { ModePaiement, TypePaiement, PaiementCreate } from '@/types/paiement';

// interface Props {
//   initialData?: Partial<PaiementCreate>;
//   onSubmit: (data: PaiementCreate) => void;
//   onCancel: () => void;
//   loading?: boolean;
//   bailId?: number;
// }

// const modePaiementOptions = [
//   { value: ModePaiement.VIREMENT, label: 'Virement' },
//   { value: ModePaiement.ESPECES, label: 'Espèces' },
//   { value: ModePaiement.CHEQUE, label: 'Chèque' },
//   { value: ModePaiement.MVOLA, label: 'MVola' },
//   { value: ModePaiement.ORANGE_MONEY, label: 'Orange Money' },
//   { value: ModePaiement.AIRTEL_MONEY, label: 'Airtel Money' }
// ];

// const typePaiementOptions = [
//   { value: TypePaiement.LOYER, label: 'Loyer' },
//   { value: TypePaiement.CHARGE, label: 'Charges' },
//   { value: TypePaiement.CAUTION, label: 'Caution' },
//   { value: TypePaiement.PENALITE, label: 'Pénalités' },
//   { value: TypePaiement.REGULARISATION, label: 'Régularisation' },
//   { value: TypePaiement.AUTRE, label: 'Autre' }
// ];

// export default function PaiementForm({ initialData, onSubmit, onCancel, loading, bailId }: Props) {
//   const [baux, setBaux] = useState<any[]>([]);
//   const [loadingBaux, setLoadingBaux] = useState(true);
//   const [error, setError] = useState('');

//   const { control, handleSubmit, watch, formState: { errors } } = useForm<PaiementCreate>({
//     defaultValues: {
//       bail_id: initialData?.bail_id || bailId || 0,
//       montant: initialData?.montant || 0,
//       date_echeance: initialData?.date_echeance?.split('T')[0] || new Date().toISOString().split('T')[0],
//       type_paiement: initialData?.type_paiement || TypePaiement.LOYER,
//       mode_paiement: initialData?.mode_paiement || ModePaiement.VIREMENT,
//       mois_concerne: initialData?.mois_concerne || new Date().getMonth() + 1,
//       annee_concernee: initialData?.annee_concernee || new Date().getFullYear(),
//       reference_paiement: initialData?.reference_paiement || '',
//       notes: initialData?.notes || ''
//     }
//   });

//   useEffect(() => {
//     const fetchBaux = async () => {
//       try {
//         const data = await bailService.getAll({ statut: 'actif', limit: 200 });
//         setBaux(Array.isArray(data) ? data : []);
//       } catch (err) {
//         console.error('Erreur chargement baux:', err);
//         setError('Erreur chargement des contrats');
//       } finally {
//         setLoadingBaux(false);
//       }
//     };
//     fetchBaux();
//   }, []);

//   const formatDateForAPI = (date: string): string => {
//     if (!date) return '';
//     if (date.includes('T')) return date;
//     return `${date}T00:00:00`;
//   };

//   const handleFormSubmit = (data: PaiementCreate) => {
//     const formattedData = {
//       ...data,
//       date_echeance: formatDateForAPI(data.date_echeance)
//     };
//     onSubmit(formattedData);
//   };

//   const selectedBail = watch('bail_id');

//   if (loadingBaux) {
//     return (
//       <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
//         <CircularProgress size={32} />
//       </Box>
//     );
//   }

//   return (
//     <Card elevation={0} sx={{ borderRadius: 2, border: '1px solid #e2e8f0' }}>
//       <CardContent sx={{ p: 3 }}>
//         <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Enregistrer un paiement</Typography>
        
//         {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        
//         <Box component="form" onSubmit={handleSubmit(handleFormSubmit)}>
//           <Grid container spacing={2}>
//             {/* Bail */}
//             <Grid size={{ xs: 12 }}>
//               <Controller
//                 name="bail_id"
//                 control={control}
//                 rules={{ required: 'Le bail est requis' }}
//                 render={({ field }) => (
//                   <FormControl fullWidth size="small" error={!!errors.bail_id}>
//                     <InputLabel>Contrat de bail *</InputLabel>
//                     <Select {...field} label="Contrat de bail *" disabled={!!bailId}>
//                       {baux.map((b: any) => (
//                         <MenuItem key={b.id} value={b.id}>
//                           {b.numero_contrat} - {b.locataire_nom} {b.locataire_prenom}
//                         </MenuItem>
//                       ))}
//                     </Select>
//                   </FormControl>
//                 )}
//               />
//             </Grid>

//             {/* Montant */}
//             <Grid size={{ xs: 12, sm: 6 }}>
//               <Controller
//                 name="montant"
//                 control={control}
//                 rules={{ required: 'Le montant est requis', min: 1 }}
//                 render={({ field }) => (
//                   <TextField
//                     {...field}
//                     fullWidth size="small"
//                     label="Montant (Ar) *"
//                     type="number"
//                     error={!!errors.montant}
//                     helperText={errors.montant?.message}
//                     onChange={(e) => field.onChange(Number(e.target.value))}
//                   />
//                 )}
//               />
//             </Grid>

//             {/* Date échéance */}
//             <Grid size={{ xs: 12, sm: 6 }}>
//               <Controller
//                 name="date_echeance"
//                 control={control}
//                 rules={{ required: 'La date est requise' }}
//                 render={({ field }) => (
//                   <TextField
//                     {...field}
//                     fullWidth size="small"
//                     label="Date d'échéance *"
//                     type="date"
//                     slotProps={{ inputLabel: { shrink: true } }}
//                     error={!!errors.date_echeance}
//                     helperText={errors.date_echeance?.message}
//                   />
//                 )}
//               />
//             </Grid>

//             {/* Type paiement */}
//             <Grid size={{ xs: 12, sm: 6 }}>
//               <Controller
//                 name="type_paiement"
//                 control={control}
//                 render={({ field }) => (
//                   <FormControl fullWidth size="small">
//                     <InputLabel>Type de paiement</InputLabel>
//                     <Select {...field} label="Type de paiement">
//                       {typePaiementOptions.map(opt => (
//                         <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
//                       ))}
//                     </Select>
//                   </FormControl>
//                 )}
//               />
//             </Grid>

//             {/* Mode paiement */}
//             <Grid size={{ xs: 12, sm: 6 }}>
//               <Controller
//                 name="mode_paiement"
//                 control={control}
//                 render={({ field }) => (
//                   <FormControl fullWidth size="small">
//                     <InputLabel>Mode de paiement</InputLabel>
//                     <Select {...field} label="Mode de paiement">
//                       {modePaiementOptions.map(opt => (
//                         <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
//                       ))}
//                     </Select>
//                   </FormControl>
//                 )}
//               />
//             </Grid>

//             {/* Période */}
//             <Grid size={{ xs: 6 }}>
//               <Controller
//                 name="mois_concerne"
//                 control={control}
//                 render={({ field }) => (
//                   <TextField
//                     {...field}
//                     fullWidth size="small"
//                     label="Mois"
//                     type="number"
//                     slotProps={{ htmlInput: { min: 1, max: 12 } }}
//                     onChange={(e) => field.onChange(Number(e.target.value))}
//                   />
//                 )}
//               />
//             </Grid>

//             <Grid size={{ xs: 6 }}>
//               <Controller
//                 name="annee_concernee"
//                 control={control}
//                 render={({ field }) => (
//                   <TextField
//                     {...field}
//                     fullWidth size="small"
//                     label="Année"
//                     type="number"
//                     onChange={(e) => field.onChange(Number(e.target.value))}
//                   />
//                 )}
//               />
//             </Grid>

//             {/* Référence */}
//             <Grid size={{ xs: 12 }}>
//               <Controller
//                 name="reference_paiement"
//                 control={control}
//                 render={({ field }) => (
//                   <TextField {...field} fullWidth size="small" label="Référence de paiement" />
//                 )}
//               />
//             </Grid>

//             {/* Notes */}
//             <Grid size={{ xs: 12 }}>
//               <Controller
//                 name="notes"
//                 control={control}
//                 render={({ field }) => (
//                   <TextField {...field} fullWidth size="small" label="Notes" multiline rows={2} />
//                 )}
//               />
//             </Grid>
//           </Grid>

//           <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
//             <Button onClick={onCancel} variant="outlined" startIcon={<Cancel />} disabled={loading}>
//               Annuler
//             </Button>
//             <Button type="submit" variant="contained" startIcon={<Save />} disabled={loading}>
//               {loading ? 'Enregistrement...' : 'Enregistrer'}
//             </Button>
//           </Box>
//         </Box>
//       </CardContent>
//     </Card>
//   );
// }

// src/components/paiements/PaiementForm.tsx
'use client';

import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { 
  Box, Button, Card, CardContent, TextField, Typography, 
  MenuItem, CircularProgress, Alert, Grid, FormControl,
  InputLabel, Select, IconButton, Tooltip
} from '@mui/material';
import { Save, Cancel, Refresh, Receipt, Autorenew } from '@mui/icons-material';
import { paiementService } from '@/services/paiementService';
import { bailService } from '@/services/bailService';
import { ModePaiement, TypePaiement, PaiementCreate } from '@/types/paiement';

interface Props {
  initialData?: Partial<PaiementCreate>;
  onSubmit: (data: PaiementCreate) => void;
  onCancel: () => void;
  loading?: boolean;
  bailId?: number;
}

const modePaiementOptions = [
  { value: ModePaiement.VIREMENT, label: '🏦 Virement' },
  { value: ModePaiement.ESPECES, label: '💵 Espèces' },
  { value: ModePaiement.CHEQUE, label: '📝 Chèque' },
  { value: ModePaiement.MVOLA, label: '📱 MVola' },
  { value: ModePaiement.ORANGE_MONEY, label: '📱 Orange Money' },
  { value: ModePaiement.AIRTEL_MONEY, label: '📱 Airtel Money' }
];

const typePaiementOptions = [
  { value: TypePaiement.LOYER, label: '🏠 Loyer' },
  { value: TypePaiement.CHARGE, label: '⚡ Charges' },
  { value: TypePaiement.CAUTION, label: '🔒 Caution' },
  { value: TypePaiement.PENALITE, label: '⚠️ Pénalités' },
  { value: TypePaiement.REGULARISATION, label: '🔄 Régularisation' },
  { value: TypePaiement.AUTRE, label: '📌 Autre' }
];

export default function PaiementForm({ initialData, onSubmit, onCancel, loading, bailId: fixedBailId }: Props) {
  const [baux, setBaux] = useState<any[]>([]);
  const [loadingBaux, setLoadingBaux] = useState(true);
  const [error, setError] = useState('');
  const [generatingRef, setGeneratingRef] = useState(false);
  const [autoReference, setAutoReference] = useState('');
  const [generatedSuccess, setGeneratedSuccess] = useState('');

  const { control, handleSubmit, watch, setValue, formState: { errors } } = useForm<PaiementCreate>({
    defaultValues: {
      bail_id: initialData?.bail_id || fixedBailId || 0,
      montant: initialData?.montant || 0,
      date_echeance: initialData?.date_echeance?.split('T')[0] || new Date().toISOString().split('T')[0],
      type_paiement: initialData?.type_paiement || TypePaiement.LOYER,
      mode_paiement: initialData?.mode_paiement || ModePaiement.VIREMENT,
      mois_concerne: initialData?.mois_concerne || new Date().getMonth() + 1,
      annee_concernee: initialData?.annee_concernee || new Date().getFullYear(),
      reference_paiement: initialData?.reference_paiement || '',
      notes: initialData?.notes || ''
    }
  });

  const selectedBailId = watch('bail_id');

  // 🔥 Générer la référence automatiquement
  const generateReference = async () => {
    const bailId = selectedBailId || fixedBailId;
    if (!bailId) return;
    
    setGeneratingRef(true);
    try {
      const reference = await paiementService.generateReference(bailId);
      setAutoReference(reference);
      setValue('reference_paiement', reference);
      setGeneratedSuccess('Référence générée automatiquement');
      setTimeout(() => setGeneratedSuccess(''), 3000);
    } catch (err) {
      console.error('Erreur génération:', err);
      // Fallback
      const fallbackRef = `PAY-${bailId}-${Date.now()}`;
      setAutoReference(fallbackRef);
      setValue('reference_paiement', fallbackRef);
    } finally {
      setGeneratingRef(false);
    }
  };

  // 🔥 Générer au chargement si bailId est présent
  useEffect(() => {
    if ((selectedBailId || fixedBailId) && !autoReference) {
      generateReference();
    }
  }, [selectedBailId, fixedBailId]);

  useEffect(() => {
    const fetchBaux = async () => {
      try {
        const data = await bailService.getAll({ statut: 'actif', limit: 200 });
        setBaux(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Erreur chargement baux:', err);
        setError('Erreur chargement des contrats');
      } finally {
        setLoadingBaux(false);
      }
    };
    fetchBaux();
  }, []);

  const formatDateForAPI = (date: string): string => {
    if (!date) return '';
    if (date.includes('T')) return date;
    return `${date}T00:00:00`;
  };

  const handleFormSubmit = (data: PaiementCreate) => {
    const formattedData = {
      ...data,
      date_echeance: formatDateForAPI(data.date_echeance),
      reference_paiement: data.reference_paiement || autoReference,
      numero_quittance: data.reference_paiement || autoReference
    };
    onSubmit(formattedData);
  };

  if (loadingBaux) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress size={32} />
      </Box>
    );
  }

  return (
    <Card elevation={0} sx={{ borderRadius: 2, border: '1px solid #e2e8f0' }}>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Enregistrer un paiement</Typography>
        
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {generatedSuccess && <Alert severity="success" sx={{ mb: 2 }}>{generatedSuccess}</Alert>}
        
        <Box component="form" onSubmit={handleSubmit(handleFormSubmit)}>
          <Grid container spacing={2}>
            {/* Bail */}
            <Grid size={{ xs: 12 }}>
              <Controller
                name="bail_id"
                control={control}
                rules={{ required: 'Le bail est requis' }}
                render={({ field }) => (
                  <FormControl fullWidth size="small" error={!!errors.bail_id}>
                    <InputLabel>Contrat de bail *</InputLabel>
                    <Select 
                      {...field} 
                      label="Contrat de bail *" 
                      disabled={!!fixedBailId}
                      onChange={(e) => {
                        field.onChange(e);
                        setAutoReference(''); // Reset reference
                        setTimeout(() => generateReference(), 100);
                      }}
                    >
                      {baux.map((b: any) => (
                        <MenuItem key={b.id} value={b.id}>
                          {b.numero_contrat} - {b.locataire_nom} {b.locataire_prenom}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>

            {/* Référence auto-générée */}
            <Grid size={{ xs: 12 }}>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <TextField
                  fullWidth
                  size="small"
                  label="N° Quittance / Référence"
                  value={autoReference}
                  disabled
                  helperText="Référence générée automatiquement"
                  slotProps={{
                    input: {
                      startAdornment: <Autorenew sx={{ mr: 1, color: 'success.main' }} fontSize="small" />
                    }
                  }}
                />
                <Tooltip title="Régénérer la référence">
                  <IconButton 
                    onClick={generateReference} 
                    disabled={generatingRef || !selectedBailId}
                    size="small"
                    sx={{ bgcolor: '#f5f5f5' }}
                  >
                    {generatingRef ? <CircularProgress size={20} /> : <Refresh />}
                  </IconButton>
                </Tooltip>
              </Box>
            </Grid>

            {/* Montant */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name="montant"
                control={control}
                rules={{ required: 'Le montant est requis', min: 1 }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    size="small"
                    label="Montant (Ar) *"
                    type="number"
                    error={!!errors.montant}
                    helperText={errors.montant?.message}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                )}
              />
            </Grid>

            {/* Date échéance */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name="date_echeance"
                control={control}
                rules={{ required: 'La date est requise' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    size="small"
                    label="Date d'échéance *"
                    type="date"
                    slotProps={{ inputLabel: { shrink: true } }}
                    error={!!errors.date_echeance}
                    helperText={errors.date_echeance?.message}
                  />
                )}
              />
            </Grid>

            {/* Type paiement */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name="type_paiement"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth size="small">
                    <InputLabel>Type de paiement</InputLabel>
                    <Select {...field} label="Type de paiement">
                      {typePaiementOptions.map(opt => (
                        <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>

            {/* Mode paiement */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name="mode_paiement"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth size="small">
                    <InputLabel>Mode de paiement</InputLabel>
                    <Select {...field} label="Mode de paiement">
                      {modePaiementOptions.map(opt => (
                        <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>

            {/* Période */}
            <Grid size={{ xs: 6 }}>
              <Controller
                name="mois_concerne"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    size="small"
                    label="Mois concerné"
                    type="number"
                    slotProps={{ htmlInput: { min: 1, max: 12 } }}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 6 }}>
              <Controller
                name="annee_concernee"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    size="small"
                    label="Année concernée"
                    type="number"
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                )}
              />
            </Grid>

            {/* Notes */}
            <Grid size={{ xs: 12 }}>
              <Controller
                name="notes"
                control={control}
                render={({ field }) => (
                  <TextField {...field} fullWidth size="small" label="Notes" multiline rows={2} />
                )}
              />
            </Grid>
          </Grid>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
            <Button onClick={onCancel} variant="outlined" startIcon={<Cancel />} disabled={loading}>
              Annuler
            </Button>
            <Button 
              type="submit" 
              variant="contained" 
              startIcon={loading ? <CircularProgress size={16} /> : <Save />} 
              disabled={loading || !autoReference}
            >
              {loading ? 'Enregistrement...' : 'Enregistrer'}
            </Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}