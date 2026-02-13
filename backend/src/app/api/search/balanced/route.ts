import { NextRequest, NextResponse } from 'next/server';
import { BalancedSearchQueryHandler } from '@/application/queries/search/balanced-search/balanced-search.handler';
import { BalancedSearchQuery } from '@/application/queries/search/balanced-search/balanced-search.query';
import { ElasticSearchService } from '@/infrastructure/services/ElasticSearchService';

// Force dynamic rendering - don't try to statically generate at build time
export const dynamic = 'force-dynamic';

/**
 * GET /api/search/balanced
 * Performs a balanced search across multiple entity types
 * Query params: query, skip?, take?
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    const query = new BalancedSearchQuery(
      searchParams.get('query') ?? ''
    );
    
    const searchService = new ElasticSearchService();
    const handler = new BalancedSearchQueryHandler(searchService);
    
    // Add timeout protection (10 seconds)
    const searchPromise = handler.handle(query);
    const timeoutPromise = new Promise<any>((_, reject) => 
      setTimeout(() => reject(new Error('Search timeout')), 10000)
    );
    
    const result = await Promise.race([searchPromise, timeoutPromise])
      .catch((error) => {
        console.error('Search error or timeout:', error);
        return { verses: [], commentaries: [], authors: [], books: [] }; // Return empty results
      });
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in GET /api/search/balanced:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
