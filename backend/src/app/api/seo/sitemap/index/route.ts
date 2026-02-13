import { NextRequest, NextResponse } from 'next/server';
import { GetSitemapIndexQueryHandler } from '@/application/queries/seo/sitemaps/get-sitemap-index/get-sitemap-index.handler';
import { GetSitemapIndexQuery } from '@/application/queries/seo/sitemaps/get-sitemap-index/get-sitemap-index.query';
import { SitemapService } from '@/infrastructure/services/sitemap.service';
import { RedisCacheService } from '@/infrastructure/services/RedisCacheService';

// Force dynamic rendering - don't try to statically generate at build time
export const dynamic = 'force-dynamic';

/**
 * GET /api/seo/sitemap/index
 * Gets the sitemap index XML
 */
export async function GET(request: NextRequest) {
  try {
    const query = new GetSitemapIndexQuery();
    const cacheService = new RedisCacheService() as any;
    const sitemapService = new SitemapService(cacheService);
    const handler = new GetSitemapIndexQueryHandler(sitemapService);
    const result = await handler.handle(query);
    
    return new NextResponse(result, {
      headers: {
        'Content-Type': 'application/xml',
      },
    });
  } catch (error) {
    console.error('Error in GET /api/seo/sitemap/index:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
