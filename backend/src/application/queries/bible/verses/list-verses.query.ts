import { BibleVerseModel } from '@/application/models/bible-models/bible-verse.model';

/**
 * Query to retrieve all verses for a specific chapter
 */
export class ListVersesQuery {
  bookSlug?: string;
  chapterNumber?: number;
}

export type ListVersesQueryResponse = BibleVerseModel[];
