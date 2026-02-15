import { NextRequest, NextResponse } from 'next/server';
import { ListStrongsVerseReferencesQueryHandler } from '@/application/queries/bible/lexicons/list-strongs-verse-references/list-strongs-verse-references.handler';
import { ListStrongsVerseReferencesQuery } from '@/application/queries/bible/lexicons/list-strongs-verse-references/list-strongs-verse-references.query';

// Force dynamic rendering - don't try to statically generate at build time
export const dynamic = 'force-dynamic';

/**
 * GET /api/exploration/lexicon/verse/references
 * Lists all verse references for a Strong's number with pagination
 * Query params: strongsNumber, version, page, pageSize
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    // Frontend sends parameters with capital letters
    const page = parseInt(searchParams.get('Page') ?? searchParams.get('page') ?? '1', 10);
    const pageSize = parseInt(searchParams.get('PageSize') ?? searchParams.get('pageSize') ?? '20', 10);
    
    const query = new ListStrongsVerseReferencesQuery({
      strongsKey: searchParams.get('StrongsNumber') ?? 
                  searchParams.get('StrongsKey') ?? 
                  searchParams.get('strongsNumber') ?? 
                  searchParams.get('strongsKey') ?? '',
      version: searchParams.get('Version') ?? 
               searchParams.get('version') ?? 
               undefined,
      page: page > 0 ? page : 1,
      pageSize: pageSize > 0 && pageSize <= 100 ? pageSize : 20,
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
