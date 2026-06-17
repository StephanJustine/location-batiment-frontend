// app/employes/[id]/edit/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Box, Container, Typography, Paper, Avatar, alpha, Chip, CircularProgress } from '@mui/material';
import { Edit } from '@mui/icons-material';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import EmployeForm from '@/components/employes/EmployeForm';
import { employeService } from '@/services/employeService';

export default function ModifierEmployePage() {
  const { id } = useParams();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [employe, setEmploye] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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

  return (
    <Box sx={{ display: 'flex', bgcolor: '#f8fafc', minHeight: '100vh' }}>
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Header onMenuClick={() => setMobileOpen(!mobileOpen)} />
        <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 }, py: { xs: 2, sm: 2.5 }, mt: { xs: 7, sm: 8 } }}>
          <Paper elevation={0} sx={{ p: 2.5, mb: 3, borderRadius: 3, border: '1px solid rgba(46,125,50,0.1)' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: alpha('#2e7d32', 0.1), width: 52, height: 52 }}>
                <Edit sx={{ color: '#2e7d32', fontSize: 26 }} />
              </Avatar>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a' }}>Modifier l'employé</Typography>
                <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                  <Chip label={`${employe?.nom} ${employe?.prenom}`} size="small" sx={{ bgcolor: '#e8f5e9', color: '#2e7d32' }} />
                </Box>
              </Box>
            </Box>
          </Paper>
          <EmployeForm initialData={employe} isEditing />
        </Container>
      </Box>
    </Box>
  );
}