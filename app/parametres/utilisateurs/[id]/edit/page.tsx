// app/parametres/utilisateurs/[id]/edit/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Box, Container, Typography, Paper, Avatar, alpha, Chip, Breadcrumbs, Link, CircularProgress, Button } from '@mui/material';
import { Edit, Settings } from '@mui/icons-material';
import { NavigateNext } from '@mui/icons-material';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import UserForm from '@/components/users/UserForm';
import { userService } from '@/services/userService';
import { User } from '@/types/user';

export default function ModifierUtilisateurPage() {
  const { id } = useParams();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUser();
  }, [id]);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const data = await userService.getById(Number(id));
      if (!data) {
        router.push('/parametres/utilisateurs');
        return;
      }
      setUser(data);
    } catch (err) {
      setError('Erreur lors du chargement');
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

  if (error || !user) {
    return (
      <Box sx={{ display: 'flex', bgcolor: '#f8fafc', minHeight: '100vh' }}>
        <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
        <Box component="main" sx={{ flexGrow: 1 }}>
          <Header onMenuClick={() => setMobileOpen(!mobileOpen)} />
          <Container sx={{ py: 4 }}>
            <Paper sx={{ p: 3, borderRadius: 2 }}>
              <Typography color="error">{error || 'Utilisateur non trouvé'}</Typography>
              <Button onClick={() => router.push('/parametres/utilisateurs')} sx={{ mt: 2 }}>
                Retour à la liste
              </Button>
            </Paper>
          </Container>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', bgcolor: '#f8fafc', minHeight: '100vh' }}>
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Header onMenuClick={() => setMobileOpen(!mobileOpen)} />

        <Container maxWidth="md" sx={{ px: { xs: 2, sm: 3 }, py: { xs: 2, sm: 2.5 }, mt: { xs: 7, sm: 8 } }}>
          
          <Breadcrumbs separator={<NavigateNext fontSize="small" />} sx={{ mb: 2 }}>
            <Link href="/" color="inherit" sx={{ textDecoration: 'none' }}>Accueil</Link>
            <Link href="/parametres" color="inherit" sx={{ textDecoration: 'none' }}>Paramètres</Link>
            <Link href="/parametres/utilisateurs" color="inherit" sx={{ textDecoration: 'none' }}>Utilisateurs</Link>
            <Typography color="text.primary">Modifier</Typography>
          </Breadcrumbs>

          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              mb: 3,
              borderRadius: 3,
              background: 'linear-gradient(135deg, #fff 0%, #f8fafc 100%)',
              border: '1px solid rgba(46,125,50,0.1)'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: alpha('#2e7d32', 0.1), width: 52, height: 52 }}>
                <Edit sx={{ color: '#2e7d32', fontSize: 26 }} />
              </Avatar>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a' }}>
                  Modifier l'utilisateur
                </Typography>
                <Chip 
                  label={`${user.nom} ${user.prenom}`} 
                  size="small" 
                  sx={{ bgcolor: '#e8f5e9', color: '#2e7d32', mt: 0.5 }} 
                />
              </Box>
            </Box>
          </Paper>

          <UserForm initialData={user} onSuccess={() => router.push('/parametres/utilisateurs')} />
        </Container>
      </Box>
    </Box>
  );
}