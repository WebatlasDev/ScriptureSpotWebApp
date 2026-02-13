/**
 * Clerk Configuration
 * Centralized Clerk settings for the backend API
 */

export const clerkConfig = {
  // Custom domain configuration (production)
  authority: process.env.CLERK_ISSUER || process.env.CLERK_FRONTEND_API 
    ? `https://${process.env.CLERK_FRONTEND_API}` 
    : undefined,
  
  // Audience validation
  audience: process.env.CLERK_AUDIENCE,
  
  // Frontend API domain
  frontendApi: process.env.CLERK_FRONTEND_API,
  
  // Admin role name
  adminRole: process.env.ADMIN_ROLE || 'super-admin',
  
  // API Base URL
  apiBaseUrl: 'https://api.clerk.com/v1/',
};

/**
 * Check if Clerk is configured with custom domain
 */
export function hasCustomClerkDomain(): boolean {
  return !!(process.env.CLERK_FRONTEND_API || process.env.CLERK_ISSUER);
}

/**
 * Get the Clerk authority URL
 */
export function getClerkAuthority(): string {
  if (process.env.CLERK_ISSUER) {
    return process.env.CLERK_ISSUER;
  }
  
  if (process.env.CLERK_FRONTEND_API) {
    return `https://${process.env.CLERK_FRONTEND_API}`;
  }
  
  // Default to standard Clerk domain
  return 'https://clerk.com';
}

/**
 * Validate Clerk configuration
 */
export function validateClerkConfig(): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!process.env.CLERK_SECRET_KEY) {
    errors.push('CLERK_SECRET_KEY is not set');
  }
  
  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
    errors.push('NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is not set');
  }
  
  // Warn if using test keys in production
  if (process.env.NODE_ENV === 'production') {
    if (process.env.CLERK_SECRET_KEY?.startsWith('sk_test_')) {
      errors.push('WARNING: Using test Clerk secret key in production');
    }
    if (process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.startsWith('pk_test_')) {
      errors.push('WARNING: Using test Clerk publishable key in production');
    }
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}
