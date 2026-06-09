// src/components/locataires/LocataireForm.tsx
'use client';

import React, { useState, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Box, Button, Card, CardContent, TextField, Typography,
  Stepper, Step, StepLabel, MenuItem, Alert, Stack, Paper, Fade
} from '@mui/material';
import { ArrowBack, ArrowForward, Save, Person, Work, FamilyRestroom, Check } from '@mui/icons-material';

const VALID_SITUATIONS = ['celibataire', 'marie', 'divorce', 'veuf'] as const;
type Situation = typeof VALID_SITUATIONS[number];

const S: Record<Situation, string> = {
  celibataire: 'Célibataire', marie: 'Marié(e)', divorce: 'Divorcé(e)', veuf: 'Veuf/Veuve'
};

const L: Record<string, string> = {
  nom:'Nom *', prenom:'Prénom(s) *', date_naissance:'Date naissance', lieu_naissance:'Lieu naissance',
  nationalite:'Nationalité', cin:'N° CIN', passeport:'Passeport', email:'Email',
  telephone:'Téléphone *', telephone_secondaire:'Tél. secondaire', adresse:'Adresse',
  profession:'Profession', employeur:'Employeur', revenu_mensuel:'Revenu mensuel (Ar)',
  situation_matrimoniale:'Situation matrimoniale', nombre_enfants:'Nombre d\'enfants', notes:'Notes'
};

const schema = z.object({
  nom:z.string().min(2), prenom:z.string().min(2), nationalite:z.string(), telephone:z.string().min(8),
  nombre_enfants:z.number().min(0).max(20),
  date_naissance:z.string().nullable().optional(), lieu_naissance:z.string().nullable().optional(),
  cin:z.string().nullable().optional(), passeport:z.string().nullable().optional(),
  email:z.string().email().nullable().optional(), telephone_secondaire:z.string().nullable().optional(),
  adresse:z.string().nullable().optional(), profession:z.string().nullable().optional(),
  employeur:z.string().nullable().optional(), revenu_mensuel:z.number().min(0).nullable().optional(),
  situation_matrimoniale:z.string().nullable().optional(), notes:z.string().nullable().optional()
});

interface FD {
  nom:string; prenom:string; nationalite:string; telephone:string; nombre_enfants:number;
  date_naissance?:string|null; lieu_naissance?:string|null; cin?:string|null; passeport?:string|null;
  email?:string|null; telephone_secondaire?:string|null; adresse?:string|null; profession?:string|null;
  employeur?:string|null; revenu_mensuel?:number|null; situation_matrimoniale?:string|null; notes?:string|null;
}

interface Props { initialData?:Partial<FD>; onSubmit:(d:FD)=>void; onCancel:()=>void; loading?:boolean; }

const STEPS = [
  { label:'Identité', icon:<Person />, c:'#1976d2' },
  { label:'Contact', icon:<Person />, c:'#388e3c' },
  { label:'Profession', icon:<Work />, c:'#f57c00' },
  { label:'Famille', icon:<FamilyRestroom />, c:'#7b1fa2' }
];

const FIELDS: Record<number, (keyof FD)[]> = {
  0:['nom','prenom','date_naissance','lieu_naissance','nationalite','cin','passeport'],
  1:['email','telephone','telephone_secondaire','adresse'],
  2:['profession','employeur','revenu_mensuel'],
  3:['situation_matrimoniale','nombre_enfants','notes']
};

const clean = (d?:Partial<FD>):Partial<FD> => d?{...d,
  situation_matrimoniale: d.situation_matrimoniale && (VALID_SITUATIONS as readonly string[]).includes(d.situation_matrimoniale) ? d.situation_matrimoniale : ''
}:{};

