import { Author } from './author.entity';
import { BibleVerse } from '../bible-entities/bible-verse.entity';

export interface Quote {
  id: string;
  authorId?: string | null;
  bibleVerseId?: string | null;
  content?: string | null;
  slug?: string | null;

  // Navigation properties
  author?: Author | null;
  bibleVerse?: BibleVerse | null;
}
