import { IRequestHandler } from '@/lib/mediator';
import { ListEntriesQuery } from './list-entries.query';
import { SearchResultModel } from '@/application/models/search-models';
import { IElasticSearchService } from '@/application/common/interfaces/elastic-search-service.interface';

export class ListEntriesQueryHandler
  implements IRequestHandler<ListEntriesQuery, SearchResultModel[]>
{
  constructor(private searchService: IElasticSearchService) {}

  async handle(
    request: ListEntriesQuery,
    signal?: AbortSignal
  ): Promise<SearchResultModel[]> {
    const entries = await this.searchService.search(
      request.query || '',
      request.page,
      request.pageSize,
      signal
    );

    for (const entry of entries) {
      const typeLower = entry.type.toLowerCase();

      if (typeLower === 'bibleverse') {
        entry.slug = `/${entry.bookSlug}/${entry.chapterNumber}/${entry.verseNumber}`;
      }

      if (typeLower === 'bibleverseversion') {
        entry.slug = `/${entry.authorName.toLowerCase()}/${entry.bookSlug}/${entry.chapterNumber}/${entry.startVerseNumber}`;
      }
    }

    // Group by type
    const grouped = entries.reduce((acc, entry) => {
      if (!acc[entry.type]) {
        acc[entry.type] = [];
      }
      acc[entry.type].push(entry);
      return acc;
    }, {} as Record<string, any[]>);

    return (Object.entries(grouped) as [string, any[]][]).map(([type, entries]) => ({
      type,
      entries,
    }));
  }
}
