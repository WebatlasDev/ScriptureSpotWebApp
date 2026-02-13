import { NextResponse } from 'next/server';
import { ListAuthorsQueryHandler } from '@/application/queries/authors/list-authors.handler';
import { ListAuthorsQuery } from '@/application/queries/authors/list-authors.query';

export const dynamic = 'force-dynamic';

/**
 * GET /api/authors
 * Lists all authors
 */
export async function GET() {
  try {
    
    console.log('[Authors API] GET request received');
    const handler = new ListAuthorsQueryHandler();
    const query = new ListAuthorsQuery();
    
    const result = await handler.handle(query);
    console.log('[Authors API] Returning', result.length, 'authors');
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in GET /api/authors:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
