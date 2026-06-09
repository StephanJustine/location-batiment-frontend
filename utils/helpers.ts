// src/utils/helpers.ts
import { format, formatDistance, parseISO, isValid } from 'date-fns';
import { fr } from 'date-fns/locale';

export const formatDateComplete = (date: string | Date): string => {
  const d = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(d)) return 'Date invalide';
  return format(d, 'dd MMMM yyyy', { locale: fr });
};

export const formatDateRelative = (date: string | Date): string => {
  const d = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(d)) return 'Date invalide';
  return formatDistance(d, new Date(), { addSuffix: true, locale: fr });
};

export const getInitials = (prenom: string, nom: string): string => {
  return `${prenom.charAt(0)}${nom.charAt(0)}`.toUpperCase();
};

export const getFullName = (prenom: string, nom: string): string => {
  return `${prenom} ${nom}`.trim();
};

export const truncateText = (text: string, maxLength: number = 50): string => {
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

export const generateColor = (str: string): string => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const colors = [
    '#1976d2', '#388e3c', '#d32f2f', '#7b1fa2',
    '#c2185b', '#00796b', '#f57c00', '#455a64'
  ];
  return colors[Math.abs(hash) % colors.length];
};

export const groupBy = <T>(array: T[], key: keyof T): Record<string, T[]> => {
  return array.reduce((groups, item) => {
    const groupKey = String(item[key]);
    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(item);
    return groups;
  }, {} as Record<string, T[]>);
};

export const sortBy = <T>(array: T[], key: keyof T, order: 'asc' | 'desc' = 'asc'): T[] => {
  return [...array].sort((a, b) => {
    if (a[key] < b[key]) return order === 'asc' ? -1 : 1;
    if (a[key] > b[key]) return order === 'asc' ? 1 : -1;
    return 0;
  });
};

export const filterBySearch = <T>(
  items: T[],
  searchTerm: string,
  keys: (keyof T)[]
): T[] => {
  const term = searchTerm.toLowerCase();
  return items.filter((item) =>
    keys.some((key) => {
      const value = item[key];
      return value && String(value).toLowerCase().includes(term);
    })
  );
};