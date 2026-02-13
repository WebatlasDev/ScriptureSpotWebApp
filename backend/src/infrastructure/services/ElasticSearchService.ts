import { Client } from '@elastic/elasticsearch';
import { SearchEntry } from '@/domain/entities/search-entities';
import { SearchEntryModel } from '@/application/models/search-models';

/**
 * ElasticSearch service implementation
 * Provides full-text search capabilities using Elasticsearch
 */
export class ElasticSearchService {
  private readonly client: Client;
  private readonly indexName = 'search-scripture-spot';

  constructor(elasticsearchUrl?: string) {
    const node = elasticsearchUrl || process.env.ELASTICSEARCH_NODE || '';
    
    this.client = new Client({
      node,
      requestTimeout: 30000,
      maxRetries: 3,
    });

    this.client.ping()
      .then(() => console.log('Elasticsearch connected successfully'))
      .catch((error) => console.error('Elasticsearch connection error:', error));
  }

  /**
   * Resets the search index (deletes and recreates with proper mappings and analyzers)
   */
  async resetIndexAsync(): Promise<void> {
    try {
      // Delete index if it exists
      const exists = await this.client.indices.exists({ index: this.indexName });
      
      if (exists) {
        await this.client.indices.delete({ index: this.indexName });
      }

      // Create index with custom settings and mappings
      await this.client.indices.create({
        index: this.indexName,
        body: {
          settings: {
            analysis: {
              analyzer: {
                english_stem: {
                  type: 'custom',
                  tokenizer: 'standard',
                  filter: ['lowercase', 'porter_stem'],
                },
              },
            },
          },
          mappings: {
            properties: {
              id: { type: 'keyword' },
              text: { type: 'text', analyzer: 'english_stem' },
              takeawayContent: { type: 'text', analyzer: 'english_stem' },
              reference: { type: 'text', analyzer: 'english_stem' },
              authorName: { type: 'text', analyzer: 'english_stem' },
              bookSlug: { type: 'text', analyzer: 'english_stem' },
              bookName: { type: 'text', analyzer: 'english_stem' },
              bookAliases: { type: 'text', analyzer: 'english_stem' },
              slug: { type: 'text', analyzer: 'english_stem' },
              chapterNumber: { type: 'integer' },
              verseNumber: { type: 'integer' },
              type: { type: 'keyword' },
              rank: { type: 'integer' },
              createdAt: { type: 'date' },
              updatedAt: { type: 'date' },
            },
          },
        },
      });

      console.log(`Index ${this.indexName} created successfully`);
    } catch (error) {
      console.error('Failed to reset Elasticsearch index:', error);
      throw error;
    }
  }

  /**
   * Indexes a collection of search entries in bulk
   * @param entries The search entries to index
   */
  async indexEntriesAsync(entries: SearchEntry[]): Promise<void> {
    if (!entries || entries.length === 0) {
      return;
    }

    try {
      const operations = entries.flatMap((entry) => [
        { index: { _index: this.indexName, _id: entry.id } },
        entry,
      ]);

      const response = await this.client.bulk({
        operations,
        refresh: true,
      });

      if (response.errors) {
        const erroredDocuments = response.items.filter(
          (item: any) => item.index?.error
        );
        console.error('Bulk indexing errors:', erroredDocuments);
      } else {
        console.log(`Successfully indexed ${entries.length} entries`);
      }
    } catch (error) {
      console.error('Failed to index entries:', error);
      throw error;
    }
  }

  /**
   * Public search method (implements IElasticSearchService interface)
   */
  async search(
    query: string,
    page: number,
    limit: number,
    signal?: AbortSignal
  ): Promise<any[]> {
    return await this.searchAsync(query, page, limit);
  }

  /**
   * Performs a full-text search across indexed content
   * @param query The search query string
   * @param page The page number (1-based)
   * @param pageSize The number of results per page
   * @returns Collection of search results
   */
  async searchAsync(
    query: string,
    page: number,
    pageSize: number
  ): Promise<SearchEntryModel[]> {
    try {
      const reference = this.extractReference(query);
      const terms = query.split(/\s+/).filter((t) => t.length > 0);

      const mustQueries: any[] = [];

      // Boost reference matches
      if (reference) {
        mustQueries.push({
          match_phrase: {
            reference: {
              query: reference,
              boost: 3,
            },
          },
        });
      }

      // Multi-match query across all fields
      mustQueries.push({
        multi_match: {
          query,
          fields: [
            'text',
            'takeawayContent',
            'reference',
            'bookSlug',
            'bookName',
            'bookAliases',
            'slug',
            'authorName',
          ],
          fuzziness: terms.length > 1 ? 0 : 'AUTO',
          operator: terms.length > 1 ? 'and' : 'or',
          analyzer: 'english_stem',
        },
      });

      // Boost exact phrase matches for multi-word queries
      if (terms.length > 1) {
        mustQueries.push({
          match_phrase: {
            text: {
              query,
              analyzer: 'english_stem',
              boost: 2,
            },
          },
        });
      }

      const response = await this.client.search({
        index: this.indexName,
        body: {
          query: {
            bool: {
              must: mustQueries,
            },
          },
          from: (page - 1) * pageSize,
          size: pageSize,
        },
      });

      // Map Elasticsearch hits to SearchEntryModel
      const results = response.hits.hits.map((hit: any) => {
        const source = hit._source as SearchEntry;
        return {
          id: source.id,
          text: source.text,
          takeawayContent: source.takeawayContent,
          reference: source.reference,
          authorName: source.authorName,
          bookSlug: source.bookSlug,
          bookName: source.bookName,
          bookAliases: source.bookAliases,
          slug: source.slug,
          chapterNumber: source.chapterNumber,
          verseNumber: source.verseNumber,
          type: source.type,
        } as SearchEntryModel;
      });

      return results;
    } catch (error) {
      console.error('Search failed:', error);
      throw error;
    }
  }

  /**
   * Extracts Bible reference from a query string (e.g., "John 3:16")
   * @param query The search query
   * @returns Extracted reference or null
   */
  private extractReference(query: string): string | null {
    if (!query) {
      return null;
    }

    // Match patterns like "John 3:16", "1 John 2:5", "Genesis 1:1"
    const match = query.match(/(?:(?:\d\s+)?[A-Za-z]+\s+\d{1,3}:\d{1,3})/i);
    return match ? match[0].trim() : null;
  }

  /**
   * Checks if Elasticsearch is connected and responsive
   * @returns True if connected
   */
  async isConnected(): Promise<boolean> {
    try {
      await this.client.ping();
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Closes the Elasticsearch client connection
   */
  async close(): Promise<void> {
    await this.client.close();
  }
}

// Singleton instance
let elasticSearchServiceInstance: ElasticSearchService | null = null;

export function getElasticSearchService(): ElasticSearchService {
  if (!elasticSearchServiceInstance) {
    elasticSearchServiceInstance = new ElasticSearchService();
  }
  return elasticSearchServiceInstance;
}

export const elasticSearchService = getElasticSearchService();
