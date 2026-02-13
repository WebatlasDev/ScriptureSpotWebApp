import { BibleChapter } from './bible-chapter.entity';
import { BibleVerseVersion } from './bible-verse-version.entity';

export interface BibleVerse {
  id: string;
  chapterId?: string | null;
  verseNumber?: number | null;

  // Navigation properties
  bibleChapter?: BibleChapter | null;
  versions?: BibleVerseVersion[] | null;
}
