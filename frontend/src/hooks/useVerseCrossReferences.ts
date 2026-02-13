import agent from "@/app/api/agent";
import { useApiQuery } from "./useApiQuery";

export function useVerseCrossReferences(bookSlug: string, chapterNumber: number, verseNumber: number, version: string) {
    return useApiQuery(
      ['verseCrossReferences', bookSlug, chapterNumber, verseNumber, version],
      async () => {
        const result = await agent.Bible.listBibleVerseCrossReferences({ BookSlug: bookSlug, ChapterNumber: chapterNumber, VerseNumber: verseNumber, Version: version });
        return result || [];
      },
      { enabled: !!bookSlug && !!chapterNumber && !!verseNumber && !!version, staleTime: 1000 * 60 * 5, refetchOnWindowFocus: true }
  );
}