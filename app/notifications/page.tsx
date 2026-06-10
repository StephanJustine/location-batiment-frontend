// src/app/notifications/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, Toolbar, Container, Chip, Avatar, CircularProgress, Button, Fade } from '@mui/material';
import { Notifications, CheckCircle, Warning, Info, Error } from '@mui/icons-material';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { notificationService } from '@/lib/api';

const iconMap: Record<string, any> = { urgent: <Error color="error" />, moyen: <Warning color="warning" />, faible: <Info color="info" /> };

export default function NotificationsPage() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    notificationService.getAll().then(setItems).finally(() => setLoading(false));
  }, []);

  const markAll = async () => {
    await notificationService.markAllAsRead();
    setItems(items.map(i => ({ ...i, lu: true })));
  };

  return (
    <Box sx={{ display: 'flex', bgcolor: '#f5f7fa', minHeight: '100vh' }}>
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <Box component="main" sx={{ flexGrow: 1, width: { sm: 'calc(100% - 260px)' }, minWidth: 0 }}>
        <Header onMenuClick={() => setMobileOpen(!mobileOpen)} />
        <Toolbar />
        <Container maxWidth="md" sx={{ px: { xs: 2, sm: 3 }, py: 2.5 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>Notifications</Typography>
            <Button size="small" variant="outlined" onClick={markAll}>Tout marquer lu</Button>
          </Box>

          {loading ? <Box sx={{ textAlign: 'center', py: 6 }}><CircularProgress /></Box> : items.length === 0 ? (
            <Card sx={{ textAlign: 'center', py: 6, borderRadius: 3 }}>
              <Notifications sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
              <Typography color="text.secondary">Aucune notification</Typography>
            </Card>
          ) : (
            items.map((n, i) => (
              <Fade in key={i}>
                <Card sx={{ mb: 1, borderRadius: 2, border: '1px solid #e8edf2', boxShadow: 'none', bgcolor: n.lu ? 'transparent' : '#f8fafc' }}>
                  <CardContent sx={{ p: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
                    {iconMap[n.niveau] || <Info />}
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: n.lu ? 400 : 600 }}>{n.message}</Typography>
                      <Typography variant="caption" color="text.secondary">{n.date}</Typography>
                    </Box>
                    {!n.lu && <Chip label="Nouveau" size="small" color="primary" />}
                  </CardContent>
                </Card>
              </Fade>
            ))
          )}
        </Container>
      </Box>
    </Box>
  );
}