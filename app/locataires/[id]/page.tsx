// src/app/locataires/[id]/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import {
  Box, Card, CardContent, Typography, Button, Chip, Avatar,
  Tabs, Tab, Paper, Divider, Alert, Breadcrumbs, Link,
  TextField, CircularProgress, Toolbar, Container, IconButton, Grid
} from '@mui/material';
import {
  Edit, Delete, Phone, Email, Home, Work, Person,
  CheckCircle, Block, Description, AttachMoney, History,
  NavigateNext, Send, ArrowBack, Download, CalendarToday,
  LocationOn, Flag, Badge, Business, AttachFile
} from '@mui/icons-material';
import { useRouter, useParams } from 'next/navigation';
import { locataireService } from '@/services/locataireService';
import { LocataireDetail } from '@/types/models';
import { formatCurrency, formatDate } from '@/utils/formatters';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';

// Configuration statuts
const statusConfig = {
  actif: { color: 'success' as const, bg: 'linear-gradient(135deg, #43a047, #66bb6a)', icon: <CheckCircle /> },
  blacklist: { color: 'error' as const, bg: 'linear-gradient(135deg, #e53935, #ef5350)', icon: <Block /> },
  archive: { color: 'default' as const, bg: 'linear-gradient(135deg, #757575, #9e9e9e)', icon: <Block /> }
};

// Style overlay pour les dialogues
const overlay = {
  position: 'fixed', inset: 0, bgcolor: 'rgba(0,0,0,0.6)',
  zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center',
  backdropFilter: 'blur(4px)'
};

