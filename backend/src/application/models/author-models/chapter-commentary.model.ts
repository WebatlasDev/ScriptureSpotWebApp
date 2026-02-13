import { CommentaryModel } from './commentary.model';
import { ChapterVerseModel } from './chapter-verse.model';

export interface ChapterCommentaryModel {
  verseNumber: number;
  verseRange?: string | null;
  groupId?: string | null;
  commentaries: CommentaryModel[];
  verses: ChapterVerseModel[];
}
