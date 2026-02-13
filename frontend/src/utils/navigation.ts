export type BuildUrlParams = {
  version: string;
  book?: string | number;
  chapter?: string | number;
  verse?: string | number;
};

const normalizeSegment = (segment: string | number | undefined): string | null => {
  if (segment === undefined || segment === null) {
    return null;
  }

  const trimmed = segment.toString().trim();
  if (!trimmed) {
    return null;
  }

  return trimmed.toLowerCase();
};

export const buildUrl = ({ version, book, chapter, verse }: BuildUrlParams): string => {
  const segments: Array<string> = [];
  const normalizedVersion = normalizeSegment(version);

  if (!normalizedVersion) {
    throw new Error('Version is required to build a Bible navigation URL.');
  }

  segments.push(normalizedVersion);

  const normalizedBook = normalizeSegment(book);
  if (normalizedBook) {
    segments.push(normalizedBook);
  }

  const normalizedChapter = normalizeSegment(chapter);
  if (normalizedChapter) {
    segments.push(normalizedChapter);
  }

  const normalizedVerse = normalizeSegment(verse);
  if (normalizedVerse) {
    segments.push(normalizedVerse);
  }

  return `/${segments.join('/')}`;
};
