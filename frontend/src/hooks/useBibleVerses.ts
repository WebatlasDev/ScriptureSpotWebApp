'use client';

import { UseQueryOptions } from '@tanstack/react-query';
import agent from '@/app/api/agent';
import { useApiQuery } from './useApiQuery';

type BibleVersesQueryOptions = Omit<UseQueryOptions<any, unknown, any, any>, 'queryKey' | 'queryFn'>;

export function useBibleVerses(
  bookSlug: string,
  chapterNumber: number,
  options?: BibleVersesQueryOptions,
) {
  return useApiQuery(
    ['bibleVerses', bookSlug, chapterNumber],
    async () => {
      const result = await agent.Bible.listBibleVerses({ BookSlug: bookSlug, ChapterNumber: chapterNumber });
      return result || [];
    },
    {
      enabled: !!bookSlug && !!chapterNumber,
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: true,
      ...options,
    }
  );
}
