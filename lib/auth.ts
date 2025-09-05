// User roles for B2B system
export const USER_ROLES = {
  ADMIN: 'admin',
  DEALER: 'dealer', 
  SALES: 'sales',
  SUPPORT: 'support'
} as const;

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];

// Basic types for client-side usage
export interface User {
  id: string;
  email: string;
  name?: string;
  role: string;
  companyName?: string;
  customerNumber?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Session {
  id: string;
  userId: string;
  user: User;
  expiresAt: Date;
}