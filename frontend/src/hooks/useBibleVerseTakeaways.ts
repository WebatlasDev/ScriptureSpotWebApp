'use client';

import agent from '@/app/api/agent';
import { useApiQuery } from './useApiQuery';
import { UseQueryOptions } from '@tanstack/react-query';

type VerseTakeawaysQueryOptions = Omit<UseQueryOptions<any, unknown, any, any>, 'queryKey' | 'queryFn'>;

export function useBibleVerseTakeaways(
  bookSlug: string,
  chapterNumber: number,
  verseNumber: number,
  options?: VerseTakeawaysQueryOptions,
) {
  return useApiQuery(
    ['bibleVerseTakeaways', bookSlug, chapterNumber, verseNumber],
    async () => {
      const result = await agent.Bible.getBibleVerseTakeaways({ 
        BookSlug: bookSlug, 
        ChapterNumber: chapterNumber, 
        VerseNumber: verseNumber
      });
      return result || [];
    },
    {
      enabled: !!bookSlug && !!chapterNumber && !!verseNumber,
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: true,
      ...options,
    }
  );
}
