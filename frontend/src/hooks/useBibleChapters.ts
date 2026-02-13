'use client';

import { useApiQuery } from './useApiQuery';
import agent from '@/app/api/agent';
import { UseQueryOptions } from '@tanstack/react-query';

type BibleChaptersQueryOptions = Omit<UseQueryOptions<any, unknown, any, any>, 'queryKey' | 'queryFn'>;

export function useBibleChapters(bookSlug: string, options?: BibleChaptersQueryOptions) {
  return useApiQuery(
    ['bibleChapters', bookSlug],
    async () => {
      const result = await agent.Bible.listBibleChapters({ BookSlug: bookSlug });
      return result || [];
    },
    { enabled: !!bookSlug, staleTime: 1000 * 60 * 5, refetchOnWindowFocus: true, ...options }
  );
}
