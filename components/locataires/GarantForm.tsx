// // src/components/locataires/GarantForm.tsx
// 'use client';

// import React, { useState } from 'react';
// import {
//   Box,
//   Button,
//   Card,
//   CardContent,
//   TextField,
//   Typography,
//   IconButton,
//   Paper,
//   Stack,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions
// } from '@mui/material';
// import {
//   Add as AddIcon,
//   Delete as DeleteIcon,
//   Edit as EditIcon,
//   PersonAdd as PersonAddIcon
// } from '@mui/icons-material';
// import { Garant } from '@/types/models';

// interface GarantFormProps {
//   garants: Garant[];
//   onUpdate: (garants: Garant[]) => void;
// }

// export default function GarantForm({ garants, onUpdate }: GarantFormProps) {
//   const [openDialog, setOpenDialog] = useState(false);
//   const [editingGarant, setEditingGarant] = useState<Garant | null>(null);
//   const [formData, setFormData] = useState<Partial<Garant>>({
//     nom: '',
//     prenom: '',
//     telephone: '',
//     email: '',
//     adresse: '',
//     profession: '',
//     revenu_mensuel: undefined
//   });

//   const handleOpenAdd = () => {
//     setEditingGarant(null);
//     setFormData({ nom: '', prenom: '', telephone: '', email: '', adresse: '', profession: '', revenu_mensuel: undefined });
//     setOpenDialog(true);
//   };

//   const handleOpenEdit = (garant: Garant) => {
//     setEditingGarant(garant);
//     setFormData(garant);
//     setOpenDialog(true);
//   };

//   const handleDelete = (index: number) => {
//     const newGarants = garants.filter((_, i) => i !== index);
//     onUpdate(newGarants);
//   };

//   const handleSave = () => {
//     if (!formData.nom || !formData.prenom || !formData.telephone) return;

//     if (editingGarant) {
//       const newGarants = garants.map(g => g === editingGarant ? { ...g, ...formData } as Garant : g);
//       onUpdate(newGarants);
//     } else {
//       onUpdate([...garants, { ...formData } as Garant]);
//     }
//     setOpenDialog(false);
//   };

//   return (
//     <Box>
//       <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
//         <Typography variant="h6">Garants ({garants.length})</Typography>
//         <Button variant="outlined" startIcon={<PersonAddIcon />} onClick={handleOpenAdd}>
//           Ajouter un garant
//         </Button>
//       </Box>

//       {garants.length === 0 ? (
//         <Paper sx={{ p: 4, textAlign: 'center' }}>
//           <Typography color="text.secondary" gutterBottom>Aucun garant ajouté</Typography>
//           <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenAdd} sx={{ mt: 1 }}>
//             Ajouter un garant
//           </Button>
//         </Paper>
//       ) : (
//         <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
//           {garants.map((garant, index) => (
//             <Box key={index} sx={{ flex: '1 1 calc(50% - 8px)', minWidth: 300 }}>
//               <Card variant="outlined">
//                 <CardContent>
//                   <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
//                     <Box>
//                       <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
//                         {garant.nom} {garant.prenom}
//                       </Typography>
//                       <Typography variant="body2" color="text.secondary">{garant.telephone}</Typography>
//                       {garant.email && <Typography variant="body2" color="text.secondary">{garant.email}</Typography>}
//                       {garant.profession && <Typography variant="body2" color="text.secondary">{garant.profession}</Typography>}
//                       {garant.revenu_mensuel && (
//                         <Typography variant="body2" color="text.secondary">
//                           Revenu: {garant.revenu_mensuel.toLocaleString()} Ar
//                         </Typography>
//                       )}
//                     </Box>
//                     <Stack direction="row">
//                       <IconButton size="small" onClick={() => handleOpenEdit(garant)}>
//                         <EditIcon fontSize="small" />
//                       </IconButton>
//                       <IconButton size="small" color="error" onClick={() => handleDelete(index)}>
//                         <DeleteIcon fontSize="small" />
//                       </IconButton>
//                     </Stack>
//                   </Box>
//                 </CardContent>
//               </Card>
//             </Box>
//           ))}
//         </Box>
//       )}

