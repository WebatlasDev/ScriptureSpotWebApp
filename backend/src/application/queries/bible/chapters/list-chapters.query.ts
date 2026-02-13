import { BibleChapterModel } from '@/application/models/bible-models/bible-chapter.model';

/**
 * Query to retrieve all chapters for a specific Bible book
 */
export class ListChaptersQuery {
  bookSlug?: string;
}

export type ListChaptersQueryResponse = BibleChapterModel[];
