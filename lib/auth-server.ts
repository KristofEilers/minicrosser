import { betterAuth } from "better-auth";

// User roles for B2B system
export const USER_ROLES = {
  ADMIN: 'admin',
  DEALER: 'dealer', 
  SALES: 'sales',
  SUPPORT: 'support'
} as const;

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];

export const auth = betterAuth({
  database: {
    provider: "sqlite",
    url: ":memory:"
  },
  
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  
  socialProviders: {
    // Can add Google, Microsoft, etc. later for B2B SSO
  },
  
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        defaultValue: USER_ROLES.DEALER
      },
      companyName: {
        type: "string",
        required: false
      },
      customerNumber: {
        type: "string",
        required: false
      },
      isActive: {
        type: "boolean",
        required: true,
        defaultValue: true
      }
    }
  },
  
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5 // 5 minutes
    }
  },

  plugins: [
    // Add custom plugins for B2B features
  ]
});

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.User;