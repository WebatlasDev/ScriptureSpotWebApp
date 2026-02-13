'use client';

import agent from '@/app/api/agent';
import { useApiQuery } from './useApiQuery';
import { UseQueryOptions } from '@tanstack/react-query';

export function useAuthorsAuthors(
  options?: Omit<UseQueryOptions<any, unknown, any, any>, 'queryKey' | 'queryFn'>
) {
  return useApiQuery(
    ['authors'],
    async () => {
      const result = await agent.Authors.listAuthors({});
      return result;
    },
    { staleTime: 1000 * 60 * 5, refetchOnWindowFocus: true, ...options }
  );
}
