import { env } from '@/types/env';

export const canonicalHost = new URL(env.site).hostname.toLowerCase();

const sitemapCache = new Map<string, string>();

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function fetchWithRetry(
  url: string,
  init: RequestInit,
  retries = 3,
  backoffMs = 250
): Promise<Response> {
  let lastError: unknown;

  for (let attempt = 0; attempt < retries; attempt += 1) {
    try {
      const response = await fetch(url, init);
      if (!response.ok) {
        throw new Error(`Unexpected status ${response.status}`);
      }

      return response;
    } catch (error) {
      lastError = error;
      if (attempt < retries - 1) {
        await sleep(backoffMs * 2 ** attempt);
      }
    }
  }

  throw lastError;
}

function normalizeUrl(rawUrl: string): string {
  try {
    const base = `https://${canonicalHost}`;
    const candidate = rawUrl.trim();
    const url = candidate ? new URL(candidate, base) : new URL(base);
    url.protocol = 'https:';
    url.hostname = canonicalHost;
    url.pathname = url.pathname
      .split('/')
      .map((segment) => segment.toLowerCase())
      .join('/');
    return url.toString();
  } catch {
    const sanitized = rawUrl.trim().replace(/^https?:\/\//i, '');
    const url = new URL(`https://${sanitized || canonicalHost}`);
    url.protocol = 'https:';
    url.hostname = canonicalHost;
    url.pathname = url.pathname
      .split('/')
      .map((segment) => segment.toLowerCase())
      .join('/');
    return url.toString();
  }
}

export function canonicalizeSitemapXml(xml: string): string {
  return xml.replace(/<loc>([^<]+)<\/loc>/gi, (_, loc: string) => `<loc>${normalizeUrl(loc)}</loc>`);
}

export function setSitemapCache(key: string, xml: string) {
  sitemapCache.set(key.toLowerCase(), xml);
}

export function getSitemapCache(key: string) {
  return sitemapCache.get(key.toLowerCase());
}

export function buildDefaultIndexXml() {
  return `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <sitemap>\n    <loc>https://${canonicalHost}/sitemap.xml</loc>\n    <changefreq>daily</changefreq>\n  </sitemap>\n</sitemapindex>`;
}

export function buildDefaultUrlsetXml(groupType: string, identifier: string) {
  const safeGroup = groupType.toLowerCase();
  const safeIdentifier = identifier.toLowerCase();

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url>\n    <loc>https://${canonicalHost}/sitemap/${safeGroup}/${safeIdentifier}</loc>\n    <changefreq>weekly</changefreq>\n  </url>\n</urlset>`;
}
