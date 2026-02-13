import agent from "@/app/api/agent";
import { useApiQuery } from "./useApiQuery";
import { useState, useCallback, useEffect } from "react";

interface VerseReference {
  book: string;
  chapter: number;
  verse: number;
  text: string;
  reference: string;
}

interface PaginatedVerseReferencesResult {
  references: VerseReference[];
  isLoading: boolean;
  hasMore: boolean;
  loadMore: () => void;
  totalCount: number;
}

export function useExplorationLexiconVerseReferencesPaginated(
  strongsKey: string, 
  version: string,
  pageSize: number = 10
): PaginatedVerseReferencesResult {
  const [visibleCount, setVisibleCount] = useState(pageSize);
  
  // Get ALL verse references (cached)
  const { data: allVerseReferences, isLoading } = useApiQuery(
    ['explorationLexiconVerseReferences', strongsKey, version],
    async () => {
      const result = await agent.Exploration.getLexiconVerseReference({ 
        StrongsKey: strongsKey, 
        Version: version 
      });
      return result || [];
    },
    { 
      enabled: !!strongsKey && !!version, 
      staleTime: 1000 * 60 * 5, 
      refetchOnWindowFocus: false 
    }
  );

  // Reset visible count when strongsKey or version changes
  useEffect(() => {
    setVisibleCount(pageSize);
  }, [strongsKey, version, pageSize]);

  // Get only the visible references
  const visibleReferences = allVerseReferences?.slice(0, visibleCount) || [];
  const totalCount = allVerseReferences?.length || 0;
  const hasMore = visibleCount < totalCount;

  const loadMore = useCallback(() => {
    if (!hasMore) return;
    setVisibleCount(prev => prev + pageSize);
  }, [hasMore, pageSize]);

  return {
    references: visibleReferences,
    isLoading,
    hasMore,
    loadMore,
    totalCount
  };
}