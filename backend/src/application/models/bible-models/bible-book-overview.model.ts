import { BibleBookModel } from './bible-book.model';
import { BibleBookStructureModel } from './bible-book-structure.model';

export interface BibleBookOverviewModel {
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
  bibleBook?: BibleBookModel | null;
  bibleBookStructures?: BibleBookStructureModel[] | null;
}
