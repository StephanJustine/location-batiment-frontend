// components/users/UserList.tsx
'use client';

import { useState, useEffect, JSX } from 'react';
import {
  Box, Typography, Chip, Button, Grid, IconButton, Tooltip,
  Dialog, DialogTitle, DialogContent, DialogActions, Alert,
  CircularProgress, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, TextField, FormControl,
  InputLabel, Select, MenuItem, LinearProgress, Badge, TableSortLabel,
  Avatar, Switch, FormControlLabel, Stack,
  Divider
} from '@mui/material';
import {
  Add, Delete, Edit, Visibility, Person, CheckCircle, Cancel,
  Pending, Search, Clear, Refresh, Close, Email, Phone,
  AdminPanelSettings, Security, Block, Check, LockReset
} from '@mui/icons-material';
import { userService } from '@/services/userService';
import { User, UserRole, UserStatus } from '@/types/user';
import { motion, AnimatePresence } from 'framer-motion';

interface UserListProps {
  onSelect?: (user: User) => void;
  readonly?: boolean;
}

const roleConfig: Record<UserRole, { label: string; color: string; bg: string; icon: JSX.Element }> = {
  [UserRole.ADMIN]: { label: 'Administrateur', color: '#dc2626', bg: '#fef2f2', icon: <AdminPanelSettings sx={{ fontSize: 14 }} /> },
  [UserRole.GESTIONNAIRE]: { label: 'Gestionnaire', color: '#2563eb', bg: '#eff6ff', icon: <Security sx={{ fontSize: 14 }} /> },
  [UserRole.LOCATAIRE]: { label: 'Locataire', color: '#059669', bg: '#f0fdf4', icon: <Person sx={{ fontSize: 14 }} /> },
  [UserRole.SUPERVISEUR]: { label: 'superviseur', color: '#dc2626', bg: '#f0fdf4', icon: <Visibility sx={{ fontSize: 14 }} /> }
};

const statusConfig: Record<UserStatus, { label: string; color: string; bg: string; icon: JSX.Element }> = {
  [UserStatus.ACTIF]: { label: 'Actif', color: '#22c55e', bg: '#f0fdf4', icon: <CheckCircle sx={{ fontSize: 14 }} /> },
  [UserStatus.INACTIF]: { label: 'Inactif', color: '#64748b', bg: '#f1f5f9', icon: <Cancel sx={{ fontSize: 14 }} /> },
  [UserStatus.SUSPENDU]: { label: 'Suspendu', color: '#dc2626', bg: '#fef2f2', icon: <Block sx={{ fontSize: 14 }} /> }
};

