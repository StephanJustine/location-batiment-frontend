// src/services/bailService.ts
import api from '@/lib/axios';
import { Bail, BailCreate, Avenant } from '@/types/models';

export const bailService = {
  getAll: async (params?: any) => (await api.get<Bail[]>('/baux/', { params })).data,
  getById: async (id: number) => (await api.get<Bail>(`/baux/${id}`)).data,
  create: async (data: BailCreate) => (await api.post<Bail>('/baux/', data)).data,
  update: async (id: number, data: Partial<BailCreate>) => (await api.put<Bail>(`/baux/${id}`, data)).data,
  signer: async (id: number) => (await api.post(`/baux/${id}/signer`)).data,
  activer: async (id: number) => (await api.post(`/baux/${id}/activer`)).data,
  resilier: async (id: number, data: any) => (await api.post(`/baux/${id}/resilier`, data)).data,
  renouveler: async (id: number, data: any) => (await api.post(`/baux/${id}/renouveler`, data)).data,
  terminer: async (id: number) => (await api.post(`/baux/${id}/terminer`)).data,
  getAvenants: async (bailId: number) => (await api.get<Avenant[]>(`/baux/${bailId}/avenants`)).data,
  addAvenant: async (data: any) => (await api.post<Avenant>('/baux/avenants', data)).data,
  getNotifications: async (bailId: number) => (await api.get(`/baux/${bailId}/notifications`)).data,
};