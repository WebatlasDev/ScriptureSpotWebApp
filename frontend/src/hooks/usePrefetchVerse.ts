'use client';

import { useQueryClient } from '@tanstack/react-query';
import agent from '@/app/api/agent';

export function usePrefetchVerse() {
  const queryClient = useQueryClient();

  const prefetchVerseData = async (
    bookSlug: string, 
    chapterNumber: number, 
    verseNumber: number, 
    version: string
  ) => {
    // Prefetch verse content
    await queryClient.prefetchQuery({
      queryKey: ['bibleVerseVersion', bookSlug, chapterNumber, verseNumber, version],
      queryFn: async () => {
        const result = await agent.Bible.getBibleVerseVersion({ 
          BookSlug: bookSlug, 
          ChapterNumber: chapterNumber, 
          VerseNumber: verseNumber, 
          VersionName: version 
        });
        return result || [];
      },
      staleTime: 1000 * 60 * 10, // 10 minutes
    });

    // Prefetch verse takeaways
    await queryClient.prefetchQuery({
      queryKey: ['bibleVerseTakeaways', bookSlug, chapterNumber, verseNumber],
      queryFn: async () => {
        const result = await agent.Bible.getBibleVerseTakeaways({ 
          BookSlug: bookSlug, 
          ChapterNumber: chapterNumber, 
          VerseNumber: verseNumber
        });
        return result || [];
      },
      staleTime: 1000 * 60 * 10, // 10 minutes
    });

    // Prefetch book overview (if not already cached)
    await queryClient.prefetchQuery({
      queryKey: ['bibleBookOverview', bookSlug],
      queryFn: async () => {
        const result = await agent.Bible.getBibleBookOverview({ slug: bookSlug });
        return result || null;
      },
      staleTime: Infinity, // Book overviews don't change
    });
  };

  const prefetchAdjacentVerses = async (
    bookSlug: string,
    chapterNumber: number,
    verseNumber: number,
    version: string,
    maxVerses: number,
    maxChapters: number
  ) => {
    const promises: Promise<void>[] = [];

    // Prefetch previous verse
    if (verseNumber > 1) {
      promises.push(prefetchVerseData(bookSlug, chapterNumber, verseNumber - 1, version));
    } else if (chapterNumber > 1) {
      // Need to fetch the last verse of the previous chapter
      // We'll import our static data to know the verse count
      const { getVerseCount } = await import('@/data/bibleStructure');
      const lastVerseOfPrevChapter = getVerseCount(bookSlug, chapterNumber - 1);
      if (lastVerseOfPrevChapter > 0) {
        promises.push(prefetchVerseData(bookSlug, chapterNumber - 1, lastVerseOfPrevChapter, version));
      }
    }

    // Prefetch next verse
    if (verseNumber < maxVerses) {
      promises.push(prefetchVerseData(bookSlug, chapterNumber, verseNumber + 1, version));
    } else if (chapterNumber < maxChapters) {
      // First verse of next chapter
      promises.push(prefetchVerseData(bookSlug, chapterNumber + 1, 1, version));
    }

    await Promise.all(promises);
  };

  const prefetchPickerSelection = async (
    bookSlug: string,
    chapterNumber: number,
    verseNumber: number,
    version: string
  ) => {
    // Lighter prefetch for picker hover/selection
    // Only prefetch the verse content, not takeaways
    await queryClient.prefetchQuery({
      queryKey: ['bibleVerseVersion', bookSlug, chapterNumber, verseNumber, version],
      queryFn: async () => {
        const result = await agent.Bible.getBibleVerseVersion({ 
          BookSlug: bookSlug, 
          ChapterNumber: chapterNumber, 
          VerseNumber: verseNumber, 
          VersionName: version 
        });
        return result || [];
      },
      staleTime: 1000 * 60 * 5, // 5 minutes for picker selections
    });
  };

  const prefetchCrossReferences = async (
    bookSlug: string,
    chapterNumber: number,
    verseNumber: number,
    version: string
  ) => {
    // Prefetch cross references data
    await queryClient.prefetchQuery({
      queryKey: ['verseCrossReferences', bookSlug, chapterNumber, verseNumber, version],
      queryFn: async () => {
        const result = await agent.Bible.listBibleVerseCrossReferences({ 
          BookSlug: bookSlug, 
          ChapterNumber: chapterNumber, 
          VerseNumber: verseNumber, 
          Version: version 
        });
        return result || [];
      },
      staleTime: 1000 * 60 * 10, // 10 minutes
    });
  };

  const prefetchInterlinear = async (
    bookSlug: string,
    chapterNumber: number,
    verseNumber: number
  ) => {
    // Prefetch interlinear verse data
    await queryClient.prefetchQuery({
      queryKey: ['explorationInterlinearVerse', bookSlug, chapterNumber, verseNumber],
      queryFn: async () => {
        try {
          const result = await agent.Exploration.getInterlinearVerse({
            BookSlug: bookSlug,
            ChapterNumber: chapterNumber,
            VerseNumber: verseNumber
          });
          return result || [];
        } catch {
          return [];
        }
      },
      staleTime: 1000 * 60 * 10, // 10 minutes
    });
  };

  const prefetchLexiconEntry = async (strongsNumber: string) => {
    // Prefetch specific lexicon entry
    await queryClient.prefetchQuery({
      queryKey: ['explorationLexiconEntry', strongsNumber],
      queryFn: async () => {
        const result = await agent.Exploration.getLexiconEntry({ StrongsNumber: strongsNumber });
        return result || null;
      },
      staleTime: Infinity, // Lexicon entries don't change
    });
  };

  return {
    prefetchVerseData,
    prefetchAdjacentVerses,
    prefetchPickerSelection,
    prefetchCrossReferences,
    prefetchInterlinear,
    prefetchLexiconEntry
  };
}