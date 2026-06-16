'use client';

import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { 
  Box, Button, Card, CardContent, TextField, Typography, 
  MenuItem, CircularProgress, Alert, Grid, FormControl,
  InputLabel, Select, IconButton, Tooltip, Divider,
  Chip, Stack, FormHelperText, Paper
} from '@mui/material';
import { 
  Save, Cancel, Refresh, Receipt, Autorenew, 
  AttachMoney, Person, Home,
  Warning, Schedule
} from '@mui/icons-material';
import { paiementService } from '@/services/paiementService';
import { paiementSessionService } from '@/services/paiementSessionService';
import { bailService } from '@/services/bailService';
import { ModePaiement, TypePaiement, PaiementCreate } from '@/types/paiement';
import { PaiementSession } from '@/types/paiementSession';
import { formatCurrency } from '@/utils/formatters';

interface Props {
  initialData?: Partial<PaiementCreate>;
  onSubmit: (data: PaiementCreate) => void;
  onCancel: () => void;
  loading?: boolean;
  bailId?: number;
  sessionId?: number;
}

interface BailInfo {
  id: number;
  numero_contrat: string;
  locataire_nom: string;
  locataire_prenom: string;
  locataire_id: number;
  loyer_mensuel: number;
  charges_mensuelles: number;
  logement_numero: string;
}

const modePaiementOptions = [
  { value: ModePaiement.VIREMENT, label: '🏦 Virement', description: 'Virement bancaire' },
  { value: ModePaiement.ESPECES, label: '💵 Espèces', description: 'Paiement en espèces' },
  { value: ModePaiement.CHEQUE, label: '📝 Chèque', description: 'Chèque bancaire' },
  { value: ModePaiement.MVOLA, label: '📱 MVola', description: 'Paiement mobile MVola' },
  { value: ModePaiement.ORANGE_MONEY, label: '📱 Orange Money', description: 'Paiement mobile Orange Money' },
  { value: ModePaiement.AIRTEL_MONEY, label: '📱 Airtel Money', description: 'Paiement mobile Airtel Money' }
];

const typePaiementOptions = [
  { value: TypePaiement.LOYER, label: '🏠 Loyer', description: 'Paiement du loyer mensuel' },
  { value: TypePaiement.CHARGE, label: '⚡ Charges', description: 'Paiement des charges' },
  { value: TypePaiement.CAUTION, label: '🔒 Caution', description: 'Dépôt de garantie' },
  { value: TypePaiement.PENALITE, label: '⚠️ Pénalités', description: 'Pénalités de retard' },
  { value: TypePaiement.REGULARISATION, label: '🔄 Régularisation', description: 'Régularisation de charges' },
  { value: TypePaiement.AUTRE, label: '📌 Autre', description: 'Autre type de paiement' }
];

