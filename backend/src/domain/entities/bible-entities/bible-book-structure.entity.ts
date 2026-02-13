import { BibleBookOverview } from './bible-book-overview.entity';

export interface BibleBookStructure {
  id: string;
  bookOverviewId?: string | null;
  order?: number | null;
  title?: string | null;
  description?: string | null;
  verses?: string | null;
  verseReferenceSlug?: string | null;

  // Navigation properties
  bibleBookOverview?: BibleBookOverview | null;
}
