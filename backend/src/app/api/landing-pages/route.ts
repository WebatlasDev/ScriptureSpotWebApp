import { NextRequest, NextResponse } from 'next/server';
import { GetLandingPageQueryHandler } from '@/application/queries/pages/get-landing-page/get-landing-page.handler';
import { GetLandingPageQuery } from '@/application/queries/pages/get-landing-page/get-landing-page.query';

export const dynamic = 'force-dynamic';

/**
 * GET /api/landing-pages
 * Gets a landing page by slug
 * Query params: slug
 */
export async function GET(request: NextRequest) {
  try {
    
    const searchParams = request.nextUrl.searchParams;
    
    const query = new GetLandingPageQuery();
    query.slug = searchParams.get('slug') ?? undefined;
    
    const handler = new GetLandingPageQueryHandler();
    const result = await handler.handle(query);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in GET /api/landing-pages:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
