import { NextRequest, NextResponse } from 'next/server';
import { ListEntriesQueryHandler } from '@/application/queries/search/list-entries/list-entries.handler';
import { ListEntriesQuery } from '@/application/queries/search/list-entries/list-entries.query';
import { ElasticSearchService } from '@/infrastructure/services/ElasticSearchService';

export const dynamic = 'force-dynamic';

/**
 * GET /api/search
 * Search across all content
 */
export async function GET(request: NextRequest) {
  try {
    
    const searchParams = request.nextUrl.searchParams;
    
    const query = new ListEntriesQuery({
      query: searchParams.get('query') ?? undefined,
      page: searchParams.get('page') ? parseInt(searchParams.get('page')!, 10) : 1,
      pageSize: searchParams.get('pageSize') ? parseInt(searchParams.get('pageSize')!, 10) : 10,
    });
    
    const searchService = new ElasticSearchService();
    const handler = new ListEntriesQueryHandler(searchService);
    
    // Add timeout protection (10 seconds)
    const searchPromise = handler.handle(query);
    const timeoutPromise = new Promise<any[]>((_, reject) => 
      setTimeout(() => reject(new Error('Search timeout')), 10000)
    );
    
    const result = await Promise.race([searchPromise, timeoutPromise])
      .catch((error) => {
        console.error('Search error or timeout:', error);
        return []; // Return empty results on timeout/error
      });
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in GET /api/search:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
