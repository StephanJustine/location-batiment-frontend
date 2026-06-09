// src/app/locataires/page.tsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Box, Button, Card, CardContent, Typography, TextField,
  InputAdornment, MenuItem, IconButton, Tooltip, Pagination,
  Toolbar, Container, Chip, Avatar, Fade, CircularProgress, Stack
} from '@mui/material';
import { Add, Search, Refresh, People, TrendingUp, Archive, Block, FilterList } from '@mui/icons-material';
import { locataireService } from '@/services/locataireService';
import LocataireCard from '@/components/locataires/LocataireCard';
import { Locataire } from '@/types/models';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';

const PAGE_SIZE = 12;

const statCards = [
  { key: 'total', label: 'Total', icon: <People />, color: '#1565c0', bg: '#e3f2fd' },
  { key: 'actifs', label: 'Actifs', icon: <TrendingUp />, color: '#2e7d32', bg: '#e8f5e9' },
  { key: 'archives', label: 'Archivés', icon: <Archive />, color: '#616161', bg: '#f5f5f5' },
  { key: 'blacklist', label: 'Blacklistés', icon: <Block />, color: '#c62828', bg: '#ffebee' }
];

const statusOptions = [
  { value: '', label: 'Tous', icon: '📋' },
  { value: 'actif', label: 'Actifs', icon: '✅' },
  { value: 'archive', label: 'Archivés', icon: '📦' },
  { value: 'blacklist', label: 'Blacklistés', icon: '🚫' }
];

