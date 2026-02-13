export type CanonicalSegment = string | number | null | undefined | false;

const normalizeSegment = (segment: CanonicalSegment): string | null => {
  if (segment === null || segment === undefined || segment === false) {
    return null;
  }

  const trimmed = segment.toString().trim();

  if (!trimmed) {
    return null;
  }

  return trimmed.toLowerCase();
};

export const buildCanonical = (origin: string, params: CanonicalSegment[] = []): string => {
  const normalizedOrigin = origin.replace(/\/+$/, '');
  const segments = params
    .map(normalizeSegment)
    .filter((segment): segment is string => Boolean(segment));

  if (!segments.length) {
    return `${normalizedOrigin}/`;
  }

  return `${normalizedOrigin}/${segments.join('/')}`;
};
