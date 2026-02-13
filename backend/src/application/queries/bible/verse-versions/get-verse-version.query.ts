import { BibleVerseVersionModel } from '@/application/models/bible-models/bible-verse-version.model';

/**
 * Query to retrieve a specific verse version
 */
export class GetVerseVersionQuery {
  bookSlug?: string;
  chapterNumber?: number;
  verseNumber?: number;
  versionName?: string;
}

export type GetVerseVersionQueryResponse = BibleVerseVersionModel | null;
