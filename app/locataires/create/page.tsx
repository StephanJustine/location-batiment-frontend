// src/app/locataires/create/page.tsx
'use client';

import React, { useState } from 'react';
import {
  Box, Typography, Paper, Stepper, Step, StepLabel,
  Button, Alert, Breadcrumbs, Link, Toolbar, Container,
  Card, CardContent, Divider, Chip, Avatar, Stack
} from '@mui/material';
import {
  NavigateNext, Home, CheckCircle,
  ArrowBack, ArrowForward, Save, Badge, Group
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import LocataireForm from '@/components/locataires/LocataireForm';
import GarantForm from '@/components/locataires/GarantForm';
import { locataireService } from '@/services/locataireService';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';

const steps = [
  { label: 'Infos', icon: <Badge /> },
  { label: 'Garants', icon: <Group /> },
  { label: 'Validation', icon: <CheckCircle /> }
];

export default function CreateLocatairePage() {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [data, setData] = useState<any>({ garants: [], pieces_jointes: [] });

  const submit = async () => {
    try {
      setLoading(true);
      setError('');
      await locataireService.createLocataire(data);
      setSuccess('Locataire créé !');
      setTimeout(() => router.push('/locataires'), 1000);
    } catch (e: any) {
      // 🔥 Extraction propre du message d'erreur
      const detail = e.response?.data?.detail;
      let msg = 'Erreur lors de la création';
      
      if (typeof detail === 'string') {
        msg = detail;
      } else if (Array.isArray(detail)) {
        msg = detail.map((d: any) => d.msg || JSON.stringify(d)).join(', ');
      } else if (e.message) {
        msg = e.message;
      }
      
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const getInitials = () => {
    const p = data.prenom?.[0] || '';
    const n = data.nom?.[0] || '';
    return (p + n).toUpperCase() || '?';
  };

  const formatValue = (v: any) => v || '-';
  const formatRevenu = (v: any) => (v != null) ? `${Number(v).toLocaleString()} Ar` : '-';

  const infoItems = [
    { label: 'Email', value: formatValue(data.email) },
    { label: 'CIN', value: formatValue(data.cin) },
    { label: 'Nationalité', value: formatValue(data.nationalite) },
    { label: 'Né(e) le', value: formatValue(data.date_naissance) },
    { label: 'Profession', value: formatValue(data.profession) },
    { label: 'Employeur', value: formatValue(data.employeur) },
    { label: 'Revenu', value: formatRevenu(data.revenu_mensuel) },
    { label: 'Situation', value: formatValue(data.situation_matrimoniale) },
    { label: 'Enfants', value: data.nombre_enfants ?? 0 },
    { label: 'Adresse', value: formatValue(data.adresse) },
  ];

  return (
    <Box sx={{ display: 'flex', bgcolor: '#f5f7fa', minHeight: '100vh' }}>
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <Box component="main" sx={{ flexGrow: 1, width: { sm: `calc(100% - 260px)` }, minWidth: 0 }}>
        <Header onMenuClick={() => setMobileOpen(!mobileOpen)} />
        <Toolbar />
        <Container maxWidth="md" sx={{ px: { xs: 2, sm: 3 }, py: 3 }}>

          <Breadcrumbs separator={<NavigateNext sx={{ fontSize: 16 }} />} sx={{ mb: 2 }}>
            <Link href="/" color="inherit" underline="hover"><Home sx={{ mr: 0.5, fontSize: 16 }} />Dashboard</Link>
            <Link href="/locataires" color="inherit" underline="hover">Locataires</Link>
            <Typography color="text.primary">Nouveau</Typography>
          </Breadcrumbs>

          <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>Nouveau locataire</Typography>

          <Paper elevation={0} sx={{ p: 3, mb: 3, borderRadius: 3, border: '1px solid #e0e0e0' }}>
            <Stepper activeStep={step} alternativeLabel>
              {steps.map((s, i) => (
                <Step key={s.label} completed={step > i}>
                  <StepLabel>
                    <Stack direction="row" spacing={1} sx={{ alignItems: 'center', justifyContent: 'center' }}>
                      {React.cloneElement(s.icon, { 
                        sx: { fontSize: 18, color: step >= i ? 'primary.main' : 'grey.400' } 
                      })}
                      <Typography variant="body2" sx={{ 
                        fontWeight: step === i ? 600 : 400, 
                        color: step >= i ? 'text.primary' : 'text.disabled' 
                      }}>
                        {s.label}
                      </Typography>
                    </Stack>
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
          </Paper>

          {/* 🔥 Toujours convertir en string avant d'afficher */}
          {success && <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>{String(success)}</Alert>}
          {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }} onClose={() => setError('')}>{String(error)}</Alert>}

          {step === 0 && (
            <LocataireForm 
              onSubmit={(d: any) => { setData((p: any) => ({ ...p, ...d })); setStep(1); }} 
              onCancel={() => router.push('/locataires')} 
            />
          )}

          {step === 1 && (
            <>
              <GarantForm garants={data.garants} onUpdate={(g: any) => setData((p: any) => ({ ...p, garants: g }))} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                <Button onClick={() => setStep(0)} startIcon={<ArrowBack />} variant="outlined">Retour</Button>
                <Button onClick={() => setStep(2)} variant="contained" endIcon={<ArrowForward />}>Suivant</Button>
              </Box>
            </>
          )}

          {step === 2 && (
            <>
              <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid #e0e0e0', mb: 3 }}>
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                    <Avatar sx={{ width: 56, height: 56, bgcolor: 'primary.main', fontWeight: 700 }}>
                      {getInitials()}
                    </Avatar>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {data.prenom} {data.nom}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {data.telephone || '-'}
                      </Typography>
                    </Box>
                  </Box>
                  <Divider sx={{ mb: 3 }} />
                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 1.5 }}>
                    {infoItems.map((item, i) => (
                      <Box key={i} sx={{ bgcolor: '#f9fafb', p: 1.5, borderRadius: 1.5 }}>
                        <Typography variant="caption" color="text.secondary">{item.label}</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>{String(item.value)}</Typography>
                      </Box>
                    ))}
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1, mt: 3 }}>
                    <Chip 
                      icon={<Group />} 
                      label={`${data.garants.length} garant(s)`} 
                      size="small" 
                      color={data.garants.length > 0 ? 'success' : 'default'} 
                      variant="outlined" 
                    />
                  </Box>
                  {data.notes && (
                    <Box sx={{ mt: 3, p: 2, bgcolor: '#fff8e1', borderRadius: 1.5 }}>
                      <Typography variant="caption" color="text.secondary">Notes</Typography>
                      <Typography variant="body2">{String(data.notes)}</Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button onClick={() => setStep(1)} startIcon={<ArrowBack />} variant="outlined">Retour</Button>
                <Button 
                  onClick={submit} 
                  variant="contained" 
                  startIcon={<Save />} 
                  disabled={loading} 
                  sx={{ px: 4, borderRadius: 2 }}
                >
                  {loading ? 'Création...' : 'Créer'}
                </Button>
              </Box>
            </>
          )}
        </Container>
      </Box>
    </Box>
  );
}