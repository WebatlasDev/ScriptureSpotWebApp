import { NextRequest, NextResponse } from 'next/server';
import { GetStrongsLexiconQueryHandler } from '@/application/queries/bible/lexicons/get-strongs-lexicon/get-strongs-lexicon.handler';
import { GetStrongsLexiconQuery } from '@/application/queries/bible/lexicons/get-strongs-lexicon/get-strongs-lexicon.query';

// Force dynamic rendering - don't try to statically generate at build time
export const dynamic = 'force-dynamic';

/**
 * GET /api/exploration/lexicon/entry
 * Gets a Strong's lexicon entry
 * Query params: strongsNumber
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    // Frontend sends StrongsNumber or StrongsKey (capital S)
    const query = new GetStrongsLexiconQuery(
      searchParams.get('StrongsNumber') ?? 
      searchParams.get('StrongsKey') ?? 
      searchParams.get('strongsNumber') ?? 
      searchParams.get('strongsKey') ?? ''
    );
    
    const handler = new GetStrongsLexiconQueryHandler();
    const result = await handler.handle(query);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in GET /api/exploration/lexicon/entry:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
