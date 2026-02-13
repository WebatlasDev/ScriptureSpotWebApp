import { NextResponse } from 'next/server';
import {
  buildDefaultIndexXml,
  canonicalizeSitemapXml,
  fetchWithRetry,
  getSitemapCache,
  setSitemapCache,
} from '@/app/sitemap/utils';
import { env } from '@/types/env';

export const dynamic = 'force-dynamic';

const INDEX_CACHE_KEY = 'index';

export async function GET() {
  try {
    const res = await fetchWithRetry(`${env.api}/SEO/Sitemap/Index`, {
      headers: {
        Accept: 'application/xml',
      },
      cache: 'no-store',
    });

    const xml = canonicalizeSitemapXml(await res.text());
    setSitemapCache(INDEX_CACHE_KEY, xml);

    return new NextResponse(xml, {
      headers: {
        'Content-Type': 'application/xml',
      },
    });
  } catch (err) {
    const fallback = getSitemapCache(INDEX_CACHE_KEY) ?? buildDefaultIndexXml();

    return new NextResponse(fallback, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=300',
      },
    });
  }
}
