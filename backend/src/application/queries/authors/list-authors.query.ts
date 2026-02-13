/**
 * List Authors Query
 */

import { AuthorModel } from '@/application/models/author-models/author.model';

export class ListAuthorsQuery {
  // No parameters needed - retrieves all authors
}

export type ListAuthorsQueryResponse = AuthorModel[];
