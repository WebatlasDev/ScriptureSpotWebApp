/**
 * Authentication utilities
 * Clerk integration for user authentication and authorization
 */

import { auth, currentUser } from '@clerk/nextjs/server';

export { auth, currentUser };

/**
 * Check if user has admin role
 */
export async function isAdmin(): Promise<boolean> {
  const { sessionClaims } = auth();
  const adminRole = process.env.ADMIN_ROLE || 'super-admin';
  
  if (!sessionClaims) return false;
  
  const roles = (sessionClaims.metadata as any)?.roles || [];
  return roles.includes(adminRole);
}

/**
 * Require admin role or throw error
 */
export async function requireAdmin(): Promise<void> {
  const admin = await isAdmin();
  if (!admin) {
    throw new Error('Unauthorized: Admin access required');
  }
}
