import { BibleVerseModel } from '../bible-models/bible-verse.model';
import { AuthorModel } from './author.model';

export interface QuoteModel {
  id: string;
  verseId?: string | null;
  authorId?: string | null;
  content?: string | null;
  bibleVerse?: BibleVerseModel | null;
  author?: AuthorModel | null;
}
