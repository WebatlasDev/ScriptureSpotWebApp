import { BibleVerseReferenceFlattenedModel } from './bible-verse-reference-flattened.model';

export interface BibleVerseCrossReferenceModel {
  id: string;
  book?: string | null;
  bookSlug?: string | null;
  chapter?: string | null;
  verse?: string | null;
  keyword?: string | null;
  keywordSlug?: string | null;
  bibleVerseReferences?: BibleVerseReferenceFlattenedModel[] | null;
}
