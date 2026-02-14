import { NextRequest, NextResponse } from 'next/server';
import { GetVerseTakeawaysQueryHandler } from '@/application/queries/bible/takeaways/get-verse-takeaways.handler';
import { GetVerseTakeawaysQuery } from '@/application/queries/bible/takeaways/get-verse-takeaways.query';

// Force dynamic rendering - don't try to statically generate at build time
export const dynamic = 'force-dynamic';

/**
 * GET /api/bible/verse/takeaways
 * Gets takeaways for a specific verse
 * Query params: bookSlug, chapterNumber, verseNumber
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const query = new GetVerseTakeawaysQuery();
    // Frontend sends parameters with capital letters
    query.bookSlug = searchParams.get('BookSlug') || undefined;
    query.chapterNumber = searchParams.get('ChapterNumber') 
      ? parseInt(searchParams.get('ChapterNumber')!, 10) 
      : undefined;
    query.verseNumber = searchParams.get('VerseNumber') 
      ? parseInt(searchParams.get('VerseNumber')!, 10) 
      : undefined;
    
    const handler = new GetVerseTakeawaysQueryHandler();
    const result = await handler.handle(query);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in GET /api/bible/verse/takeaways:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
