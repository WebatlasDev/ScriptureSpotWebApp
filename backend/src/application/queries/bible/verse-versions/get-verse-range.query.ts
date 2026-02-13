import { BibleVerseRangeModel } from '@/application/models/bible-models/bible-verse-range.model';

/**
 * Query to retrieve a range of verses (e.g., "1-3" or "5")
 */
export class GetVerseRangeQuery {
  bookSlug?: string;
  chapterNumber?: number;
  verseRange?: string;
  versionName?: string;
}

export type GetVerseRangeQueryResponse = BibleVerseRangeModel;
