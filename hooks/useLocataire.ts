// src/hooks/useLocataire.ts
'use client';

import { useState, useEffect, useCallback } from 'react';
import { locataireService } from '@/services/locataireService';
import { Locataire, LocataireDetail, Garant } from '@/types/models';

interface UseLocataireReturn {
  locataires: Locataire[];
  loading: boolean;
  error: string | null;
  totalPages: number;
  currentPage: number;
  loadLocataires: (page?: number) => Promise<void>;
  deleteLocataire: (id: number) => Promise<void>;
  blacklistLocataire: (id: number, motif: string) => Promise<void>;
  activateLocataire: (id: number) => Promise<void>;
}

export function useLocataires(filters?: {
  search?: string;
  statut?: string;
  is_active?: boolean;
}) {
  const [locataires, setLocataires] = useState<Locataire[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  const loadLocataires = useCallback(async (page: number = 1) => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await locataireService.getLocataires({
        skip: (page - 1) * 12,
        limit: 12,
        ...filters
      });
      
      setLocataires(data);
      setCurrentPage(page);
      // Note: Le backend devrait retourner le total pour la pagination
      setTotalPages(Math.ceil(data.length / 12) || 1);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Erreur lors du chargement des locataires');
      setLocataires([]);
    } finally {
      setLoading(false);
    }
  }, [filters?.search, filters?.statut, filters?.is_active]);

  const deleteLocataire = async (id: number) => {
    try {
      await locataireService.deleteLocataire(id);
      await loadLocataires(currentPage);
      return true;
    } catch (err: any) {
      throw new Error(err.response?.data?.detail || 'Erreur lors de la suppression');
    }
  };

  const blacklistLocataire = async (id: number, motif: string) => {
    try {
      await locataireService.blacklistLocataire(id, motif);
      await loadLocataires(currentPage);
      return true;
    } catch (err: any) {
      throw new Error(err.response?.data?.detail || 'Erreur lors du blacklistage');
    }
  };

  const activateLocataire = async (id: number) => {
    try {
      await locataireService.activateLocataire(id);
      await loadLocataires(currentPage);
      return true;
    } catch (err: any) {
      throw new Error(err.response?.data?.detail || 'Erreur lors de l\'activation');
    }
  };

  useEffect(() => {
    loadLocataires(1);
  }, [loadLocataires]);

  return {
    locataires,
    loading,
    error,
    totalPages,
    currentPage,
    loadLocataires,
    deleteLocataire,
    blacklistLocataire,
    activateLocataire
  };
}

export function useLocataireDetail(id: number) {
  const [locataire, setLocataire] = useState<LocataireDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadLocataire = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await locataireService.getLocataireById(id);
      setLocataire(data);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Erreur lors du chargement du locataire');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) loadLocataire();
  }, [id, loadLocataire]);

  return {
    locataire,
    loading,
    error,
    reload: loadLocataire
  };
}