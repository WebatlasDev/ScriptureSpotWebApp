const GUID_PATTERN = /^[0-9a-fA-F]{8}-(?:[0-9a-fA-F]{4}-){3}[0-9a-fA-F]{12}$/;

/**
 * Returns the first candidate that matches the GUID pattern.
 */
export function resolveBookmarkId(...candidates: Array<unknown>): string | null {
  for (const candidate of candidates) {
    if (typeof candidate === 'string') {
      const normalized = candidate.trim();
      if (normalized && GUID_PATTERN.test(normalized)) {
        return normalized;
      }
    }
  }

  return null;
}
