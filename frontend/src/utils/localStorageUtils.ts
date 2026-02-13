import { env } from '@/types/env';

const VERSION_REGEX = /^[a-zA-Z0-9]{2,6}$/;

// Reserved routes that should never be treated as Bible versions
const RESERVED_ROUTES = [
  'books', 
  'commentators', 
  'landing', 
  'authors', 
  'search', 
  'account', 
  'bookmarks', 
  'doctrines', 
  'hymns', 
  'premium-content', 
  'protected-content',
  'strongs', 
  'study-plans', 
  'translations', 
  'sitemap',
  'api',
  'admin',
  'settings',
  'profile'
];

/** Safely read a value from localStorage. Returns null on failure */
export function safeGetItem(key: string): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

/** Safely write a value to localStorage. Silently fails if storage is unavailable */
export function safeSetItem(key: string, value: string) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, value);
    window.dispatchEvent(
      new CustomEvent('local-storage', {
        detail: { key, value },
      }),
    );
  } catch {
    // Ignore write errors (e.g., in private browsing or full storage)
  }
}

export function getLastVersion(): string {
  if (typeof window === 'undefined') {
    return env.defaultVersion;
  }

  const stored = safeGetItem('lastVersion');
  if (stored && stored !== 'null' && VERSION_REGEX.test(stored)) {
    return stored.toLowerCase();
  }

  const firstSegment = window.location.pathname.split('/').filter(Boolean)[0];
  if (firstSegment && 
      VERSION_REGEX.test(firstSegment) && 
      !RESERVED_ROUTES.includes(firstSegment.toLowerCase())) {
    safeSetItem('lastVersion', firstSegment.toLowerCase());
    return firstSegment.toLowerCase();
  }

  safeSetItem('lastVersion', env.defaultVersion.toLowerCase());
  return env.defaultVersion;
}
