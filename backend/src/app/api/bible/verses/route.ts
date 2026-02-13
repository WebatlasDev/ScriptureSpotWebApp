import { NextRequest, NextResponse } from 'next/server';
import { ListVersesQueryHandler } from '@/application/queries/bible/verses/list-verses.handler';
import { ListVersesQuery } from '@/application/queries/bible/verses/list-verses.query';

// Force dynamic rendering - don't try to statically generate at build time
export const dynamic = 'force-dynamic';

/**
 * GET /api/bible/verses
 * Lists all verses for a chapter
 * Query params: bookSlug, chapterNumber
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const query = new ListVersesQuery();
    query.bookSlug = searchParams.get('bookSlug') || undefined;
    query.chapterNumber = searchParams.get('chapterNumber') 
      ? parseInt(searchParams.get('chapterNumber')!, 10) 
      : undefined;
    
    const handler = new ListVersesQueryHandler();
    const result = await handler.handle(query);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in GET /api/bible/verses:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
