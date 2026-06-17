// components/employes/EmployeList.tsx
'use client';

import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Chip, Button, Grid, IconButton, Tooltip,
  Alert, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, TextField, FormControl, InputLabel,
  Select, MenuItem, LinearProgress, Badge, TableSortLabel,
  Avatar
} from '@mui/material';
import {
  Add, Delete, Edit, Visibility, Person, CheckCircle, Cancel,
  Pending, Search, Clear, Refresh, Phone, Email
} from '@mui/icons-material';
import { employeService, EmployeFilters } from '@/services/employeService';
import { Employe, TypeEmploye, StatutEmploye } from '@/types/employe';
import { motion, AnimatePresence } from 'framer-motion';

interface EmployeListProps {
  batimentId?: number;
  readonly?: boolean;
}

const statutConfig: Record<StatutEmploye, any> = {
  [StatutEmploye.ACTIF]: { color: '#2e7d32', bg: '#e8f5e9', icon: <CheckCircle sx={{ fontSize: 14 }} />, label: 'Actif' },
  [StatutEmploye.CONGE]: { color: '#f57c00', bg: '#fff3e0', icon: <Pending sx={{ fontSize: 14 }} />, label: 'Congé' },
  [StatutEmploye.ARRET_MALADIE]: { color: '#c62828', bg: '#ffebee', icon: <Cancel sx={{ fontSize: 14 }} />, label: 'Arrêt' },
  [StatutEmploye.ABSENT]: { color: '#757575', bg: '#f5f5f5', icon: <Cancel sx={{ fontSize: 14 }} />, label: 'Absent' },
  [StatutEmploye.TERMINE]: { color: '#616161', bg: '#fafafa', icon: <Cancel sx={{ fontSize: 14 }} />, label: 'Terminé' }
};

const typeConfig: Record<TypeEmploye, any> = {
  [TypeEmploye.GARDIEN]: { label: 'Gardien', icon: <Person sx={{ fontSize: 14 }} /> },
  [TypeEmploye.FEMME_MENAGE]: { label: 'Ménage', icon: <Person sx={{ fontSize: 14 }} /> },
  [TypeEmploye.JARDINIER]: { label: 'Jardinier', icon: <Person sx={{ fontSize: 14 }} /> },
  [TypeEmploye.TECHNICIEN]: { label: 'Technicien', icon: <Person sx={{ fontSize: 14 }} /> },
  [TypeEmploye.AGENT_SECURITE]: { label: 'Sécurité', icon: <Person sx={{ fontSize: 14 }} /> },
  [TypeEmploye.COMPTABLE]: { label: 'Comptable', icon: <Person sx={{ fontSize: 14 }} /> },
  [TypeEmploye.AUTRE]: { label: 'Autre', icon: <Person sx={{ fontSize: 14 }} /> }
};

