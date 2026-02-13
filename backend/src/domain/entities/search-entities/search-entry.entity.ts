export interface SearchEntry {
  id: string;
  type?: string | null;
  slug?: string | null;
  reference?: string | null;
  authorName?: string | null;
  bookSlug?: string | null;
  bookName?: string | null;
  bookAliases?: string | null;
  chapterNumber?: number | null;
  verseNumber?: number | null;
  startVerseNumber?: number | null;
  endVerseNumber?: number | null;
  text?: string | null;
  takeawayContent?: string | null;
}
