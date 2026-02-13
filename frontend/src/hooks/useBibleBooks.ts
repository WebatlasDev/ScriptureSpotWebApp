'use client';

import agent from '@/app/api/agent';
import { useApiQuery } from './useApiQuery';
import { UseQueryOptions } from '@tanstack/react-query';

type BibleBooksQueryOptions = Omit<UseQueryOptions<any, unknown, any, any>, 'queryKey' | 'queryFn'>;

export function useBibleBooks(options?: BibleBooksQueryOptions) {
  return useApiQuery(
    ['bibleBooks'],
    async () => {
      const result = await agent.Bible.listBibleBooks({});
      return result;
    },
    { staleTime: 1000 * 60 * 5, refetchOnWindowFocus: true, ...options }
  );
}
