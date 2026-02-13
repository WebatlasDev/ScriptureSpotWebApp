import { BibleVerse } from './bible-verse.entity';

export interface BibleVerseReference {
  id: string;
  startVerseId?: string | null;
  endVerseId?: string | null;

  // Navigation properties
  startVerse?: BibleVerse | null;
  endVerse?: BibleVerse | null;
}
