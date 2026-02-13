import { BibleBookOverview } from './bible-book-overview.entity';
import { BibleChapter } from './bible-chapter.entity';

export interface BibleBook {
  id: string;
  name?: string | null;
  abbreviation?: string | null;
  bookNumber?: number | null;
  description?: string | null;
  slug?: string | null;
  aliases?: string | null;

  // Navigation properties
  bibleBookOverview?: BibleBookOverview | null;
  chapters?: BibleChapter[] | null;
}
