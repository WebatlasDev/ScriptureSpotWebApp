import { useExplorationLexiconVerseReferencesPaginated } from './useExplorationLexiconVerseReferencesPaginated';
import { bookNameToSlug } from '@/utils/stringHelpers';
import { useMemo, useState, useEffect } from 'react';
import agent from '@/app/api/agent';

interface VerseReference {
  book: string;
  chapter: number;
  verse: number;
  text: string;
  reference: string;
}

interface EnhancedVerseReference extends VerseReference {
  bookSlug: string;
  verseContent?: string;
}

export function useStrongsVerseReferences(
  strongsKey: string, 
  version: string,
  pageSize: number = 10
) {
  const { 
    references: verseReferences, 
    isLoading: referencesLoading, 
    hasMore, 
    loadMore, 
    totalCount 
  } = useExplorationLexiconVerseReferencesPaginated(strongsKey, version, pageSize);
  
  const [verseContents, setVerseContents] = useState<Record<string, string>>({});
  
  // Fetch verse content for references (cleaner implementation)
  useEffect(() => {
    const fetchVerseContents = async () => {
      const newContents: Record<string, string> = {};
      
      // Only fetch for references we don't have yet
      const referencesToFetch = verseReferences.filter(ref => {
        const bookSlug = bookNameToSlug(ref.book);
        const cacheKey = `${bookSlug}-${ref.chapter}-${ref.verse}`;
        return !verseContents[cacheKey];
      });
      
      if (referencesToFetch.length === 0) return;
      
      // Batch fetch all verses
      const fetchPromises = referencesToFetch.map(async (ref) => {
        const bookSlug = bookNameToSlug(ref.book);
        const cacheKey = `${bookSlug}-${ref.chapter}-${ref.verse}`;
        
        try {
          const result = await agent.Bible.getBibleVerseVersion({
            BookSlug: bookSlug,
            ChapterNumber: ref.chapter,
            VerseNumber: ref.verse,
            VersionName: version
          });
          
          newContents[cacheKey] = result?.content || '';
        } catch {
          newContents[cacheKey] = '';
        }
      });
      
      await Promise.all(fetchPromises);
      
      // Update state with new contents
      if (Object.keys(newContents).length > 0) {
        setVerseContents(prev => ({ ...prev, ...newContents }));
      }
    };
    
    if (verseReferences.length > 0) {
      fetchVerseContents();
    }
  }, [verseReferences, version, verseContents]);
  
  // Create enhanced references
  const enhancedReferences = useMemo(() => {
    return verseReferences.map(ref => {
      const bookSlug = bookNameToSlug(ref.book);
      const cacheKey = `${bookSlug}-${ref.chapter}-${ref.verse}`;
      
      return {
        ...ref,
        bookSlug,
        verseContent: verseContents[cacheKey] || undefined
      };
    });
  }, [verseReferences, verseContents]);
  
  return {
    enhancedReferences,
    referencesLoading,
    totalCount,
    hasMore,
    loadMore
  };
}