export default function LocataireDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params?.id) || 0;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [d, setD] = useState<LocataireDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tab, setTab] = useState(0);
  const [delOpen, setDelOpen] = useState(false);
  const [blOpen, setBlOpen] = useState(false);
  const [blMotif, setBlMotif] = useState('');
  const [msg, setMsg] = useState('');

  const load = async () => {
    if (!id) return;
    try { setLoading(true); setError(''); setD(await locataireService.getLocataireById(id)); }
    catch (e: any) { setError(e?.response?.data?.detail || 'Erreur'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [id]);

  const toast = (m: string) => { setMsg(m); setTimeout(() => setMsg(''), 3000); };

  const del = async () => { try { await locataireService.deleteLocataire(id); toast('Archivé'); setTimeout(() => router.push('/locataires'), 1000); } catch { setError('Erreur'); } setDelOpen(false); };
  const bl = async () => { try { await locataireService.blacklistLocataire(id, blMotif); toast('Blacklisté'); load(); } catch { setError('Erreur'); } setBlOpen(false); setBlMotif(''); };
  const activate = async () => { try { await locataireService.activateLocataire(id); toast('Activé'); load(); } catch { setError('Erreur'); } };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}><CircularProgress size={48} /></Box>;
  if (!d) return <Box sx={{ p: 3 }}><Alert severity="warning">Locataire introuvable</Alert></Box>;

  const cfg = statusConfig[d.statut] || statusConfig.archive;
  const photo = (d as any).photo_url || null;
  const init = `${d.prenom?.[0] || ''}${d.nom?.[0] || ''}`;

  return (
    <Box sx={{ display: 'flex', bgcolor: '#f5f7fa', minHeight: '100vh' }}>
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <Box component="main" sx={{ flexGrow: 1, width: { sm: 'calc(100% - 260px)' }, minWidth: 0 }}>
        <Header onMenuClick={() => setMobileOpen(!mobileOpen)} />
        <Toolbar />
        <Container maxWidth={false} sx={{ px: { xs: 2, sm: 3 }, py: 2.5 }}>

          {/* Fil d'Ariane */}
          <Breadcrumbs separator={<NavigateNext sx={{ fontSize: 14 }} />} sx={{ mb: 2 }}>
            <Link href="/" color="inherit" underline="hover" sx={{ fontSize: '0.8rem' }}>Dashboard</Link>
            <Link href="/locataires" color="inherit" underline="hover" sx={{ fontSize: '0.8rem' }}>Locataires</Link>
            <Typography variant="caption">{d.prenom} {d.nom}</Typography>
          </Breadcrumbs>

          {msg && <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>{msg}</Alert>}

          {/* Carte d'en-tête */}
          <Paper sx={{
            p: 3, mb: 3, borderRadius: 3,
            background: 'linear-gradient(135deg, #fff 60%, #f8fafc 100%)',
            border: '1px solid #e8edf2', boxShadow: '0 2px 12px rgba(0,0,0,0.06)'
          }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <Avatar
                  src={photo || undefined}
                  sx={{
                    width: 72, height: 72, fontSize: 28, fontWeight: 700,
                    background: photo ? 'none' : cfg.bg,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
                  }}
                >
                  {!photo && init}
                </Avatar>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
                    {d.prenom} {d.nom}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Chip icon={cfg.icon} label={d.statut?.toUpperCase()} color={cfg.color} size="small" sx={{ fontWeight: 600 }} />
                    {d.cin && <Chip icon={<Badge />} label={`CIN: ${d.cin}`} variant="outlined" size="small" />}
                    {d.nationalite && <Chip icon={<Flag />} label={d.nationalite} variant="outlined" size="small" />}
                    {d.profession && <Chip icon={<Work />} label={d.profession} variant="outlined" size="small" />}
                  </Box>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Button size="small" variant="outlined" startIcon={<ArrowBack />} onClick={() => router.push('/locataires')}>Retour</Button>
                <Button size="small" variant="contained" startIcon={<Edit />} onClick={() => router.push(`/locataires/${id}/edit`)} sx={{ boxShadow: 2 }}>Modifier</Button>
                {d.statut === 'actif' && <Button size="small" color="warning" variant="outlined" startIcon={<Block />} onClick={() => setBlOpen(true)}>Blacklister</Button>}
                {d.statut === 'archive' && <Button size="small" color="success" variant="outlined" startIcon={<CheckCircle />} onClick={activate}>Activer</Button>}
                {d.statut !== 'blacklist' && <Button size="small" color="error" variant="outlined" startIcon={<Delete />} onClick={() => setDelOpen(true)}>Archiver</Button>}
              </Box>
            </Box>
          </Paper>

          {/* Statistiques rapides */}
          <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
            {[
              { label: 'Total payé', value: formatCurrency(d.paiements_total), color: '#2e7d32', bg: '#e8f5e9', icon: <AttachMoney /> },
              { label: 'Impayés', value: formatCurrency(d.paiements_impayes), color: '#c62828', bg: '#ffebee', icon: <Block /> },
              { label: 'Baux actifs', value: d.baux_actifs?.length || 0, color: '#1565c0', bg: '#e3f2fd', icon: <Description /> },
              { label: 'Garants', value: d.garants?.length || 0, color: '#6a1b9a', bg: '#f3e5f5', icon: <Person /> }
            ].map(s => (
              <Card key={s.label} sx={{ flex: '1 1 180px', bgcolor: s.bg, borderRadius: 3, boxShadow: 'none', border: `1px solid ${s.color}20` }}>
                <CardContent sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Avatar sx={{ width: 40, height: 40, bgcolor: `${s.color}20`, color: s.color }}>{s.icon}</Avatar>
                  <Box>
                    <Typography variant="caption" color="text.secondary">{s.label}</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: s.color }}>{s.value}</Typography>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>

          {/* Tabs */}
          <Paper sx={{ mb: 3, borderRadius: 2, border: '1px solid #e8edf2' }}>
            <Tabs value={tab} onChange={(_, v) => setTab(v)} variant="fullWidth"
              sx={{ minHeight: 44, '& .MuiTab-root': { minHeight: 44, py: 0.5, textTransform: 'none', fontSize: '0.8rem' } }}>
              {[['Infos', <Person />], ['Baux', <Description />], ['Paiements', <AttachMoney />], ['Historique', <History />]].map(([l, i]) => (
                <Tab key={l as string} icon={i as any} label={l} iconPosition="start" />
              ))}
            </Tabs>
          </Paper>

          {/* Contenu des tabs */}
          {tab === 0 && (
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2.5 }}>
              <SectionCard title="Identité" icon={<Person />}>
                <InfoRow icon={<CalendarToday />} label="Né(e) le" value={d.date_naissance ? formatDate(d.date_naissance) : '-'} />
                <InfoRow icon={<LocationOn />} label="Lieu" value={d.lieu_naissance || '-'} />
                <InfoRow icon={<Flag />} label="Nationalité" value={d.nationalite} />
                <InfoRow icon={<Person />} label="Situation" value={d.situation_matrimoniale || '-'} />
                <InfoRow icon={<Person />} label="Enfants" value={d.nombre_enfants} />
              </SectionCard>

              <SectionCard title="Contact" icon={<Phone />}>
                <InfoRow icon={<Phone />} label="Téléphone" value={d.telephone}
                  action={<IconButton size="small" href={`tel:${d.telephone}`}><Phone sx={{ fontSize: 16 }} color="success" /></IconButton>} />
                {d.telephone_secondaire && <InfoRow icon={<Phone />} label="Tél. secondaire" value={d.telephone_secondaire} />}
                {d.email && <InfoRow icon={<Email />} label="Email" value={d.email}
                  action={<IconButton size="small" href={`mailto:${d.email}`}><Send sx={{ fontSize: 16 }} color="primary" /></IconButton>} />}
                <InfoRow icon={<Home />} label="Adresse" value={d.adresse || '-'} span />
              </SectionCard>

              <SectionCard title="Profession" icon={<Work />}>
                <InfoRow icon={<Work />} label="Profession" value={d.profession || '-'} />
                <InfoRow icon={<Business />} label="Employeur" value={d.employeur || '-'} />
                <InfoRow icon={<AttachMoney />} label="Revenu" value={d.revenu_mensuel ? formatCurrency(d.revenu_mensuel) : '-'} />
              </SectionCard>

              <SectionCard title={`Garants (${d.garants?.length || 0})`} icon={<Person />}>
                {d.garants?.length ? d.garants.map((g, i) => (
                  <Box key={i} sx={{ py: 0.8, px: 1, bgcolor: '#f8fafc', borderRadius: 1.5, mb: 0.5 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{g.nom} {g.prenom}</Typography>
                    <Typography variant="caption" color="text.secondary">{g.telephone}{g.profession ? ` · ${g.profession}` : ''}</Typography>
                  </Box>
                )) : <Typography variant="caption" color="text.secondary">Aucun garant</Typography>}
              </SectionCard>

              {d.notes && (
                <Box sx={{ gridColumn: '1 / -1' }}>
                  <SectionCard title="Notes" icon={<AttachFile />}>
                    <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', color: 'text.secondary' }}>{d.notes}</Typography>
                  </SectionCard>
                </Box>
              )}
            </Box>
          )}

          {tab === 1 && (
            <Card sx={{ borderRadius: 3, border: '1px solid #e8edf2', boxShadow: 'none' }}>
              <CardContent sx={{ p: 2.5 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>Baux actifs</Typography>
                {d.baux_actifs?.length ? d.baux_actifs.map(b => (
                  <Box key={b.id} sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 1, px: 2, bgcolor: '#f8fafc', borderRadius: 2, mb: 1, flexWrap: 'wrap' }}>
                    <Typography variant="body2" sx={{ fontWeight: 600, minWidth: 120 }}>{b.numero_contrat}</Typography>
                    <Chip label={b.logement_numero} size="small" variant="outlined" />
                    <Typography variant="caption">{formatDate(b.date_debut)} → {formatDate(b.date_fin)}</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.main' }}>{formatCurrency(b.loyer_mensuel)}</Typography>
                    <Chip label={b.statut} size="small" color="primary" sx={{ ml: 'auto' }} />
                  </Box>
                )) : <Typography variant="caption" color="text.secondary">Aucun bail actif</Typography>}
              </CardContent>
            </Card>
          )}

          {tab === 2 && (
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' }, gap: 2 }}>
              <StatBox label="Total payé" value={formatCurrency(d.paiements_total)} color="#2e7d32" />
              <StatBox label="Impayés" value={formatCurrency(d.paiements_impayes)} color="#c62828" />
              <StatBox label="Nombre de paiements" value={d.nombre_paiements} color="#1565c0" />
            </Box>
          )}

          {tab === 3 && (
            <Card sx={{ borderRadius: 3, border: '1px solid #e8edf2', boxShadow: 'none' }}>
              <CardContent sx={{ p: 2.5 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>Historique des logements</Typography>
                {d.historique_logements?.length ? d.historique_logements.map(h => (
                  <Box key={h.id} sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 1, px: 2, bgcolor: '#f8fafc', borderRadius: 2, mb: 1, flexWrap: 'wrap' }}>
                    <Chip label={h.logement_numero} size="small" color="primary" variant="outlined" />
                    <Typography variant="caption">{formatDate(h.date_debut)} → {h.date_fin ? formatDate(h.date_fin) : 'En cours'}</Typography>
                    {h.loyer && <Typography variant="body2" sx={{ fontWeight: 600 }}>{formatCurrency(h.loyer)}</Typography>}
                    {h.motif_depart && <Chip label={h.motif_depart} size="small" variant="outlined" sx={{ ml: 'auto' }} />}
                  </Box>
                )) : <Typography variant="caption" color="text.secondary">Aucun historique</Typography>}
              </CardContent>
            </Card>
          )}

        </Container>
      </Box>

      {/* Dialogue suppression */}
      {delOpen && <Box sx={overlay} onClick={() => setDelOpen(false)}>
        <Paper sx={{ p: 3, maxWidth: 400, width: '90%', borderRadius: 3 }} onClick={e => e.stopPropagation()}>
          <Typography variant="h6" sx={{ mb: 1 }}>Archiver le locataire</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>Cette action désactivera le locataire. Confirmer ?</Typography>
          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
            <Button onClick={() => setDelOpen(false)}>Annuler</Button>
            <Button variant="contained" color="error" onClick={del}>Archiver</Button>
          </Box>
        </Paper>
      </Box>}

      {/* Dialogue blacklist */}
      {blOpen && <Box sx={overlay} onClick={() => { setBlOpen(false); setBlMotif(''); }}>
        <Paper sx={{ p: 3, maxWidth: 400, width: '90%', borderRadius: 3 }} onClick={e => e.stopPropagation()}>
          <Typography variant="h6" sx={{ mb: 2 }}>Blacklister le locataire</Typography>
          <TextField fullWidth multiline rows={3} label="Motif du blacklistage" value={blMotif} onChange={e => setBlMotif(e.target.value)} sx={{ mb: 3 }} />
          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
            <Button onClick={() => { setBlOpen(false); setBlMotif(''); }}>Annuler</Button>
            <Button variant="contained" color="error" onClick={bl} disabled={!blMotif}>Blacklister</Button>
          </Box>
        </Paper>
      </Box>}
    </Box>
  );
}

// Composants internes
function SectionCard({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <Card sx={{ borderRadius: 3, border: '1px solid #e8edf2', boxShadow: 'none', height: 'fit-content' }}>
      <CardContent sx={{ p: 2.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main', color: 'white' }}>{icon}</Avatar>
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>{title}</Typography>
        </Box>
        <Divider sx={{ mb: 1.5 }} />
        {children}
      </CardContent>
    </Card>
  );
}

function InfoRow({ icon, label, value, action, span }: { icon: React.ReactNode; label: string; value: string | number; action?: React.ReactNode; span?: boolean }) {
  return (
    <Box sx={{
      display: 'flex',
      py: 0.6,
      flexDirection: span ? 'column' : 'row',
      alignItems: span ? 'flex-start' : 'center'
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: span ? '100%' : 140 }}>
        <Box sx={{ color: 'text.disabled', display: 'flex' }}>{icon}</Box>
        <Typography variant="caption" color="text.secondary">{label}</Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, ml: span ? 0 : 'auto', mt: span ? 0.5 : 0 }}>
        <Typography variant="body2" sx={{ fontWeight: 500 }}>{value}</Typography>
        {action}
      </Box>
    </Box>
  );
}

function StatBox({ label, value, color }: { label: string; value: string | number; color: string }) {
  return (
    <Card sx={{ borderRadius: 3, bgcolor: `${color}15`, border: `1px solid ${color}30`, boxShadow: 'none' }}>
      <CardContent sx={{ p: 2.5, textAlign: 'center' }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color, mb: 0.5 }}>{value}</Typography>
        <Typography variant="caption" color="text.secondary">{label}</Typography>
      </CardContent>
    </Card>
  );
}