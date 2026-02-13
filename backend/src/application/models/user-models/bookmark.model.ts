import { AuthorModel } from '../author-models/author.model';
import { CommentaryModel } from '../author-models/commentary.model';
import { QuoteModel } from '../author-models/quote.model';
import { BibleVerseModel } from '../bible-models/bible-verse.model';
import { BibleVerseVersionModel } from '../bible-models/bible-verse-version.model';
import { BibleBookOverviewModel } from '../bible-models/bible-book-overview.model';
import { BibleVerseTakeawayModel } from '../bible-models/bible-verse-takeaway.model';
import { StrongsLexiconModel } from '../bible-models/strongs-lexicon.model';
import { BookmarkType } from '@/domain/enums/bookmark-type.enum';

export interface BookmarkModel {
  id: string;
  type?: BookmarkType | null;
  referenceId?: string | null;
  userId?: string | null;
  createdDate?: Date | null;
  contentType?: BookmarkType | null;
  contentId?: string | null;
  title?: string | null;
  description?: string | null;
  reference?: string | null;
  author?: AuthorModel | null;
  slug?: string | null;
  tags: string[];
  createdAt?: Date | null;
  updatedAt?: Date | null;
  commentary?: CommentaryModel | null;
  quote?: QuoteModel | null;
  verse?: BibleVerseModel | null;
  verseVersion?: BibleVerseVersionModel | null;
  bookOverview?: BibleBookOverviewModel | null;
  takeaway?: BibleVerseTakeawayModel | null;
  strongsEntry?: StrongsLexiconModel | null;
}
