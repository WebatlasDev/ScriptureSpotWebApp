import { BibleVerseVersionModel } from './bible-verse-version.model';

export interface BibleVerseVersionWithBookVerseChapterSlugModel extends BibleVerseVersionModel {
  bookName?: string | null;
  chapterNumber?: number | null;
  verseNumber?: number | null;
  verseSlug?: string | null;
}