export default function LocataireForm({ initialData, onSubmit, onCancel, loading }: Props) {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState<number[]>([]);
  const init = useMemo(() => clean(initialData), [initialData]);
  const pct = Math.round((step/3)*100);

  const { control, handleSubmit, formState:{errors}, trigger } = useForm<FD>({
    resolver: zodResolver(schema) as any,
    defaultValues: {
      nom:init.nom||'', prenom:init.prenom||'', nationalite:init.nationalite||'MALAGASY',
      telephone:init.telephone||'', nombre_enfants:init.nombre_enfants??0,
      date_naissance:init.date_naissance||null, lieu_naissance:init.lieu_naissance||null,
      cin:init.cin||null, passeport:init.passeport||null, email:init.email||null,
      telephone_secondaire:init.telephone_secondaire||null, adresse:init.adresse||null,
      profession:init.profession||null, employeur:init.employeur||null,
      revenu_mensuel:init.revenu_mensuel??null, situation_matrimoniale:init.situation_matrimoniale||'',
      notes:init.notes||null
    }
  });

  const next = async () => {
    if (await trigger(FIELDS[step] as any)) {
      setDone(p=>[...new Set([...p,step])]);
      setStep(p=>Math.min(p+1,3));
    }
  };
  const prev = () => setStep(p=>Math.max(p-1,0));
  const go = (s:number) => { if (done.includes(s)||s<step) setStep(s); };

  const renderField = (f: keyof FD) => {
    const full = f==='adresse'||f==='notes';
    return (
      <Box key={f} sx={{ flex:full?'1 1 100%':'1 1 calc(50% - 8px)', minWidth:250 }}>
        <Controller name={f} control={control} render={({ field:fl }) => {
          // Select Nationalité
          if (f==='nationalite') return (
            <TextField {...fl} fullWidth select label={L[f]} value={fl.value||'MALAGASY'} size="medium">
              <MenuItem value="MALAGASY">🇲🇬 Malagasy</MenuItem>
              <MenuItem value="FRANCAISE">🇫🇷 Française</MenuItem>
              <MenuItem value="COMORIENNE">🇰🇲 Comorienne</MenuItem>
              <MenuItem value="AUTRE">🌍 Autre</MenuItem>
            </TextField>
          );
          // Select Situation
          if (f==='situation_matrimoniale') return (
            <TextField {...fl} fullWidth select label={L[f]} value={fl.value||''} size="medium">
              <MenuItem value="">Non renseigné</MenuItem>
              {VALID_SITUATIONS.map(v=><MenuItem key={v} value={v}>{S[v as Situation]}</MenuItem>)}
            </TextField>
          );
          // Date
          if (f==='date_naissance') return (
            <TextField {...fl} fullWidth type="date" label={L[f]} value={fl.value||''} size="medium" slotProps={{ inputLabel:{shrink:true} }} />
          );
          // Revenu
          if (f==='revenu_mensuel') return (
            <TextField {...fl} fullWidth type="number" label={L[f]} value={fl.value??''} size="medium" onChange={e=>fl.onChange(e.target.value?Number(e.target.value):null)} error={!!errors.revenu_mensuel} helperText={errors.revenu_mensuel?.message} />
          );
          // Enfants
          if (f==='nombre_enfants') return (
            <TextField {...fl} fullWidth type="number" label={L[f]} value={fl.value??0} size="medium" onChange={e=>fl.onChange(Number(e.target.value)||0)} slotProps={{ htmlInput:{min:0,max:20} }} />
          );
          // Email
          if (f==='email') return (
            <TextField {...fl} fullWidth type="email" label={L[f]} value={fl.value||''} size="medium" error={!!errors.email} helperText={errors.email?.message} />
          );
          // Standard
          return (
            <TextField {...fl} fullWidth label={L[f]} value={fl.value||''} size="medium" error={!!errors[f]} helperText={errors[f]?.message} multiline={full} rows={f==='notes'?4:f==='adresse'?3:1} />
          );
        }} />
      </Box>
    );
  };

  return (
    <Box sx={{ maxWidth:900, mx:'auto' }}>
      {/* Stepper */}
      <Paper elevation={0} sx={{ p:2, mb:3, borderRadius:2, border:'1px solid #e0e0e0' }}>
        <Stepper activeStep={step} alternativeLabel>
          {STEPS.map((s,i)=>(
            <Step key={s.label} completed={done.includes(i)}>
              <StepLabel
                onClick={()=>go(i)}
                sx={{ cursor:done.includes(i)||i<step?'pointer':'default' }}
                slots={{ stepIcon:()=>done.includes(i)?<Check sx={{ fontSize:22, color:s.c }} />:React.cloneElement(s.icon as any,{sx:{fontSize:22,color:step>=i?s.c:'grey.400'}}) }}
              >
                <Typography variant="body2" sx={{ fontWeight:step===i?600:400, color:step>=i?'text.primary':'text.disabled' }}>
                  {s.label}
                </Typography>
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Paper>

      {/* Barre progression */}
      <Box sx={{ height:3, bgcolor:'grey.200', borderRadius:1, mb:3 }}>
        <Box sx={{ width:`${pct}%`, height:'100%', bgcolor:'primary.main', borderRadius:1, transition:'width .3s' }} />
      </Box>

      {/* Formulaire */}
      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <Fade in key={step}>
          <Card elevation={0} sx={{ borderRadius:2, border:'1px solid #e0e0e0' }}>
            <CardContent sx={{ p:3 }}>
              {Object.keys(errors).length>0 && (
                <Alert severity="warning" sx={{ mb:2 }}>{Object.keys(errors).length} champ(s) à corriger</Alert>
              )}
              <Box sx={{ display:'flex', flexWrap:'wrap', gap:2 }}>
                {FIELDS[step].map(renderField)}
              </Box>
            </CardContent>
          </Card>
        </Fade>

        {/* Boutons */}
        <Box sx={{ display:'flex', justifyContent:'space-between', alignItems:'center', mt:3 }}>
          <Button onClick={onCancel} variant="outlined" startIcon={<ArrowBack />}>Annuler</Button>
          <Box sx={{ display:'flex', gap:1, alignItems:'center' }}>
            <Typography variant="body2" color="text.secondary" sx={{ mr:1 }}>{step+1}/4</Typography>
            {step>0 && <Button onClick={prev} variant="outlined" startIcon={<ArrowBack />}>Précédent</Button>}
            {step<3 ? <Button onClick={next} variant="contained" endIcon={<ArrowForward />}>Suivant</Button>
            : <Button type="submit" variant="contained" startIcon={<Save />} disabled={loading} sx={{ minWidth:130 }}>{loading?'Enregistrement...':'Enregistrer'}</Button>}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}