const EmployeList: React.FC<EmployeListProps> = ({ batimentId, readonly = false }) => {
  const [employes, setEmployes] = useState<Employe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filterStatut, setFilterStatut] = useState('');
  const [filterType, setFilterType] = useState('');
  const [orderBy, setOrderBy] = useState('nom');
  const [orderDir, setOrderDir] = useState<'asc' | 'desc'>('asc');

  useEffect(() => { loadEmployes(); }, [batimentId]);

  const loadEmployes = async () => {
    try {
      setLoading(true);
      const filters: EmployeFilters = {};
      if (batimentId) filters.batiment_id = batimentId;
      if (filterStatut) filters.statut = filterStatut as StatutEmploye;
      if (filterType) filters.type_employe = filterType as TypeEmploye;
      if (search) filters.search = search;
      filters.limit = 100;
      const data = await employeService.getAll(filters);
      setEmployes(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Erreur de chargement');
    } finally { setLoading(false); }
  };

  const handleSort = (prop: string) => {
    setOrderDir(orderBy === prop && orderDir === 'asc' ? 'desc' : 'asc');
    setOrderBy(prop);
  };

  const filtered = employes
    .filter(e => {
      const s = search.toLowerCase();
      return !s || e.nom.toLowerCase().includes(s) || e.prenom.toLowerCase().includes(s) ||
        e.telephone.includes(s) || (e.email || '').toLowerCase().includes(s);
    })
    .sort((a, b) => {
      const asc = orderDir === 'asc';
      switch (orderBy) {
        case 'nom': return asc ? a.nom.localeCompare(b.nom) : b.nom.localeCompare(a.nom);
        case 'prenom': return asc ? a.prenom.localeCompare(b.prenom) : b.prenom.localeCompare(a.prenom);
        case 'type_employe': return asc ? a.type_employe.localeCompare(b.type_employe) : b.type_employe.localeCompare(a.type_employe);
        case 'statut': return asc ? a.statut.localeCompare(b.statut) : b.statut.localeCompare(a.statut);
        case 'salaire_base': return asc ? a.salaire_base - b.salaire_base : b.salaire_base - a.salaire_base;
        default: return asc ? a.id - b.id : b.id - a.id;
      }
    });

  const stats = {
    total: employes.length,
    actif: employes.filter(e => e.statut === StatutEmploye.ACTIF).length,
    conge: employes.filter(e => e.statut === StatutEmploye.CONGE).length,
    absent: employes.filter(e => e.statut === StatutEmploye.ABSENT).length,
    termine: employes.filter(e => e.statut === StatutEmploye.TERMINE).length
  };

  if (loading) return (
    <Box sx={{ py: 4 }}>
      <LinearProgress sx={{ borderRadius: 2 }} />
      <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', mt: 1, color: '#64748b' }}>Chargement...</Typography>
    </Box>
  );

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2, mb: 3 }}>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>Employés <Badge badgeContent={employes.length} color="primary" sx={{ ml: 1 }}><span /></Badge></Typography>
          <Typography variant="caption" sx={{ color: '#64748b' }}>{batimentId ? 'Employés de ce bâtiment' : 'Tous les employés'}</Typography>
        </Box>
        {!readonly && (
          <Button variant="contained" startIcon={<Add />} href="/employes/create"
            sx={{ bgcolor: '#2e7d32', '&:hover': { bgcolor: '#1b5e20' }, borderRadius: 2, textTransform: 'none' }}>
            Nouvel employé
          </Button>
        )}
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'Total', value: stats.total, color: '#0f172a' },
          { label: 'Actifs', value: stats.actif, color: '#2e7d32', bg: '#e8f5e9' },
          { label: 'Congé', value: stats.conge, color: '#f57c00', bg: '#fff3e0' },
          { label: 'Absents', value: stats.absent, color: '#757575', bg: '#f5f5f5' },
          { label: 'Terminés', value: stats.termine, color: '#616161', bg: '#fafafa' }
        ].map((s, i) => (
          <Grid size={{ xs: 6, sm: 2.4 }} key={i}>
            <Paper sx={{ p: 1.5, textAlign: 'center', borderRadius: 2, bgcolor: s.bg || '#fff' }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: s.color }}>{s.value}</Typography>
              <Typography variant="caption" sx={{ color: '#64748b' }}>{s.label}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {error && <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}

      <Paper sx={{ p: 1.5, mb: 3, borderRadius: 2, border: '1px solid #e2e8f0' }}>
        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', alignItems: 'center' }}>
          <TextField size="small" placeholder="Rechercher..." value={search} onChange={e => setSearch(e.target.value)}
            sx={{ flex: 1, minWidth: 180, '& .MuiOutlinedInput-root': { borderRadius: 1.5, bgcolor: '#f8fafc' } }}
            slotProps={{ input: {
              startAdornment: <Search sx={{ mr: 1, color: '#94a3b8', fontSize: 18 }} />,
              endAdornment: search && <IconButton size="small" onClick={() => setSearch('')}><Clear sx={{ fontSize: 16 }} /></IconButton>
            } }} />
          <FormControl size="small" sx={{ minWidth: 130 }}>
            <InputLabel>Statut</InputLabel>
            <Select value={filterStatut} onChange={e => setFilterStatut(e.target.value)} label="Statut">
              <MenuItem value="">Tous</MenuItem>
              {Object.values(StatutEmploye).map(s => <MenuItem key={s} value={s}>{statutConfig[s]?.label || s}</MenuItem>)}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 130 }}>
            <InputLabel>Type</InputLabel>
            <Select value={filterType} onChange={e => setFilterType(e.target.value)} label="Type">
              <MenuItem value="">Tous</MenuItem>
              {Object.values(TypeEmploye).map(t => <MenuItem key={t} value={t}>{typeConfig[t]?.label || t}</MenuItem>)}
            </Select>
          </FormControl>
          <Tooltip title="Rafraîchir"><IconButton onClick={loadEmployes} size="small"><Refresh /></IconButton></Tooltip>
          <Typography variant="caption" sx={{ color: '#94a3b8', ml: 'auto' }}>{filtered.length} résultat(s)</Typography>
        </Box>
      </Paper>

      {filtered.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 2, border: '1px solid #e2e8f0' }}>
          <Person sx={{ fontSize: 48, color: '#cbd5e1', mb: 2 }} />
          <Typography variant="h6" sx={{ color: '#64748b' }}>Aucun employé trouvé</Typography>
          {!readonly && <Button variant="outlined" startIcon={<Add />} href="/employes/create" sx={{ mt: 2 }}>Ajouter</Button>}
        </Paper>
      ) : (
        <TableContainer component={Paper} sx={{ borderRadius: 2, border: '1px solid #e2e8f0' }}>
          <Table size="small">
            <TableHead sx={{ bgcolor: '#f8fafc' }}>
              <TableRow>
                {['Employé', 'Poste', 'Contact', 'Statut', 'Salaire', 'Actions'].map((h, idx) => (
                  <TableCell key={idx} sx={{ fontWeight: 600 }}>
                    {h === 'Employé' ? <TableSortLabel active={orderBy === 'nom'} direction={orderDir} onClick={() => handleSort('nom')}>Employé</TableSortLabel>
                    : h === 'Poste' ? <TableSortLabel active={orderBy === 'type_employe'} direction={orderDir} onClick={() => handleSort('type_employe')}>Poste</TableSortLabel>
                    : h === 'Statut' ? <TableSortLabel active={orderBy === 'statut'} direction={orderDir} onClick={() => handleSort('statut')}>Statut</TableSortLabel>
                    : h === 'Salaire' ? <TableSortLabel active={orderBy === 'salaire_base'} direction={orderDir} onClick={() => handleSort('salaire_base')}>Salaire</TableSortLabel>
                    : h}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              <AnimatePresence>
                {filtered.map((e, i) => (
                  <motion.tr key={e.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ delay: i * 0.03 }}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar sx={{ bgcolor: '#e8f5e9', width: 36, height: 36 }}>{e.prenom?.[0]}{e.nom?.[0]}</Avatar>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>{e.nom} {e.prenom}</Typography>
                          <Typography variant="caption" sx={{ color: '#94a3b8' }}>{e.cin || 'N/A'}</Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip icon={typeConfig[e.type_employe as TypeEmploye]?.icon} label={typeConfig[e.type_employe as TypeEmploye]?.label || e.type_employe} size="small" sx={{ bgcolor: '#f1f5f9' }} />
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}><Phone sx={{ fontSize: 12, color: '#94a3b8' }} /> {e.telephone}</Typography>
                      {e.email && <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#94a3b8' }}><Email sx={{ fontSize: 12 }} /> {e.email}</Typography>}
                    </TableCell>
                    <TableCell>
                      <Chip icon={statutConfig[e.statut as StatutEmploye]?.icon} label={statutConfig[e.statut as StatutEmploye]?.label} size="small" sx={{ bgcolor: statutConfig[e.statut as StatutEmploye]?.bg, color: statutConfig[e.statut as StatutEmploye]?.color }} />
                    </TableCell>
                    <TableCell><Typography variant="body2" sx={{ fontWeight: 500 }}>{e.salaire_base.toLocaleString()} Ar</Typography></TableCell>
                    <TableCell align="right">
                      <Tooltip title="Détails"><IconButton size="small" href={`/employes/${e.id}`}><Visibility fontSize="small" /></IconButton></Tooltip>
                      {!readonly && (
                        <>
                          <Tooltip title="Modifier"><IconButton size="small" href={`/employes/${e.id}/edit`}><Edit fontSize="small" /></IconButton></Tooltip>
                          <Tooltip title="Supprimer"><IconButton size="small" color="error" onClick={() => { if (confirm(`Supprimer ${e.nom} ${e.prenom} ?`)) employeService.delete(e.id).then(loadEmployes); }}><Delete fontSize="small" /></IconButton></Tooltip>
                        </>
                      )}
                    </TableCell>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default EmployeList;