'use client';

import { UseQueryOptions } from '@tanstack/react-query';
import { useApiQuery } from './useApiQuery';
import agent from '@/app/api/agent';

type BibleVerseRangeQueryOptions = Omit<UseQueryOptions<any, unknown, any, any>, 'queryKey' | 'queryFn'>;

export function useBibleVerseRange(
  bookSlug: string,
  chapterNumber: number,
  verseRange: string,
  versionShortName: string,
  options?: BibleVerseRangeQueryOptions,
) {
  return useApiQuery(
    ['bibleVerseRange', bookSlug, chapterNumber, verseRange, versionShortName],
    async () => {
      const result = await agent.Bible.listBibleVerseRange({
        BookSlug: bookSlug,
        ChapterNumber: chapterNumber,
        VerseRange: verseRange,
        VersionName: versionShortName,
      });
      return result || [];
    },
    {
      enabled: !!bookSlug && !!chapterNumber && !!verseRange && !!versionShortName,
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: true,
      ...options,
    }
  );
}

// Helper function to extract verse range from commentary slug
export function extractVerseRangeFromSlug(slug: string): string | null {
  // Expected slug format: /commentators/author-slug/commentaries/book-slug/chapter/verse-range
  const parts = slug.split('/');
  if (parts.length >= 7) {
    return parts[6]; // verse-range part
  }
  return null;
}

// Helper function to extract book and chapter from commentary slug
export function extractBookChapterFromSlug(slug: string): { bookSlug: string; chapter: number } | null {
  const parts = slug.split('/');
  if (parts.length >= 6) {
    return {
      bookSlug: parts[4],
      chapter: Number(parts[5])
    };
  }
  return null;
}
