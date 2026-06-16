// src/app/releves/[id]/page.tsx

'use client';

import { useState, useEffect, JSX } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Box, Container, Typography, Paper, Grid, Card, CardContent,
  Button, Chip, Avatar, Stack, IconButton, CircularProgress,
  Alert, Snackbar, Tooltip, Divider, Dialog, DialogTitle,
  DialogContent, DialogActions, useTheme, Fade, LinearProgress,
  Collapse
} from '@mui/material';
import {
  ArrowBack, Edit, Delete, WaterDrop, ElectricBolt,
  TrendingUp, Receipt, CheckCircle, Warning, Schedule,
  Home, LocationOn, CalendarToday, Numbers,
  AttachMoney, Description, People,
  Person, Phone, Email, Print, 
  Verified, Check, ExpandMore, ExpandLess,
  Business, Work
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { releveService } from '@/services/releveService';
import { locataireService } from '@/services/locataireService';
import { TypeReleve, StatutReleve, Releve } from '@/types/releve';
import { formatCurrency, formatDate } from '@/utils/formatters';
import api from '@/lib/api';

// ==================== CONSTANTES ====================

const TARIF_EAU_PAR_PERSONNE = 10000; // 10 000 Ar par personne

const typeLabels: Record<TypeReleve, { label: string; icon: JSX.Element; color: string; bg: string }> = {
  [TypeReleve.EAU]: { label: 'Eau', icon: <WaterDrop sx={{ fontSize: 14 }} />, color: '#3b82f6', bg: '#eff6ff' },
  [TypeReleve.ELECTRICITE]: { label: 'Électricité', icon: <ElectricBolt sx={{ fontSize: 14 }} />, color: '#f59e0b', bg: '#fffbeb' },
  [TypeReleve.GAZ]: { label: 'Gaz', icon: <TrendingUp sx={{ fontSize: 14 }} />, color: '#10b981', bg: '#f0fdf4' },
  [TypeReleve.AUTRE]: { label: 'Autre', icon: <TrendingUp sx={{ fontSize: 14 }} />, color: '#64748b', bg: '#f8fafc' }
};

const statutLabels: Record<StatutReleve, { label: string; color: string; bg: string; icon: JSX.Element }> = {
  [StatutReleve.BROUILLON]: { label: 'Brouillon', color: '#f59e0b', bg: '#fffbeb', icon: <Schedule sx={{ fontSize: 12 }} /> },
  [StatutReleve.VALIDE]: { label: 'Validé', color: '#22c55e', bg: '#f0fdf4', icon: <CheckCircle sx={{ fontSize: 12 }} /> },
  [StatutReleve.FACTURE]: { label: 'Facturé', color: '#3b82f6', bg: '#eff6ff', icon: <Receipt sx={{ fontSize: 12 }} /> },
  [StatutReleve.CONTESTE]: { label: 'Contesté', color: '#ef4444', bg: '#fef2f2', icon: <Warning sx={{ fontSize: 12 }} /> }
};

const moisNoms = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

// ==================== COMPOSANTS ====================

interface InfoRowProps {
  label: string;
  value: string | number;
  bold?: boolean;
  color?: string;
  icon?: JSX.Element;
  subValue?: string;
}

function InfoRow({ label, value, bold, color, icon, subValue }: InfoRowProps) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 0.5 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {icon && <Box sx={{ color: '#94a3b8', display: 'flex', fontSize: 18 }}>{icon}</Box>}
        <Typography variant="body2" color="text.secondary">{label}</Typography>
      </Box>
      <Box sx={{ textAlign: 'right' }}>
        <Typography variant="body2" sx={{ fontWeight: bold ? 700 : 400, color: color || 'inherit' }}>
          {value}
        </Typography>
        {subValue && (
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
            {subValue}
          </Typography>
        )}
      </Box>
    </Box>
  );
}

interface LocataireCardProps {
  locataire: any;
  bail?: any;
  index: number;
  isActive?: boolean;
}

