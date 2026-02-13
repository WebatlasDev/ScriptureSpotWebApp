import { useSearch } from './useSearch';
import { useMemo } from 'react';

interface SearchEntry {
  id: string;
  slug: string;
  reference: string;
  text: string;
  authorName?: string | null;
}

interface SearchGroup {
  type: string;
  entries: SearchEntry[];
}

const CATEGORY_LIMITS = {
  'Author': 10,
  'BibleVerse': 10,
  'Commentary': 10,
  'Takeaway': 10,
  'BibleVerseTakeaway': 10,
};

const TOTAL_LIMIT = 500;

export function useBalancedSearch(query: string) {
  const { data: rawResults, isLoading, error } = useSearch(query, 1, TOTAL_LIMIT);

  const balancedResults = useMemo(() => {
    if (!rawResults || !Array.isArray(rawResults)) {
      return [];
    }

    // Filter out unwanted types
    let filteredResults = rawResults.filter((group: SearchGroup) => 
      group.type !== 'CommentaryExcerpt' && group.type !== 'BibleVerseVersion'
    );


    // Create a map to track how many results we've allocated per category
    const categoryAllocations = new Map<string, number>();
    const distributedResults: SearchGroup[] = [];

    // First pass: Allocate up to the limit for each category
    for (const group of filteredResults) {
      const limit = CATEGORY_LIMITS[group.type as keyof typeof CATEGORY_LIMITS] || 10;
      const currentAllocation = categoryAllocations.get(group.type) || 0;
      
      if (currentAllocation < limit) {
        const availableSlots = limit - currentAllocation;
        const entriesToTake = Math.min(availableSlots, group.entries.length);
        
        distributedResults.push({
          type: group.type,
          entries: group.entries.slice(0, entriesToTake)
        });
        
        categoryAllocations.set(group.type, currentAllocation + entriesToTake);
      }
    }

    // Calculate total results allocated so far
    const totalAllocated = distributedResults.reduce((sum, group) => sum + group.entries.length, 0);
    const remainingSlots = TOTAL_LIMIT - totalAllocated;

    if (remainingSlots > 0) {
      // Second pass: Distribute remaining slots proportionally among categories that have more results
      const categoriesWithMore: { type: string; remaining: number }[] = [];
      
      for (const group of filteredResults) {
        const allocated = categoryAllocations.get(group.type) || 0;
        const remaining = group.entries.length - allocated;
        
        if (remaining > 0) {
          categoriesWithMore.push({ type: group.type, remaining });
        }
      }

      if (categoriesWithMore.length > 0) {
        // Sort by remaining results (descending) to prioritize categories with more content
        categoriesWithMore.sort((a, b) => b.remaining - a.remaining);
        
        let slotsToDistribute = remainingSlots;
        const slotsPerCategory = Math.floor(slotsToDistribute / categoriesWithMore.length);
        let extraSlots = slotsToDistribute % categoriesWithMore.length;

        for (const { type, remaining } of categoriesWithMore) {
          if (slotsToDistribute <= 0) break;
          
          let slotsForThisCategory = Math.min(slotsPerCategory, remaining);
          
          // Distribute extra slots to the first few categories
          if (extraSlots > 0) {
            slotsForThisCategory = Math.min(slotsForThisCategory + 1, remaining);
            extraSlots--;
          }
          
          if (slotsForThisCategory > 0) {
            const currentGroup = distributedResults.find(g => g.type === type);
            const originalGroup = filteredResults.find(g => g.type === type);
            
            if (currentGroup && originalGroup) {
              const currentCount = currentGroup.entries.length;
              const additionalEntries = originalGroup.entries.slice(
                currentCount, 
                currentCount + slotsForThisCategory
              );
              
              currentGroup.entries.push(...additionalEntries);
              slotsToDistribute -= additionalEntries.length;
            }
          }
        }
      }
    }

    // Sort results by priority (Author first, then others)
    return distributedResults.sort((a, b) => {
      const getPriority = (type: string) => {
        switch (type) {
          case 'Author': return 1;
          case 'BibleVerse': return 2;
          case 'Commentary': return 3;
          case 'Takeaway':
          case 'BibleVerseTakeaway': return 4;
          default: return 5;
        }
      };
      
      return getPriority(a.type) - getPriority(b.type);
    });
  }, [rawResults]);

  return { data: balancedResults, isLoading, error };
}