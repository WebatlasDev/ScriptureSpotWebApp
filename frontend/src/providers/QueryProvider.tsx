'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

export function QueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
      },
      mutations: {
        onError: (err: unknown) => {
          const message = err instanceof Error ? err.message : 'An unexpected error occurred';
          toast.error(message);
        },
      },
    },
  }));

  useEffect(() => {
    const unsubscribe = queryClient.getQueryCache().subscribe(event => {
      if (event.type === 'updated' && event.query.state.status === 'error') {
        const err = event.query.state.error;
        const message = err instanceof Error ? err.message : 'An unexpected error occurred';
        toast.error(message);
      }
    });
    return unsubscribe;
  }, [queryClient]);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}