import { BibleVerse } from './bible-verse.entity';
import { BibleVersion } from './bible-version.entity';

export interface BibleVerseVersion {
  id: string;
  verseId?: string | null;
  bibleVersionId?: string | null;
  content?: string | null;

  // Navigation properties
  bibleVerse?: BibleVerse | null;
  bibleVersion?: BibleVersion | null;
}