export default function LocatairesPage() {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [items, setItems] = useState<Locataire[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statut, setStatut] = useState('actif');
  const [page, setPage] = useState(1);
  const [delId, setDelId] = useState<number | null>(null);

  // 🔥 Stats globales (tous les locataires, sans pagination)
  const [globalStats, setGlobalStats] = useState({ total: 0, actifs: 0, archives: 0, blacklist: 0 });
  const [totalFiltered, setTotalFiltered] = useState(0);
  const totalPages = Math.max(1, Math.ceil(totalFiltered / PAGE_SIZE));

  // 🔥 Charger les stats globales (sans filtre ni pagination)
  const loadGlobalStats = useCallback(async () => {
    try {
      const all = await locataireService.getLocataires({ skip: 0, limit: 1000, statut: undefined });
      setGlobalStats({
        total: all.length,
        actifs: all.filter(l => l.statut === 'actif').length,
        archives: all.filter(l => l.statut === 'archive').length,
        blacklist: all.filter(l => l.statut === 'blacklist').length
      });
    } catch { /* silencieux */ }
  }, []);

  // Charger la page courante (avec filtre et pagination)
  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const data = await locataireService.getLocataires({
        skip: (page - 1) * PAGE_SIZE,
        limit: PAGE_SIZE,
        search: search || undefined,
        statut: statut || undefined
      });
      setItems(data);
      setTotalFiltered(data.length); // Idéalement retourné par le backend
    } catch (e: any) {
      setError(e?.response?.data?.detail || 'Erreur');
    } finally {
      setLoading(false);
    }
  }, [page, statut, search]);

  useEffect(() => { loadGlobalStats(); }, []);
  useEffect(() => { load(); }, [load]);

  const handleDelete = async () => {
    if (!delId) return;
    try { await locataireService.deleteLocataire(delId); load(); loadGlobalStats(); } catch { setError('Erreur'); }
    setDelId(null);
  };

  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      if (newStatus === 'blacklist') await locataireService.blacklistLocataire(id, 'Depuis la liste');
      else if (newStatus === 'actif') await locataireService.activateLocataire(id);
      else if (newStatus === 'archive') await locataireService.deleteLocataire(id);
      load();
      loadGlobalStats();
    } catch { setError('Erreur'); }
  };

  return (
    <Box sx={{ display: 'flex', bgcolor: '#f5f7fa', minHeight: '100vh' }}>
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <Box component="main" sx={{ flexGrow: 1, width: { sm: 'calc(100% - 260px)' }, minWidth: 0 }}>
        <Header onMenuClick={() => setMobileOpen(!mobileOpen)} />
        <Toolbar />
        <Container maxWidth={false} sx={{ px: { xs: 2, sm: 3 }, py: 2.5 }}>

          {/* Header */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5, flexWrap: 'wrap', gap: 1 }}>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.2 }}>Locataires</Typography>
              <Typography variant="caption" color="text.secondary">
                {totalFiltered} résultat(s) · Page {page}/{totalPages}
              </Typography>
            </Box>
            <Button variant="contained" size="small" startIcon={<Add sx={{ fontSize: 18 }} />}
              onClick={() => router.push('/locataires/create')}
              sx={{ textTransform: 'none', fontWeight: 600, fontSize: '0.8rem', borderRadius: 2, boxShadow: 2 }}>
              Nouveau
            </Button>
          </Box>

          {/* 🔥 Stats globales */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(4, 1fr)' }, gap: 1.5, mb: 2.5 }}>
            {statCards.map(s => (
              <Card key={s.key} sx={{ bgcolor: s.bg, boxShadow: 'none', border: `1px solid ${s.color}20`, borderRadius: 2.5 }}>
                <CardContent sx={{ p: 1.5, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Avatar sx={{ width: 38, height: 38, bgcolor: `${s.color}18`, color: s.color }}>{s.icon}</Avatar>
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>{s.label}</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: s.color, lineHeight: 1.2, fontSize: '1.1rem' }}>
                      {(globalStats as any)[s.key]}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>

          {/* Filtres */}
          <Card sx={{ mb: 2.5, boxShadow: 'none', border: '1px solid #e8edf2', borderRadius: 2.5 }}>
            <CardContent sx={{ p: 1.5, display: 'flex', flexWrap: 'wrap', gap: 1.5, alignItems: 'center' }}>
              <TextField size="small" placeholder="Rechercher nom, CIN, email..." value={search}
                onChange={e => setSearch(e.target.value)}
                sx={{ flex: '1 1 280px', minWidth: 200 }}
                slotProps={{ input: { startAdornment: <InputAdornment position="start"><Search sx={{ fontSize: 18, color: 'text.secondary' }} /></InputAdornment> } }}
                onKeyDown={e => { if (e.key === 'Enter') { setPage(1); load(); } }} />
              <TextField size="small" select label="Statut" value={statut}
                onChange={e => { setStatut(e.target.value); setPage(1); }}
                sx={{ flex: '0 1 150px', minWidth: 130 }}>
                {statusOptions.map(o => <MenuItem key={o.value} value={o.value}>{o.icon} {o.label}</MenuItem>)}
              </TextField>
              <Button variant="contained" size="small" startIcon={<FilterList sx={{ fontSize: 16 }} />}
                onClick={() => { setPage(1); load(); }}
                sx={{ textTransform: 'none', fontSize: '0.75rem', borderRadius: 2 }}>Appliquer</Button>
              {(search || statut !== 'actif') && (
                <Button size="small" onClick={() => { setSearch(''); setStatut('actif'); setPage(1); }}
                  sx={{ textTransform: 'none', fontSize: '0.7rem', color: 'text.secondary' }}>Réinitialiser</Button>
              )}
            </CardContent>
          </Card>

          {/* Liste */}
          {loading ? (
            <Box sx={{ py: 6, textAlign: 'center' }}><CircularProgress size={32} /></Box>
          ) : error ? (
            <Card sx={{ p: 3, textAlign: 'center', borderRadius: 2 }}><Typography color="error" sx={{ mb: 1 }}>{error}</Typography><Button size="small" onClick={load}>Réessayer</Button></Card>
          ) : items.length === 0 ? (
            <Card sx={{ textAlign: 'center', py: 6, borderRadius: 2 }}>
              <Typography color="text.secondary">Aucun locataire trouvé</Typography>
              <Button variant="contained" size="small" startIcon={<Add />} onClick={() => router.push('/locataires/create')} sx={{ mt: 1, textTransform: 'none' }}>Créer</Button>
            </Card>
          ) : (
            <Fade in>
              <Box>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: '1fr 1fr 1fr' }, gap: 2 }}>
                  {items.map(l => (
                    <LocataireCard key={l.id} locataire={l}
                      onEdit={id => router.push(`/locataires/${id}/edit`)}
                      onDelete={id => setDelId(id)}
                      onView={id => router.push(`/locataires/${id}`)}
                      onStatusChange={handleStatusChange} />
                  ))}
                </Box>
                {totalPages > 1 && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                    <Pagination count={totalPages} page={page} onChange={(_, v) => setPage(v)} size="small" />
                  </Box>
                )}
              </Box>
            </Fade>
          )}
        </Container>
      </Box>

      {/* Dialogue */}
      {delId !== null && (
        <Box sx={{ position: 'fixed', inset: 0, bgcolor: 'rgba(0,0,0,.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onClick={() => setDelId(null)}>
          <Card sx={{ p: 3, maxWidth: 400, width: '90%', borderRadius: 3 }} onClick={e => e.stopPropagation()}>
            <Typography variant="h6" sx={{ mb: 1 }}>Archiver ?</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>Confirmer l'archivage ?</Typography>
            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
              <Button size="small" onClick={() => setDelId(null)}>Annuler</Button>
              <Button size="small" variant="contained" color="error" onClick={handleDelete}>Archiver</Button>
            </Box>
          </Card>
        </Box>
      )}
    </Box>
  );
}