'use client';
import { useEffect, useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  Box, Container, Typography, Button, Grid, CircularProgress, 
  Alert, Chip, IconButton, InputBase, Paper, FormControl, 
  InputLabel, Select, MenuItem, Fade, alpha, Avatar, 
  Badge, Tooltip, Zoom, Pagination, Skeleton
} from '@mui/material';
import { 
  Add, Search, Apartment, Home, Clear, FilterList, 
  ViewModule, ViewList, Sort, CheckCircle, Cancel,
  Pending, Build, Refresh
} from '@mui/icons-material';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import LogementCard from '@/components/logements/LogementCard';
import { logementService, Logement } from '@/services/logementService';
import { batimentService, Batiment } from '@/services/batimentService';
import { motion, AnimatePresence } from 'framer-motion';

export default function LogementsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const batimentIdParam = searchParams.get('batiment_id');
  
  const [logements, setLogements] = useState<Logement[]>([]);
  const [batiments, setBatiments] = useState<Batiment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [selectedBatiment, setSelectedBatiment] = useState<number | ''>(batimentIdParam ? Number(batimentIdParam) : '');
  const [selectedStatut, setSelectedStatut] = useState<string>('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [page, setPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const itemsPerPage = 12;

  useEffect(() => {
    fetchBatiments();
    fetchLogements();
  }, [selectedBatiment, selectedStatut]);

  const fetchBatiments = async () => {
    try {
      const data = await batimentService.getAll();
      setBatiments(data);
    } catch (error) {
      console.error('Erreur chargement bâtiments:', error);
    }
  };

  const fetchLogements = async () => {
    try {
      setLoading(true);
      let data: Logement[] = [];
      if (selectedBatiment) {
        data = await logementService.getByBatiment(selectedBatiment, selectedStatut || undefined);
      } else {
        data = await logementService.getDisponibles();
      }
      setLogements(data);
      setPage(1);
      setError(null);
    } catch (error) {
      setError('Impossible de charger les logements');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    await logementService.delete(id);
    fetchLogements();
  };

  const handleStatutChange = async (id: number, statut: string) => {
    await logementService.updateStatut(id, statut);
    fetchLogements();
  };

  const clearFilters = () => {
    setSearch('');
    setSelectedBatiment('');
    setSelectedStatut('');
    setPage(1);
  };

  const filteredLogements = logements.filter(l =>
    l.numero.toLowerCase().includes(search.toLowerCase()) ||
    l.type?.toLowerCase().includes(search.toLowerCase()) ||
    (l.batiment?.nom?.toLowerCase().includes(search.toLowerCase()))
  );

  const paginatedLogements = filteredLogements.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const pageCount = Math.ceil(filteredLogements.length / itemsPerPage);

  const statutOptions = [
    { value: 'libre', label: 'Libre', color: '#2e7d32', icon: <CheckCircle sx={{ fontSize: 12 }} /> },
    { value: 'occupe', label: 'Occupé', color: '#1565c0', icon: <Home sx={{ fontSize: 12 }} /> },
    { value: 'reserve', label: 'Réservé', color: '#e65100', icon: <Pending sx={{ fontSize: 12 }} /> },
    { value: 'en_maintenance', label: 'Maintenance', color: '#c62828', icon: <Build sx={{ fontSize: 12 }} /> },
    { value: 'en_renovation', label: 'Rénovation', color: '#6a1b9a', icon: <Build sx={{ fontSize: 12 }} /> },
  ];

  const getStatutIcon = (statut: string) => {
    const option = statutOptions.find(s => s.value === statut);
    return option?.icon || <CheckCircle sx={{ fontSize: 12 }} />;
  };

  return (
    <Box sx={{ display: 'flex', bgcolor: '#f8fafc', minHeight: '100vh' }}>
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Header onMenuClick={() => setMobileOpen(!mobileOpen)} />
        
        <Container maxWidth={false} sx={{ px: { xs: 2, sm: 3 }, py: { xs: 2, sm: 2.5 }, mt: { xs: 7, sm: 8 } }}>
          
          <Fade in timeout={500}>
            <Box>
              {/* Header avec statistiques */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2, mb: 3 }}>
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
                      Logements
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                      <Chip 
                        size="small" 
                        label={`${filteredLogements.length} logement${filteredLogements.length > 1 ? 's' : ''}`} 
                        sx={{ bgcolor: alpha('#2e7d32', 0.1), color: '#2e7d32', height: 22, fontSize: '0.7rem' }} 
                      />
                      {selectedBatiment && (
                        <Chip 
                          size="small" 
                          label={batiments.find(b => b.id === selectedBatiment)?.nom} 
                          onDelete={() => setSelectedBatiment('')}
                          sx={{ height: 22, fontSize: '0.7rem' }} 
                        />
                      )}
                      {selectedStatut && (
                        <Chip 
                          size="small" 
                          label={selectedStatut} 
                          icon={getStatutIcon(selectedStatut)}
                          onDelete={() => setSelectedStatut('')}
                          sx={{ height: 22, fontSize: '0.7rem' }} 
                        />
                      )}
                    </Box>
                  </Box>
                  
                  <Box sx={{ display: 'flex', gap: 1.5 }}>
                    <Tooltip title="Rafraîchir">
                      <IconButton 
                        onClick={fetchLogements} 
                        size="small"
                        sx={{ 
                          bgcolor: '#fff', 
                          border: '1px solid #e2e8f0',
                          borderRadius: 1.5,
                          '&:hover': { bgcolor: '#f8fafc' }
                        }}
                      >
                        <Refresh sx={{ fontSize: 18, color: '#64748b' }} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Vue grille">
                      <IconButton 
                        onClick={() => setViewMode('grid')} 
                        size="small"
                        sx={{ 
                          bgcolor: viewMode === 'grid' ? alpha('#2e7d32', 0.1) : '#fff',
                          border: '1px solid #e2e8f0',
                          borderRadius: 1.5,
                          '&:hover': { bgcolor: '#f8fafc' }
                        }}
                      >
                        <ViewModule sx={{ fontSize: 18, color: viewMode === 'grid' ? '#2e7d32' : '#64748b' }} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Vue liste">
                      <IconButton 
                        onClick={() => setViewMode('list')} 
                        size="small"
                        sx={{ 
                          bgcolor: viewMode === 'list' ? alpha('#2e7d32', 0.1) : '#fff',
                          border: '1px solid #e2e8f0',
                          borderRadius: 1.5,
                          '&:hover': { bgcolor: '#f8fafc' }
                        }}
                      >
                        <ViewList sx={{ fontSize: 18, color: viewMode === 'list' ? '#2e7d32' : '#64748b' }} />
                      </IconButton>
                    </Tooltip>
                    <Button 
                      variant="contained" 
                      startIcon={<Add />} 
                      onClick={() => router.push('/logements/create')} 
                      sx={{ 
                        bgcolor: '#2e7d32', 
                        borderRadius: 1.5, 
                        textTransform: 'none', 
                        fontWeight: 600,
                        px: 2.5,
                        boxShadow: '0 2px 8px rgba(46,125,50,0.2)',
                        '&:hover': { bgcolor: '#1b5e20', transform: 'translateY(-2px)', boxShadow: '0 4px 12px rgba(46,125,50,0.3)' },
                        transition: 'all 0.2s'
                      }}
                    >
                      Nouveau
                    </Button>
                  </Box>
                </Box>
              </motion.div>

              {/* Filtres modernisés */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <Paper 
                  elevation={0} 
                  sx={{ 
                    p: 1.5, 
                    mb: 3, 
                    borderRadius: 2, 
                    border: '1px solid #e2e8f0',
                    bgcolor: '#fff',
                    transition: 'all 0.3s'
                  }}
                >
                  <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', flex: 1, position: 'relative', minWidth: 200 }}>
                      <Search sx={{ position: 'absolute', left: 12, color: '#94a3b8', fontSize: 18, zIndex: 1 }} />
                      <InputBase 
                        placeholder="Rechercher par numéro, type ou bâtiment..." 
                        value={search} 
                        onChange={(e) => setSearch(e.target.value)} 
                        sx={{ 
                          pl: 4.5, 
                          pr: 4, 
                          py: 1, 
                          width: '100%', 
                          fontSize: '0.85rem',
                          bgcolor: '#f8fafc',
                          borderRadius: 1.5,
                          transition: 'all 0.2s',
                          '&:focus-within': { bgcolor: '#fff', boxShadow: '0 0 0 2px rgba(46,125,50,0.2)' }
                        }} 
                      />
                      {search && (
                        <IconButton size="small" onClick={() => setSearch('')} sx={{ position: 'absolute', right: 4 }}>
                          <Clear sx={{ fontSize: 16, color: '#94a3b8' }} />
                        </IconButton>
                      )}
                    </Box>
                    
                    <FormControl size="small" sx={{ minWidth: 180 }}>
                      <InputLabel sx={{ fontSize: '0.8rem' }}>Bâtiment</InputLabel>
                      <Select 
                        value={selectedBatiment} 
                        onChange={(e) => setSelectedBatiment(e.target.value as number | '')} 
                        label="Bâtiment"
                        sx={{ borderRadius: 1.5, bgcolor: '#f8fafc', fontSize: '0.8rem' }}
                      >
                        <MenuItem value="" sx={{ fontSize: '0.8rem' }}>Tous les bâtiments</MenuItem>
                        {batiments.map(b => (
                          <MenuItem key={b.id} value={b.id} sx={{ fontSize: '0.8rem' }}>{b.nom}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <FormControl size="small" sx={{ minWidth: 140 }}>
                      <InputLabel sx={{ fontSize: '0.8rem' }}>Statut</InputLabel>
                      <Select 
                        value={selectedStatut} 
                        onChange={(e) => setSelectedStatut(e.target.value)} 
                        label="Statut"
                        sx={{ borderRadius: 1.5, bgcolor: '#f8fafc', fontSize: '0.8rem' }}
                      >
                        <MenuItem value="" sx={{ fontSize: '0.8rem' }}>Tous les statuts</MenuItem>
                        {statutOptions.map(s => (
                          <MenuItem key={s.value} value={s.value} sx={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box component="span" sx={{ color: s.color }}>{s.icon}</Box>
                            {s.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    {(search || selectedBatiment || selectedStatut) && (
                      <Tooltip title="Effacer les filtres">
                        <Button 
                          size="small"
                          onClick={clearFilters}
                          startIcon={<Clear sx={{ fontSize: 14 }} />}
                          sx={{ 
                            textTransform: 'none', 
                            fontSize: '0.7rem',
                            color: '#f44336',
                            '&:hover': { bgcolor: alpha('#f44336', 0.05) }
                          }}
                        >
                          Effacer
                        </Button>
                      </Tooltip>
                    )}
                  </Box>
                </Paper>
              </motion.div>

              {/* Message d'erreur */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <Alert 
                      severity="error" 
                      sx={{ mb: 3, borderRadius: 2 }}
                      action={
                        <Button color="inherit" size="small" onClick={() => setError(null)}>
                          Fermer
                        </Button>
                      }
                    >
                      {error}
                    </Alert>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Contenu principal */}
              {loading ? (
                <Grid container spacing={2.5}>
                  {[...Array(8)].map((_, i) => (
                    <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={i}>
                      <Skeleton 
                        variant="rectangular" 
                        height={280} 
                        sx={{ borderRadius: 2, bgcolor: '#e2e8f0' }} 
                      />
                    </Grid>
                  ))}
                </Grid>
              ) : filteredLogements.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Paper 
                    sx={{ 
                      textAlign: 'center', 
                      py: 8, 
                      borderRadius: 3,
                      border: '1px solid #e2e8f0',
                      bgcolor: '#fff'
                    }}
                  >
                    <Avatar 
                      sx={{ 
                        width: 80, 
                        height: 80, 
                        mx: 'auto', 
                        mb: 2, 
                        bgcolor: alpha('#2e7d32', 0.1),
                        color: '#2e7d32'
                      }}
                    >
                      <Home sx={{ fontSize: 40 }} />
                    </Avatar>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#0f172a', mb: 1 }}>
                      Aucun logement trouvé
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#64748b', mb: 3 }}>
                      {search || selectedBatiment || selectedStatut 
                        ? "Aucun logement ne correspond à vos critères" 
                        : "Commencez par ajouter votre premier logement"}
                    </Typography>
                    <Button 
                      variant="contained" 
                      startIcon={<Add />} 
                      onClick={() => router.push('/logements/create')}
                      sx={{ bgcolor: '#2e7d32', borderRadius: 2, textTransform: 'none' }}
                    >
                      Ajouter un logement
                    </Button>
                  </Paper>
                </motion.div>
              ) : (
                <>
                  <Grid container spacing={2.5}>
                    <AnimatePresence>
                        {paginatedLogements.map((logement, index) => (
                        <Grid size={{ xs: 12, sm: 6, md: viewMode === 'grid' ? 4 : 12, lg: viewMode === 'grid' ? 3 : 12 }} key={logement.id}>
                            <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.3, delay: (index % 12) * 0.02 }}
                            style={{ height: '100%' }}
                            >
                            <LogementCard 
                                logement={logement} 
                                onDelete={handleDelete} 
                                onStatutChange={handleStatutChange}
                                // viewMode={viewMode} ← Supprimez cette ligne
                            />
                            </motion.div>
                        </Grid>
                        ))}
                    </AnimatePresence>
                    </Grid>

                  {/* Pagination */}
                  {pageCount > 1 && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                      <Pagination 
                        count={pageCount} 
                        page={page} 
                        onChange={(_, value) => setPage(value)} 
                        color="primary"
                        sx={{
                          '& .MuiPaginationItem-root': {
                            borderRadius: 1.5,
                            '&.Mui-selected': {
                              bgcolor: '#2e7d32',
                              color: '#fff',
                              '&:hover': { bgcolor: '#1b5e20' }
                            }
                          }
                        }}
                      />
                    </Box>
                  )}
                </>
              )}
            </Box>
          </Fade>
        </Container>
      </Box>
    </Box>
  );
}