const UserList: React.FC<UserListProps> = ({ onSelect, readonly = false }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [orderBy, setOrderBy] = useState<string>('nom');
  const [orderDir, setOrderDir] = useState<'asc' | 'desc'>('asc');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [dialogAction, setDialogAction] = useState<'view' | 'edit' | 'delete' | 'suspend' | 'activate' | 'reset'>('view');
  const [tempPassword, setTempPassword] = useState<string>('');

  useEffect(() => { loadUsers(); }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const filters: any = {};
      if (filterRole) filters.role = filterRole;
      if (filterStatus) filters.status = filterStatus;
      if (search) filters.search = search;
      filters.limit = 100;
      filters.skip = 0;
      
      const data = await userService.getAll(filters);
      setUsers(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Erreur de chargement');
    } finally { setLoading(false); }
  };

  const handleSort = (prop: string) => {
    const isAsc = orderBy === prop && orderDir === 'asc';
    setOrderDir(isAsc ? 'desc' : 'asc');
    setOrderBy(prop);
  };

  const filtered = users
    .filter(u => {
      const s = search.toLowerCase();
      return !s || 
        u.nom.toLowerCase().includes(s) ||
        u.prenom.toLowerCase().includes(s) ||
        u.email.toLowerCase().includes(s) ||
        u.username.toLowerCase().includes(s);
    })
    .sort((a, b) => {
      const asc = orderDir === 'asc';
      switch (orderBy) {
        case 'nom': return asc ? a.nom.localeCompare(b.nom) : b.nom.localeCompare(a.nom);
        case 'email': return asc ? a.email.localeCompare(b.email) : b.email.localeCompare(a.email);
        case 'role': return asc ? a.role.localeCompare(b.role) : b.role.localeCompare(a.role);
        case 'status': return asc ? a.status.localeCompare(b.status) : b.status.localeCompare(a.status);
        default: return asc ? a.id - b.id : b.id - a.id;
      }
    });

  const stats = {
    total: users.length,
    admin: users.filter(u => u.role === UserRole.ADMIN).length,
    gestionnaire: users.filter(u => u.role === UserRole.GESTIONNAIRE).length,
    locataire: users.filter(u => u.role === UserRole.LOCATAIRE).length,
    actif: users.filter(u => u.status === UserStatus.ACTIF).length,
    suspendu: users.filter(u => u.status === UserStatus.SUSPENDU).length,
    inactif: users.filter(u => u.status === UserStatus.INACTIF).length
  };

  const handleAction = async () => {
    if (!selectedUser) return;
    try {
      switch (dialogAction) {
        case 'delete':
          await userService.delete(selectedUser.id);
          break;
        case 'suspend':
          await userService.suspend(selectedUser.id);
          break;
        case 'activate':
          await userService.activate(selectedUser.id);
          break;
        case 'reset':
          const result = await userService.resetPassword(selectedUser.id);
          setTempPassword(result.temporary_password);
          return;
        default:
          break;
      }
      setDialogOpen(false);
      await loadUsers();
    } catch (err: any) {
      setError(err.message || 'Erreur lors de l\'opération');
    }
  };

  const openDialog = (user: User, action: typeof dialogAction) => {
    setSelectedUser(user);
    setDialogAction(action);
    setTempPassword('');
    setDialogOpen(true);
  };

  if (loading) {
    return (
      <Box sx={{ py: 4 }}>
        <LinearProgress sx={{ borderRadius: 2 }} />
        <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', mt: 1, color: '#64748b' }}>
          Chargement des utilisateurs...
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2, mb: 3 }}>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Utilisateurs <Badge badgeContent={users.length} color="primary" sx={{ ml: 1 }}><span /></Badge>
          </Typography>
          <Typography variant="caption" sx={{ color: '#64748b' }}>Gestion des comptes utilisateurs</Typography>
        </Box>
        {!readonly && (
          <Button variant="contained" startIcon={<Add />} href="/parametres/utilisateurs/nouveau"
            sx={{ bgcolor: '#2e7d32', '&:hover': { bgcolor: '#1b5e20' }, borderRadius: 2, textTransform: 'none' }}>
            Nouvel utilisateur
          </Button>
        )}
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'Total', value: stats.total, color: '#0f172a' },
          { label: 'Administrateurs', value: stats.admin, color: '#dc2626', bg: '#fef2f2' },
          { label: 'Gestionnaires', value: stats.gestionnaire, color: '#2563eb', bg: '#eff6ff' },
          { label: 'Locataires', value: stats.locataire, color: '#059669', bg: '#f0fdf4' },
          { label: 'Actifs', value: stats.actif, color: '#22c55e', bg: '#f0fdf4' },
          { label: 'Suspendus', value: stats.suspendu, color: '#dc2626', bg: '#fef2f2' }
        ].map((s, i) => (
          <Grid size={{ xs: 6, sm: 2 }} key={i}>
            <Paper sx={{ p: 1.5, textAlign: 'center', borderRadius: 2, bgcolor: s.bg || '#fff' }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: s.color }}>{s.value}</Typography>
              <Typography variant="caption" sx={{ color: '#64748b' }}>{s.label}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {error && <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}

      <Paper sx={{ p: 1.5, mb: 3, borderRadius: 2, border: '1px solid #e2e8f0' }}>
        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', alignItems: 'center' }}>
          <TextField size="small" placeholder="Rechercher..." value={search} onChange={e => setSearch(e.target.value)}
            sx={{ flex: 1, minWidth: 180, '& .MuiOutlinedInput-root': { borderRadius: 1.5, bgcolor: '#f8fafc' } }}
            slotProps={{ input: { 
              startAdornment: <Search sx={{ mr: 1, color: '#94a3b8', fontSize: 18 }} />,
              endAdornment: search && <IconButton size="small" onClick={() => setSearch('')}><Clear sx={{ fontSize: 16 }} /></IconButton>
            } }} />
          
          <FormControl size="small" sx={{ minWidth: 130 }}>
            <InputLabel>Rôle</InputLabel>
            <Select value={filterRole} onChange={e => setFilterRole(e.target.value)} label="Rôle">
              <MenuItem value="">Tous</MenuItem>
              {Object.values(UserRole).map(r => (
                <MenuItem key={r} value={r}>{roleConfig[r]?.label || r}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 130 }}>
            <InputLabel>Statut</InputLabel>
            <Select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} label="Statut">
              <MenuItem value="">Tous</MenuItem>
              {Object.values(UserStatus).map(s => (
                <MenuItem key={s} value={s}>{statusConfig[s]?.label || s}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <Tooltip title="Rafraîchir"><IconButton onClick={loadUsers} size="small"><Refresh /></IconButton></Tooltip>
          <Typography variant="caption" sx={{ color: '#94a3b8', ml: 'auto' }}>{filtered.length} résultat(s)</Typography>
        </Box>
      </Paper>

      {filtered.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 2, border: '1px solid #e2e8f0' }}>
          <Person sx={{ fontSize: 48, color: '#cbd5e1', mb: 2 }} />
          <Typography variant="h6" sx={{ color: '#64748b' }}>Aucun utilisateur trouvé</Typography>
          {!readonly && (
            <Button variant="outlined" startIcon={<Add />} href="/parametres/utilisateurs/nouveau" sx={{ mt: 2 }}>Ajouter</Button>
          )}
        </Paper>
      ) : (
        <TableContainer component={Paper} sx={{ borderRadius: 2, border: '1px solid #e2e8f0' }}>
          <Table size="small">
            <TableHead sx={{ bgcolor: '#f8fafc' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Utilisateur</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Contact</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>
                  <TableSortLabel active={orderBy === 'role'} direction={orderDir} onClick={() => handleSort('role')}>
                    Rôle
                  </TableSortLabel>
                </TableCell>
                <TableCell sx={{ fontWeight: 600 }}>
                  <TableSortLabel active={orderBy === 'status'} direction={orderDir} onClick={() => handleSort('status')}>
                    Statut
                  </TableSortLabel>
                </TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Dernière connexion</TableCell>
                <TableCell align="center" sx={{ fontWeight: 600 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <AnimatePresence>
                {filtered.map((u, i) => {
                  const role = roleConfig[u.role] || { label: u.role, color: '#64748b', bg: '#f1f5f9', icon: <Person sx={{ fontSize: 14 }} /> };
                  const status = statusConfig[u.status] || { label: u.status, color: '#64748b', bg: '#f1f5f9', icon: <Person sx={{ fontSize: 14 }} /> };
                  return (
                    <motion.tr key={u.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ delay: i * 0.03 }}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Avatar sx={{ bgcolor: role.bg, width: 36, height: 36 }}>
                            {u.prenom?.[0]}{u.nom?.[0]}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>{u.nom} {u.prenom}</Typography>
                            <Typography variant="caption" sx={{ color: '#94a3b8' }}>@{u.username}</Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Email sx={{ fontSize: 12, color: '#94a3b8' }} /> {u.email}
                        </Typography>
                        {u.telephone && (
                          <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#94a3b8' }}>
                            <Phone sx={{ fontSize: 12 }} /> {u.telephone}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Chip 
                          icon={role.icon}
                          label={role.label}
                          size="small"
                          sx={{ bgcolor: role.bg, color: role.color }}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip 
                          icon={status.icon}
                          label={status.label}
                          size="small"
                          sx={{ bgcolor: status.bg, color: status.color }}
                        />
                      </TableCell>
                      <TableCell>
                        {u.last_login ? new Date(u.last_login).toLocaleDateString() : '-'}
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="Voir détails">
                          <IconButton size="small" onClick={() => openDialog(u, 'view')}>
                            <Visibility fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        {!readonly && u.role !== UserRole.ADMIN && (
                          <>
                            <Tooltip title="Modifier">
                              <IconButton size="small" href={`/parametres/utilisateurs/${u.id}/edit`}>
                                <Edit fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            {u.status === UserStatus.ACTIF ? (
                              <Tooltip title="Suspendre">
                                <IconButton size="small" color="warning" onClick={() => openDialog(u, 'suspend')}>
                                  <Block fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            ) : (
                              <Tooltip title="Activer">
                                <IconButton size="small" color="success" onClick={() => openDialog(u, 'activate')}>
                                  <Check fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            )}
                            <Tooltip title="Réinitialiser le mot de passe">
                              <IconButton size="small" color="info" onClick={() => openDialog(u, 'reset')}>
                                <LockReset fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Supprimer">
                              <IconButton size="small" color="error" onClick={() => openDialog(u, 'delete')}>
                                <Delete fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </>
                        )}
                      </TableCell>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Dialog d'action */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        {selectedUser && (
          <>
            <DialogTitle>
              {dialogAction === 'view' && 'Détails de l\'utilisateur'}
              {dialogAction === 'delete' && 'Confirmer la suppression'}
              {dialogAction === 'suspend' && 'Confirmer la suspension'}
              {dialogAction === 'activate' && 'Confirmer l\'activation'}
              {dialogAction === 'reset' && 'Réinitialisation du mot de passe'}
            </DialogTitle>
            <DialogContent dividers>
              {dialogAction === 'view' ? (
                <Stack spacing={2}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ width: 64, height: 64, bgcolor: roleConfig[selectedUser.role]?.bg || '#f1f5f9' }}>
                      {selectedUser.prenom?.[0]}{selectedUser.nom?.[0]}
                    </Avatar>
                    <Box>
                      <Typography variant="h6">{selectedUser.nom} {selectedUser.prenom}</Typography>
                      <Typography variant="caption" color="text.secondary">@{selectedUser.username}</Typography>
                    </Box>
                  </Box>
                  <Divider />
                  <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
                    <Typography variant="caption" color="text.secondary">Email</Typography>
                    <Typography variant="body2">{selectedUser.email}</Typography>
                    <Typography variant="caption" color="text.secondary">Téléphone</Typography>
                    <Typography variant="body2">{selectedUser.telephone || '-'}</Typography>
                    <Typography variant="caption" color="text.secondary">Rôle</Typography>
                    <Chip label={roleConfig[selectedUser.role]?.label || selectedUser.role} size="small" />
                    <Typography variant="caption" color="text.secondary">Statut</Typography>
                    <Chip label={statusConfig[selectedUser.status]?.label || selectedUser.status} size="small" />
                    <Typography variant="caption" color="text.secondary">Dernière connexion</Typography>
                    <Typography variant="body2">{selectedUser.last_login ? new Date(selectedUser.last_login).toLocaleString() : '-'}</Typography>
                    <Typography variant="caption" color="text.secondary">Créé le</Typography>
                    <Typography variant="body2">{new Date(selectedUser.created_at).toLocaleString()}</Typography>
                  </Box>
                </Stack>
              ) : dialogAction === 'reset' ? (
                <Stack spacing={2}>
                  {tempPassword ? (
                    <>
                      <Alert severity="success" sx={{ borderRadius: 2 }}>
                        Mot de passe réinitialisé avec succès !
                      </Alert>
                      <Paper sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: 2 }}>
                        <Typography variant="caption" color="text.secondary">Nouveau mot de passe temporaire</Typography>
                        <Typography variant="h6" sx={{ fontFamily: 'monospace', color: '#2e7d32' }}>
                          {tempPassword}
                        </Typography>
                      </Paper>
                      <Alert severity="info" sx={{ borderRadius: 2 }}>
                        Ce mot de passe est temporaire. L'utilisateur devra le changer lors de sa prochaine connexion.
                      </Alert>
                    </>
                  ) : (
                    <>
                      <Alert severity="warning" sx={{ borderRadius: 2 }}>
                        Êtes-vous sûr de vouloir réinitialiser le mot de passe de <strong>{selectedUser.nom} {selectedUser.prenom}</strong> ?
                      </Alert>
                      <Typography variant="body2" color="text.secondary">
                        Un nouveau mot de passe temporaire sera généré et affiché après confirmation.
                      </Typography>
                    </>
                  )}
                </Stack>
              ) : (
                <Alert severity="warning" sx={{ borderRadius: 2 }}>
                  {dialogAction === 'delete' && `Êtes-vous sûr de vouloir supprimer ${selectedUser.nom} ${selectedUser.prenom} ? Cette action est irréversible.`}
                  {dialogAction === 'suspend' && `Êtes-vous sûr de vouloir suspendre ${selectedUser.nom} ${selectedUser.prenom} ?`}
                  {dialogAction === 'activate' && `Êtes-vous sûr de vouloir activer ${selectedUser.nom} ${selectedUser.prenom} ?`}
                </Alert>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDialogOpen(false)} disabled={!!tempPassword}>
                {dialogAction === 'view' ? 'Fermer' : 'Annuler'}
              </Button>
              {dialogAction !== 'view' && !tempPassword && (
                <Button 
                  variant="contained" 
                  onClick={handleAction}
                  color={dialogAction === 'delete' ? 'error' : dialogAction === 'suspend' ? 'warning' : 'primary'}
                >
                  Confirmer
                </Button>
              )}
              {tempPassword && (
                <Button variant="contained" onClick={() => setDialogOpen(false)}>
                  Fermer
                </Button>
              )}
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default UserList;