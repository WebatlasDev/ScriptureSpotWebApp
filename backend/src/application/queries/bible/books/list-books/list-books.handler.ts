import { IRequestHandler } from '@/lib/mediator';
import { ListBooksQuery } from './list-books.query';
import { BibleBookModel } from '@/application/models/bible-models';
import { prisma } from '@/lib/prisma';

export class ListBooksQueryHandler
  implements IRequestHandler<ListBooksQuery, BibleBookModel[]>
{
  async handle(
    request: ListBooksQuery,
    signal?: AbortSignal
  ): Promise<BibleBookModel[]> {
    const books = await prisma.bibleBooks.findMany({
      orderBy: { BookNumber: 'asc' },
    });

    return books.map(
      (book) =>
        ({
          id: book.Id,
          bookNumber: book.BookNumber ?? undefined,
          name: book.Name ?? undefined,
          slug: book.Slug ?? undefined,
        } as BibleBookModel)
    );
  }
}
