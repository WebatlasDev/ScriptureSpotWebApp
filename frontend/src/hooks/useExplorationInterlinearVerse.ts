import agent from '@/app/api/agent';
import { useApiQuery } from './useApiQuery';

export function useExplorationInterlinearVerse(bookSlug: string, chapterNumber: number, verseNumber: number) {
  return useApiQuery(
    ['explorationInterlinearVerse', bookSlug, chapterNumber, verseNumber],
    async () => {
      try {
        const result = await agent.Exploration.getInterlinearVerse({
          BookSlug: bookSlug,
          ChapterNumber: chapterNumber,
          VerseNumber: verseNumber,
        });
        return result || [];
      } catch (error) {
        // Surface a friendly error message so the UI can inform the user instead of crashing the drawer.
        if (error instanceof Error) {
          throw new Error('Interlinear data is currently unavailable. Please try again later.');
        }

        throw error;
      }
    },
    { enabled: !!bookSlug && !!chapterNumber && !!verseNumber, staleTime: 1000 * 60 * 5, refetchOnWindowFocus: true }
  );
}
