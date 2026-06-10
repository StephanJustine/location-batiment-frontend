// src/app/contrats/page.tsx - Final avec CRUD complet
'use client';

import React, { useState, useEffect } from 'react';
import {
  Box, Card, CardContent, Typography, Button, Toolbar, Chip, Avatar, Fade,
  CircularProgress, Paper, Tabs, Tab, IconButton, Tooltip, Stack, Dialog,
  TextField, Alert, MenuItem, Breadcrumbs, Link
} from '@mui/material';
import {
  Add, Article, CheckCircle, Archive, Description, Download, Print,
  Visibility, Edit, Delete, PictureAsPdf, Close, Refresh, Home,
  NavigateNext, Save, ArrowBack
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { contratService, ContratModele, ContratSigne } from '@/services/contratService';
import { formatDate } from '@/utils/formatters';

const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'http://localhost:8000';
const getFullUrl = (url: string) => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  return `${API_BASE}${url.startsWith('/') ? '' : '/'}${url}`;
};

export default function ContratsPage() {
  const r = useRouter();
  const [mo, setMo] = useState(false);
  const [tab, setTab] = useState(0);
  const [modeles, setModeles] = useState<ContratModele[]>([]);
  const [contrats, setContrats] = useState<ContratSigne[]>([]);
  const [ld, setLd] = useState(true);
  const [error, setError] = useState('');
  const [ok, setOk] = useState('');

  // États pour les dialogues
  const [previewUrl, setPreviewUrl] = useState('');
  const [editModele, setEditModele] = useState<ContratModele | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [legaliserOpen, setLegaliserOpen] = useState<number | null>(null);
  const [legalForm, setLegalForm] = useState({ numero_enregistrement: '', legalise_par: '', date_legalisation: '' });
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLd(true);
    try {
      const [m, c] = await Promise.all([contratService.getModeles(), contratService.getByBail(0)]);
      setModeles(m || []);
      setContrats(c || []);
    } catch (e) { console.error(e); }
    finally { setLd(false); }
  };

  // ==================== CRUD Modèles ====================
  const handleDeleteModele = async () => {
    if (!deleteConfirm) return;
    try {
      await contratService.deleteModele(deleteConfirm);
      setOk('Modèle supprimé');
      setDeleteConfirm(null);
      loadData();
    } catch (e: any) { setError(e?.response?.data?.detail || 'Erreur'); }
  };

  const handleUpdateModele = async () => {
    if (!editModele) return;
    try {
      await contratService.updateModele(editModele.id, {
        nom: editModele.nom,
        type_contrat: editModele.type_contrat,
        description: editModele.description,
        template_html: editModele.template_html,
        variables: editModele.variables,
        est_par_defaut: editModele.est_par_defaut,
      });
      setOk('Modèle mis à jour');
      setEditOpen(false);
      loadData();
    } catch (e: any) { setError(e?.response?.data?.detail || 'Erreur'); }
  };

  // ==================== Actions Contrats ====================
  const handleSigner = async (contratId: number) => {
    try {
      await contratService.signer(contratId);
      setOk('Contrat signé !');
      loadData();
    } catch (e: any) { setError(e?.response?.data?.detail || 'Erreur'); }
  };

  const handleLegaliser = async () => {
    if (!legaliserOpen) return;
    try {
      await contratService.legaliser(legaliserOpen, legalForm);
      setOk('Contrat légalisé !');
      setLegaliserOpen(null);
      loadData();
    } catch (e: any) { setError(e?.response?.data?.detail || 'Erreur'); }
  };

  const handleArchiver = async (contratId: number) => {
    try {
      await contratService.archiver(contratId);
      setOk('Contrat archivé !');
      loadData();
    } catch (e: any) { setError(e?.response?.data?.detail || 'Erreur'); }
  };

  const handlePrint = (url: string) => {
    const w = window.open(getFullUrl(url), '_blank');
    if (w) w.onload = () => w.print();
  };

  if (ld) return <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}><CircularProgress /></Box>;

  return (
    <Box sx={{ display: 'flex', bgcolor: '#f5f7fa', minHeight: '100vh' }}>
      <Sidebar mobileOpen={mo} onClose={() => setMo(false)} />
      <Box component="main" sx={{ flexGrow: 1, width: { sm: 'calc(100% - 260px)' }, minWidth: 0 }}>
        <Header onMenuClick={() => setMo(!mo)} />
        <Toolbar />
        <Box sx={{ p: { xs: 2, sm: 2.5 }, maxWidth: 1200, mx: 'auto' }}>

          <Breadcrumbs separator={<NavigateNext sx={{ fontSize: 14 }} />} sx={{ mb: 2 }}>
            <Link href="/" color="inherit" underline="hover" sx={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center' }}>
              <Home sx={{ mr: 0.5, fontSize: 14 }} />Dashboard
            </Link>
            <Typography variant="caption" color="text.primary">Contrats</Typography>
          </Breadcrumbs>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2.5, alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>Contrats & Modèles</Typography>
            <Stack direction="row" spacing={1}>
              <Tooltip title="Actualiser"><IconButton size="small" onClick={loadData}><Refresh sx={{ fontSize: 18 }} /></IconButton></Tooltip>
              <Button variant="contained" size="small" startIcon={<Add />} onClick={() => r.push('/contrats/modeles/create')}
                sx={{ borderRadius: 2, textTransform: 'none', fontSize: '0.8rem' }}>Nouveau modèle</Button>
            </Stack>
          </Box>

          {ok && <Alert severity="success" sx={{ mb: 2, borderRadius: 2, py: 0.5 }} onClose={() => setOk('')}>{ok}</Alert>}
          {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2, py: 0.5 }} onClose={() => setError('')}>{error}</Alert>}

          <Paper sx={{ mb: 2.5, borderRadius: 2, border: '1px solid #e8edf2' }}>
            <Tabs value={tab} onChange={(_, v) => setTab(v)} variant="fullWidth"
              sx={{ minHeight: 42, '& .MuiTab-root': { minHeight: 42, textTransform: 'none', fontSize: '0.8rem' } }}>
              <Tab label={`Modèles (${modeles.length})`} icon={<Article sx={{ fontSize: 16 }} />} iconPosition="start" />
              <Tab label={`Contrats (${contrats.length})`} icon={<CheckCircle sx={{ fontSize: 16 }} />} iconPosition="start" />
            </Tabs>
          </Paper>

          {/* Tab 0 : Modèles */}
          {tab === 0 && (
            <Fade in>
              <Box>
                {modeles.length === 0 ? (
                  <Paper sx={{ textAlign: 'center', py: 8, borderRadius: 3, border: '1px solid #e8edf2' }}>
                    <Article sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
                    <Typography color="text.secondary" sx={{ mb: 2 }}>Aucun modèle de contrat</Typography>
                    <Button variant="contained" size="small" startIcon={<Add />} onClick={() => r.push('/contrats/modeles/create')}
                      sx={{ borderRadius: 2, textTransform: 'none' }}>Créer un modèle</Button>
                  </Paper>
                ) : (
                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: '1fr 1fr 1fr' }, gap: 2 }}>
                    {modeles.map(m => (
                      <Card key={m.id} sx={{ borderRadius: 2.5, border: '1px solid #e8edf2', boxShadow: 'none', '&:hover': { boxShadow: '0 4px 12px rgba(0,0,0,.06)' }, transition: 'all .2s' }}>
                        <CardContent sx={{ p: 2.5 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                              <Avatar sx={{ width: 40, height: 40, bgcolor: m.est_par_defaut ? '#e8f5e9' : '#e3f2fd' }}>
                                <Article sx={{ color: m.est_par_defaut ? '#2e7d32' : '#1565c0' }} />
                              </Avatar>
                              <Box>
                                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>{m.nom}</Typography>
                                <Typography variant="caption" color="text.secondary">{m.type_contrat}</Typography>
                              </Box>
                            </Box>
                            <Box>
                              <Tooltip title="Modifier"><IconButton size="small" onClick={() => { setEditModele(m); setEditOpen(true); }}><Edit sx={{ fontSize: 15 }} /></IconButton></Tooltip>
                              <Tooltip title="Supprimer"><IconButton size="small" color="error" onClick={() => setDeleteConfirm(m.id)}><Delete sx={{ fontSize: 15 }} /></IconButton></Tooltip>
                            </Box>
                          </Box>
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                            {m.description || 'Aucune description'} · {m.variables?.length || 0} variables
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                            <Chip label={m.est_par_defaut ? '⭐ Défaut' : 'Standard'} size="small"
                              color={m.est_par_defaut ? 'success' : 'default'} sx={{ height: 18, fontSize: '0.6rem' }} />
                            <Chip label={m.est_actif ? '✅ Actif' : '❌ Inactif'} size="small"
                              sx={{ height: 18, fontSize: '0.6rem' }} />
                          </Box>
                        </CardContent>
                      </Card>
                    ))}
                  </Box>
                )}
              </Box>
            </Fade>
          )}

          {/* Tab 1 : Contrats signés */}
          {tab === 1 && (
            <Fade in>
              <Box>
                {contrats.length === 0 ? (
                  <Paper sx={{ textAlign: 'center', py: 8, borderRadius: 3, border: '1px solid #e8edf2' }}>
                    <PictureAsPdf sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
                    <Typography color="text.secondary">Aucun contrat signé</Typography>
                    <Typography variant="caption" color="text.secondary">Générez un contrat depuis un bail</Typography>
                  </Paper>
                ) : (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    {contrats.map(c => (
                      <Paper key={c.id} sx={{ p: 2.5, borderRadius: 2.5, border: '1px solid #e8edf2', boxShadow: '0 1px 3px rgba(0,0,0,.03)' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar sx={{ bgcolor: c.est_archive ? '#f5f5f5' : c.legalise ? '#e8f5e9' : '#fff3e0', width: 44, height: 44 }}>
                              <PictureAsPdf sx={{ color: c.est_archive ? '#9e9e9e' : c.legalise ? '#2e7d32' : '#ed6c02' }} />
                            </Avatar>
                            <Box>
                              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>{c.numero_contrat} v{c.version}</Typography>
                              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 0.3 }}>
                                <Typography variant="caption" color="text.secondary">{formatDate(c.created_at)}</Typography>
                                {c.date_signature && <Chip label="✍️ Signé" size="small" color="success" sx={{ height: 18, fontSize: '0.6rem' }} />}
                                {c.legalise && <Chip label="🏛️ Légalisé" size="small" color="primary" sx={{ height: 18, fontSize: '0.6rem' }} />}
                                {c.est_archive && <Chip label="📦 Archivé" size="small" color="default" sx={{ height: 18, fontSize: '0.6rem' }} />}
                              </Box>
                            </Box>
                          </Box>
                          <Stack direction="row" spacing={0.5}>
                            <Tooltip title="Aperçu"><IconButton size="small" onClick={() => setPreviewUrl(getFullUrl(c.pdf_url))}><Visibility sx={{ fontSize: 16 }} /></IconButton></Tooltip>
                            <Tooltip title="Télécharger"><IconButton size="small" onClick={() => window.open(getFullUrl(c.pdf_url), '_blank')}><Download sx={{ fontSize: 16 }} /></IconButton></Tooltip>
                            <Tooltip title="Imprimer"><IconButton size="small" onClick={() => handlePrint(c.pdf_url)}><Print sx={{ fontSize: 16 }} /></IconButton></Tooltip>
                            {!c.date_signature && <Button size="small" variant="outlined" color="success" onClick={() => handleSigner(c.id)} sx={{ borderRadius: 2, textTransform: 'none', fontSize: '0.65rem' }}>Signer</Button>}
                            {c.date_signature && !c.legalise && (
                              <Button size="small" variant="outlined" color="primary" onClick={() => { setLegaliserOpen(c.id); setLegalForm({ numero_enregistrement: '', legalise_par: '', date_legalisation: '' }); }}
                                sx={{ borderRadius: 2, textTransform: 'none', fontSize: '0.65rem' }}>Légaliser</Button>
                            )}
                            {!c.est_archive && <Button size="small" variant="outlined" color="error" onClick={() => handleArchiver(c.id)} sx={{ borderRadius: 2, textTransform: 'none', fontSize: '0.65rem' }}>Archiver</Button>}
                          </Stack>
                        </Box>
                        {c.legalise && (
                          <Box sx={{ mt: 1, p: 1.5, bgcolor: '#f8fafc', borderRadius: 1.5, display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                            <Typography variant="caption" color="text.secondary">📋 N° {c.numero_enregistrement}</Typography>
                            <Typography variant="caption" color="text.secondary">👤 {c.legalise_par}</Typography>
                            <Typography variant="caption" color="text.secondary">📅 {c.date_legalisation ? formatDate(c.date_legalisation) : '-'}</Typography>
                          </Box>
                        )}
                      </Paper>
                    ))}
                  </Box>
                )}
              </Box>
            </Fade>
          )}

          {/* Dialogue Aperçu PDF */}
          <Dialog open={!!previewUrl} onClose={() => setPreviewUrl('')} maxWidth="lg" fullWidth>
            <Box sx={{ p: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: '#1a1a1a' }}>
              <Typography variant="body2" sx={{ color: 'white', fontWeight: 600, ml: 1 }}>Aperçu du contrat</Typography>
              <Box>
                <IconButton size="small" onClick={() => window.open(previewUrl, '_blank')} sx={{ color: 'white' }}><Download sx={{ fontSize: 18 }} /></IconButton>
                <IconButton size="small" onClick={() => handlePrint(previewUrl)} sx={{ color: 'white' }}><Print sx={{ fontSize: 18 }} /></IconButton>
                <IconButton size="small" onClick={() => setPreviewUrl('')} sx={{ color: 'white' }}><Close /></IconButton>
              </Box>
            </Box>
            <iframe src={previewUrl} style={{ width: '100%', height: '80vh', border: 'none' }} />
          </Dialog>

          {/* Dialogue Édition Modèle */}
          <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="md" fullWidth>
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Modifier le modèle</Typography>
              {editModele && (
                <Stack spacing={2}>
                  <TextField label="Nom" value={editModele.nom} onChange={e => setEditModele({ ...editModele, nom: e.target.value })} size="small" />
                  <TextField label="Type" select value={editModele.type_contrat} onChange={e => setEditModele({ ...editModele, type_contrat: e.target.value })} size="small">
                    {['habitation','commercial','professionnel','saisonnier'].map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
                  </TextField>
                  <TextField label="Description" value={editModele.description || ''} onChange={e => setEditModele({ ...editModele, description: e.target.value })} size="small" multiline rows={2} />
                  <TextField label="Template HTML" value={editModele.template_html} onChange={e => setEditModele({ ...editModele, template_html: e.target.value })} size="small" multiline rows={6} />
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
                    <Button onClick={() => setEditOpen(false)} sx={{ borderRadius: 2, textTransform: 'none' }}>Annuler</Button>
                    <Button variant="contained" onClick={handleUpdateModele} sx={{ borderRadius: 2, textTransform: 'none' }}>Enregistrer</Button>
                  </Box>
                </Stack>
              )}
            </Box>
          </Dialog>

          {/* Dialogue Légalisation */}
          <Dialog open={!!legaliserOpen} onClose={() => setLegaliserOpen(null)} maxWidth="sm" fullWidth>
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Légaliser le contrat</Typography>
              <Stack spacing={2}>
                <TextField label="N° enregistrement *" value={legalForm.numero_enregistrement} onChange={e => setLegalForm({ ...legalForm, numero_enregistrement: e.target.value })} size="small" required />
                <TextField label="Légalisé par *" value={legalForm.legalise_par} onChange={e => setLegalForm({ ...legalForm, legalise_par: e.target.value })} size="small" required />
                <TextField label="Date de légalisation" type="date" value={legalForm.date_legalisation} onChange={e => setLegalForm({ ...legalForm, date_legalisation: e.target.value })} size="small" slotProps={{ inputLabel: { shrink: true } }} />
              </Stack>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 3 }}>
                <Button onClick={() => setLegaliserOpen(null)} sx={{ borderRadius: 2, textTransform: 'none' }}>Annuler</Button>
                <Button variant="contained" onClick={handleLegaliser} disabled={!legalForm.numero_enregistrement || !legalForm.legalise_par}
                  sx={{ borderRadius: 2, textTransform: 'none' }}>Légaliser</Button>
              </Box>
            </Box>
          </Dialog>

          {/* Dialogue Confirmation Suppression */}
          <Dialog open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} maxWidth="xs" fullWidth>
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Avatar sx={{ bgcolor: '#ffebee', width: 56, height: 56, mx: 'auto', mb: 2 }}>
                <Delete sx={{ color: '#c62828' }} />
              </Avatar>
              <Typography variant="h6" sx={{ mb: 1 }}>Supprimer le modèle ?</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>Cette action est irréversible.</Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                <Button onClick={() => setDeleteConfirm(null)} sx={{ borderRadius: 2, textTransform: 'none' }}>Annuler</Button>
                <Button variant="contained" color="error" onClick={handleDeleteModele} sx={{ borderRadius: 2, textTransform: 'none' }}>Supprimer</Button>
              </Box>
            </Box>
          </Dialog>
        </Box>
      </Box>
    </Box>
  );
}