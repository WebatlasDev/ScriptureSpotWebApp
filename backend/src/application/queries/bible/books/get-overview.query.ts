import { BibleBookOverviewModel } from '@/application/models/bible-models/bible-book-overview.model';

/**
 * Query to retrieve a Bible book overview by slug
 */
export class GetOverviewQuery {
  slug?: string;
}

export type GetOverviewQueryResponse = BibleBookOverviewModel | null;
