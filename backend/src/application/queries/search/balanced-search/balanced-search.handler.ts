import { IRequestHandler } from '@/lib/mediator';
import { BalancedSearchQuery } from './balanced-search.query';
import { SearchResultModel } from '@/application/models/search-models';
import { IElasticSearchService } from '@/application/common/interfaces/elastic-search-service.interface';

const CATEGORY_LIMITS: Record<string, number> = {
  Author: 10,
  BibleVerse: 10,
  Commentary: 10,
  Takeaway: 10,
  BibleVerseTakeaway: 10,
};

const TOTAL_LIMIT = 500;

export class BalancedSearchQueryHandler
  implements IRequestHandler<BalancedSearchQuery, SearchResultModel[]>
{
  constructor(private searchService: IElasticSearchService) {}

  async handle(
    request: BalancedSearchQuery,
    signal?: AbortSignal
  ): Promise<SearchResultModel[]> {
    const rawResults = await this.searchService.search(
      request.query || '',
      1,
      TOTAL_LIMIT,
      signal
    );

    if (!rawResults || rawResults.length === 0) {
      return [];
    }

    // Filter out unwanted types
    const filtered = rawResults.filter(
      (r) =>
        r.type !== 'CommentaryExcerpt' &&
        r.type !== 'BibleVerseVersion' &&
        r.type !== 'BibleBookStructure' &&
        r.type !== 'Fact' &&
        r.type !== 'Work'
    );

    // Group by type
    const grouped = filtered.reduce((acc, result) => {
      if (!acc[result.type]) {
        acc[result.type] = [];
      }
      acc[result.type].push(result);
      return acc;
    }, {} as Record<string, any[]>);

    const distributedResults: SearchResultModel[] = [];
    const allocations: Record<string, number> = {};

    // Initial allocation
    for (const [type, entries] of Object.entries(grouped) as [string, any[]][]) {
      const limit = CATEGORY_LIMITS[type] || 10;
      const take = Math.min(limit, entries.length);
      allocations[type] = take;
      distributedResults.push({
        type,
        entries: entries.slice(0, take),
      });
    }

    // Distribute remaining slots
    const totalAllocated = Object.values(allocations).reduce(
      (sum, val) => sum + val,
      0
    );
    let remainingSlots = TOTAL_LIMIT - totalAllocated;

    if (remainingSlots > 0) {
      const categoriesWithMore = (Object.entries(grouped) as [string, any[]][])
        .map(([type, entries]) => ({
          type,
          remaining: entries.length - (allocations[type] || 0),
        }))
        .filter((x) => x.remaining > 0)
        .sort((a, b) => b.remaining - a.remaining);

      if (categoriesWithMore.length > 0) {
        const slotsPerCategory = Math.floor(
          remainingSlots / categoriesWithMore.length
        );
        let extraSlots = remainingSlots % categoriesWithMore.length;

        for (const cat of categoriesWithMore) {
          if (remainingSlots <= 0) break;

          let slotsForCat = Math.min(slotsPerCategory, cat.remaining);
          if (extraSlots > 0) {
            slotsForCat = Math.min(slotsForCat + 1, cat.remaining);
            extraSlots--;
          }

          if (slotsForCat > 0) {
            const group = distributedResults.find((g) => g.type === cat.type);
            if (group) {
              const currentCount = group.entries?.length || 0;
              const additional = grouped[cat.type].slice(
                currentCount,
                currentCount + slotsForCat
              );
              group.entries!.push(...additional);
              remainingSlots -= additional.length;
            }
          }
        }
      }
    }

    return distributedResults;
  }
}
