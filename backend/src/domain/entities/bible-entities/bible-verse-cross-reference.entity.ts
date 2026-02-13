import { BibleVerseReference } from './bible-verse-reference.entity';

export interface BibleVerseCrossReference {
  id: string;
  book?: string | null;
  bookSlug?: string | null;
  chapter?: string | null;
  verse?: string | null;
  keyword?: string | null;
  keywordSlug?: string | null;

  // Navigation properties
  bibleVerseReferences?: BibleVerseReference[] | null;
}