//       <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
//         <DialogTitle>{editingGarant ? 'Modifier le garant' : 'Ajouter un garant'}</DialogTitle>
//         <DialogContent>
//           <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 1 }}>
//             <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: 200 }}>
//               <TextField fullWidth label="Nom *" value={formData.nom} onChange={(e) => setFormData({ ...formData, nom: e.target.value })} required />
//             </Box>
//             <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: 200 }}>
//               <TextField fullWidth label="Prénom(s) *" value={formData.prenom} onChange={(e) => setFormData({ ...formData, prenom: e.target.value })} required />
//             </Box>
//             <Box sx={{ flex: '1 1 100%' }}>
//               <TextField fullWidth label="Téléphone *" value={formData.telephone} onChange={(e) => setFormData({ ...formData, telephone: e.target.value })} required />
//             </Box>
//             <Box sx={{ flex: '1 1 100%' }}>
//               <TextField fullWidth label="Email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
//             </Box>
//             <Box sx={{ flex: '1 1 100%' }}>
//               <TextField fullWidth label="Adresse" multiline rows={2} value={formData.adresse} onChange={(e) => setFormData({ ...formData, adresse: e.target.value })} />
//             </Box>
//             <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: 200 }}>
//               <TextField fullWidth label="Profession" value={formData.profession} onChange={(e) => setFormData({ ...formData, profession: e.target.value })} />
//             </Box>
//             <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: 200 }}>
//               <TextField fullWidth label="Revenu mensuel (Ar)" type="number" value={formData.revenu_mensuel || ''} onChange={(e) => setFormData({ ...formData, revenu_mensuel: Number(e.target.value) })} />
//             </Box>
//           </Box>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setOpenDialog(false)}>Annuler</Button>
//           <Button onClick={handleSave} variant="contained" disabled={!formData.nom || !formData.prenom || !formData.telephone}>
//             {editingGarant ? 'Modifier' : 'Ajouter'}
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Box>
//   );
// }

// src/components/locataires/GarantForm.tsx
'use client';

import { useState } from 'react';
import { Box, TextField, Button, Paper, Typography, IconButton, Stack } from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
import { Garant } from '@/types/models';

interface Props {
  garants: Garant[];
  onUpdate: (g: Garant[]) => void;
}

export default function GarantForm({ garants, onUpdate }: Props) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Garant>({ nom: '', prenom: '', telephone: '' });

  const add = () => {
    if (form.nom && form.prenom && form.telephone) {
      onUpdate([...garants, form]);
      setForm({ nom: '', prenom: '', telephone: '' });
      setOpen(false);
    }
  };

  const remove = (idx: number) => onUpdate(garants.filter((_, i) => i !== idx));

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="subtitle1">{garants.length} garant(s)</Typography>
        <Button size="small" startIcon={<Add />} onClick={() => setOpen(true)}>Ajouter</Button>
      </Box>

      {garants.map((g, i) => (
        <Paper key={i} sx={{ p: 1.5, mb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Stack spacing={0.5}>
            <Typography variant="body2"><strong>{g.nom} {g.prenom}</strong></Typography>
            <Typography variant="caption" color="text.secondary">{g.telephone}</Typography>
          </Stack>
          <IconButton size="small" color="error" onClick={() => remove(i)}><Delete fontSize="small" /></IconButton>
        </Paper>
      ))}

      {open && (
        <Paper sx={{ p: 2, mt: 2 }}>
          <Typography variant="subtitle2" gutterBottom>Nouveau garant</Typography>
          <Stack spacing={1.5}>
            <TextField size="small" label="Nom *" value={form.nom} onChange={e => setForm({ ...form, nom: e.target.value })} fullWidth />
            <TextField size="small" label="Prénom *" value={form.prenom} onChange={e => setForm({ ...form, prenom: e.target.value })} fullWidth />
            <TextField size="small" label="Téléphone *" value={form.telephone} onChange={e => setForm({ ...form, telephone: e.target.value })} fullWidth />
            <TextField size="small" label="Email" value={form.email || ''} onChange={e => setForm({ ...form, email: e.target.value })} fullWidth />
            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
              <Button size="small" onClick={() => setOpen(false)}>Annuler</Button>
              <Button size="small" variant="contained" onClick={add}>Ajouter</Button>
            </Box>
          </Stack>
        </Paper>
      )}
    </Box>
  );
}