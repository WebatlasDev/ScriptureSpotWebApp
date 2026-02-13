'use client';

import { useApiQuery } from './useApiQuery';
import agent from '@/app/api/agent';
import { UseQueryOptions } from '@tanstack/react-query';

type VerseVersionQueryOptions = Omit<UseQueryOptions<any, unknown, any, any>, 'queryKey' | 'queryFn'>;

export function useBibleVerseVersion(
  bookSlug: string,
  chapterNumber: number,
  verseNumber: number,
  versionShortName: string,
  options?: VerseVersionQueryOptions,
) {
  return useApiQuery(
    ['bibleVerseVersion', bookSlug, chapterNumber, verseNumber, versionShortName],
    async () => {
      const result = await agent.Bible.getBibleVerseVersion({ BookSlug: bookSlug, ChapterNumber: chapterNumber, VerseNumber: verseNumber, VersionName: versionShortName });
      return result || null;
    },
    {
      enabled: !!bookSlug && !!chapterNumber && !!verseNumber && !!versionShortName,
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: true,
      ...options,
    }
  );
}