function LocataireCard({ locataire, bail, index, isActive = true }: LocataireCardProps) {
  const nbPersonnes = 1 + (locataire.nombre_enfants || 0);
  const dateDebut = bail?.date_debut ? formatDate(bail.date_debut) : 'N/A';
  const dateFin = bail?.date_fin ? formatDate(bail.date_fin) : 'En cours';
  const loyer = bail?.loyer ? formatCurrency(bail.loyer) : 'N/A';
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <Card sx={{ 
        mb: 1.5, 
        borderRadius: 2, 
        border: `1px solid ${isActive ? '#e2e8f0' : '#fef3c7'}`,
        bgcolor: isActive ? '#ffffff' : '#fffbeb',
        '&:hover': {
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
        }
      }}>
        <CardContent sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Avatar sx={{ bgcolor: isActive ? '#8b5cf6' : '#f59e0b', width: 36, height: 36 }}>
                <Person sx={{ fontSize: 18 }} />
              </Avatar>
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {locataire.nom} {locataire.prenom}
                </Typography>
                <Stack direction="row" spacing={1} sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
                  {locataire.telephone && (
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
                      <Phone sx={{ fontSize: 12 }} /> {locataire.telephone}
                    </Typography>
                  )}
                  {locataire.email && (
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
                      <Email sx={{ fontSize: 12 }} /> {locataire.email}
                    </Typography>
                  )}
                </Stack>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Chip 
                icon={<People sx={{ fontSize: 14 }} />}
                label={`${nbPersonnes} pers.`}
                size="small"
                color={nbPersonnes > 1 ? 'primary' : 'default'}
                sx={{ fontWeight: 500 }}
              />
              {!isActive && (
                <Chip 
                  label="Inactif"
                  size="small"
                  color="warning"
                  sx={{ fontWeight: 500 }}
                />
              )}
            </Box>
          </Box>
          
          {locataire.nombre_enfants > 0 && (
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5, ml: 6 }}>
              {locataire.nombre_enfants} enfant{locataire.nombre_enfants > 1 ? 's' : ''}
            </Typography>
          )}
          
          {locataire.profession && (
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5, ml: 6 }}>
              <Work sx={{ fontSize: 12, verticalAlign: 'middle', mr: 0.3 }} />
              {locataire.profession}
            </Typography>
          )}
          
          {/* Informations du bail */}
          {bail && (
            <Box sx={{ 
              mt: 1, 
              p: 1, 
              bgcolor: '#f8fafc', 
              borderRadius: 1,
              border: '1px solid #e2e8f0'
            }}>
              <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap' }}>
                <Typography variant="caption" color="text.secondary">
                  <Business sx={{ fontSize: 12, verticalAlign: 'middle', mr: 0.3 }} />
                  Bail du {dateDebut} au {dateFin}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  <AttachMoney sx={{ fontSize: 12, verticalAlign: 'middle', mr: 0.3 }} />
                  Loyer: {loyer}
                </Typography>
              </Stack>
            </Box>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ==================== COMPOSANT PRINCIPAL ====================

export default function ReleveDetailPage() {
  const params = useParams();
  const router = useRouter();
  const theme = useTheme();
  const id = Number(params.id);
  
  // États
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [validating, setValidating] = useState(false);
  const [releve, setReleve] = useState<Releve | null>(null);
  const [logement, setLogement] = useState<any>(null);
  const [locataires, setLocataires] = useState<any[]>([]);
  const [nbPersonnes, setNbPersonnes] = useState(0);
  const [montantCalcule, setMontantCalcule] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState('');
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openValidateDialog, setOpenValidateDialog] = useState(false);
  const [calculating, setCalculating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [loadingLocataires, setLoadingLocataires] = useState(false);
  const [locatairesError, setLocatairesError] = useState<string | null>(null);
  const [showLocatairesDetails, setShowLocatairesDetails] = useState(true);

  useEffect(() => {
    if (id) {
      fetchReleve();
    }
  }, [id]);

  // ==================== FETCH RELEVÉ ====================

  const fetchReleve = async () => {
    setLoading(true);
    setError(null);
    try {
      // Utiliser l'API directement pour avoir plus de contrôle
      const response = await api.get(`/releves/${id}`);
      console.log('📋 Réponse brute:', response.data);
      
      if (response.data && response.data.status === 'success') {
        const data = response.data.data;
        console.log('📋 Données extraites:', data);
        
        // Relevé
        if (data.releve) {
          setReleve(data.releve);
        }
        
        // Logement
        if (data.logement) {
          setLogement(data.logement);
        }
        
        // Nombre de personnes
        if (data.nb_personnes !== undefined) {
          setNbPersonnes(data.nb_personnes);
        }
        
        // Montant calculé
        if (data.montant_calcule !== undefined) {
          setMontantCalcule(data.montant_calcule);
        }
        
        // Locataires
        if (data.locataires && Array.isArray(data.locataires)) {
          setLocataires(data.locataires);
        }
      } else {
        // Fallback: utiliser le service normal
        const data = await releveService.getById(id);
        if (data) {
          setReleve(data.releve || data);
          setLogement(data.logement || null);
          setNbPersonnes(data.nb_personnes || 0);
          setMontantCalcule(data.montant_calcule || 0);
          setLocataires(data.locataires || []);
        }
      }
    } catch (err: any) {
      console.error('❌ Erreur chargement relevé:', err);
      setError(err?.message || 'Erreur lors du chargement du relevé');
      
      // Données de test en cas d'erreur
      setReleve({
        id: id,
        logement_id: 1,
        type_releve: TypeReleve.EAU,
        index_ancien: 100,
        index_nouveau: 150,
        consommation: 50,
        mois: new Date().getMonth() + 1,
        annee: new Date().getFullYear(),
        date_releve: new Date().toISOString(),
        statut: StatutReleve.BROUILLON,
        est_facture: false,
        created_at: new Date().toISOString(),
        notes: 'Relevé de test'
      });
      setLogement({
        numero: 'APP-001',
        batiment_nom: 'Résidence Test',
        adresse: '123 Rue de Test'
      });
      setNbPersonnes(2);
      setLocataires([
        {
          locataire: {
            id: 1,
            nom: 'Rakoto',
            prenom: 'Jean',
            telephone: '0341234567',
            email: 'jean@email.com',
            nombre_enfants: 2,
            profession: 'Enseignant',
            is_active: true,
            statut: 'actif'
          },
          bail: null
        },
        {
          locataire: {
            id: 2,
            nom: 'Rabe',
            prenom: 'Marie',
            telephone: '0347654321',
            email: 'marie@email.com',
            nombre_enfants: 1,
            profession: 'Infirmière',
            is_active: true,
            statut: 'actif'
          },
          bail: null
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // ==================== FETCH LOCATAIRES ====================

  const fetchLocataires = async (logementId: number) => {
    setLoadingLocataires(true);
    setLocatairesError(null);
    try {
      console.log('🔍 Récupération des locataires pour le logement:', logementId);
      
      // Essayer de récupérer les locataires
      const data = await locataireService.getLocataires();
      console.log('📋 Locataires reçus:', data);
      
      if (Array.isArray(data)) {
        const filtered = data.filter((loc: any) => {
          return loc.logement_id === logementId || loc.logementId === logementId;
        });
        
        console.log('📌 Locataires filtrés:', filtered.length);
        
        // Transformer pour le format attendu
        const formatted = filtered.map((loc: any) => ({
          locataire: loc,
          bail: null
        }));
        
        setLocataires(formatted);
        
        const total = filtered.reduce((sum, loc) => {
          const nb = 1 + (loc.nombre_enfants || 0);
          return sum + nb;
        }, 0);
        setNbPersonnes(total);
      } else {
        setLocataires([]);
        setNbPersonnes(0);
      }
    } catch (err: any) {
      console.error('❌ Erreur chargement locataires:', err);
      setLocatairesError(err?.message || 'Impossible de charger les locataires');
    } finally {
      setLoadingLocataires(false);
    }
  };

  // ==================== AUTRES FONCTIONS ====================

  const handleRetryLocataires = () => {
    if (releve?.logement_id) {
      fetchLocataires(releve.logement_id);
    }
  };

  const handleCalculer = async () => {
    if (!releve) return;
    setCalculating(true);
    setError(null);
    try {
      const result = await releveService.calculerConsommation(releve.id);
      setSuccess(`Consommation: ${result.consommation} - ${formatCurrency(result.montant)}`);
      fetchReleve();
    } catch (err: any) {
      setError(err?.message || 'Erreur de calcul');
    } finally {
      setCalculating(false);
    }
  };

  const handleValidate = async () => {
    if (!releve) return;
    setValidating(true);
    setError(null);
    try {
      await releveService.update(releve.id, {
        statut: StatutReleve.VALIDE
      });
      
      if (releve.type_releve === TypeReleve.EAU && nbPersonnes > 0) {
        await releveService.calculerConsommation(releve.id);
      }
      
      setSuccess('Relevé validé avec succès');
      setOpenValidateDialog(false);
      fetchReleve();
    } catch (err: any) {
      setError(err?.message || 'Erreur lors de la validation');
    } finally {
      setValidating(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    setError(null);
    try {
      await releveService.deleteReleve(id);
      setSuccess('Relevé supprimé avec succès');
      setOpenDeleteDialog(false);
      setTimeout(() => router.push('/releves'), 1500);
    } catch (err: any) {
      setError(err?.message || 'Erreur de suppression');
      setDeleting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const getMontantAffiche = () => {
    if (montantCalcule > 0) return montantCalcule;
    if (!releve) return 0;
    if (releve.type_releve === TypeReleve.EAU && nbPersonnes > 0) {
      return nbPersonnes * TARIF_EAU_PAR_PERSONNE;
    }
    return releve.montant || 0;
  };

  const getLocatairesActifs = () => {
    return locataires.filter((item: any) => {
      const loc = item.locataire || item;
      return loc.is_active !== false && loc.statut !== 'inactif';
    });
  };

  const getLocatairesInactifs = () => {
    return locataires.filter((item: any) => {
      const loc = item.locataire || item;
      return loc.is_active === false || loc.statut === 'inactif';
    });
  };

  // ==================== RENDU ====================

  if (loading) {
    return (
      <Box sx={{ display: 'flex', bgcolor: '#f8fafc', minHeight: '100vh' }}>
        <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
        <Box component="main" sx={{ flexGrow: 1 }}>
          <Header onMenuClick={() => setMobileOpen(!mobileOpen)} />
          <Container sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', py: 8 }}>
            <CircularProgress size={40} />
            <Typography variant="body2" sx={{ mt: 2, color: '#64748b' }}>
              Chargement du relevé...
            </Typography>
          </Container>
        </Box>
      </Box>
    );
  }

  if (error || !releve) {
    return (
      <Box sx={{ display: 'flex', bgcolor: '#f8fafc', minHeight: '100vh' }}>
        <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
        <Box component="main" sx={{ flexGrow: 1 }}>
          <Header onMenuClick={() => setMobileOpen(!mobileOpen)} />
          <Container sx={{ py: 3, mt: 7 }}>
            <Fade in={true}>
              <Alert 
                severity="error" 
                sx={{ mb: 2, borderRadius: 2 }}
                action={
                  <Button color="inherit" size="small" onClick={() => router.push('/releves')}>
                    Retour
                  </Button>
                }
              >
                {error || 'Relevé non trouvé'}
              </Alert>
            </Fade>
            <Button startIcon={<ArrowBack />} onClick={() => router.push('/releves')} variant="outlined">
              Retour à la liste
            </Button>
          </Container>
        </Box>
      </Box>
    );
  }

  const typeInfo = typeLabels[releve.type_releve];
  const statutInfo = statutLabels[releve.statut];
  const consommation = releve.consommation || (releve.index_nouveau - releve.index_ancien);
  const montantAffiche = getMontantAffiche();
  const locatairesActifs = getLocatairesActifs();
  const locatairesInactifs = getLocatairesInactifs();
  const isBrouillon = releve.statut === StatutReleve.BROUILLON;

  return (
    <Box sx={{ display: 'flex', bgcolor: '#f8fafc', minHeight: '100vh' }}>
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Header onMenuClick={() => setMobileOpen(!mobileOpen)} />
        <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 }, py: 2.5, mt: { xs: 7, sm: 8 } }}>
          
          {/* En-tête */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <IconButton onClick={() => router.push('/releves')} sx={{ bgcolor: '#f1f5f9' }}>
                <ArrowBack />
              </IconButton>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  Détail du relevé
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {typeInfo.label} - {moisNoms[releve.mois - 1]} {releve.annee}
                </Typography>
              </Box>
            </Box>
            <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
              {isBrouillon && (
                <>
                  <Tooltip title="Valider le relevé">
                    <Button 
                      variant="contained" 
                      startIcon={<Verified />}
                      onClick={() => setOpenValidateDialog(true)}
                      size="small"
                      sx={{ 
                        textTransform: 'none', 
                        bgcolor: '#059669',
                        '&:hover': { bgcolor: '#047857' }
                      }}
                    >
                      Valider
                    </Button>
                  </Tooltip>
                  <Tooltip title="Recalculer la consommation">
                    <Button 
                      variant="outlined" 
                      startIcon={calculating ? <CircularProgress size={16} /> : <TrendingUp />}
                      onClick={handleCalculer}
                      disabled={calculating}
                      size="small"
                      sx={{ textTransform: 'none' }}
                    >
                      {calculating ? 'Calcul...' : 'Calculer'}
                    </Button>
                  </Tooltip>
                  <Tooltip title="Modifier">
                    <Button 
                      variant="outlined" 
                      startIcon={<Edit />} 
                      size="small"
                      sx={{ textTransform: 'none' }}
                    >
                      Modifier
                    </Button>
                  </Tooltip>
                  <Tooltip title="Supprimer">
                    <Button 
                      variant="outlined" 
                      color="error" 
                      startIcon={<Delete />} 
                      onClick={() => setOpenDeleteDialog(true)} 
                      size="small"
                      sx={{ textTransform: 'none' }}
                    >
                      Supprimer
                    </Button>
                  </Tooltip>
                </>
              )}
              <Tooltip title="Imprimer">
                <Button 
                  variant="outlined" 
                  startIcon={<Print />}
                  onClick={handlePrint}
                  size="small"
                  sx={{ textTransform: 'none' }}
                >
                  Imprimer
                </Button>
              </Tooltip>
            </Stack>
          </Box>

          {/* Contenu principal */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Paper sx={{ borderRadius: 2, overflow: 'hidden', mb: 3 }}>
              {/* Header coloré */}
              <Box sx={{ p: 2.5, bgcolor: typeInfo.bg, borderBottom: `1px solid ${typeInfo.color}20` }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                  <Avatar sx={{ width: 56, height: 56, bgcolor: typeInfo.color, color: '#fff' }}>
                    {typeInfo.icon}
                  </Avatar>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>{typeInfo.label}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {moisNoms[releve.mois - 1]} {releve.annee}
                    </Typography>
                  </Box>
                  <Chip 
                    icon={statutInfo.icon} 
                    label={statutInfo.label} 
                    sx={{ ml: 'auto', bgcolor: statutInfo.bg, color: statutInfo.color, fontWeight: 600 }} 
                  />
                  {isBrouillon && (
                    <Chip 
                      label="À valider"
                      color="warning"
                      size="small"
                      sx={{ fontWeight: 600 }}
                    />
                  )}
                </Box>
              </Box>

              {/* Contenu */}
              <Box sx={{ p: 3 }}>
                <Grid container spacing={3}>
                  {/* Informations logement */}
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#1976d2', mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Home sx={{ fontSize: 18 }} />
                      Informations du logement
                    </Typography>
                    <Card variant="outlined" sx={{ borderRadius: 2 }}>
                      <CardContent>
                        <Stack spacing={1.5}>
                          <InfoRow label="Logement" value={logement?.numero || `#${releve.logement_id}`} icon={<Numbers />} />
                          <InfoRow label="Bâtiment" value={logement?.batiment_nom || '-'} icon={<LocationOn />} />
                          <InfoRow label="Adresse" value={logement?.adresse || '-'} icon={<Home />} />
                          {nbPersonnes > 0 && (
                            <InfoRow 
                              label="Nombre de personnes" 
                              value={`${nbPersonnes} personne${nbPersonnes > 1 ? 's' : ''}`} 
                              icon={<People />}
                              color="#8b5cf6"
                              subValue={`${locatairesActifs.length} locataire${locatairesActifs.length > 1 ? 's' : ''} actif${locatairesActifs.length > 1 ? 's' : ''}`}
                            />
                          )}
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>

                  {/* Informations relevé */}
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#1976d2', mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Description sx={{ fontSize: 18 }} />
                      Détails du relevé
                    </Typography>
                    <Card variant="outlined" sx={{ borderRadius: 2 }}>
                      <CardContent>
                        <Stack spacing={1.5}>
                          <InfoRow label="Date" value={formatDate(releve.date_releve)} icon={<CalendarToday />} />
                          <InfoRow label="Index ancien" value={releve.index_ancien} icon={<Numbers />} />
                          <InfoRow label="Index nouveau" value={releve.index_nouveau} icon={<Numbers />} />
                          <Divider />
                          <InfoRow 
                            label="Consommation" 
                            value={`${consommation.toFixed(2)} ${releve.type_releve === TypeReleve.EAU ? 'm³' : 'kWh'}`} 
                            bold 
                            icon={<TrendingUp />}
                          />
                          <InfoRow 
                            label="Tarif unitaire" 
                            value={releve.tarif_unitaire ? `${releve.tarif_unitaire} Ar` : '-'} 
                            icon={<AttachMoney />}
                          />
                          <InfoRow 
                            label="Montant" 
                            value={formatCurrency(montantAffiche)} 
                            bold 
                            color="#2e7d32" 
                            icon={<Receipt />}
                            subValue={releve.type_releve === TypeReleve.EAU && nbPersonnes > 0 ? 
                              `${nbPersonnes} × ${formatCurrency(TARIF_EAU_PAR_PERSONNE)} = ${formatCurrency(montantAffiche)}` : undefined}
                          />
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>

                {/* Notes */}
                {releve.notes && (
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#1976d2', mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Description sx={{ fontSize: 18 }} />
                      Notes
                    </Typography>
                    <Paper variant="outlined" sx={{ p: 2, bgcolor: '#fafafa', borderRadius: 2 }}>
                      <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>{releve.notes}</Typography>
                    </Paper>
                  </Box>
                )}

                {/* Locataires */}
                <Box sx={{ mt: 3 }}>
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    mb: 1.5
                  }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#1976d2', display: 'flex', alignItems: 'center', gap: 1 }}>
                      <People sx={{ fontSize: 18 }} />
                      Locataires ({locataires.length})
                      {nbPersonnes > 0 && (
                        <Chip 
                          size="small" 
                          label={`${nbPersonnes} personne${nbPersonnes > 1 ? 's' : ''}`}
                          color="primary"
                        />
                      )}
                    </Typography>
                    <IconButton 
                      size="small" 
                      onClick={() => setShowLocatairesDetails(!showLocatairesDetails)}
                      sx={{ color: '#64748b' }}
                    >
                      {showLocatairesDetails ? <ExpandLess /> : <ExpandMore />}
                    </IconButton>
                  </Box>

                  <Collapse in={showLocatairesDetails}>
                    {loadingLocataires ? (
                      <Box sx={{ py: 2 }}>
                        <LinearProgress />
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                          Chargement des locataires...
                        </Typography>
                      </Box>
                    ) : locatairesError ? (
                      <Alert 
                        severity="error" 
                        sx={{ borderRadius: 2 }}
                        action={
                          <Button color="inherit" size="small" onClick={handleRetryLocataires}>
                            Réessayer
                          </Button>
                        }
                      >
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            Erreur lors du chargement des locataires
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {locatairesError}
                          </Typography>
                        </Box>
                      </Alert>
                    ) : locataires.length === 0 ? (
                      <Alert severity="info" sx={{ borderRadius: 2 }}>
                        Aucun locataire associé à ce logement
                      </Alert>
                    ) : (
                      <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
                        {locatairesActifs.length > 0 && (
                          <>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                              Actifs ({locatairesActifs.length})
                            </Typography>
                            {locatairesActifs.map((item: any, index: number) => {
                              const loc = item.locataire || item;
                              const bail = item.bail || null;
                              return (
                                <LocataireCard 
                                  key={loc.id || index} 
                                  locataire={loc}
                                  bail={bail}
                                  index={index} 
                                  isActive={true} 
                                />
                              );
                            })}
                          </>
                        )}
                        
                        {locatairesInactifs.length > 0 && (
                          <>
                            <Divider sx={{ my: 2 }} />
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                              Inactifs ({locatairesInactifs.length})
                            </Typography>
                            {locatairesInactifs.map((item: any, index: number) => {
                              const loc = item.locataire || item;
                              const bail = item.bail || null;
                              return (
                                <LocataireCard 
                                  key={loc.id || index} 
                                  locataire={loc}
                                  bail={bail}
                                  index={index} 
                                  isActive={false} 
                                />
                              );
                            })}
                          </>
                        )}
                      </Box>
                    )}
                  </Collapse>
                </Box>

                {/* Informations de création */}
                <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid #e2e8f0' }}>
                  <Stack direction="row" spacing={2} sx={{ justifyContent: 'space-between', flexWrap: 'wrap' }}>
                    <Typography variant="caption" color="text.secondary">
                      Créé le {formatDate(releve.created_at)}
                    </Typography>
                    {releve.date_facturation && (
                      <Typography variant="caption" color="text.secondary">
                        Facturé le {formatDate(releve.date_facturation)}
                      </Typography>
                    )}
                    {releve.numero_facture && (
                      <Typography variant="caption" color="text.secondary">
                        N° {releve.numero_facture}
                      </Typography>
                    )}
                  </Stack>
                </Box>
              </Box>
            </Paper>
          </motion.div>
        </Container>
      </Box>

      {/* Dialogue validation */}
      <Dialog open={openValidateDialog} onClose={() => setOpenValidateDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ borderBottom: '1px solid #e2e8f0', pb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Verified sx={{ color: '#059669' }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Valider le relevé
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Alert severity="info" sx={{ borderRadius: 2 }}>
              Êtes-vous sûr de vouloir valider ce relevé ?
            </Alert>

            <Card variant="outlined" sx={{ borderRadius: 2, bgcolor: '#f8fafc' }}>
              <CardContent>
                <Stack spacing={1}>
                  <Typography variant="body2">
                    <strong>Type :</strong> {typeInfo.label}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Période :</strong> {moisNoms[releve.mois - 1]} {releve.annee}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Consommation :</strong> {consommation.toFixed(2)} {releve.type_releve === TypeReleve.EAU ? 'm³' : 'kWh'}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Nombre de personnes :</strong> {nbPersonnes}
                  </Typography>
                  {releve.type_releve === TypeReleve.EAU && nbPersonnes > 0 && (
                    <Box sx={{ p: 1.5, bgcolor: '#eff6ff', borderRadius: 1, mt: 1 }}>
                      <Typography variant="body2" color="#3b82f6">
                        <strong>Calcul eau :</strong> {nbPersonnes} × {formatCurrency(TARIF_EAU_PAR_PERSONNE)} ={' '}
                        <strong>{formatCurrency(montantAffiche)}</strong>
                      </Typography>
                    </Box>
                  )}
                  <Typography variant="body2" sx={{ fontWeight: 700, color: '#059669' }}>
                    <strong>Montant total :</strong> {formatCurrency(montantAffiche)}
                  </Typography>
                </Stack>
              </CardContent>
            </Card>

            {locatairesActifs.length > 0 && (
              <Alert severity="success" sx={{ borderRadius: 2 }}>
                {locatairesActifs.length} locataire{locatairesActifs.length > 1 ? 's' : ''} actif{locatairesActifs.length > 1 ? 's' : ''}
              </Alert>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, borderTop: '1px solid #e2e8f0', pt: 2, gap: 1 }}>
          <Button onClick={() => setOpenValidateDialog(false)} variant="outlined" sx={{ textTransform: 'none' }}>
            Annuler
          </Button>
          <Button 
            variant="contained" 
            onClick={handleValidate} 
            disabled={validating}
            startIcon={validating ? <CircularProgress size={20} /> : <Check />}
            sx={{ 
              textTransform: 'none', 
              bgcolor: '#059669',
              '&:hover': { bgcolor: '#047857' }
            }}
          >
            {validating ? 'Validation...' : 'Valider le relevé'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialogue suppression */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ borderBottom: '1px solid #e2e8f0', pb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#ef4444' }}>
            Confirmer la suppression
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Alert severity="warning" sx={{ mb: 2, borderRadius: 2 }}>
            Cette action est irréversible.
          </Alert>
          <Typography variant="body2">
            Êtes-vous sûr de vouloir supprimer ce relevé du{' '}
            <strong>{moisNoms[releve.mois - 1]} {releve.annee}</strong> ?
          </Typography>
          {releve.est_facture && (
            <Alert severity="error" sx={{ mt: 2, borderRadius: 2 }}>
              ⚠️ Ce relevé a déjà été facturé. La suppression n'est pas recommandée.
            </Alert>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, borderTop: '1px solid #e2e8f0', pt: 2 }}>
          <Button onClick={() => setOpenDeleteDialog(false)} variant="outlined">Annuler</Button>
          <Button onClick={handleDelete} variant="contained" color="error" disabled={deleting}>
            {deleting ? 'Suppression...' : 'Supprimer'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbars */}
      <Snackbar 
        open={!!success} 
        autoHideDuration={4000} 
        onClose={() => setSuccess('')} 
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" onClose={() => setSuccess('')} sx={{ borderRadius: 2 }}>
          {success}
        </Alert>
      </Snackbar>
      
      <Snackbar 
        open={!!error} 
        autoHideDuration={6000} 
        onClose={() => setError(null)} 
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="error" onClose={() => setError(null)} sx={{ borderRadius: 2 }}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
}