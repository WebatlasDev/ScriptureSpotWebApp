import { AuthorModel } from '../author-models/author.model';

export interface BibleVerseTakeawayQuoteModel {
  id: string;
  takeAwayId?: string | null;
  authorId?: string | null;
  order?: number | null;
  title?: string | null;
  content?: string | null;
  source?: string | null;
  author?: AuthorModel | null;
}
