import agent from '@/app/api/agent';
import { useApiQuery } from './useApiQuery';

export function useChapterCommentaryAvailability(
  authorSlug: string,
  bookSlug: string,
  chapterNumbers: number[]
) {
  const hasChapters = chapterNumbers.length > 0;

  return useApiQuery(
    ['chapterCommentaryAvailability', authorSlug, bookSlug, chapterNumbers],
    async () => {
      const result = await agent.Authors.listCommentariesChapterAvailability({
        AuthorSlug: authorSlug,
        BookSlug: bookSlug,
        ChapterNumbers: [...chapterNumbers],
      });
      return result;
    },
    {
      enabled: !!authorSlug && !!bookSlug && hasChapters,
      staleTime: 1000 * 60 * 60 * 24,
      refetchOnWindowFocus: false,
      retry: 1,
    }
  );
}
