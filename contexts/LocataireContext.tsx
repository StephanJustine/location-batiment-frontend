// src/contexts/LocataireContext.tsx
'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { Locataire, LocataireDetail } from '@/types/models';
import { locataireService } from '@/services/locataireService';

interface LocataireContextType {
  selectedLocataire: LocataireDetail | null;
  loading: boolean;
  error: string | null;
  selectLocataire: (id: number) => Promise<void>;
  clearSelection: () => void;
  refreshSelected: () => Promise<void>;
}

const LocataireContext = createContext<LocataireContextType | undefined>(undefined);

export function LocataireProvider({ children }: { children: React.ReactNode }) {
  const [selectedLocataire, setSelectedLocataire] = useState<LocataireDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const selectLocataire = useCallback(async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      setSelectedId(id);
      const data = await locataireService.getLocataireById(id);
      setSelectedLocataire(data);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Erreur lors du chargement');
      setSelectedLocataire(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedLocataire(null);
    setSelectedId(null);
    setError(null);
  }, []);

  const refreshSelected = useCallback(async () => {
    if (selectedId) {
      await selectLocataire(selectedId);
    }
  }, [selectedId, selectLocataire]);

  return (
    <LocataireContext.Provider
      value={{
        selectedLocataire,
        loading,
        error,
        selectLocataire,
        clearSelection,
        refreshSelected
      }}
    >
      {children}
    </LocataireContext.Provider>
  );
}

export function useLocataireContext() {
  const context = useContext(LocataireContext);
  if (context === undefined) {
    throw new Error('useLocataireContext must be used within a LocataireProvider');
  }
  return context;
}