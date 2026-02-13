import { BibleVerseReferenceModel } from '../bible-models/bible-verse-reference.model';
import { AuthorModel } from './author.model';
import { CommentaryExcerptModel } from './commentary-excerpt.model';

export interface CommentaryModel {
  id: string;
  authorId?: string | null;
  bibleReferenceId?: string | null;
  slug?: string | null;
  source?: string | null;
  sourceUrl?: string | null;
  groupId?: string | null;
  bibleVerseReference?: BibleVerseReferenceModel | null;
  author?: AuthorModel | null;
  excerpts?: CommentaryExcerptModel[] | null;
  previewContent?: string | null;
}
