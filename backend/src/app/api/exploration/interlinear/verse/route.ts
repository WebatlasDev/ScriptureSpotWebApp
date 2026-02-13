import { NextRequest, NextResponse } from 'next/server';
import { ListInterlinearByVerseQueryHandler } from '@/application/queries/bible/interlinear/list-interlinear-by-verse/list-interlinear-by-verse.handler';
import { ListInterlinearByVerseQuery } from '@/application/queries/bible/interlinear/list-interlinear-by-verse/list-interlinear-by-verse.query';

// Force dynamic rendering - don't try to statically generate at build time
export const dynamic = 'force-dynamic';

/**
 * GET /api/exploration/interlinear/verse
 * Gets interlinear data for a specific verse
 * Query params: bookSlug, chapterNumber, verseNumber
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    const query = new ListInterlinearByVerseQuery();
    query.bookSlug = searchParams.get('bookSlug') ?? undefined;
    query.chapterNumber = searchParams.get('chapterNumber') 
      ? parseInt(searchParams.get('chapterNumber')!, 10) 
      : undefined;
    query.verseNumber = searchParams.get('verseNumber') 
      ? parseInt(searchParams.get('verseNumber')!, 10) 
      : undefined;
    
    const handler = new ListInterlinearByVerseQueryHandler();
    const result = await handler.handle(query);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in GET /api/exploration/interlinear/verse:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
