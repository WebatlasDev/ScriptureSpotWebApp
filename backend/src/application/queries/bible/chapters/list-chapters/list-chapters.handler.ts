import { IRequestHandler } from '@/lib/mediator';
import { ListChaptersQuery } from './list-chapters.query';
import { BibleChapterModel } from '@/application/models/bible-models';
import { prisma } from '@/lib/prisma';

export class ListChaptersQueryHandler
  implements IRequestHandler<ListChaptersQuery, BibleChapterModel[]>
{
  async handle(
    request: ListChaptersQuery,
    signal?: AbortSignal
  ): Promise<BibleChapterModel[]> {
    const chapters = await prisma.bibleChapters.findMany({
      where: {
        BibleBooks: {
          Slug: request.bookSlug,
        },
      },
      orderBy: { ChapterNumber: 'asc' },
      include: {
        BibleBooks: true,
      },
    });

    return chapters.map(
      (chapter) =>
        ({
          id: chapter.Id,
          bookId: chapter.BookId ?? undefined,
          chapterNumber: chapter.ChapterNumber ?? undefined,
        } as BibleChapterModel)
    );
  }
}
