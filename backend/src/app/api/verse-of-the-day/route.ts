import { NextRequest, NextResponse } from 'next/server';
import { GetVerseOfTheDayQueryHandler } from '@/application/queries/bible/verse-of-the-day/get-verse-of-the-day.handler';
import { GetVerseOfTheDayQuery } from '@/application/queries/bible/verse-of-the-day/get-verse-of-the-day.query';

// Force dynamic rendering - don't try to statically generate at build time
export const dynamic = 'force-dynamic';

/**
 * GET /api/verse-of-the-day
 * Gets the verse of the day
 * Query params: version? (optional, default: NIV)
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    const query = new GetVerseOfTheDayQuery({
      version: searchParams.get('version') ?? searchParams.get('versionName') ?? 'NIV',
    });
    
    const handler = new GetVerseOfTheDayQueryHandler();
    const result = await handler.handle(query);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in GET /api/verse-of-the-day:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
