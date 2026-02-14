import { NextRequest, NextResponse } from 'next/server';
import { GetVerseRangeQueryHandler } from '@/application/queries/bible/verse-versions/get-verse-range.handler';
import { GetVerseRangeQuery } from '@/application/queries/bible/verse-versions/get-verse-range.query';

// Force dynamic rendering - don't try to statically generate at build time
export const dynamic = 'force-dynamic';

/**
 * GET /api/bible/verse/range
 * Gets a range of verses in a specific version
 * Query params: bookSlug, chapterNumber, verseRange, versionName
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const query = new GetVerseRangeQuery();
    // Parameters come in with capital letters (BookSlug, ChapterNumber, etc.)
    query.bookSlug = searchParams.get('BookSlug') || undefined;
    query.chapterNumber = searchParams.get('ChapterNumber') 
      ? parseInt(searchParams.get('ChapterNumber')!, 10) 
      : undefined;
    query.verseRange = searchParams.get('VerseRange') || undefined;
    query.versionName = searchParams.get('VersionName') || undefined;
    
    const handler = new GetVerseRangeQueryHandler();
    const result = await handler.handle(query);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in GET /api/bible/verse/range:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
