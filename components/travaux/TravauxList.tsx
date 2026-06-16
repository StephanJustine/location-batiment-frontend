// components/travaux/TravauxList.tsx
'use client';

import React, { useState, useEffect, JSX } from 'react';
import {
  Box,
  Typography,
  Chip,
  Button,
  Grid,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  LinearProgress,
  Badge,
  TableSortLabel,
  InputAdornment
} from '@mui/material';
import {
  Add,
  Delete,
  Edit,
  Visibility,
  Construction,
  CheckCircle,
  Cancel,
  Pending,
  Schedule,
  Search,
  Clear,
  Refresh,
  Description,
  Close,
  Warning
} from '@mui/icons-material';
import { logementService } from '@/services/logementService';
import { Travaux, TypeTravaux, StatutTravaux } from '@/types/travaux';
import { motion, AnimatePresence } from 'framer-motion';

// Composant TravauxForm intégré
const TravauxForm = ({ initialData, logementId, onSubmit, onCancel, isEditing }: any) => {
  const [formData, setFormData] = useState({
    logement_id: initialData?.logement_id || logementId || '',
    type_travaux: initialData?.type_travaux || TypeTravaux.MAINTENANCE,
    description: initialData?.description || '',
    date_debut: initialData?.date_debut || '',
    date_fin: initialData?.date_fin || '',
    cout_estime: initialData?.cout_estime || 0,
    cout_reel: initialData?.cout_reel || 0,
    prestataire: initialData?.prestataire || '',
    statut: initialData?.statut || StatutTravaux.PLANIFIE
  });
  const [loading, setLoading] = useState(false);

  const typeOptions = Object.values(TypeTravaux).map(type => ({
    value: type,
    label: type.replace('_', ' ').toUpperCase()
  }));

  const statutOptions = Object.values(StatutTravaux).map(statut => ({
    value: statut,
    label: statut.replace('_', ' ').toUpperCase()
  }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ pt: 2 }}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormControl fullWidth size="small">
            <InputLabel>Type de travaux *</InputLabel>
            <Select
              value={formData.type_travaux}
              onChange={(e) => setFormData({ ...formData, type_travaux: e.target.value })}
              label="Type de travaux *"
              required
            >
              {typeOptions.map((type) => (
                <MenuItem key={type.value} value={type.value}>
                  {type.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <FormControl fullWidth size="small">
            <InputLabel>Statut</InputLabel>
            <Select
              value={formData.statut}
              onChange={(e) => setFormData({ ...formData, statut: e.target.value })}
              label="Statut"
            >
              {statutOptions.map((statut) => (
                <MenuItem key={statut.value} value={statut.value}>
                  {statut.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            size="small"
            multiline
            rows={3}
            label="Description *"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
            placeholder="Décrivez les travaux à effectuer..."
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            size="small"
            type="date"
            label="Date de début"
            value={formData.date_debut}
            onChange={(e) => setFormData({ ...formData, date_debut: e.target.value })}
            slotProps={{ inputLabel: { shrink: true } }}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            size="small"
            type="date"
            label="Date de fin prévue"
            value={formData.date_fin}
            onChange={(e) => setFormData({ ...formData, date_fin: e.target.value })}
            slotProps={{ inputLabel: { shrink: true } }}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            size="small"
            type="number"
            label="Coût estimé (Ar)"
            value={formData.cout_estime}
            onChange={(e) => setFormData({ ...formData, cout_estime: Number(e.target.value) })}
            slotProps={{ 
              htmlInput: { min: 0 },
              input: { startAdornment: <InputAdornment position="start">Ar</InputAdornment> }
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            size="small"
            type="number"
            label="Coût réel (Ar)"
            value={formData.cout_reel}
            onChange={(e) => setFormData({ ...formData, cout_reel: Number(e.target.value) })}
            slotProps={{ 
              htmlInput: { min: 0 },
              input: { startAdornment: <InputAdornment position="start">Ar</InputAdornment> }
            }}
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            size="small"
            label="Prestataire / Entreprise"
            value={formData.prestataire}
            onChange={(e) => setFormData({ ...formData, prestataire: e.target.value })}
            placeholder="Nom de l'entreprise ou du prestataire"
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button onClick={onCancel} disabled={loading} size="small">
              Annuler
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              size="small"
              sx={{ bgcolor: '#2e7d32', '&:hover': { bgcolor: '#1b5e20' } }}
            >
              {loading ? <CircularProgress size={20} /> : (isEditing ? 'Mettre à jour' : 'Créer')}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

interface TravauxListProps {
  logementId?: number;
  onSelect?: (travaux: Travaux) => void;
  readonly?: boolean;
}

const TravauxList: React.FC<TravauxListProps> = ({
  logementId,
  onSelect,
  readonly = false
}) => {
  const [travaux, setTravaux] = useState<Travaux[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedTravaux, setSelectedTravaux] = useState<Travaux | null>(null);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [search, setSearch] = useState('');
  const [filterStatut, setFilterStatut] = useState<string>('');
  const [filterType, setFilterType] = useState<string>('');
  const [orderBy, setOrderBy] = useState<string>('created_at');
  const [orderDirection, setOrderDirection] = useState<'asc' | 'desc'>('desc');

  const statutConfig: Record<string, { color: string; bg: string; icon: JSX.Element; label: string }> = {
    [StatutTravaux.PLANIFIE]: {
      color: '#f57c00',
      bg: '#fff3e0',
      icon: <Schedule sx={{ fontSize: 14 }} />,
      label: 'Planifié'
    },
    [StatutTravaux.EN_COURS]: {
      color: '#1976d2',
      bg: '#e3f2fd',
      icon: <Pending sx={{ fontSize: 14 }} />,
      label: 'En cours'
    },
    [StatutTravaux.TERMINE]: {
      color: '#2e7d32',
      bg: '#e8f5e9',
      icon: <CheckCircle sx={{ fontSize: 14 }} />,
      label: 'Terminé'
    },
    [StatutTravaux.ANNULE]: {
      color: '#c62828',
      bg: '#ffebee',
      icon: <Cancel sx={{ fontSize: 14 }} />,
      label: 'Annulé'
    }
  };

  const typeConfig: Record<string, { label: string; icon: JSX.Element }> = {
    [TypeTravaux.MAINTENANCE]: { label: 'Maintenance', icon: <Construction sx={{ fontSize: 14 }} /> },
    [TypeTravaux.RENOVATION]: { label: 'Rénovation', icon: <Construction sx={{ fontSize: 14 }} /> },
    [TypeTravaux.URGENCE]: { label: 'Urgence', icon: <Warning sx={{ fontSize: 14 }} /> },
    [TypeTravaux.ELECTRIQUE]: { label: 'Électrique', icon: <Construction sx={{ fontSize: 14 }} /> },
    [TypeTravaux.PLOMBERIE]: { label: 'Plomberie', icon: <Construction sx={{ fontSize: 14 }} /> },
    [TypeTravaux.PEINTURE]: { label: 'Peinture', icon: <Construction sx={{ fontSize: 14 }} /> },
    [TypeTravaux.AUTRE]: { label: 'Autre', icon: <Construction sx={{ fontSize: 14 }} /> }
  };

  useEffect(() => {
    loadTravaux();
  }, [logementId]);

  const loadTravaux = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let data: Travaux[];
      if (logementId) {
        data = await logementService.getTravauxByLogement(logementId);
      } else {
        data = await logementService.getAllTravaux();
      }
      
      setTravaux(data);
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement des travaux');
      console.error('Error loading travaux:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    loadTravaux();
  };

  const handleCreate = () => {
    setSelectedTravaux(null);
    setFormMode('create');
    setDialogOpen(true);
  };

  const handleEdit = (travaux: Travaux) => {
    setSelectedTravaux(travaux);
    setFormMode('edit');
    setDialogOpen(true);
  };

  const handleViewDetails = (travaux: Travaux) => {
    setSelectedTravaux(travaux);
    setDetailDialogOpen(true);
    if (onSelect) {
      onSelect(travaux);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ces travaux ?')) {
      try {
        await logementService.deleteTravaux(id);
        await loadTravaux();
        setDetailDialogOpen(false);
      } catch (err: any) {
        setError(err.message || 'Erreur lors de la suppression');
      }
    }
  };

  const handleFormSubmit = async (data: any) => {
    try {
      if (formMode === 'create') {
        const createData = {
          ...data,
          logement_id: logementId || data.logement_id
        };
        await logementService.createTravaux(createData);
      } else {
        await logementService.updateTravaux(selectedTravaux!.id, data);
      }
      setDialogOpen(false);
      await loadTravaux();
    } catch (err: any) {
      setError(err.message || 'Erreur lors de l\'enregistrement');
      throw err;
    }
  };

  const handleSort = (property: string) => {
    const isAsc = orderBy === property && orderDirection === 'asc';
    setOrderDirection(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const filteredTravaux = travaux
    .filter(t => {
      const matchSearch = search === '' || 
        t.description.toLowerCase().includes(search.toLowerCase()) ||
        t.type_travaux.toLowerCase().includes(search.toLowerCase()) ||
        (t.prestataire && t.prestataire.toLowerCase().includes(search.toLowerCase()));
      
      const matchStatut = filterStatut === '' || t.statut === filterStatut;
      const matchType = filterType === '' || t.type_travaux === filterType;
      
      return matchSearch && matchStatut && matchType;
    })
    .sort((a, b) => {
      const isAsc = orderDirection === 'asc';
      switch (orderBy) {
        case 'description':
          return isAsc ? a.description.localeCompare(b.description) : b.description.localeCompare(a.description);
        case 'statut':
          return isAsc ? a.statut.localeCompare(b.statut) : b.statut.localeCompare(a.statut);
        case 'date_debut':
          return isAsc 
            ? (a.date_debut || '').localeCompare(b.date_debut || '')
            : (b.date_debut || '').localeCompare(a.date_debut || '');
        default:
          return isAsc ? a.id - b.id : b.id - a.id;
      }
    });

  const getStats = () => {
    const total = travaux.length;
    const planifie = travaux.filter(t => t.statut === StatutTravaux.PLANIFIE).length;
    const enCours = travaux.filter(t => t.statut === StatutTravaux.EN_COURS).length;
    const termine = travaux.filter(t => t.statut === StatutTravaux.TERMINE).length;
    const annule = travaux.filter(t => t.statut === StatutTravaux.ANNULE).length;
    
    return { total, planifie, enCours, termine, annule };
  };

  const stats = getStats();

  if (loading) {
    return (
      <Box sx={{ py: 4 }}>
        <LinearProgress sx={{ borderRadius: 2 }} />
        <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', mt: 1, color: '#64748b' }}>
          Chargement des travaux...
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* En-tête */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2, mb: 3 }}>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#0f172a' }}>
            Travaux
            <Badge badgeContent={travaux.length} color="primary" sx={{ ml: 1 }}>
              <span />
            </Badge>
          </Typography>
          <Typography variant="caption" sx={{ color: '#64748b' }}>
            {logementId ? 'Travaux de ce logement' : 'Tous les travaux'}
          </Typography>
        </Box>
        
        {!readonly && (
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleCreate}
            sx={{
              bgcolor: '#2e7d32',
              borderRadius: 2,
              textTransform: 'none',
              '&:hover': { bgcolor: '#1b5e20' }
            }}
          >
            Nouveau travaux
          </Button>
        )}
      </Box>

      {/* Stats rapides */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 6, sm: 2.4 }}>
          <Paper sx={{ p: 1.5, textAlign: 'center', borderRadius: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#0f172a' }}>{stats.total}</Typography>
            <Typography variant="caption" sx={{ color: '#64748b' }}>Total</Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 6, sm: 2.4 }}>
          <Paper sx={{ p: 1.5, textAlign: 'center', borderRadius: 2, bgcolor: '#fff3e0' }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#f57c00' }}>{stats.planifie}</Typography>
            <Typography variant="caption" sx={{ color: '#f57c00' }}>Planifiés</Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 6, sm: 2.4 }}>
          <Paper sx={{ p: 1.5, textAlign: 'center', borderRadius: 2, bgcolor: '#e3f2fd' }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#1976d2' }}>{stats.enCours}</Typography>
            <Typography variant="caption" sx={{ color: '#1976d2' }}>En cours</Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 6, sm: 2.4 }}>
          <Paper sx={{ p: 1.5, textAlign: 'center', borderRadius: 2, bgcolor: '#e8f5e9' }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#2e7d32' }}>{stats.termine}</Typography>
            <Typography variant="caption" sx={{ color: '#2e7d32' }}>Terminés</Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 6, sm: 2.4 }}>
          <Paper sx={{ p: 1.5, textAlign: 'center', borderRadius: 2, bgcolor: '#ffebee' }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#c62828' }}>{stats.annule}</Typography>
            <Typography variant="caption" sx={{ color: '#c62828' }}>Annulés</Typography>
          </Paper>
        </Grid>
      </Grid>

      {error && (
        <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 2, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      {/* Filtres */}
      <Paper sx={{ p: 2, mb: 3, borderRadius: 2, border: '1px solid #e2e8f0' }}>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
          <Box sx={{ flex: 1, minWidth: 200 }}>
            <TextField
              size="small"
              placeholder="Rechercher..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              fullWidth
              slotProps={{
                input: {
                  startAdornment: <Search sx={{ mr: 1, color: '#94a3b8', fontSize: 18 }} />,
                  endAdornment: search && (
                    <IconButton size="small" onClick={() => setSearch('')}>
                      <Clear sx={{ fontSize: 16 }} />
                    </IconButton>
                  )
                }
              }}
              sx={{
                '& .MuiOutlinedInput-root': { borderRadius: 1.5, bgcolor: '#f8fafc' }
              }}
            />
          </Box>

          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel>Statut</InputLabel>
            <Select
              value={filterStatut}
              onChange={(e) => setFilterStatut(e.target.value)}
              label="Statut"
            >
              <MenuItem value="">Tous</MenuItem>
              {Object.values(StatutTravaux).map((statut) => (
                <MenuItem key={statut} value={statut}>
                  {statutConfig[statut]?.label || statut}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel>Type</InputLabel>
            <Select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              label="Type"
            >
              <MenuItem value="">Tous</MenuItem>
              {Object.values(TypeTravaux).map((type) => (
                <MenuItem key={type} value={type}>
                  {typeConfig[type]?.label || type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Tooltip title="Rafraîchir">
            <IconButton onClick={handleRefresh} size="small">
              <Refresh />
            </IconButton>
          </Tooltip>

          <Typography variant="caption" sx={{ color: '#94a3b8', ml: 'auto' }}>
            {filteredTravaux.length} résultat(s)
          </Typography>
        </Box>
      </Paper>

      {/* Liste des travaux */}
      {filteredTravaux.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 2, border: '1px solid #e2e8f0' }}>
          <Construction sx={{ fontSize: 48, color: '#cbd5e1', mb: 2 }} />
          <Typography variant="h6" sx={{ color: '#64748b' }}>
            Aucun travaux trouvé
          </Typography>
          <Typography variant="body2" sx={{ color: '#94a3b8' }}>
            {logementId ? 'Ce logement n\'a pas de travaux' : 'Aucun travaux ne correspond à vos critères'}
          </Typography>
          {!readonly && (
            <Button
              variant="outlined"
              startIcon={<Add />}
              onClick={handleCreate}
              sx={{ mt: 2 }}
            >
              Planifier des travaux
            </Button>
          )}
        </Paper>
      ) : (
        <TableContainer component={Paper} sx={{ borderRadius: 2, border: '1px solid #e2e8f0' }}>
          <Table>
            <TableHead sx={{ bgcolor: '#f8fafc' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>
                  <TableSortLabel
                    active={orderBy === 'type_travaux'}
                    direction={orderBy === 'type_travaux' ? orderDirection : 'asc'}
                    onClick={() => handleSort('type_travaux')}
                  >
                    Type
                  </TableSortLabel>
                </TableCell>
                <TableCell sx={{ fontWeight: 600 }}>
                  <TableSortLabel
                    active={orderBy === 'description'}
                    direction={orderBy === 'description' ? orderDirection : 'asc'}
                    onClick={() => handleSort('description')}
                  >
                    Description
                  </TableSortLabel>
                </TableCell>
                {!logementId && <TableCell sx={{ fontWeight: 600 }}>Logement</TableCell>}
                <TableCell sx={{ fontWeight: 600 }}>
                  <TableSortLabel
                    active={orderBy === 'statut'}
                    direction={orderBy === 'statut' ? orderDirection : 'asc'}
                    onClick={() => handleSort('statut')}
                  >
                    Statut
                  </TableSortLabel>
                </TableCell>
                <TableCell sx={{ fontWeight: 600 }}>
                  <TableSortLabel
                    active={orderBy === 'date_debut'}
                    direction={orderBy === 'date_debut' ? orderDirection : 'asc'}
                    onClick={() => handleSort('date_debut')}
                  >
                    Dates
                  </TableSortLabel>
                </TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Coût</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Prestataire</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <AnimatePresence>
                {filteredTravaux.map((t, index) => (
                  <motion.tr
                    key={t.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: index * 0.03 }}
                  >
                    <TableCell>
                      <Chip
                        icon={typeConfig[t.type_travaux]?.icon || <Construction />}
                        label={typeConfig[t.type_travaux]?.label || t.type_travaux}
                        size="small"
                        sx={{
                          bgcolor: '#f1f5f9',
                          color: '#475569',
                          '& .MuiChip-icon': { color: '#475569' }
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
                        {t.description}
                      </Typography>
                    </TableCell>
                    {!logementId && (
                      <TableCell>
                        <Typography variant="body2">
                          {t.logement_numero || `#${t.logement_id}`}
                        </Typography>
                      </TableCell>
                    )}
                    <TableCell>
                      <Chip
                        icon={statutConfig[t.statut]?.icon}
                        label={statutConfig[t.statut]?.label || t.statut}
                        size="small"
                        sx={{
                          bgcolor: statutConfig[t.statut]?.bg || '#f1f5f9',
                          color: statutConfig[t.statut]?.color || '#475569',
                          '& .MuiChip-icon': { color: statutConfig[t.statut]?.color }
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption" sx={{ display: 'block' }}>
                        {t.date_debut ? new Date(t.date_debut).toLocaleDateString() : '-'}
                      </Typography>
                      {t.date_fin && (
                        <Typography variant="caption" color="text.secondary">
                          → {new Date(t.date_fin).toLocaleDateString()}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      {t.cout_estime && (
                        <Typography variant="caption" sx={{ display: 'block' }}>
                          Est.: {t.cout_estime.toLocaleString()} Ar
                        </Typography>
                      )}
                      {t.cout_reel && (
                        <Typography variant="caption" color="primary" sx={{ display: 'block' }}>
                          Réel: {t.cout_reel.toLocaleString()} Ar
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>{t.prestataire || '-'}</TableCell>
                    <TableCell align="right">
                      <Tooltip title="Voir détails">
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
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="md"
        fullWidth
        slotProps={{
          paper: { sx: { borderRadius: 3 } }
        }}
      >
        <DialogTitle>
          {formMode === 'create' ? 'Nouveaux travaux' : 'Modifier les travaux'}
        </DialogTitle>
        <DialogContent dividers>
          <TravauxForm
            initialData={selectedTravaux || undefined}
            logementId={logementId}
            onSubmit={handleFormSubmit}
            onCancel={() => setDialogOpen(false)}
            isEditing={formMode === 'edit'}
          />
        </DialogContent>
      </Dialog>

      {/* Dialog de détails */}
      <Dialog
        open={detailDialogOpen}
        onClose={() => setDetailDialogOpen(false)}
        maxWidth="md"
        fullWidth
        slotProps={{
          paper: { sx: { borderRadius: 3 } }
        }}
      >
        {selectedTravaux && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Construction sx={{ color: '#2e7d32' }} />
                  <Typography variant="h6">
                    {typeConfig[selectedTravaux.type_travaux]?.label || selectedTravaux.type_travaux}
                  </Typography>
                  <Chip
                    icon={statutConfig[selectedTravaux.statut]?.icon}
                    label={statutConfig[selectedTravaux.statut]?.label}
                    size="small"
                    sx={{
                      bgcolor: statutConfig[selectedTravaux.statut]?.bg,
                      color: statutConfig[selectedTravaux.statut]?.color
                    }}
                  />
                </Box>
                <Box>
                  {!readonly && (
                    <>
                      <Tooltip title="Modifier">
                        <IconButton onClick={() => {
                          setDetailDialogOpen(false);
                          handleEdit(selectedTravaux);
                        }}>
                          <Edit />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Supprimer">
                        <IconButton color="error" onClick={() => handleDelete(selectedTravaux.id)}>
                          <Delete />
                        </IconButton>
                      </Tooltip>
                    </>
                  )}
                  <IconButton onClick={() => setDetailDialogOpen(false)}>
                    <Close />
                  </IconButton>
                </Box>
              </Box>
            </DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Description
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 0.5 }}>
                    {selectedTravaux.description}
                  </Typography>
                </Grid>
                
                <Grid size={{ xs: 6 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Logement
                  </Typography>
                  <Typography variant="body1">
                    {selectedTravaux.logement_numero || `#${selectedTravaux.logement_id}`}
                  </Typography>
                </Grid>
                
                <Grid size={{ xs: 6 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Statut
                  </Typography>
                  <Chip
                    icon={statutConfig[selectedTravaux.statut]?.icon}
                    label={statutConfig[selectedTravaux.statut]?.label}
                    size="small"
                    sx={{
                      bgcolor: statutConfig[selectedTravaux.statut]?.bg,
                      color: statutConfig[selectedTravaux.statut]?.color
                    }}
                  />
                </Grid>

                <Grid size={{ xs: 6 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Date de début
                  </Typography>
                  <Typography variant="body1">
                    {selectedTravaux.date_debut ? new Date(selectedTravaux.date_debut).toLocaleDateString() : '-'}
                  </Typography>
                </Grid>

                <Grid size={{ xs: 6 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Date de fin
                  </Typography>
                  <Typography variant="body1">
                    {selectedTravaux.date_fin ? new Date(selectedTravaux.date_fin).toLocaleDateString() : '-'}
                  </Typography>
                </Grid>

                <Grid size={{ xs: 6 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Coût estimé
                  </Typography>
                  <Typography variant="body1">
                    {selectedTravaux.cout_estime ? `${selectedTravaux.cout_estime.toLocaleString()} Ar` : '-'}
                  </Typography>
                </Grid>

                <Grid size={{ xs: 6 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Coût réel
                  </Typography>
                  <Typography variant="body1" color={selectedTravaux.cout_reel ? 'primary' : 'text.secondary'}>
                    {selectedTravaux.cout_reel ? `${selectedTravaux.cout_reel.toLocaleString()} Ar` : '-'}
                  </Typography>
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Prestataire
                  </Typography>
                  <Typography variant="body1">
                    {selectedTravaux.prestataire || '-'}
                  </Typography>
                </Grid>

                {selectedTravaux.documents && selectedTravaux.documents.length > 0 && (
                  <Grid size={{ xs: 12 }}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Documents
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {selectedTravaux.documents.map((doc, idx) => (
                        <Chip
                          key={idx}
                          icon={<Description />}
                          label={`Document ${idx + 1}`}
                          size="small"
                          onClick={() => window.open(doc, '_blank')}
                          sx={{ cursor: 'pointer' }}
                        />
                      ))}
                    </Box>
                  </Grid>
                )}

                <Grid size={{ xs: 12 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Créé le
                  </Typography>
                  <Typography variant="body2">
                    {new Date(selectedTravaux.created_at).toLocaleString()}
                  </Typography>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDetailDialogOpen(false)}>Fermer</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default TravauxList;