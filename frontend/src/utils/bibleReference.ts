const BOOK_SLUG_OVERRIDES: Record<string, string> = {
  psalm: 'psalms',
};

export type ParsedBibleReference = {
  bookSlug: string;
  chapter: string;
  verse: string;
};

export const parseBibleReference = (reference?: string | null): ParsedBibleReference | null => {
  if (!reference) {
    return null;
  }

  const match = reference.match(/^(.+?)\s+(\d+):(\d+)(?:[-–]\d+)?$/);
  if (!match) {
    return null;
  }

  let bookSlug = match[1].trim().toLowerCase().replace(/\s+/g, '-');
  if (BOOK_SLUG_OVERRIDES[bookSlug]) {
    bookSlug = BOOK_SLUG_OVERRIDES[bookSlug];
  }

  return {
    bookSlug,
    chapter: match[2],
    verse: match[3],
  };
};
