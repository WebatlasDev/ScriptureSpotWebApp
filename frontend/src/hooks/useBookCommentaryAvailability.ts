import agent from "@/app/api/agent";
import { useApiQuery } from './useApiQuery';

export function useBookCommentaryAvailability(authorSlug: string, bookSlugs: string[]) {
    return useApiQuery(
      ['bookCommentaryAvailability', authorSlug, bookSlugs],
      async () => {
        const result = await agent.Authors.listCommentariesAvailability({AuthorSlug : authorSlug, BookSlugs: [...bookSlugs]})
        return result;
      },
      { enabled: !!authorSlug && bookSlugs.length > 0, staleTime: 1000 * 60 * 60 * 24, refetchOnWindowFocus: false }
    );
}