// src/components/baux/BailForm.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Box, Button, Card, CardContent, TextField, Typography, MenuItem, Autocomplete, CircularProgress, Avatar } from '@mui/material';
import { ArrowBack, Save, Home, Person } from '@mui/icons-material';
import { locataireService } from '@/services/locataireService';
import { logementService } from '@/services/logementService';

const schema = z.object({
  logement_id: z.number().min(1), locataire_id: z.number().min(1),
  date_debut: z.string().min(1), date_fin: z.string().min(1),
  loyer_mensuel: z.number().min(1), caution_montant: z.number().min(1),
  charges_mensuelles: z.number().min(0).default(0), frais_agence: z.number().min(0).default(0),
  type_bail: z.string().default('habitation'), jour_paiement: z.number().min(1).max(31).default(5),
  mode_paiement: z.string().default('virement'), clauses_specifiques: z.string().optional()
});

type FD = z.infer<typeof schema>;
interface Props { initialData?: Partial<FD>; onSubmit: (d: FD) => void; onCancel: () => void; loading?: boolean; }

export default function BailForm({ initialData, onSubmit, onCancel, loading }: Props) {
  const [locataires, setLocataires] = useState<any[]>([]);
  const [logements, setLogements] = useState<any[]>([]);
  const [ldData, setLdData] = useState(true);

  const { control, handleSubmit, formState: { errors }, watch, setValue } = useForm<FD>({
    resolver: zodResolver(schema) as any,
    defaultValues: { type_bail: 'habitation', jour_paiement: 5, mode_paiement: 'virement', charges_mensuelles: 0, frais_agence: 0, ...initialData }
  });

// src/components/baux/BailForm.tsx - Correction du useEffect

useEffect(() => {
  Promise.all([
    locataireService.getLocataires({ statut: 'actif', limit: 200 }),
    logementService.getDisponibles()
  ]).then(([locs, logs]) => {
    // 🔥 Gérer tous les formats possibles
    const locatairesData = Array.isArray(locs) ? locs : (locs as any)?.items || (locs as any)?.data || [];
    const logementsData = Array.isArray(logs) ? logs : (logs as any)?.items || (logs as any)?.data || [];
    
    setLocataires(locatairesData);
    setLogements(logementsData);
  }).catch(console.error).finally(() => setLdData(false));
}, []);

  const selLog = logements.find(l => l.id === watch('logement_id'));
  const selLoc = locataires.find(l => l.id === watch('locataire_id'));

  if (ldData) return <Box sx={{ textAlign: 'center', py: 4 }}><CircularProgress size={32} /></Box>;

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
      <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid #e8edf2', mb: 3 }}>
        <CardContent sx={{ p: 2.5 }}>
          <Typography variant="h6" sx={{ mb: 2.5, fontWeight: 600, fontSize: '1rem' }}>Nouveau bail</Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>

            {/* Logement */}
            <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: 250 }}>
              <Controller name="logement_id" control={control} render={({ field }) => (
                <Autocomplete value={selLog || null} onChange={(_, v) => { field.onChange(v?.id || null); if (v?.loyer_base) setValue('loyer_mensuel', v.loyer_base); }} options={logements}
                  getOptionLabel={(o: any) => `${o.numero || ''} - ${o.batiment_nom || o.adresse || ''}`}
                  renderInput={(p) => <TextField {...p} label="Logement *" size="small" error={!!errors.logement_id} helperText={errors.logement_id?.message} />}
                  renderOption={(props, o: any) => (
                    <li {...props} key={o.id}><Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar src={o.photos?.[0]} sx={{ width: 28, height: 28, fontSize: 12 }}><Home sx={{ fontSize: 14 }} /></Avatar>
                      <Box><Typography variant="body2">{o.numero} - {o.batiment_nom || o.adresse}</Typography><Typography variant="caption" color="text.secondary">{o.loyer_base?.toLocaleString()} Ar</Typography></Box>
                    </Box></li>
                  )}
                  size="small" isOptionEqualToValue={(o, v) => o.id === v.id} />
              )} />
            </Box>

            {/* Locataire */}
            <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: 250 }}>
              <Controller name="locataire_id" control={control} render={({ field }) => (
                <Autocomplete value={selLoc || null} onChange={(_, v) => field.onChange(v?.id || null)} options={locataires}
                  getOptionLabel={(o: any) => `${o.nom} ${o.prenom} - ${o.telephone || ''}`}
                  renderInput={(p) => <TextField {...p} label="Locataire *" size="small" error={!!errors.locataire_id} helperText={errors.locataire_id?.message} />}
                  renderOption={(props, o: any) => (
                    <li {...props} key={o.id}><Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar sx={{ width: 28, height: 28, fontSize: 12, bgcolor: 'primary.main' }}>{o.prenom?.[0]}{o.nom?.[0]}</Avatar>
                      <Box><Typography variant="body2">{o.nom} {o.prenom}</Typography><Typography variant="caption" color="text.secondary">{o.telephone} · {o.cin || 'N/A'}</Typography></Box>
                    </Box></li>
                  )}
                  size="small" isOptionEqualToValue={(o, v) => o.id === v.id} />
              )} />
            </Box>

            <F n="date_debut" l="Date début *" t="date" c={control} e={errors} />
            <F n="date_fin" l="Date fin *" t="date" c={control} e={errors} />
            <F n="loyer_mensuel" l="Loyer mensuel (Ar) *" t="number" c={control} e={errors} />
            <F n="caution_montant" l="Caution (Ar) *" t="number" c={control} e={errors} />
            <F n="charges_mensuelles" l="Charges (Ar)" t="number" c={control} e={errors} />
            <F n="frais_agence" l="Frais agence (Ar)" t="number" c={control} e={errors} />
            <F n="type_bail" l="Type" s options={['habitation','commercial','professionnel','saisonnier']} c={control} e={errors} />
            <F n="mode_paiement" l="Paiement" s options={['virement','especes','cheque','mvola','orange_money','airtel_money']} c={control} e={errors} />
            <F n="jour_paiement" l="Jour" t="number" c={control} e={errors} />
            <F n="clauses_specifiques" l="Clauses" m r={2} full c={control} e={errors} />
          </Box>
        </CardContent>
      </Card>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button onClick={onCancel} variant="outlined" startIcon={<ArrowBack />}>Annuler</Button>
        <Button type="submit" variant="contained" startIcon={<Save />} disabled={loading}>{loading ? '...' : 'Créer'}</Button>
      </Box>
    </Box>
  );
}

function F({ n, l, t, s, options, m, r, full, c, e }: any) {
  return (
    <Box sx={{ flex: full ? '1 1 100%' : '1 1 calc(50% - 8px)', minWidth: 250 }}>
      <Controller name={n} control={c} render={({ field: fl }) => (
        s ? <TextField {...fl} fullWidth select label={l} size="small">{options?.map((o: string) => <MenuItem key={o} value={o}>{o}</MenuItem>)}</TextField>
        : <TextField {...fl} fullWidth label={l} type={t || 'text'} size="small" multiline={m} rows={r} value={fl.value ?? ''}
            onChange={e => fl.onChange(t === 'number' ? Number(e.target.value) : e.target.value)}
            error={!!e[n]} helperText={e[n]?.message} slotProps={t === 'date' ? { inputLabel: { shrink: true } } : {}} />
      )} />
    </Box>
  );
}