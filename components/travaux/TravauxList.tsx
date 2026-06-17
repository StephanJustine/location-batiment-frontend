// components/travaux/TravauxList.tsx
'use client';

import React, { useState, useEffect, JSX } from 'react';
import {
  Box, Typography, Chip, Button, Grid, IconButton, Tooltip,
  Dialog, DialogTitle, DialogContent, DialogActions, Alert,
  CircularProgress, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, TextField, FormControl,
  InputLabel, Select, MenuItem, LinearProgress, Badge, TableSortLabel
} from '@mui/material';
import {
  Add, Delete, Edit, Visibility, Construction, CheckCircle,
  Cancel, Pending, Schedule, Search, Clear, Refresh, Description, Close, Warning
} from '@mui/icons-material';
import { logementService, TravauxWithLogement } from '@/services/logementService';
import { TypeTravaux, StatutTravaux } from '@/types/travaux';
import { motion, AnimatePresence } from 'framer-motion';
import TravauxForm from './TravauxForm';

interface TravauxListProps {
  logementId?: number;
  onSelect?: (travaux: TravauxWithLogement) => void;
  readonly?: boolean;
}

// Ajouter l'index signature pour les configurations
interface StatutConfig {
  color: string;
  bg: string;
  icon: JSX.Element;
  label: string;
}

interface TypeConfig {
  label: string;
  icon: JSX.Element;
}

const statutConfig: Record<StatutTravaux, StatutConfig> = {
  [StatutTravaux.PLANIFIE]: { color: '#f57c00', bg: '#fff3e0', icon: <Schedule sx={{ fontSize: 14 }} />, label: 'Planifié' },
  [StatutTravaux.EN_COURS]: { color: '#1976d2', bg: '#e3f2fd', icon: <Pending sx={{ fontSize: 14 }} />, label: 'En cours' },
  [StatutTravaux.TERMINE]: { color: '#2e7d32', bg: '#e8f5e9', icon: <CheckCircle sx={{ fontSize: 14 }} />, label: 'Terminé' },
  [StatutTravaux.ANNULE]: { color: '#c62828', bg: '#ffebee', icon: <Cancel sx={{ fontSize: 14 }} />, label: 'Annulé' }
};

const typeConfig: Record<TypeTravaux, TypeConfig> = {
  [TypeTravaux.MAINTENANCE]: { label: 'Maintenance', icon: <Construction sx={{ fontSize: 14 }} /> },
  [TypeTravaux.RENOVATION]: { label: 'Rénovation', icon: <Construction sx={{ fontSize: 14 }} /> },
  [TypeTravaux.URGENCE]: { label: 'Urgence', icon: <Warning sx={{ fontSize: 14 }} /> },
  [TypeTravaux.ELECTRIQUE]: { label: 'Électrique', icon: <Construction sx={{ fontSize: 14 }} /> },
  [TypeTravaux.PLOMBERIE]: { label: 'Plomberie', icon: <Construction sx={{ fontSize: 14 }} /> },
  [TypeTravaux.PEINTURE]: { label: 'Peinture', icon: <Construction sx={{ fontSize: 14 }} /> },
  [TypeTravaux.AUTRE]: { label: 'Autre', icon: <Construction sx={{ fontSize: 14 }} /> }
};

