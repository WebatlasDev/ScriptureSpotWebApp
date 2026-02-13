import { BibleBookModel } from '@/application/models/bible-models/bible-book.model';

/**
 * Query to retrieve all Bible books ordered by book number
 */
export class ListBooksQuery {
  // No parameters needed - retrieves all books
}

export type ListBooksQueryResponse = BibleBookModel[];
