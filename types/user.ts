// types/user.ts
export enum UserRole {
  ADMIN = 'admin',  // ✅ minuscule
  GESTIONNAIRE = 'gestionnaire',  // ✅ minuscule
  LOCATAIRE = 'locataire',  // ✅ minuscule
  SUPERVISEUR = 'superviseur'  // ✅ minuscule
}

export enum UserStatus {
  ACTIF = 'actif',
  INACTIF = 'inactif',
  SUSPENDU = 'suspendu'
}

export interface User {
  id: number;
  email: string;
  username: string;
  nom: string;
  prenom: string;
  telephone?: string;
  photo_url?: string;
  role: UserRole;  // ✅ 'admin' | 'gestionnaire' | 'locataire' | 'superviseur'
  status: UserStatus;
  is_active: boolean;
  is_default?: boolean;
  last_login?: string;
  created_at: string;
  updated_at?: string;
}

export interface UserCreate {
  email: string;
  username: string;
  nom: string;
  prenom: string;
  telephone?: string;
  password: string;
  role?: UserRole;  // ✅ 'admin' | 'gestionnaire' | 'locataire' | 'superviseur'
}

export interface UserUpdate {
  email?: string;
  nom?: string;
  prenom?: string;
  telephone?: string;
  role?: UserRole;
  status?: UserStatus;
  is_active?: boolean;
}