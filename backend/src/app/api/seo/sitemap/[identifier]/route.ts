import { NextRequest, NextResponse } from 'next/server';
import { GetSitemapQueryHandler } from '@/application/queries/seo/sitemaps/get-sitemap/get-sitemap.handler';
import { GetSitemapQuery } from '@/application/queries/seo/sitemaps/get-sitemap/get-sitemap.query';
import { SitemapService } from '@/infrastructure/services/sitemap.service';
import { RedisCacheService } from '@/infrastructure/services/RedisCacheService';

// Force dynamic rendering - don't try to statically generate at build time
export const dynamic = 'force-dynamic';

/**
 * GET /api/seo/sitemap/[identifier]
 * Gets a specific sitemap XML by identifier
 * Path param: identifier (from URL)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { identifier: string } }
) {
  try {
    const query = new GetSitemapQuery(params.identifier);
    
    const cacheService = new RedisCacheService() as any;
    const sitemapService = new SitemapService(cacheService);
    const handler = new GetSitemapQueryHandler(sitemapService);
    
    // Add timeout protection (15 seconds)
    const sitemapPromise = handler.handle(query);
    const timeoutPromise = new Promise<string>((_, reject) => 
      setTimeout(() => reject(new Error('Sitemap generation timeout')), 15000)
    );
    
    const result = await Promise.race([sitemapPromise, timeoutPromise])
      .catch((error) => {
        console.error('Sitemap error or timeout:', error);
        // Return minimal valid sitemap XML on error
        return '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>';
      });
    
    return new NextResponse(result, {
      headers: {
        'Content-Type': 'application/xml',
      },
    });
  } catch (error) {
    console.error('Error in GET /api/seo/sitemap/[identifier]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
