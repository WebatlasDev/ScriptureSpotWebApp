import { BibleVerseTakeaway } from './bible-verse-takeaway.entity';

export interface BibleVerseTakeawayExcerpt {
  id: string;
  takeAwayId?: string | null;
  order?: number | null;
  title?: string | null;
  content?: string | null;

  // Navigation properties
  bibleVerseTakeaway?: BibleVerseTakeaway | null;
}
