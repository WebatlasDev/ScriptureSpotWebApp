import { NextResponse } from 'next/server';
import {
  buildDefaultUrlsetXml,
  canonicalizeSitemapXml,
  fetchWithRetry,
  getSitemapCache,
  setSitemapCache,
} from '@/app/sitemap/utils';
import { env } from '@/types/env';

export const dynamic = 'force-dynamic';

export async function GET(
  req: Request,
  context: { params: Promise<{ groupType: string; identifier: string }> }
) {
  const { groupType, identifier } = await context.params;
  const cacheKey = `${groupType}:${identifier}`.toLowerCase();

  try {
    const res = await fetchWithRetry(
      `${env.api}/SEO/Sitemap/${groupType}/${identifier}.xml`,
      {
        headers: { Accept: 'application/xml' },
        cache: 'no-store',
      }
    );

    const xml = canonicalizeSitemapXml(await res.text());
    setSitemapCache(cacheKey, xml);

    return new NextResponse(xml, {
      headers: {
        'Content-Type': 'application/xml',
      },
    });
  } catch (err) {
    const fallback = getSitemapCache(cacheKey) ?? buildDefaultUrlsetXml(groupType, identifier);

    return new NextResponse(fallback, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=300',
      },
    });
  }
}
