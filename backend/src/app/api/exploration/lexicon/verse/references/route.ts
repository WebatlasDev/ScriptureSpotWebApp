import { NextRequest, NextResponse } from 'next/server';
import { ListStrongsVerseReferencesQueryHandler } from '@/application/queries/bible/lexicons/list-strongs-verse-references/list-strongs-verse-references.handler';
import { ListStrongsVerseReferencesQuery } from '@/application/queries/bible/lexicons/list-strongs-verse-references/list-strongs-verse-references.query';

// Force dynamic rendering - don't try to statically generate at build time
export const dynamic = 'force-dynamic';

/**
 * GET /api/exploration/lexicon/verse/references
 * Lists all verse references for a Strong's number
 * Query params: strongsNumber
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    const query = new ListStrongsVerseReferencesQuery({
      strongsKey: searchParams.get('strongsNumber') ?? searchParams.get('strongsKey') ?? '',
      version: searchParams.get('version') ?? undefined,
    });
    
    const handler = new ListStrongsVerseReferencesQueryHandler();
    const result = await handler.handle(query);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in GET /api/exploration/lexicon/verse/references:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
