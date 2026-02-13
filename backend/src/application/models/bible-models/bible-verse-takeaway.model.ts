import { BibleVerseReferenceModel } from './bible-verse-reference.model';
import { BibleVerseTakeawayExcerptModel } from './bible-verse-takeaway-excerpt.model';
import { BibleVerseTakeawayQuoteModel } from './bible-verse-takeaway-quote.model';

export interface BibleVerseTakeawayModel {
  id: string;
  bibleReferenceId?: string | null;
  slug?: string | null;
  commentaryAuthors?: string | null;
  bibleVerseReference?: BibleVerseReferenceModel | null;
  excerpts?: BibleVerseTakeawayExcerptModel[] | null;
  quotes?: BibleVerseTakeawayQuoteModel[] | null;
}
