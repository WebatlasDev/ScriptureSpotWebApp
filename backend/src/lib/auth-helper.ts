/**
 * Auth Helper
 * Provides auth utilities for retrieving current user information
 */

import { auth } from '@clerk/nextjs/server';

/**
 * Gets the current authenticated user information
 * Returns userId from Clerk auth or null if not authenticated
 */
export async function getAuth(): Promise<{ userId: string | null }> {
  try {
    const { userId } = await auth();
    return { userId };
  } catch (error) {
    console.error('Error getting auth:', error);
    return { userId: null };
  }
}

/**
 * Gets the current userId or throws if not authenticated
 * Use this for protected routes that require authentication
 */
export async function requireAuth(): Promise<string> {
  const { userId } = await getAuth();
  
  if (!userId) {
    throw new Error('Authentication required');
  }
  
  return userId;
}
