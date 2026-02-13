import { BibleBook } from './bible-book.entity';
import { BibleVerse } from './bible-verse.entity';

export interface BibleChapter {
  id: string;
  bookId?: string | null;
  chapterNumber?: number | null;

  // Navigation properties
  bibleBook?: BibleBook | null;
  verses?: BibleVerse[] | null;
}
