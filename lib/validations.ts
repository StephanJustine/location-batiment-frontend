// src/lib/validations.ts
import * as z from 'zod';

export const locataireValidationSchema = z.object({
  nom: z.string()
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .max(100, 'Le nom ne doit pas dépasser 100 caractères')
    .regex(/^[a-zA-ZÀ-ÿ\s-]+$/, 'Le nom ne doit contenir que des lettres'),
  
  prenom: z.string()
    .min(2, 'Le prénom doit contenir au moins 2 caractères')
    .max(100, 'Le prénom ne doit pas dépasser 100 caractères')
    .regex(/^[a-zA-ZÀ-ÿ\s-]+$/, 'Le prénom ne doit contenir que des lettres'),
  
  date_naissance: z.string()
    .optional()
    .refine((date) => {
      if (!date) return true;
      const birthDate = new Date(date);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      return age >= 18 && age <= 120;
    }, 'Le locataire doit avoir entre 18 et 120 ans'),
  
  lieu_naissance: z.string()
    .max(100, 'Le lieu de naissance ne doit pas dépasser 100 caractères')
    .optional(),
  
  nationalite: z.enum(['MALAGASY', 'FRANCAISE', 'COMORIENNE', 'AUTRE'])
    .default('MALAGASY'),
  
  cin: z.string()
    .optional()
    .refine((cin) => {
      if (!cin) return true;
      return /^\d{12}$/.test(cin);
    }, 'Le CIN doit contenir exactement 12 chiffres'),
  
  passeport: z.string()
    .optional()
    .refine((passport) => {
      if (!passport) return true;
      return /^[A-Z0-9]{5,20}$/.test(passport);
    }, 'Format de passeport invalide'),
  
  email: z.string()
    .email('Email invalide')
    .optional()
    .or(z.literal('')),
  
  telephone: z.string()
    .min(8, 'Le numéro doit contenir au moins 8 caractères')
    .max(20, 'Le numéro ne doit pas dépasser 20 caractères')
    .regex(/^[\+]?[0-9\s-]+$/, 'Format de téléphone invalide'),
  
  telephone_secondaire: z.string()
    .optional()
    .or(z.literal('')),
  
  adresse: z.string()
    .max(500, 'L\'adresse ne doit pas dépasser 500 caractères')
    .optional(),
  
  profession: z.string()
    .max(100, 'La profession ne doit pas dépasser 100 caractères')
    .optional(),
  
  employeur: z.string()
    .max(200, 'L\'employeur ne doit pas dépasser 200 caractères')
    .optional(),
  
  revenu_mensuel: z.number()
    .min(0, 'Le revenu ne peut pas être négatif')
    .max(999999999, 'Revenu trop élevé')
    .optional(),
  
  situation_matrimoniale: z.enum(['celibataire', 'marie', 'divorce', 'veuf'])
    .optional(),
  
  nombre_enfants: z.number()
    .int('Doit être un nombre entier')
    .min(0, 'Ne peut pas être négatif')
    .max(20, 'Maximum 20 enfants')
    .default(0),
  
  notes: z.string()
    .max(2000, 'Les notes ne doivent pas dépasser 2000 caractères')
    .optional()
});

export const garantValidationSchema = z.object({
  nom: z.string()
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .max(100, 'Le nom ne doit pas dépasser 100 caractères'),
  
  prenom: z.string()
    .min(2, 'Le prénom doit contenir au moins 2 caractères')
    .max(100, 'Le prénom ne doit pas dépasser 100 caractères'),
  
  telephone: z.string()
    .min(8, 'Le numéro doit contenir au moins 8 caractères')
    .max(20, 'Le numéro ne doit pas dépasser 20 caractères'),
  
  email: z.string()
    .email('Email invalide')
    .optional()
    .or(z.literal('')),
  
  adresse: z.string()
    .optional(),
  
  profession: z.string()
    .optional(),
  
  revenu_mensuel: z.number()
    .min(0, 'Le revenu ne peut pas être négatif')
    .optional(),
  
  piece_identite: z.object({
    type: z.string(),
    numero: z.string(),
    fichier: z.string().optional()
  }).optional()
});

export const locataireUpdateSchema = locataireValidationSchema.partial().extend({
  statut: z.enum(['actif', 'archive', 'blacklist']).optional(),
  is_active: z.boolean().optional()
});

export type LocataireFormValues = z.infer<typeof locataireValidationSchema>;
export type GarantFormValues = z.infer<typeof garantValidationSchema>;
export type LocataireUpdateValues = z.infer<typeof locataireUpdateSchema>;