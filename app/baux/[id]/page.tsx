// src/app/baux/[id]/page.tsx - Avec Tabs et design moderne
'use client';

import React, { useState, useEffect } from 'react';
import {
  Box, Card, CardContent, Typography, Button, Chip, Avatar, Toolbar,
  CircularProgress, Alert, Paper, Divider, Stack, IconButton,
  Breadcrumbs, Link, Dialog, Tabs, Tab, ImageList, ImageListItem, Grid
} from '@mui/material';
import {
  ArrowBack, Edit, Home, Person, AttachMoney, CalendarToday,
  CheckCircle, Block, Archive, Phone, Email, Work, PictureAsPdf,
  Download, Article, LocationOn, Badge, Close, NavigateNext,
  KeyboardArrowLeft, KeyboardArrowRight, ChevronLeft, ChevronRight,
  PhotoCamera, Description, Receipt, History, Map,
  Autorenew
} from '@mui/icons-material';
import { useRouter, useParams } from 'next/navigation';
import { bailService } from '@/services/bailService';
import { formatCurrency, formatDate } from '@/utils/formatters';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';

const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'http://localhost:8000';
const getImageUrl = (path: string | null | undefined): string => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `${API_BASE}${path.startsWith('/') ? '' : '/'}${path}`;
};

const cfg: Record<string, any> = {
  actif: { c: 'success', bg: '#43a047', icon: <CheckCircle />, l: 'Actif' },
  brouillon: { c: 'warning', bg: '#f57c00', icon: <Article />, l: 'Brouillon' },
  resilie: { c: 'error', bg: '#e53935', icon: <Block />, l: 'Résilié' },
  termine: { c: 'default', bg: '#757575', icon: <Archive />, l: 'Terminé' }
};
const tl: Record<string, string> = { habitation: '🏠', commercial: '🏪', professionnel: '💼', saisonnier: '🏖️' };

