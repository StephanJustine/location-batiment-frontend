// app/employes/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Box, Container, Typography, Paper, Grid, Card, CardContent,
  Avatar, alpha, Chip, Button, IconButton, Tooltip, Divider,
  CircularProgress, Tabs, Tab, List, ListItem, ListItemText,
  ListItemIcon, LinearProgress, Fade, Badge
} from '@mui/material';
import {
  Person, Edit, ArrowBack, Phone, Email, LocationOn,
  Work, AttachMoney, Badge as BadgeIcon, CalendarToday,
  CheckCircle, Cancel, Pending, Assessment, Description,
  Receipt, History, Build, Warning, Download, Print, Share,
  EventNote, Payment
} from '@mui/icons-material';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { employeService } from '@/services/employeService';
import { Employe, TypeEmploye, StatutEmploye } from '@/types/employe';
import { motion } from 'framer-motion';

const statutConfig: Record<StatutEmploye, any> = {
  [StatutEmploye.ACTIF]: { color: '#2e7d32', bg: '#e8f5e9', icon: <CheckCircle sx={{ fontSize: 16 }} />, label: 'Actif' },
  [StatutEmploye.CONGE]: { color: '#f57c00', bg: '#fff3e0', icon: <Pending sx={{ fontSize: 16 }} />, label: 'Congé' },
  [StatutEmploye.ARRET_MALADIE]: { color: '#c62828', bg: '#ffebee', icon: <Warning sx={{ fontSize: 16 }} />, label: 'Arrêt maladie' },
  [StatutEmploye.ABSENT]: { color: '#757575', bg: '#f5f5f5', icon: <Cancel sx={{ fontSize: 16 }} />, label: 'Absent' },
  [StatutEmploye.TERMINE]: { color: '#616161', bg: '#fafafa', icon: <Cancel sx={{ fontSize: 16 }} />, label: 'Terminé' }
};

const typeConfig: Record<TypeEmploye, any> = {
  [TypeEmploye.GARDIEN]: { label: 'Gardien', icon: <Work sx={{ fontSize: 16 }} /> },
  [TypeEmploye.FEMME_MENAGE]: { label: 'Femme de ménage', icon: <Work sx={{ fontSize: 16 }} /> },
  [TypeEmploye.JARDINIER]: { label: 'Jardinier', icon: <Work sx={{ fontSize: 16 }} /> },
  [TypeEmploye.TECHNICIEN]: { label: 'Technicien', icon: <Work sx={{ fontSize: 16 }} /> },
  [TypeEmploye.AGENT_SECURITE]: { label: 'Agent sécurité', icon: <Work sx={{ fontSize: 16 }} /> },
  [TypeEmploye.COMPTABLE]: { label: 'Comptable', icon: <Work sx={{ fontSize: 16 }} /> },
  [TypeEmploye.AUTRE]: { label: 'Autre', icon: <Work sx={{ fontSize: 16 }} /> }
};

