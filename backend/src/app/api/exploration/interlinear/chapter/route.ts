import { NextRequest, NextResponse } from 'next/server';
import { ListInterlinearByChapterQueryHandler } from '@/application/queries/bible/interlinear/list-interlinear-by-chapter/list-interlinear-by-chapter.handler';
import { ListInterlinearByChapterQuery } from '@/application/queries/bible/interlinear/list-interlinear-by-chapter/list-interlinear-by-chapter.query';

// Force dynamic rendering - don't try to statically generate at build time
export const dynamic = 'force-dynamic';

/**
 * GET /api/exploration/interlinear/chapter
 * Gets interlinear data for all verses in a chapter
 * Query params: bookSlug, chapterNumber
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    const query = new ListInterlinearByChapterQuery();
    // Parameters come with capital letters from frontend
    query.bookSlug = searchParams.get('BookSlug') ?? undefined;
    query.chapterNumber = searchParams.get('ChapterNumber') 
      ? parseInt(searchParams.get('ChapterNumber')!, 10) 
      : undefined;
    
    const handler = new ListInterlinearByChapterQueryHandler();
    const result = await handler.handle(query);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in GET /api/exploration/interlinear/chapter:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