export default function BailDetailPage() {
  const r = useRouter(); const { id: pid } = useParams(); const id = Number(pid) || 0;
  const [mo, setMo] = useState(false); const [d, setD] = useState<any>(null); const [ld, setLd] = useState(true);
  const [tab, setTab] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const [slideLog, setSlideLog] = useState(0);
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});

  useEffect(() => { if (id) bailService.getById(id).then(setD).finally(() => setLd(false)); }, [id]);

  if (ld) return <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}><CircularProgress size={40} /></Box>;
  if (!d) return <Box sx={{ p: 3 }}><Alert severity="warning">Bail introuvable</Alert></Box>;

  const s = cfg[d.statut] || cfg.termine;
  const j = Math.max(0, Math.ceil((new Date(d.date_fin).getTime() - Date.now()) / 86400000));
  const log = d.logement || {}; const loc = d.locataire || {};

  const logPhotos = (() => {
    if (!log.photos) return log.photo_url ? [log.photo_url] : [];
    if (typeof log.photos === 'string') {
      try { const p = JSON.parse(log.photos); return Array.isArray(p) ? p : []; }
      catch { return [log.photos]; }
    }
    return Array.isArray(log.photos) ? log.photos : [];
  })();

  const handleImgError = (p: string) => setImgErrors(prev => ({ ...prev, [p]: true }));
  const prevSlide = () => setSlideLog(p => (p - 1 + logPhotos.length) % logPhotos.length);
  const nextSlide = () => setSlideLog(p => (p + 1) % logPhotos.length);

  return (
    <Box sx={{ display: 'flex', bgcolor: '#f5f7fa', minHeight: '100vh' }}>
      <Sidebar mobileOpen={mo} onClose={() => setMo(false)} />
      <Box component="main" sx={{ flexGrow: 1, width: { sm: 'calc(100% - 260px)' }, minWidth: 0 }}>
        <Header onMenuClick={() => setMo(!mo)} />
        <Toolbar />
        <Box sx={{ p: { xs: 2, sm: 2.5 }, maxWidth: 1400, mx: 'auto' }}>

          {/* Breadcrumbs + Navigation */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Breadcrumbs separator={<NavigateNext sx={{ fontSize: 14 }} />}>
              <Link href="/" color="inherit" underline="hover" sx={{ fontSize: '0.75rem' }}>Dashboard</Link>
              <Link href="/baux" color="inherit" underline="hover" sx={{ fontSize: '0.75rem' }}>Baux</Link>
              <Typography variant="caption">{d.numero_contrat}</Typography>
            </Breadcrumbs>
            <Stack direction="row" spacing={0.3} sx={{ alignItems: 'center' }}>
              <Typography variant="caption" color="text.secondary" sx={{ mr: 0.5 }}>#{id}</Typography>
              <IconButton size="small" disabled={id <= 1} onClick={() => r.push(`/baux/${id - 1}`)}><KeyboardArrowLeft sx={{ fontSize: 16 }} /></IconButton>
              <IconButton size="small" onClick={() => r.push(`/baux/${id + 1}`)}><KeyboardArrowRight sx={{ fontSize: 16 }} /></IconButton>
            </Stack>
          </Box>

          {/* En-tête */}
          <Paper sx={{ p: 2, mb: 2, borderRadius: 3, border: '1px solid #e8edf2', background: 'linear-gradient(135deg, #fff 0%, #fafbfc 100%)' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 1.5 }}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Avatar sx={{ width: 52, height: 52, bgcolor: s.bg, boxShadow: '0 4px 15px rgba(0,0,0,.15)', fontSize: 22 }}>{s.icon}</Avatar>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1rem' }}>{d.numero_contrat}</Typography>
                  <Box sx={{ display: 'flex', gap: 0.8, flexWrap: 'wrap', mt: 0.3 }}>
                    <Chip label={s.l} color={s.c} size="small" sx={{ height: 18, fontSize: '0.65rem', borderRadius: 1.5 }} />
                    <Chip label={`${tl[d.type_bail] || ''} ${d.type_bail}`} size="small" variant="outlined" sx={{ height: 18, fontSize: '0.65rem', borderRadius: 1.5 }} />
                    {j <= 30 && d.statut === 'actif' && <Chip label={`⏰ ${j}j`} size="small" color="warning" sx={{ height: 18, fontSize: '0.65rem', borderRadius: 1.5 }} />}
                  </Box>
                </Box>
              </Box>
              <Stack direction="row" spacing={0.5} sx={{ flexWrap: 'wrap', gap: 0.5 }}>
                <Button size="small" variant="outlined" startIcon={<ArrowBack sx={{ fontSize: 15 }} />} onClick={() => r.push('/baux')} sx={{ borderRadius: 2, textTransform: 'none', fontSize: '0.7rem' }}>Retour</Button>
                <Button size="small" variant="contained" startIcon={<Edit sx={{ fontSize: 15 }} />} onClick={() => r.push(`/baux/${id}/edit`)} sx={{ borderRadius: 2, textTransform: 'none', fontSize: '0.7rem' }}>Modifier</Button>
                {d.statut === 'brouillon' && <Button size="small" color="success" variant="contained" onClick={() => bailService.activer(id).then(() => r.refresh())} sx={{ borderRadius: 2, textTransform: 'none', fontSize: '0.7rem' }}>Activer</Button>}
                {d.contrat_pdf_url && <Button size="small" variant="outlined" startIcon={<Download sx={{ fontSize: 15 }} />} href={d.contrat_pdf_url} target="_blank" sx={{ borderRadius: 2, textTransform: 'none', fontSize: '0.7rem' }}>PDF</Button>}
              </Stack>
            </Box>
          </Paper>

          {/* Stats */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(4, 1fr)' }, gap: 1.5, mb: 2 }}>
            {[
              { l: 'Loyer', v: formatCurrency(d.loyer_mensuel), c: '#2e7d32', bg: '#e8f5e9' },
              { l: 'Caution', v: formatCurrency(d.caution_montant), c: '#1565c0', bg: '#e3f2fd' },
              { l: 'Charges', v: formatCurrency(d.charges_mensuelles), c: '#ed6c02', bg: '#fff3e0' },
              { l: 'Frais', v: formatCurrency(d.frais_agence), c: '#7b1fa2', bg: '#f3e5f5' }
            ].map(st => (
              <Card key={st.l} sx={{ bgcolor: st.bg, boxShadow: 'none', border: `1px solid ${st.c}20`, borderRadius: 2 }}>
                <CardContent sx={{ p: 1.5, textAlign: 'center' }}>
                  <Typography variant="caption" sx={{ fontSize: '0.65rem', color: 'text.secondary' }}>{st.l}</Typography>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, color: st.c, fontSize: '0.9rem' }}>{st.v}</Typography>
                </CardContent>
              </Card>
            ))}
          </Box>

          {/* Tabs */}
          <Paper sx={{ mb: 2, borderRadius: 2, border: '1px solid #e8edf2' }}>
            <Tabs value={tab} onChange={(_, v) => setTab(v)} variant="fullWidth"
              sx={{ minHeight: 42, '& .MuiTab-root': { minHeight: 42, textTransform: 'none', fontSize: '0.75rem' } }}>
              <Tab label="Aperçu" icon={<Home sx={{ fontSize: 16 }} />} iconPosition="start" />
              <Tab label="Contrat" icon={<Description sx={{ fontSize: 16 }} />} iconPosition="start" />
              <Tab label="Paiements" icon={<Receipt sx={{ fontSize: 16 }} />} iconPosition="start" />
            </Tabs>
          </Paper>

          {/* Tab 0 : Aperçu */}
          {tab === 0 && (
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' }, gap: 1.5 }}>
              {/* Logement */}
              <Card sx={{ borderRadius: 2.5, border: '1px solid #e8edf2', boxShadow: 'none', overflow: 'hidden' }}>
                <Box sx={{ height: 200, bgcolor: '#1a1a1a', position: 'relative', overflow: 'hidden' }}>
                  {logPhotos.length > 0 ? (
                    <>
                      {!imgErrors[logPhotos[slideLog]] ? (
                        <img src={getImageUrl(logPhotos[slideLog])} alt={`Photo ${slideLog + 1}`}
                          style={{ width: '100%', height: '100%', objectFit: 'contain', cursor: 'pointer' }}
                          onClick={() => setLightbox(true)} onError={() => handleImgError(logPhotos[slideLog])} />
                      ) : (
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#666' }}>
                          <PhotoCamera sx={{ fontSize: 48, opacity: 0.3 }} />
                        </Box>
                      )}
                      {logPhotos.length > 1 && (
                        <>
                          <IconButton size="small" sx={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', bgcolor: 'rgba(255,255,255,.15)', color: 'white' }}
                            onClick={e => { e.stopPropagation(); prevSlide(); }}><ChevronLeft /></IconButton>
                          <IconButton size="small" sx={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', bgcolor: 'rgba(255,255,255,.15)', color: 'white' }}
                            onClick={e => { e.stopPropagation(); nextSlide(); }}><ChevronRight /></IconButton>
                          <Box sx={{ position: 'absolute', bottom: 10, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 0.5 }}>
                            {logPhotos.map((_: any, i: number) => (
                              <Box key={i} sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: i === slideLog ? 'white' : 'rgba(255,255,255,.4)', cursor: 'pointer' }}
                                onClick={e => { e.stopPropagation(); setSlideLog(i); }} />
                            ))}
                          </Box>
                        </>
                      )}
                    </>
                  ) : (
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', flexDirection: 'column' }}>
                      <Home sx={{ fontSize: 48, color: '#666' }} />
                      <Typography variant="caption" color="#666" sx={{ mt: 1 }}>Aucune photo</Typography>
                    </Box>
                  )}
                </Box>
                <CardContent sx={{ p: 2 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>🏠 Logement</Typography>
                  <Divider sx={{ mb: 1 }} />
                  <Info icon={<LocationOn sx={{ fontSize: 15 }} />} l="Bâtiment" v={log.batiment_nom || d.batiment_nom || '-'} />
                  <Info icon={<Badge sx={{ fontSize: 15 }} />} l="Numéro" v={log.numero || d.logement_numero || '-'} />
                  <Info icon={<Home sx={{ fontSize: 15 }} />} l="Adresse" v={log.batiment_adresse || d.logement_adresse || '-'} />
                  {log.plan_url && <Button size="small" variant="outlined" startIcon={<Map />} href={getImageUrl(log.plan_url)} target="_blank" sx={{ mt: 1, borderRadius: 2, textTransform: 'none', width: '100%', fontSize: '0.7rem' }}>Voir le plan</Button>}
                </CardContent>
              </Card>

              {/* Locataire */}
              <Card sx={{ borderRadius: 2.5, border: '1px solid #e8edf2', boxShadow: 'none', overflow: 'hidden' }}>
                <Box sx={{ height: 200, bgcolor: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {loc.photo_url ? (
                    <img src={getImageUrl(loc.photo_url)} alt="Locataire" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <Avatar sx={{ width: 72, height: 72, bgcolor: 'secondary.main', fontSize: 32, boxShadow: '0 4px 20px rgba(156,39,176,.3)' }}>
                      {loc.prenom?.[0] || d.locataire_prenom?.[0]}{loc.nom?.[0] || d.locataire_nom?.[0]}
                    </Avatar>
                  )}
                </Box>
                <CardContent sx={{ p: 2 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>👤 Locataire</Typography>
                  <Divider sx={{ mb: 1 }} />
                  <Info icon={<Phone sx={{ fontSize: 15 }} />} l="Tél" v={loc.telephone || d.locataire_telephone || '-'} />
                  <Info icon={<Email sx={{ fontSize: 15 }} />} l="Email" v={loc.email || d.locataire_email || '-'} />
                  <Info icon={<Badge sx={{ fontSize: 15 }} />} l="CIN" v={loc.cin || d.locataire_cin || '-'} />
                </CardContent>
              </Card>
            </Box>
          )}

          {/* Tab 1 : Contrat */}

          {/* Tab 1 : Contrat */}
          {tab === 1 && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              
              {/* Contrat + Période */}
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' }, gap: 1.5 }}>
                <Card sx={{ borderRadius: 2.5, border: '1px solid #e8edf2', boxShadow: 'none' }}>
                  <CardContent sx={{ p: 2 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>💰 Contrat</Typography>
                    <Divider sx={{ mb: 1 }} />
                    <Info l="Loyer mensuel" v={formatCurrency(d.loyer_mensuel)} bold />
                    <Info l="Charges" v={formatCurrency(d.charges_mensuelles)} />
                    <Info l="Caution" v={formatCurrency(d.caution_montant)} />
                    <Info l="Frais agence" v={formatCurrency(d.frais_agence)} />
                    <Info l="Pénalités" v={formatCurrency(d.penalites_retard)} />
                    <Info l="Jour paiement" v={`Le ${d.jour_paiement}`} />
                    <Info l="Mode" v={d.mode_paiement} />
                    <Info l="Indexation" v={d.indexation_annuelle ? `📈 ${d.pourcentage_indexation}%/an` : 'Aucune'} />
                  </CardContent>
                </Card>

                <Card sx={{ borderRadius: 2.5, border: '1px solid #e8edf2', boxShadow: 'none' }}>
                  <CardContent sx={{ p: 2 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>📅 Période</Typography>
                    <Divider sx={{ mb: 1 }} />
                    <Info l="Début" v={formatDate(d.date_debut)} />
                    <Info l="Fin" v={formatDate(d.date_fin)} />
                    {d.date_signature && <Info l="Signé le" v={formatDate(d.date_signature)} />}
                    {d.date_resiliation && <Info l="Résilié le" v={formatDate(d.date_resiliation)} />}
                    <Info l="Restant" v={`${j}j`} bold={j <= 30} />
                    <Info l="Renouvellement" v={d.renouvellement_auto ? '🔄 Auto' : '❌ Manuel'} />
                    <Info l="Préavis" v={`${d.preavis_jours}j`} />
                  </CardContent>
                </Card>
              </Box>

              {/* Actions : Résiliation, Renouvellement, Avenants */}
              <Card sx={{ borderRadius: 2.5, border: '1px solid #e8edf2', boxShadow: 'none' }}>
                <CardContent sx={{ p: 2 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5 }}>⚙️ Actions</Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {d.statut === 'actif' && (
                      <>
                        <Button size="small" variant="outlined" color="error" startIcon={<Block sx={{ fontSize: 15 }} />}
                          onClick={() => r.push(`/baux/${id}/resilier`)}
                          sx={{ borderRadius: 2, textTransform: 'none', fontSize: '0.7rem' }}>
                          Résilier
                        </Button>
                        <Button size="small" variant="outlined" color="success" startIcon={<Autorenew sx={{ fontSize: 15 }} />}
                          onClick={() => r.push(`/baux/${id}/renouveler`)}
                          sx={{ borderRadius: 2, textTransform: 'none', fontSize: '0.7rem' }}>
                          Renouveler
                        </Button>
                      </>
                    )}
                    <Button size="small" variant="outlined" startIcon={<Article sx={{ fontSize: 15 }} />}
                      onClick={() => r.push(`/baux/${id}/avenants`)}
                      sx={{ borderRadius: 2, textTransform: 'none', fontSize: '0.7rem' }}>
                      Avenants ({d.avenants_count || 0})
                    </Button>
                  </Box>
                </CardContent>
              </Card>

              {/* Clauses */}
              {(d.clauses_specifiques || d.conditions_resiliation) && (
                <Card sx={{ borderRadius: 2.5, border: '1px solid #e8edf2', boxShadow: 'none' }}>
                  <CardContent sx={{ p: 2 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>📝 Clauses</Typography>
                    <Divider sx={{ mb: 1 }} />
                    {d.clauses_specifiques && (
                      <Box sx={{ mb: 1.5, p: 1.5, bgcolor: '#f8fafc', borderRadius: 1.5, border: '1px solid #e8edf2' }}>
                        <Typography variant="caption" sx={{ fontWeight: 600 }}>Clauses spécifiques</Typography>
                        <Typography variant="body2" sx={{ fontSize: '0.75rem', whiteSpace: 'pre-wrap', mt: 0.3 }}>{d.clauses_specifiques}</Typography>
                      </Box>
                    )}
                    {d.conditions_resiliation && (
                      <Box sx={{ p: 1.5, bgcolor: '#fff8e1', borderRadius: 1.5, border: '1px solid #ffe0b2' }}>
                        <Typography variant="caption" sx={{ fontWeight: 600 }}>Conditions de résiliation</Typography>
                        <Typography variant="body2" sx={{ fontSize: '0.75rem', whiteSpace: 'pre-wrap', mt: 0.3 }}>{d.conditions_resiliation}</Typography>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Contrat PDF + Impression */}
              <Card sx={{ borderRadius: 2.5, border: '1px solid #e8edf2', boxShadow: 'none' }}>
                <CardContent sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Avatar sx={{ width: 44, height: 44, bgcolor: '#e8f5e9' }}><PictureAsPdf sx={{ color: '#2e7d32' }} /></Avatar>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Contrat PDF</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {d.contrat_pdf_url ? '✅ Document disponible' : '❌ Non généré'}
                      </Typography>
                    </Box>
                  </Box>
                  <Stack direction="row" spacing={0.8}>
                    {d.contrat_pdf_url ? (
                      <>
                        <Button size="small" variant="outlined" startIcon={<Download sx={{ fontSize: 15 }} />} href={d.contrat_pdf_url} target="_blank"
                          sx={{ borderRadius: 2, textTransform: 'none', fontSize: '0.7rem' }}>Télécharger</Button>
                        <Button size="small" variant="contained" startIcon={<PictureAsPdf sx={{ fontSize: 15 }} />} onClick={() => window.print()}
                          sx={{ borderRadius: 2, textTransform: 'none', fontSize: '0.7rem', bgcolor: '#2e7d32' }}>Imprimer</Button>
                      </>
                    ) : (
                      <Button size="small" variant="contained" startIcon={<PictureAsPdf sx={{ fontSize: 15 }} />}
                        sx={{ borderRadius: 2, textTransform: 'none', fontSize: '0.7rem', bgcolor: '#2e7d32' }}>
                        Générer le contrat
                      </Button>
                    )}
                  </Stack>
                </CardContent>
              </Card>
            </Box>
          )}

          {/* Tab 2 : Paiements */}
          {tab === 2 && (
            <Card sx={{ borderRadius: 3, border: '1px solid #e8edf2', boxShadow: 'none', p: 6, textAlign: 'center' }}>
              <Receipt sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">Paiements</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {d.paiements_effectues || 0} payés · {d.paiements_impayes || 0} impayés
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 700, color: 'success.main', mb: 2 }}>
                Total payé : {formatCurrency(d.total_paye || 0)}
              </Typography>
              <Button variant="outlined" size="small" onClick={() => r.push('/paiements')} sx={{ borderRadius: 2, textTransform: 'none' }}>
                Voir tous les paiements
              </Button>
            </Card>
          )}

          {/* Lightbox */}
          {lightbox && logPhotos.length > 0 && (
            <Dialog open={lightbox} onClose={() => setLightbox(false)} maxWidth="lg" fullWidth
              slotProps={{ paper: { sx: { bgcolor: 'transparent', boxShadow: 'none', margin: 0, maxWidth: '90vw', overflow: 'hidden' } } }}>
              <Box sx={{ position: 'relative', bgcolor: '#000', minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <IconButton sx={{ position: 'absolute', top: 16, right: 16, color: '#fff', bgcolor: 'rgba(0,0,0,.5)', zIndex: 10 }} onClick={() => setLightbox(false)}><Close /></IconButton>
                {logPhotos.length > 1 && (
                  <>
                    <IconButton sx={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#fff', bgcolor: 'rgba(0,0,0,.5)', zIndex: 10 }} onClick={prevSlide}><ChevronLeft sx={{ fontSize: 40 }} /></IconButton>
                    <IconButton sx={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', color: '#fff', bgcolor: 'rgba(0,0,0,.5)', zIndex: 10 }} onClick={nextSlide}><ChevronRight sx={{ fontSize: 40 }} /></IconButton>
                  </>
                )}
                <img src={getImageUrl(logPhotos[slideLog])} alt="Logement" style={{ maxWidth: '90%', maxHeight: '85vh', objectFit: 'contain' }} />
              </Box>
            </Dialog>
          )}
        </Box>
      </Box>
    </Box>
  );
}

function Info({ icon, l, v, bold }: { icon?: React.ReactNode; l: string; v: string | number; bold?: boolean }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 0.35 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
        {icon && <Box sx={{ color: 'text.disabled', display: 'flex' }}>{icon}</Box>}
        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>{l}</Typography>
      </Box>
      <Typography variant="caption" sx={{ fontWeight: bold ? 600 : 400, fontSize: '0.7rem' }}>{v}</Typography>
    </Box>
  );
}