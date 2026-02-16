import agent from '@/app/api/agent';
import { useApiQuery } from './useApiQuery';

interface VerseInterlinearData {
  verseNumber: number;
  words: any[];
  language: 'GREEK' | 'HEBREW';
}

export function useExplorationInterlinearChapter(bookSlug: string, chapterNumber: number) {
  return useApiQuery<VerseInterlinearData[]>(
    ['explorationInterlinearChapter', bookSlug, chapterNumber],
    async () => {
      // Use optimized chapter endpoint that fetches all verses at once
      const chapterData = await agent.Exploration.getInterlinearChapter({
        BookSlug: bookSlug,
        ChapterNumber: chapterNumber
      });
      
      return chapterData || [];
    },
    { 
      enabled: !!bookSlug && !!chapterNumber, 
      staleTime: 1000 * 60 * 10, // 10 minutes - longer cache for chapter data
      refetchOnWindowFocus: false // Don't refetch on focus since this is a lot of data
    }
  );
}