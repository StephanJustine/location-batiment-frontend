// src/utils/formatters.ts
export const formatCurrency = (amount: number, currency: string = 'Ar'): string => {
  return new Intl.NumberFormat('fr-MG', {
    style: 'currency',
    currency: 'MGA',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

export const formatDate = (date: string | Date): string => {
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  }).format(new Date(date));
};

export const formatPhoneNumber = (phone: string): string => {
  // Format: +261 34 12 345 67
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `+261 ${cleaned.slice(1, 3)} ${cleaned.slice(3, 5)} ${cleaned.slice(5, 8)} ${cleaned.slice(8)}`;
  }
  return phone;
};