export default function EmployeDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [employe, setEmploye] = useState<Employe | null>(null);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    fetchEmploye();
  }, [id]);

  const fetchEmploye = async () => {
    try {
      const data = await employeService.getById(Number(id));
      if (!data) { router.push('/employes'); return; }
      setEmploye(data);
    } catch (error) {
      router.push('/employes');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', bgcolor: '#f8fafc', minHeight: '100vh' }}>
        <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
        <Box component="main" sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <CircularProgress sx={{ color: '#2e7d32' }} />
        </Box>
      </Box>
    );
  }

  if (!employe) return null;

  const statut = statutConfig[employe.statut as StatutEmploye] || statutConfig[StatutEmploye.ACTIF];
  const type = typeConfig[employe.type_employe as TypeEmploye] || typeConfig[TypeEmploye.AUTRE];

  return (
    <Box sx={{ display: 'flex', bgcolor: '#f8fafc', minHeight: '100vh' }}>
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Header onMenuClick={() => setMobileOpen(!mobileOpen)} />

        <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3 }, py: { xs: 2, sm: 2.5 }, mt: { xs: 7, sm: 8 } }}>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <IconButton onClick={() => router.back()} sx={{ bgcolor: '#f1f5f9' }}>
              <ArrowBack sx={{ fontSize: 18 }} />
            </IconButton>
            <Typography variant="body2" sx={{ color: '#64748b' }}>
              Retour à la liste
            </Typography>
          </Box>

          <Fade in timeout={400}>
            <Box>
              {/* Profil Header */}
              <Paper elevation={0} sx={{
                p: 3, mb: 3, borderRadius: 3,
                background: 'linear-gradient(135deg, #fff 0%, #f8fafc 100%)',
                border: '1px solid rgba(46,125,50,0.1)',
                position: 'relative', overflow: 'hidden'
              }}>
                <Box sx={{ position: 'absolute', top: -50, right: -50, width: 200, height: 200, borderRadius: '50%', bgcolor: alpha('#2e7d32', 0.05) }} />
                
                <Grid container spacing={3} sx={{ alignItems: 'center' }}>
                  <Grid size={{ xs: 12, md: 8 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                      <Avatar sx={{
                        width: 80, height: 80,
                        bgcolor: '#2e7d32',
                        fontSize: 32,
                        boxShadow: '0 4px 20px rgba(46,125,50,0.3)'
                      }}>
                        {employe.prenom?.[0]}{employe.nom?.[0]}
                      </Avatar>
                      <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
                          <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f172a' }}>
                            {employe.nom} {employe.prenom}
                          </Typography>
                          <Chip
                            icon={statut.icon}
                            label={statut.label}
                            sx={{ bgcolor: statut.bg, color: statut.color, fontWeight: 600 }}
                          />
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1, flexWrap: 'wrap' }}>
                          <Chip icon={type.icon} label={type.label} size="small" sx={{ bgcolor: '#f1f5f9' }} />
                          <Chip icon={<BadgeIcon sx={{ fontSize: 14 }} />} label={employe.cin || 'N/A'} size="small" sx={{ bgcolor: '#f1f5f9' }} />
                          <Chip icon={<CalendarToday sx={{ fontSize: 14 }} />} label={`Depuis ${new Date(employe.date_embauche).toLocaleDateString()}`} size="small" sx={{ bgcolor: '#f1f5f9' }} />
                        </Box>
                      </Box>
                    </Box>
                  </Grid>
                  
                  <Grid size={{ xs: 12, md: 4 }}>
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
                      <Tooltip title="Modifier">
                        <Button
                          variant="contained"
                          startIcon={<Edit />}
                          href={`/employes/${employe.id}/edit`}
                          sx={{ bgcolor: '#2e7d32', '&:hover': { bgcolor: '#1b5e20' }, borderRadius: 2, textTransform: 'none' }}
                        >
                          Modifier
                        </Button>
                      </Tooltip>
                      <Tooltip title="Imprimer">
                        <IconButton sx={{ bgcolor: '#f1f5f9' }}><Print /></IconButton>
                      </Tooltip>
                      <Tooltip title="Partager">
                        <IconButton sx={{ bgcolor: '#f1f5f9' }}><Share /></IconButton>
                      </Tooltip>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>

              {/* Statistiques rapides */}
              <Grid container spacing={2} sx={{ mb: 3 }}>
                {[
                  { label: 'Salaire base', value: `${employe.salaire_base.toLocaleString()} Ar`, icon: <AttachMoney sx={{ color: '#2e7d32' }} />, color: '#e8f5e9' },
                  { label: 'Téléphone', value: employe.telephone, icon: <Phone sx={{ color: '#1976d2' }} />, color: '#e3f2fd' },
                  { label: 'Email', value: employe.email || 'Non renseigné', icon: <Email sx={{ color: '#f57c00' }} />, color: '#fff3e0' },
                  { label: 'Adresse', value: employe.adresse || 'Non renseignée', icon: <LocationOn sx={{ color: '#6a1b9a' }} />, color: '#f3e5f5' },
                ].map((item, idx) => (
                  <Grid size={{ xs: 12, sm: 6, md: 3 }} key={idx}>
                    <Card sx={{ borderRadius: 2, border: '1px solid #e2e8f0', bgcolor: '#fff' }}>
                      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Avatar sx={{ bgcolor: item.color, width: 40, height: 40 }}>{item.icon}</Avatar>
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography variant="caption" sx={{ color: '#64748b', display: 'block' }}>{item.label}</Typography>
                            <Typography variant="body2" sx={{ fontWeight: 600 }} noWrap>{item.value}</Typography>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>

              {/* Tabs */}
              <Paper sx={{ borderRadius: 2, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                <Tabs
                  value={tabValue}
                  onChange={handleTabChange}
                  sx={{
                    px: 2, pt: 1,
                    '& .MuiTabs-indicator': { bgcolor: '#2e7d32', height: 3 },
                    '& .MuiTab-root': {
                      textTransform: 'none',
                      fontWeight: 600,
                      fontSize: '0.82rem',
                      minHeight: 48,
                      '&.Mui-selected': { color: '#2e7d32' }
                    }
                  }}
                >
                  <Tab icon={<Person sx={{ fontSize: 18 }} />} iconPosition="start" label="Informations" />
                  {/* <Tab icon={<History sx={{ fontSize: 18 }} />} iconPosition="start" label="Absences" />
                  <Tab icon={<Payment sx={{ fontSize: 18 }} />} iconPosition="start" label="Paies" />
                  <Tab icon={<Build sx={{ fontSize: 18 }} />} iconPosition="start" label="Interventions" /> */}
                </Tabs>

                <Divider />

                {/* Tab 1: Informations */}
                {tabValue === 0 && (
                  <Box sx={{ p: 3 }}>
                    <Grid container spacing={3}>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2, color: '#0f172a' }}>
                          Informations personnelles
                        </Typography>
                        <List dense>
                          <ListItem>
                            <ListItemIcon><Person sx={{ color: '#64748b' }} /></ListItemIcon>
                            <ListItemText primary="Nom complet" secondary={`${employe.nom} ${employe.prenom}`} />
                          </ListItem>
                          <ListItem>
                            <ListItemIcon><BadgeIcon sx={{ color: '#64748b' }} /></ListItemIcon>
                            <ListItemText primary="CIN" secondary={employe.cin || 'Non renseigné'} />
                          </ListItem>
                          <ListItem>
                            <ListItemIcon><Phone sx={{ color: '#64748b' }} /></ListItemIcon>
                            <ListItemText primary="Téléphone" secondary={employe.telephone} />
                          </ListItem>
                          {employe.telephone_urgence && (
                            <ListItem>
                              <ListItemIcon><Phone sx={{ color: '#64748b' }} /></ListItemIcon>
                              <ListItemText primary="Téléphone urgence" secondary={employe.telephone_urgence} />
                            </ListItem>
                          )}
                          <ListItem>
                            <ListItemIcon><Email sx={{ color: '#64748b' }} /></ListItemIcon>
                            <ListItemText primary="Email" secondary={employe.email || 'Non renseigné'} />
                          </ListItem>
                          <ListItem>
                            <ListItemIcon><LocationOn sx={{ color: '#64748b' }} /></ListItemIcon>
                            <ListItemText primary="Adresse" secondary={employe.adresse || 'Non renseignée'} />
                          </ListItem>
                        </List>
                      </Grid>

                      <Grid size={{ xs: 12, md: 6 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2, color: '#0f172a' }}>
                          Informations professionnelles
                        </Typography>
                        <List dense>
                          <ListItem>
                            <ListItemIcon><Work sx={{ color: '#64748b' }} /></ListItemIcon>
                            <ListItemText primary="Type" secondary={type.label} />
                          </ListItem>
                          <ListItem>
                            <ListItemIcon><CalendarToday sx={{ color: '#64748b' }} /></ListItemIcon>
                            <ListItemText primary="Date d'embauche" secondary={new Date(employe.date_embauche).toLocaleDateString()} />
                          </ListItem>
                          <ListItem>
                            <ListItemIcon><AttachMoney sx={{ color: '#64748b' }} /></ListItemIcon>
                            <ListItemText primary="Salaire base" secondary={`${employe.salaire_base.toLocaleString()} Ar`} />
                          </ListItem>
                          {/* <ListItem>
                            <ListItemIcon><Assessment sx={{ color: '#64748b' }} /></ListItemIcon>
                            <ListItemText primary="Statut" secondary={
                              <Chip icon={statut.icon} label={statut.label} size="small" sx={{ bgcolor: statut.bg, color: statut.color }} />
                            } />
                          </ListItem> */}
                          <ListItem>
                            <ListItemIcon><Description sx={{ color: '#64748b' }} /></ListItemIcon>
                            <ListItemText primary="Notes" secondary={employe.notes || 'Aucune note'} />
                          </ListItem>
                        </List>
                      </Grid>
                    </Grid>
                  </Box>
                )}

                {/* Tab 2: Absences */}
                {/* {tabValue === 1 && (
                  <Box sx={{ p: 3, textAlign: 'center', py: 6 }}>
                    <EventNote sx={{ fontSize: 48, color: '#cbd5e1', mb: 2 }} />
                    <Typography variant="h6" sx={{ color: '#64748b' }}>Historique des absences</Typography>
                    <Typography variant="body2" sx={{ color: '#94a3b8' }}>Aucune absence enregistrée</Typography>
                  </Box>
                )} */}

                {/* Tab 3: Paies */}
                {/* {tabValue === 2 && (
                  <Box sx={{ p: 3, textAlign: 'center', py: 6 }}>
                    <Receipt sx={{ fontSize: 48, color: '#cbd5e1', mb: 2 }} />
                    <Typography variant="h6" sx={{ color: '#64748b' }}>Historique des paies</Typography>
                    <Typography variant="body2" sx={{ color: '#94a3b8' }}>Aucune paie enregistrée</Typography>
                  </Box>
                )} */}

                {/* Tab 4: Interventions */}
                {/* {tabValue === 3 && (
                  <Box sx={{ p: 3, textAlign: 'center', py: 6 }}>
                    <Build sx={{ fontSize: 48, color: '#cbd5e1', mb: 2 }} />
                    <Typography variant="h6" sx={{ color: '#64748b' }}>Historique des interventions</Typography>
                    <Typography variant="body2" sx={{ color: '#94a3b8' }}>Aucune intervention enregistrée</Typography>
                  </Box>
                )} */}
              </Paper>
            </Box>
          </Fade>
        </Container>
      </Box>
    </Box>
  );
}