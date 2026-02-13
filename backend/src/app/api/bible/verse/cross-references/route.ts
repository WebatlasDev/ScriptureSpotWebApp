import { NextRequest, NextResponse } from 'next/server';
import { ListVerseCrossReferencesQueryHandler } from '@/application/queries/bible/cross-references/list-verse-cross-references.handler';
import { ListVerseCrossReferencesQuery } from '@/application/queries/bible/cross-references/list-verse-cross-references.query';

// Force dynamic rendering - don't try to statically generate at build time
export const dynamic = 'force-dynamic';

/**
 * GET /api/bible/verse/cross-references
 * Gets cross references for a verse
 * Query params: bookSlug, chapterNumber, verseNumber, version
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const query = new ListVerseCrossReferencesQuery();
    query.bookSlug = searchParams.get('bookSlug') || undefined;
    query.chapterNumber = searchParams.get('chapterNumber') || undefined;
    query.verseNumber = searchParams.get('verseNumber') || undefined;
    query.version = searchParams.get('version') || undefined;
    
    const handler = new ListVerseCrossReferencesQueryHandler();
    const result = await handler.handle(query);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in GET /api/bible/verse/cross-references:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
