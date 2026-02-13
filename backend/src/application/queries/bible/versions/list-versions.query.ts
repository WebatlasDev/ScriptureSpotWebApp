import { BibleVersionModel } from '@/application/models/bible-models/bible-version.model';

/**
 * Query to retrieve all Bible versions ordered by name
 */
export class ListVersionsQuery {
  // No parameters needed - retrieves all versions
}

export type ListVersionsQueryResponse = BibleVersionModel[];
