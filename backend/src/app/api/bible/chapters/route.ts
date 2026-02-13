import { NextRequest, NextResponse } from 'next/server';
import { ListChaptersQueryHandler } from '@/application/queries/bible/chapters/list-chapters.handler';
import { ListChaptersQuery } from '@/application/queries/bible/chapters/list-chapters.query';

// Force dynamic rendering - don't try to statically generate at build time
export const dynamic = 'force-dynamic';

/**
 * GET /api/bible/chapters
 * Lists all chapters for a Bible book
 * Query params: bookSlug
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const query = new ListChaptersQuery();
    query.bookSlug = searchParams.get('bookSlug') || undefined;
    
    const handler = new ListChaptersQueryHandler();
    const result = await handler.handle(query);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in GET /api/bible/chapters:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
