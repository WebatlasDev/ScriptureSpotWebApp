import { NextRequest, NextResponse } from 'next/server';
import { GetOverviewQueryHandler } from '@/application/queries/bible/books/get-overview.handler';
import { GetOverviewQuery } from '@/application/queries/bible/books/get-overview.query';

// Force dynamic rendering - don't try to statically generate at build time
export const dynamic = 'force-dynamic';

/**
 * GET /api/bible/book/overview
 * Gets a Bible book overview with structures
 * Query params: slug
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const query = new GetOverviewQuery();
    query.slug = searchParams.get('slug') || undefined;
    
    const handler = new GetOverviewQueryHandler();
    const result = await handler.handle(query);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in GET /api/bible/book/overview:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