export default function PaiementForm({ 
  initialData, 
  onSubmit, 
  onCancel, 
  loading, 
  bailId: fixedBailId,
  sessionId: fixedSessionId
}: Props) {
  const [baux, setBaux] = useState<BailInfo[]>([]);
  const [loadingBaux, setLoadingBaux] = useState(true);
  const [error, setError] = useState('');
  const [generatingRef, setGeneratingRef] = useState(false);
  const [autoReference, setAutoReference] = useState('');
  const [generatedSuccess, setGeneratedSuccess] = useState('');
  const [selectedBailInfo, setSelectedBailInfo] = useState<BailInfo | null>(null);
  const [session, setSession] = useState<PaiementSession | null>(null);
  const [loadingSession, setLoadingSession] = useState(false);

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
  const montantValue = watch('montant');

  // Récupérer la session si sessionId est fourni
  useEffect(() => {
    const fetchSession = async () => {
      if (!fixedSessionId) return;
      
      setLoadingSession(true);
      try {
        const sessionData = await paiementSessionService.getById(fixedSessionId);
        setSession(sessionData);
        
        // Pré-remplir les champs basés sur la session
        const reste = sessionData.montant_total - (sessionData.montant_paye || 0);
        setValue('montant', reste);
        setValue('mois_concerne', sessionData.mois);
        setValue('annee_concernee', sessionData.annee);
        
        if (sessionData.bail_id) {
          setValue('bail_id', sessionData.bail_id);
        }
      } catch (err) {
        console.error('Erreur chargement session:', err);
        setError('Erreur lors du chargement de la session');
      } finally {
        setLoadingSession(false);
      }
    };
    
    fetchSession();
  }, [fixedSessionId, setValue]);

  // Générer la référence automatiquement
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
      const fallbackRef = `PAY-${bailId}-${Date.now()}`;
      setAutoReference(fallbackRef);
      setValue('reference_paiement', fallbackRef);
    } finally {
      setGeneratingRef(false);
    }
  };

  // Récupérer les informations du bail sélectionné
  const fetchBailInfo = async (bailId: number) => {
    try {
      const bail = baux.find(b => b.id === bailId);
      if (bail) {
        setSelectedBailInfo(bail);
        const totalMensuel = bail.loyer_mensuel + (bail.charges_mensuelles || 0);
        
        // Suggérer le montant si ce n'est pas déjà défini
        if (!montantValue || montantValue === 0) {
          setValue('montant', totalMensuel);
        }
      }
    } catch (err) {
      console.error('Erreur récupération bail:', err);
    }
  };

  // Générer au chargement si bailId est présent
  useEffect(() => {
    if ((selectedBailId || fixedBailId) && !autoReference) {
      generateReference();
    }
    if (selectedBailId) {
      fetchBailInfo(selectedBailId);
    }
  }, [selectedBailId, fixedBailId]);

  useEffect(() => {
    const fetchBaux = async () => {
      try {
        const data = await bailService.getAll({ statut: 'actif', limit: 200 });
        const formattedBaux = (Array.isArray(data) ? data : []).map((b: any) => ({
          id: b.id,
          numero_contrat: b.numero_contrat,
          locataire_nom: b.locataire_nom,
          locataire_prenom: b.locataire_prenom,
          locataire_id: b.locataire_id,
          loyer_mensuel: b.loyer_mensuel,
          charges_mensuelles: b.charges_mensuelles || 0,
          logement_numero: b.logement_numero
        }));
        setBaux(formattedBaux);
        
        // Si fixedBailId est fourni, sélectionner automatiquement
        if (fixedBailId) {
          const bail = formattedBaux.find(b => b.id === fixedBailId);
          if (bail) setSelectedBailInfo(bail);
        }
      } catch (err) {
        console.error('Erreur chargement baux:', err);
        setError('Erreur chargement des contrats');
      } finally {
        setLoadingBaux(false);
      }
    };
    fetchBaux();
  }, [fixedBailId]);

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
      numero_quittance: data.reference_paiement || autoReference,
      session_id: fixedSessionId || undefined
    };
    onSubmit(formattedData);
  };

  const getMontantTotalMensuel = () => {
    if (selectedBailInfo) {
      return selectedBailInfo.loyer_mensuel + (selectedBailInfo.charges_mensuelles || 0);
    }
    return 0;
  };

  if (loadingBaux || loadingSession) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress size={32} />
      </Box>
    );
  }

  return (
    <Card elevation={0} sx={{ borderRadius: 2, border: '1px solid #e2e8f0' }}>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          {session ? 'Paiement de session' : 'Enregistrer un paiement'}
        </Typography>
        
        {session && (
          <Alert severity="info" sx={{ mb: 2 }} icon={<Schedule />}>
            Paiement pour <strong>{session.mois}/{session.annee}</strong> - 
            Montant total: {formatCurrency(session.montant_total)} - 
            Déjà payé: {formatCurrency(session.montant_paye || 0)} - 
            Reste: {formatCurrency(session.montant_total - (session.montant_paye || 0))}
          </Alert>
        )}
        
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
                  <FormControl fullWidth size="small" error={!!errors.bail_id} disabled={!!fixedBailId || !!session}>
                    <InputLabel>Contrat de bail *</InputLabel>
                    <Select 
                      {...field} 
                      label="Contrat de bail *" 
                      disabled={!!fixedBailId || !!session}
                      onChange={(e) => {
                        field.onChange(e);
                        setAutoReference('');
                        setTimeout(() => generateReference(), 100);
                      }}
                    >
                      {baux.map((b) => (
                        <MenuItem key={b.id} value={b.id}>
                          <Box>
                            <Typography variant="body2">{b.numero_contrat}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              {b.locataire_nom} {b.locataire_prenom} - {b.logement_numero}
                            </Typography>
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.bail_id && <FormHelperText error>{errors.bail_id.message}</FormHelperText>}
                  </FormControl>
                )}
              />
            </Grid>

            {/* Informations du bail sélectionné */}
            {selectedBailInfo && !session && (
              <Grid size={{ xs: 12 }}>
                <Paper sx={{ p: 1.5, bgcolor: '#f8fafc', borderRadius: 1.5 }}>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Chip icon={<Person />} label={`${selectedBailInfo.locataire_nom} ${selectedBailInfo.locataire_prenom}`} size="small" />
                    <Chip icon={<Home />} label={selectedBailInfo.logement_numero} size="small" />
                    <Chip icon={<AttachMoney />} label={`Loyer: ${formatCurrency(selectedBailInfo.loyer_mensuel)}`} size="small" />
                    {selectedBailInfo.charges_mensuelles > 0 && (
                      <Chip label={`Charges: ${formatCurrency(selectedBailInfo.charges_mensuelles)}`} size="small" />
                    )}
                    <Chip icon={<Receipt />} label={`Total mensuel: ${formatCurrency(getMontantTotalMensuel())}`} size="small" color="primary" />
                  </Box>
                </Paper>
              </Grid>
            )}

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

            {/* Montant - CORRECTION: suppression de inputProps */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name="montant"
                control={control}
                rules={{ 
                  required: 'Le montant est requis', 
                  min: { value: 1, message: 'Le montant doit être supérieur à 0' },
                  max: session ? { value: session.montant_total - (session.montant_paye || 0), message: 'Le montant ne peut pas dépasser le reste à payer' } : undefined
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    size="small"
                    label="Montant (Ar) *"
                    type="number"
                    error={!!errors.montant}
                    helperText={errors.montant?.message || (session ? `Maximum: ${formatCurrency(session.montant_total - (session.montant_paye || 0))}` : '')}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                )}
              />
              {selectedBailInfo && !session && montantValue > getMontantTotalMensuel() && (
                <Alert severity="warning" sx={{ mt: 1 }} icon={<Warning />}>
                  Le montant saisi ({formatCurrency(montantValue)}) dépasse le total mensuel ({formatCurrency(getMontantTotalMensuel())})
                </Alert>
              )}
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
                        <MenuItem key={opt.value} value={opt.value}>
                          <Box>
                            <Typography variant="body2">{opt.label}</Typography>
                            <Typography variant="caption" color="text.secondary">{opt.description}</Typography>
                          </Box>
                        </MenuItem>
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
                        <MenuItem key={opt.value} value={opt.value}>
                          <Box>
                            <Typography variant="body2">{opt.label}</Typography>
                            <Typography variant="caption" color="text.secondary">{opt.description}</Typography>
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>

            {/* Période concernée - CORRECTION: suppression de inputProps */}
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
                    disabled={!!session}
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
                    disabled={!!session}
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
                  <TextField 
                    {...field} 
                    fullWidth 
                    size="small" 
                    label="Notes" 
                    multiline 
                    rows={2} 
                    placeholder="Informations complémentaires..."
                  />
                )}
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 2 }} />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Button 
              onClick={onCancel} 
              variant="outlined" 
              startIcon={<Cancel />} 
              disabled={loading}
              sx={{ borderRadius: 2, textTransform: 'none' }}
            >
              Annuler
            </Button>
            <Button 
              type="submit" 
              variant="contained" 
              startIcon={loading ? <CircularProgress size={16} /> : <Save />} 
              disabled={!!loading || !autoReference || (!!selectedBailInfo && montantValue <= 0)}
              sx={{ borderRadius: 2, textTransform: 'none', bgcolor: '#059669', '&:hover': { bgcolor: '#047857' } }}
            >
              {loading ? 'Enregistrement...' : session ? 'Payer la session' : 'Enregistrer le paiement'}
            </Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}