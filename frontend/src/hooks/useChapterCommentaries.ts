import agent from '@/app/api/agent';
import { env } from '@/types/env';
import { useApiQuery } from './useApiQuery';
import { UseQueryOptions } from '@tanstack/react-query';
import { extractPaginatedItems } from '@/utils/pagination';

type ChapterCommentariesQueryOptions = Omit<UseQueryOptions<any, unknown, any, any>, 'queryKey' | 'queryFn'>;

export function useChapterCommentaries(
  authorSlug: string,
  bookSlug: string,
  chapterNumber: number,
  version: string,
  options?: ChapterCommentariesQueryOptions
) {
  const requestType = 'Combined';
  const resolvedVersion = (version || env.defaultVersion).toUpperCase();

  return useApiQuery(
    ['authorCommentariesByChapter', authorSlug, bookSlug, chapterNumber, requestType, resolvedVersion],
    async () => {
      const result = await agent.Authors.listCommentariesByChapter({
        AuthorSlug: authorSlug,
        BookSlug: bookSlug,
        ChapterNumber: chapterNumber,
        RequestType: requestType,
        VersionName: resolvedVersion,
      });

      const normalizedResult = extractPaginatedItems<any[]>(result);
      return Array.isArray(normalizedResult) ? normalizedResult : [];
    },
    {
      enabled: Boolean(authorSlug && bookSlug && chapterNumber && requestType && resolvedVersion),
      staleTime: 1000 * 60 * 60 * 24,
      refetchOnWindowFocus: false,
      ...options,
    }
  );
}