const TravauxList: React.FC<TravauxListProps> = ({ logementId, onSelect, readonly = false }) => {
  const [travaux, setTravaux] = useState<TravauxWithLogement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selected, setSelected] = useState<TravauxWithLogement | null>(null);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [search, setSearch] = useState('');
  const [filterStatut, setFilterStatut] = useState<string>('');
  const [filterType, setFilterType] = useState<string>('');
  const [orderBy, setOrderBy] = useState<string>('created_at');
  const [orderDir, setOrderDir] = useState<'asc' | 'desc'>('desc');

  useEffect(() => { loadTravaux(); }, [logementId]);

  const loadTravaux = async () => {
    try {
      setLoading(true);
      let data: TravauxWithLogement[];
      if (logementId) {
        const d = await logementService.getTravauxByLogement(logementId);
        data = d.map(t => ({ ...t, logement_numero: t.logement_numero || `#${t.logement_id}`, batiment_nom: t.batiment_nom || '' }));
      } else {
        data = await logementService.getAllTravauxWithLogement({
          statut: filterStatut || undefined,
          type_travaux: filterType || undefined,
          search: search || undefined,
          limit: 100, skip: 0
        });
      }
      setTravaux(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Erreur de chargement');
    } finally { setLoading(false); }
  };

  const handleRefresh = () => { loadTravaux(); };

  const handleCreate = () => {
    setSelected(null);
    setFormMode('create');
    setDialogOpen(true);
  };

  const handleEdit = (travaux: TravauxWithLogement) => {
    setSelected(travaux);
    setFormMode('edit');
    setDialogOpen(true);
  };

  const handleViewDetails = (travaux: TravauxWithLogement) => {
    setSelected(travaux);
    setDetailOpen(true);
    if (onSelect) onSelect(travaux);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ces travaux ?')) {
      try {
        await logementService.deleteTravaux(id);
        await loadTravaux();
        setDetailOpen(false);
      } catch (err: any) {
        setError(err.message || 'Erreur lors de la suppression');
      }
    }
  };

  const handleFormSubmit = async (data: any) => {
    try {
      if (formMode === 'create') {
        await logementService.createTravaux(data);
      } else {
        await logementService.updateTravaux(selected!.id, data);
      }
      setDialogOpen(false);
      await loadTravaux();
    } catch (err: any) {
      setError(err.message || 'Erreur lors de l\'enregistrement');
      throw err;
    }
  };

  const handleSort = (prop: string) => {
    const isAsc = orderBy === prop && orderDir === 'asc';
    setOrderDir(isAsc ? 'desc' : 'asc');
    setOrderBy(prop);
  };

  const filtered = travaux
    .filter(t => {
      const s = search.toLowerCase();
      const matchSearch = !s || 
        t.description.toLowerCase().includes(s) ||
        t.type_travaux.toLowerCase().includes(s) ||
        (t.prestataire || '').toLowerCase().includes(s) ||
        (t.logement_numero || '').toLowerCase().includes(s);
      
      const matchStatut = !filterStatut || t.statut === filterStatut;
      const matchType = !filterType || t.type_travaux === filterType;
      
      return matchSearch && matchStatut && matchType;
    })
    .sort((a, b) => {
      const asc = orderDir === 'asc';
      switch (orderBy) {
        case 'description': return asc ? a.description.localeCompare(b.description) : b.description.localeCompare(a.description);
        case 'statut': return asc ? a.statut.localeCompare(b.statut) : b.statut.localeCompare(a.statut);
        case 'logement_numero': return asc ? (a.logement_numero || '').localeCompare(b.logement_numero || '') : (b.logement_numero || '').localeCompare(a.logement_numero || '');
        case 'date_debut': return asc ? (a.date_debut || '').localeCompare(b.date_debut || '') : (b.date_debut || '').localeCompare(a.date_debut || '');
        default: return asc ? a.id - b.id : b.id - a.id;
      }
    });

  const stats = {
    total: travaux.length,
    planifie: travaux.filter(t => t.statut === StatutTravaux.PLANIFIE).length,
    enCours: travaux.filter(t => t.statut === StatutTravaux.EN_COURS).length,
    termine: travaux.filter(t => t.statut === StatutTravaux.TERMINE).length,
    annule: travaux.filter(t => t.statut === StatutTravaux.ANNULE).length
  };

  if (loading) {
    return (
      <Box sx={{ py: 4 }}>
        <LinearProgress sx={{ borderRadius: 2 }} />
        <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', mt: 1, color: '#64748b' }}>Chargement...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* En-tête */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2, mb: 3 }}>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>Travaux <Badge badgeContent={travaux.length} color="primary" sx={{ ml: 1 }}><span /></Badge></Typography>
          <Typography variant="caption" sx={{ color: '#64748b' }}>{logementId ? 'Travaux de ce logement' : 'Tous les travaux'}</Typography>
        </Box>
        {!readonly && (
          <Button variant="contained" startIcon={<Add />} onClick={handleCreate}
            sx={{ bgcolor: '#2e7d32', '&:hover': { bgcolor: '#1b5e20' }, borderRadius: 2, textTransform: 'none' }}>
            Nouveau
          </Button>
        )}
      </Box>

      {/* Statistiques */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'Total', value: stats.total, color: '#0f172a' },
          { label: 'Planifiés', value: stats.planifie, color: '#f57c00', bg: '#fff3e0' },
          { label: 'En cours', value: stats.enCours, color: '#1976d2', bg: '#e3f2fd' },
          { label: 'Terminés', value: stats.termine, color: '#2e7d32', bg: '#e8f5e9' },
          { label: 'Annulés', value: stats.annule, color: '#c62828', bg: '#ffebee' }
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

      {/* Filtres */}
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
              {Object.values(StatutTravaux).map(s => (
                <MenuItem key={s} value={s}>{statutConfig[s as StatutTravaux]?.label || s}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 130 }}>
            <InputLabel>Type</InputLabel>
            <Select value={filterType} onChange={e => setFilterType(e.target.value)} label="Type">
              <MenuItem value="">Tous</MenuItem>
              {Object.values(TypeTravaux).map(t => (
                <MenuItem key={t} value={t}>{typeConfig[t as TypeTravaux]?.label || t}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <Tooltip title="Rafraîchir"><IconButton onClick={handleRefresh} size="small"><Refresh /></IconButton></Tooltip>
          <Typography variant="caption" sx={{ color: '#94a3b8', ml: 'auto' }}>{filtered.length} résultat(s)</Typography>
        </Box>
      </Paper>

      {/* Liste des travaux */}
      {filtered.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 2, border: '1px solid #e2e8f0' }}>
          <Construction sx={{ fontSize: 48, color: '#cbd5e1', mb: 2 }} />
          <Typography variant="h6" sx={{ color: '#64748b' }}>Aucun travaux trouvé</Typography>
          {!readonly && (
            <Button variant="outlined" startIcon={<Add />} onClick={handleCreate} sx={{ mt: 2 }}>Planifier</Button>
          )}
        </Paper>
      ) : (
        <TableContainer component={Paper} sx={{ borderRadius: 2, border: '1px solid #e2e8f0' }}>
          <Table size="small">
            <TableHead sx={{ bgcolor: '#f8fafc' }}>
              <TableRow>
                {['type_travaux', 'description', ...(!logementId ? ['logement'] : []), 'statut', 'date_debut', 'cout', 'prestataire', 'actions'].map(h => (
                  <TableCell key={h} sx={{ fontWeight: 600 }}>
                    {h === 'actions' ? (
                      <Box sx={{ textAlign: 'right' }}>Actions</Box>
                    ) : (
                      <TableSortLabel active={orderBy === h} direction={orderDir} onClick={() => handleSort(h)}>
                        {h === 'type_travaux' ? 'Type' : h === 'date_debut' ? 'Dates' : h === 'cout' ? 'Coût' : h.charAt(0).toUpperCase() + h.slice(1)}
                      </TableSortLabel>
                    )}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              <AnimatePresence>
                {filtered.map((t, i) => (
                  <motion.tr key={t.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ delay: i * 0.03 }}>
                    <TableCell>
                      <Chip 
                        icon={typeConfig[t.type_travaux as TypeTravaux]?.icon} 
                        label={typeConfig[t.type_travaux as TypeTravaux]?.label || t.type_travaux} 
                        size="small" 
                        sx={{ bgcolor: '#f1f5f9' }} 
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" noWrap sx={{ maxWidth: 180 }}>{t.description}</Typography>
                    </TableCell>
                    {!logementId && (
                      <TableCell>
                        <Typography variant="body2">{t.logement_numero || `#${t.logement_id}`}</Typography>
                        {t.batiment_nom && <Typography variant="caption" sx={{ color: '#64748b' }}>{t.batiment_nom}</Typography>}
                      </TableCell>
                    )}
                    <TableCell>
                      <Chip 
                        icon={statutConfig[t.statut as StatutTravaux]?.icon} 
                        label={statutConfig[t.statut as StatutTravaux]?.label} 
                        size="small" 
                        sx={{ bgcolor: statutConfig[t.statut as StatutTravaux]?.bg, color: statutConfig[t.statut as StatutTravaux]?.color }} 
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption" sx={{ display: 'block' }}>{t.date_debut ? new Date(t.date_debut).toLocaleDateString() : '-'}</Typography>
                      {t.date_fin && <Typography variant="caption" color="text.secondary">→ {new Date(t.date_fin).toLocaleDateString()}</Typography>}
                    </TableCell>
                    <TableCell>
                      {t.cout_estime && <Typography variant="caption" sx={{ display: 'block' }}>Est.: {t.cout_estime.toLocaleString()} Ar</Typography>}
                      {t.cout_reel && <Typography variant="caption" color="primary" sx={{ display: 'block' }}>Réel: {t.cout_reel.toLocaleString()} Ar</Typography>}
                    </TableCell>
                    <TableCell>{t.prestataire || '-'}</TableCell>
                    <TableCell align="right">
                      <Tooltip title="Détails">
                        <IconButton size="small" onClick={() => handleViewDetails(t)}>
                          <Visibility fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      {!readonly && (
                        <>
                          <Tooltip title="Modifier">
                            <IconButton size="small" onClick={() => handleEdit(t)}>
                              <Edit fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Supprimer">
                            <IconButton size="small" color="error" onClick={() => handleDelete(t.id)}>
                              <Delete fontSize="small" />
                            </IconButton>
                          </Tooltip>
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

      {/* Dialog de création/modification */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth slotProps={{ paper: { sx: { borderRadius: 3 } } }}>
        <DialogTitle>{formMode === 'create' ? 'Nouveaux travaux' : 'Modifier'}</DialogTitle>
        <DialogContent dividers>
          <TravauxForm 
            initialData={selected || undefined} 
            logementId={logementId}
            onSubmit={handleFormSubmit}
            onCancel={() => setDialogOpen(false)} 
            isEditing={formMode === 'edit'} 
          />
        </DialogContent>
      </Dialog>

      {/* Dialog de détails */}
      <Dialog open={detailOpen} onClose={() => setDetailOpen(false)} maxWidth="md" fullWidth slotProps={{ paper: { sx: { borderRadius: 3 } } }}>
        {selected && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Construction sx={{ color: '#2e7d32' }} />
                  <Typography variant="h6">{typeConfig[selected.type_travaux as TypeTravaux]?.label || selected.type_travaux}</Typography>
                  <Chip 
                    icon={statutConfig[selected.statut as StatutTravaux]?.icon} 
                    label={statutConfig[selected.statut as StatutTravaux]?.label} 
                    size="small"
                    sx={{ bgcolor: statutConfig[selected.statut as StatutTravaux]?.bg, color: statutConfig[selected.statut as StatutTravaux]?.color }} 
                  />
                </Box>
                <Box>
                  {!readonly && (
                    <>
                      <Tooltip title="Modifier">
                        <IconButton onClick={() => { setDetailOpen(false); handleEdit(selected); }}>
                          <Edit />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Supprimer">
                        <IconButton color="error" onClick={() => handleDelete(selected.id)}>
                          <Delete />
                        </IconButton>
                      </Tooltip>
                    </>
                  )}
                  <IconButton onClick={() => setDetailOpen(false)}><Close /></IconButton>
                </Box>
              </Box>
            </DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12 }}>
                  <Typography variant="subtitle2" color="text.secondary">Description</Typography>
                  <Typography variant="body1">{selected.description}</Typography>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="subtitle2" color="text.secondary">Logement</Typography>
                  <Typography variant="body1">{selected.logement_numero || `#${selected.logement_id}`}</Typography>
                  {selected.batiment_nom && <Typography variant="caption" color="text.secondary">{selected.batiment_nom}</Typography>}
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="subtitle2" color="text.secondary">Statut</Typography>
                  <Chip 
                    icon={statutConfig[selected.statut as StatutTravaux]?.icon} 
                    label={statutConfig[selected.statut as StatutTravaux]?.label} 
                    size="small"
                    sx={{ bgcolor: statutConfig[selected.statut as StatutTravaux]?.bg, color: statutConfig[selected.statut as StatutTravaux]?.color }} 
                  />
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="subtitle2" color="text.secondary">Début</Typography>
                  <Typography variant="body1">{selected.date_debut ? new Date(selected.date_debut).toLocaleDateString() : '-'}</Typography>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="subtitle2" color="text.secondary">Fin</Typography>
                  <Typography variant="body1">{selected.date_fin ? new Date(selected.date_fin).toLocaleDateString() : '-'}</Typography>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="subtitle2" color="text.secondary">Coût estimé</Typography>
                  <Typography variant="body1">{selected.cout_estime ? `${selected.cout_estime.toLocaleString()} Ar` : '-'}</Typography>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Typography variant="subtitle2" color="text.secondary">Coût réel</Typography>
                  <Typography variant="body1" color={selected.cout_reel ? 'primary' : 'text.secondary'}>
                    {selected.cout_reel ? `${selected.cout_reel.toLocaleString()} Ar` : '-'}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Typography variant="subtitle2" color="text.secondary">Prestataire</Typography>
                  <Typography variant="body1">{selected.prestataire || '-'}</Typography>
                </Grid>
                {selected.documents?.length > 0 && (
                  <Grid size={{ xs: 12 }}>
                    <Typography variant="subtitle2" color="text.secondary">Documents</Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {selected.documents.map((doc, i) => (
                        <Chip key={i} icon={<Description />} label={`Doc ${i + 1}`} size="small" onClick={() => window.open(doc, '_blank')} sx={{ cursor: 'pointer' }} />
                      ))}
                    </Box>
                  </Grid>
                )}
                <Grid size={{ xs: 12 }}>
                  <Typography variant="subtitle2" color="text.secondary">Créé le</Typography>
                  <Typography variant="body2">{new Date(selected.created_at).toLocaleString()}</Typography>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions><Button onClick={() => setDetailOpen(false)}>Fermer</Button></DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default TravauxList;