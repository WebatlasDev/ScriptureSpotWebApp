import { Author } from '../author-entities/author.entity';
import { BibleVerseTakeaway } from './bible-verse-takeaway.entity';

export interface BibleVerseTakeawayQuote {
  id: string;
  takeAwayId?: string | null;
  authorId?: string | null;
  order?: number | null;
  title?: string | null;
  content?: string | null;
  source?: string | null;

  // Navigation properties
  author?: Author | null;
  bibleVerseTakeaway?: BibleVerseTakeaway | null;
}
