import { useAuth, useUser } from '@clerk/nextjs';

export function usePremium(): boolean {
  const { has } = useAuth();
  const { user } = useUser();

  const hasPlan = typeof has === 'function' ? has({ plan: 'premium' }) : false;
  const subscribed = Boolean((user as any)?.subscribed);

  return hasPlan || subscribed;
}
