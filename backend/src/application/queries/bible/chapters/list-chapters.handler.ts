import { prisma } from '@/lib/prisma';
import { BibleChapterModel } from '@/application/models/bible-models/bible-chapter.model';
import { ListChaptersQuery, ListChaptersQueryResponse } from './list-chapters.query';

/**
 * Handler for retrieving all chapters for a Bible book
 */
export class ListChaptersQueryHandler {
  async handle(query: ListChaptersQuery): Promise<ListChaptersQueryResponse> {
    if (!query.bookSlug) {
      return [];
    }

    const chapters = await prisma.bibleChapters.findMany({
      where: {
        BibleBooks: {
          Slug: query.bookSlug
        }
      },
      orderBy: {
        ChapterNumber: 'asc'
      }
    });

    return chapters.map(chapter => ({
      id: chapter.Id,
      bookId: chapter.BookId ?? undefined,
      chapterNumber: chapter.ChapterNumber ?? undefined
    }));
  }
}
