import { prisma } from '@/lib/prisma';
import { BibleBookModel } from '@/application/models/bible-models/bible-book.model';
import { ListBooksQuery, ListBooksQueryResponse } from './list-books.query';

/**
 * Handler for retrieving all Bible books
 */
export class ListBooksQueryHandler {
  async handle(query: ListBooksQuery): Promise<ListBooksQueryResponse> {
    const books = await prisma.bibleBooks.findMany({
      orderBy: {
        BookNumber: 'asc'
      }
    });

    return books.map(book => ({
      id: book.Id,
      name: book.Name ?? undefined,
      slug: book.Slug ?? undefined,
      bookNumber: book.BookNumber ?? undefined,
      testament: book.Testament ?? undefined,
      chapters: book.Chapters ?? undefined,
      verses: book.Verses ?? undefined
    }));
  }
}
