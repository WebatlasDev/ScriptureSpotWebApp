import { BibleVerseVersionModel } from '@/application/models/bible-models/bible-verse-version.model';

/**
 * Query to retrieve all versions of a specific verse
 */
export class ListVerseVersionsQuery {
  bookSlug?: string;
  chapterNumber?: number;
  verseNumber?: number;
}

export type ListVerseVersionsQueryResponse = BibleVerseVersionModel[];
