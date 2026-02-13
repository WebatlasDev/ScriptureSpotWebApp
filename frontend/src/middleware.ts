import { clerkMiddleware } from '@clerk/nextjs/server';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const UPPERCASE_PATTERN = /[A-Z]/;
const IP_ADDRESS_PATTERN = /^\d+\.\d+\.\d+\.\d+$/;

const developmentHosts = new Set(
  (process.env.MIDDLEWARE_DEVELOPMENT_HOSTS ?? 'localhost,127.0.0.1')
    .split(',')
    .map((host) => host.trim().toLowerCase())
    .filter(Boolean),
);

const FALLBACK_SITE_URL = 'https://www.scripturespot.com';

function resolveCanonicalUrl() {
  const configuredUrl = process.env.NEXT_PUBLIC_BASE_URL ?? FALLBACK_SITE_URL;

  try {
    return new URL(configuredUrl);
  } catch {
    return new URL(FALLBACK_SITE_URL);
  }
}

const canonicalUrl = resolveCanonicalUrl();
const CANONICAL_HOST = canonicalUrl.hostname.toLowerCase();
const CANONICAL_PORT = canonicalUrl.port;
const CANONICAL_PROTOCOL = canonicalUrl.protocol.replace(':', '');
const APEX_DOMAIN = CANONICAL_HOST.startsWith('www.')
  ? CANONICAL_HOST.slice(4)
  : CANONICAL_HOST;

function buildRedirectUrl(req: NextRequest) {
  const url = req.nextUrl.clone();
  const hostHeader =
    req.headers.get('x-forwarded-host') ??
    req.headers.get('host') ??
    url.host;
  const sanitizedHostHeader = hostHeader?.trim().toLowerCase() ?? '';
  const [hostname = '', port = ''] = sanitizedHostHeader.split(':');

  const isLocalHost = developmentHosts.has(hostname);
  const isIpAddress = IP_ADDRESS_PATTERN.test(hostname);
  const isVercelPreview = hostname.endsWith('.vercel.app') && hostname !== CANONICAL_HOST;

  let shouldRedirect = false;

  if (!isLocalHost && !isIpAddress && !isVercelPreview) {
    if (hostname === APEX_DOMAIN && CANONICAL_HOST !== APEX_DOMAIN) {
      url.hostname = CANONICAL_HOST;
      url.port = CANONICAL_PORT || port;
      shouldRedirect = true;
    }
  }

  const forwardedProto = req.headers.get('x-forwarded-proto');
  const protocol = forwardedProto ?? url.protocol.replace(':', '');

  if (
    CANONICAL_PROTOCOL === 'https' &&
    protocol === 'http' &&
    !isLocalHost &&
    !isIpAddress
  ) {
    url.protocol = 'https:';
    shouldRedirect = true;
  }

  if (UPPERCASE_PATTERN.test(url.pathname)) {
    url.pathname = url.pathname
      .split('/')
      .map((segment) => segment.toLowerCase())
      .join('/');
    shouldRedirect = true;
  }

  return { shouldRedirect, url, hostname };
}

export default clerkMiddleware((auth, req) => {
  const { shouldRedirect, url, hostname } = buildRedirectUrl(req);

  if (shouldRedirect) {
    // A blank port ensures HTTPS defaults are respected in redirects
    if (url.protocol === 'https:' && url.port === '443') {
      url.port = '';
    }

    return NextResponse.redirect(url, 308);
  }

  const res = NextResponse.next();

  if (req.nextUrl.pathname === '/' && hostname === CANONICAL_HOST) {
    res.headers.set(
      'Cache-Control',
      'public, max-age=3600, stale-while-revalidate=60',
    );
  }

  return res;
});

export const config = {
  matcher: [
    '/((?!_next/|favicon.ico).*)',
    '/(api|trpc)(.*)',
  ],
};