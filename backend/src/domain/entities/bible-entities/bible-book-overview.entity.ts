import { BibleBook } from './bible-book.entity';
import { BibleBookStructure } from './bible-book-structure.entity';

export interface BibleBookOverview {
  id: string;
  bookId?: string | null;
  author?: string | null;
  audience?: string | null;
  composition?: string | null;
  objective?: string | null;
  uniqueElements?: string | null;
  bookStructure?: string | null;
  keyThemes?: string | null;
  teachingHighlights?: string | null;
  historicalContext?: string | null;
  culturalBackground?: string | null;
  politicalLandscape?: string | null;

  // Navigation properties
  bibleBook?: BibleBook | null;
  bibleBookStructures?: BibleBookStructure[] | null;
}
