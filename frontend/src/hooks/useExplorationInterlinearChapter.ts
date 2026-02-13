import agent from '@/app/api/agent';
import { useApiQuery } from './useApiQuery';

interface VerseInterlinearData {
  verseNumber: number;
  words: any[];
  language: 'GREEK' | 'HEBREW';
}

export function useExplorationInterlinearChapter(bookSlug: string, chapterNumber: number) {
  return useApiQuery(
    ['explorationInterlinearChapter', bookSlug, chapterNumber],
    async () => {
      // First, get all verses for this chapter
      const verses = await agent.Bible.listBibleVerses({ 
        BookSlug: bookSlug, 
        ChapterNumber: chapterNumber 
      });
      
      if (!verses || !Array.isArray(verses)) {
        return [];
      }

      // Fetch interlinear data for each verse
      const chapterData: VerseInterlinearData[] = [];
      
      for (const verse of verses) {
        try {
          const interlinearData = await agent.Exploration.getInterlinearVerse({
            BookSlug: bookSlug,
            ChapterNumber: chapterNumber,
            VerseNumber: verse.verseNumber
          });
          
          if (interlinearData && Array.isArray(interlinearData) && interlinearData.length > 0) {
            // Determine language from first word
            const language = interlinearData[0]?.hebrewWord ? 'HEBREW' : 'GREEK';
            
            chapterData.push({
              verseNumber: verse.verseNumber,
              words: interlinearData,
              language
            });
          }
        } catch {
          // Continue with other verses even if one fails
        }
      }

      return chapterData;
    },
    { 
      enabled: !!bookSlug && !!chapterNumber, 
      staleTime: 1000 * 60 * 10, // 10 minutes - longer cache for chapter data
      refetchOnWindowFocus: false // Don't refetch on focus since this is a lot of data
    }
  );
}