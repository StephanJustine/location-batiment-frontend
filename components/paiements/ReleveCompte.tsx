// src/components/paiements/ReleveCompte.tsx
'use client';

import { useState } from 'react';
import {
  Box, Card, CardContent, Typography, Table,
  TableBody, TableCell, TableContainer, TableHead,
  TableRow, Chip, Button, TextField, Grid
} from '@mui/material';
import { Print, Download, Search } from '@mui/icons-material';
import { paiementService } from '@/services/paiementService';

interface Props {
  locataireId: number;
  locataireNom: string;
}

export default function ReleveCompte({ locataireId, locataireNom }: Props) {
  const [releve, setReleve] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [dateDebut, setDateDebut] = useState('');
  const [dateFin, setDateFin] = useState('');

  const handleSearch = async () => {
    setLoading(true);
    try {
      const data = await paiementService.getReleveCompte(locataireId, dateDebut, dateFin);
      setReleve(data);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card sx={{ borderRadius: 2 }}>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          Relevé de compte - {locataireNom}
        </Typography>

        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid size={{ xs: 5 }}>
            <TextField
              fullWidth size="small"
              label="Date début"
              type="date"
              value={dateDebut}
              onChange={(e) => setDateDebut(e.target.value)}
              slotProps={{ inputLabel: { shrink: true } }}
            />
          </Grid>
          <Grid size={{ xs: 5 }}>
            <TextField
              fullWidth size="small"
              label="Date fin"
              type="date"
              value={dateFin}
              onChange={(e) => setDateFin(e.target.value)}
              slotProps={{ inputLabel: { shrink: true } }}
            />
          </Grid>
          <Grid size={{ xs: 2 }}>
            <Button fullWidth variant="contained" onClick={handleSearch} disabled={loading}>
              <Search />
            </Button>
          </Grid>
        </Grid>

        {releve && (
          <>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
              <Box>
                <Typography variant="caption" color="text.secondary">Total payé</Typography>
                <Typography variant="h6" sx={{ color: '#2e7d32' }}>
                  {releve.total_paye?.toLocaleString()} Ar
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">Total impayé</Typography>
                <Typography variant="h6" sx={{ color: '#d32f2f' }}>
                  {releve.total_impaye?.toLocaleString()} Ar
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">Nombre paiements</Typography>
                <Typography variant="h6">{releve.nombre_paiements}</Typography>
              </Box>
            </Box>

            <TableContainer>
              <Table size="small">
                <TableHead sx={{ bgcolor: '#f5f5f5' }}>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>N° Quittance</TableCell>
                    <TableCell>Montant</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Statut</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {releve.paiements?.map((p: any) => (
                    <TableRow key={p.id}>
                      <TableCell>{new Date(p.date).toLocaleDateString()}</TableCell>
                      <TableCell>{p.numero_quittance || '-'}</TableCell>
                      <TableCell>{p.montant.toLocaleString()} Ar</TableCell>
                      <TableCell>{p.type}</TableCell>
                      <TableCell>
                        <Chip 
                          label={p.statut} 
                          size="small"
                          color={p.statut === 'paye' ? 'success' : 'warning'}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
              <Button startIcon={<Print />} size="small">Imprimer</Button>
              <Button startIcon={<Download />} size="small">Exporter</Button>
            </Box>
          </>
        )}
      </CardContent>
    </Card>
  );
}