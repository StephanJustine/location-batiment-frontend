// src/components/baux/BailPaiementSection.tsx
'use client';

import { useState } from 'react';
import { Box, Typography, Tabs, Tab, Button } from '@mui/material';
import { Add } from '@mui/icons-material';
import PaiementList from '@/components/paiements/PaiementList';
import PaiementForm from '@/components/paiements/PaiementForm';
import CautionManagement from '@/components/paiements/CautionManagement';

interface Props {
  bailId: number;
  cautionMontant: number;
  onRefresh?: () => void;
}

export default function BailPaiementSection({ bailId, cautionMontant, onRefresh }: Props) {
  const [tab, setTab] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // 🔥 Vérification du bailId
  console.log('🔍 BailPaiementSection - bailId reçu:', bailId);

  if (!bailId || bailId === 0) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="error">
          Erreur: ID du bail invalide ({bailId})
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Vérifiez que le bail est correctement chargé
        </Typography>
      </Box>
    );
  }

  const handleSuccess = () => {
    setShowForm(false);
    setRefreshKey(prev => prev + 1);
    onRefresh?.();
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Paiements et caution</Typography>
        {!showForm && (
          <Button size="small" startIcon={<Add />} onClick={() => setShowForm(true)}>
            Nouveau paiement
          </Button>
        )}
      </Box>

      <CautionManagement 
        bailId={bailId} 
        cautionMontant={cautionMontant} 
        onSuccess={onRefresh} 
      />

      {showForm && (
        <Box sx={{ mt: 2, mb: 2 }}>
          <PaiementForm 
            bailId={bailId}
            onSubmit={handleSuccess}
            onCancel={() => setShowForm(false)}
          />
        </Box>
      )}

      <Box sx={{ mt: 2 }}>
        <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
          <Tab label="Historique des paiements" />
        </Tabs>
        <PaiementList 
          key={refreshKey}
          bailId={bailId} 
          onView={(paiement) => {
            console.log('Voir paiement:', paiement);
          }}
          onRefresh={handleSuccess}
        />
      </Box>
    </Box>
  );
}