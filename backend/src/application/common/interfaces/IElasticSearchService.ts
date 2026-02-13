import { SearchEntry } from '@/domain/entities/search-entities';
import { SearchEntryModel } from '@/application/models/search-models';

/**
 * Interface for Elasticsearch service operations
 * Provides full-text search capabilities for Scripture content
 */
export interface IElasticSearchService {
  /**
   * Resets the search index (deletes and recreates with proper mappings)
   * @returns Promise that resolves when index is reset
   */
  resetIndexAsync(): Promise<void>;

  /**
   * Indexes a collection of search entries
   * @param entries The search entries to index
   * @returns Promise that resolves when entries are indexed
   */
  indexEntriesAsync(entries: SearchEntry[]): Promise<void>;

  /**
   * Performs a full-text search across indexed content
   * @param query The search query string
   * @param page The page number (1-based)
   * @param pageSize The number of results per page
   * @returns Promise that resolves to collection of search results
   */
  searchAsync(query: string, page: number, pageSize: number): Promise<SearchEntryModel[]>;
}
