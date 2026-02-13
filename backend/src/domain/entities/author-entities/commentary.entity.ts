import { Author } from './author.entity';
import { CommentaryExcerpt } from './commentary-excerpt.entity';
import { BibleVerseReference } from '../bible-entities/bible-verse-reference.entity';

export interface Commentary {
  id: string;
  authorId?: string | null;
  bibleReferenceId?: string | null;
  slug?: string | null;
  source?: string | null;
  sourceUrl?: string | null;
  groupId?: string | null;

  // Navigation properties
  bibleVerseReference?: BibleVerseReference | null;
  author?: Author | null;
  excerpts?: CommentaryExcerpt[] | null;
}
