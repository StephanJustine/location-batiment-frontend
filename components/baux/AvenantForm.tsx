// src/components/baux/AvenantForm.tsx
'use client';

import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Box, Button, Card, CardContent, TextField, Typography, MenuItem, Alert } from '@mui/material';
import { ArrowBack, Save } from '@mui/icons-material';

const typesModif = ['loyer', 'duree', 'clauses', 'date_fin', 'autre'];

interface Props { bailId: number; onSubmit: (d: any) => void; onCancel: () => void; loading?: boolean; }

export default function AvenantForm({ bailId, onSubmit, onCancel, loading }: Props) {
  const { control, handleSubmit } = useForm({ defaultValues: { type_modification: 'loyer', ancienne_valeur: '{}', nouvelle_valeur: '{}', date_effet: '', document_url: '' } });

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
      <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid #e8edf2', mb: 3 }}>
        <CardContent sx={{ p: 2.5 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Nouvel avenant</Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            <Controller name="type_modification" control={control} render={({ field }) => (
              <TextField {...field} fullWidth select label="Type modification" size="small" sx={{ flex: '1 1 calc(50% - 8px)', minWidth: 220 }}>
                {typesModif.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
              </TextField>
            )} />
            <Controller name="date_effet" control={control} render={({ field }) => (
              <TextField {...field} fullWidth type="date" label="Date d'effet" size="small" sx={{ flex: '1 1 calc(50% - 8px)', minWidth: 220 }} slotProps={{ inputLabel: { shrink: true } }} />
            )} />
            <Controller name="ancienne_valeur" control={control} render={({ field }) => (
              <TextField {...field} fullWidth label="Ancienne valeur (JSON)" size="small" multiline rows={2} sx={{ flex: '1 1 100%' }} />
            )} />
            <Controller name="nouvelle_valeur" control={control} render={({ field }) => (
              <TextField {...field} fullWidth label="Nouvelle valeur (JSON)" size="small" multiline rows={2} sx={{ flex: '1 1 100%' }} />
            )} />
          </Box>
        </CardContent>
      </Card>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button onClick={onCancel} variant="outlined" startIcon={<ArrowBack />}>Annuler</Button>
        <Button type="submit" variant="contained" startIcon={<Save />} disabled={loading}>{loading ? '...' : 'Ajouter'}</Button>
      </Box>
    </Box>
  );
}