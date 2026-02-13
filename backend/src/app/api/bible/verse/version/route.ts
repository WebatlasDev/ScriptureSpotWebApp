import { NextRequest, NextResponse } from 'next/server';
import { GetVerseVersionQueryHandler } from '@/application/queries/bible/verse-versions/get-verse-version.handler';
import { GetVerseVersionQuery } from '@/application/queries/bible/verse-versions/get-verse-version.query';

// Force dynamic rendering - don't try to statically generate at build time
export const dynamic = 'force-dynamic';

/**
 * GET /api/bible/verse/version
 * Gets a specific verse in a specific version
 * Query params: bookSlug, chapterNumber, verseNumber, versionName
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const query = new GetVerseVersionQuery();
    query.bookSlug = searchParams.get('BookSlug') || searchParams.get('bookSlug') || undefined;
    query.chapterNumber = searchParams.get('ChapterNumber') || searchParams.get('chapterNumber')
      ? parseInt((searchParams.get('ChapterNumber') || searchParams.get('chapterNumber'))!, 10) 
      : undefined;
    query.verseNumber = searchParams.get('VerseNumber') || searchParams.get('verseNumber')
      ? parseInt((searchParams.get('VerseNumber') || searchParams.get('verseNumber'))!, 10) 
      : undefined;
    query.versionName = searchParams.get('VersionName') || searchParams.get('versionName') || undefined;
    
    const handler = new GetVerseVersionQueryHandler();
    const result = await handler.handle(query);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('❌ [Verse Version API] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
