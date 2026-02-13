import { BibleVerseReference } from './bible-verse-reference.entity';
import { BibleVerseTakeawayExcerpt } from './bible-verse-takeaway-excerpt.entity';
import { BibleVerseTakeawayQuote } from './bible-verse-takeaway-quote.entity';

export interface BibleVerseTakeaway {
  id: string;
  bibleReferenceId?: string | null;
  slug?: string | null;
  commentaryAuthors?: string | null;

  // Navigation properties
  bibleVerseReference?: BibleVerseReference | null;
  excerpts?: BibleVerseTakeawayExcerpt[] | null;
  quotes?: BibleVerseTakeawayQuote[] | null;
}
