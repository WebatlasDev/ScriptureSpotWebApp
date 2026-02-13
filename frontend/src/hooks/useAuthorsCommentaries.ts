import agent from "@/app/api/agent";
import { useApiQuery } from './useApiQuery';
import { UseQueryOptions } from '@tanstack/react-query';

type AuthorsCommentariesOptions = Omit<UseQueryOptions<any, unknown, any, any>, 'queryKey' | 'queryFn'>;

export function useAuthorsCommentaries(
  bookSlug: string,
  chapterNumber: number,
  verseNumber: number,
  requestType: string,
  previewCount?: number,
  options?: AuthorsCommentariesOptions,
) {
  return useApiQuery(
    ['authorCommentaries', bookSlug, chapterNumber, verseNumber, previewCount],
    async () => {
      const result = await agent.Authors.listCommentariesByVerse({
        BookSlug: bookSlug,
        ChapterNumber: chapterNumber,
        VerseNumber: verseNumber,
        RequestType: requestType,
        PreviewCount: previewCount || 150
      });
      return result || [];
    },
    {
      enabled: !!bookSlug && !!chapterNumber && !!verseNumber && !!requestType,
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: true,
      ...options,
    }
  );
}
