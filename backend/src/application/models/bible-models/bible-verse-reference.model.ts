import { BibleVerseModel } from './bible-verse.model';

export interface BibleVerseReferenceModel {
  id: string;
  startVerseId?: string | null;
  endVerseId?: string | null;
  startVerse?: BibleVerseModel | null;
  endVerse?: BibleVerseModel | null;
}
