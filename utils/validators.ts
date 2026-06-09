// src/utils/validators.ts
export const validateCIN = (cin: string): boolean => {
  // Format CIN Madagascar: 12 chiffres
  const cinRegex = /^\d{12}$/;
  return cinRegex.test(cin);
};

export const validatePhone = (phone: string): boolean => {
  // Format téléphone Madagascar
  const phoneRegex = /^(\+261|0)[234]\d{8}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};