import { IRequestHandler } from '@/lib/mediator';
import { ListVerseVersionsQuery } from './list-verse-versions.query';
import { BibleVerseVersionModel } from '@/application/models/bible-models';
import { prisma } from '@/lib/prisma';

export class ListVerseVersionsQueryHandler
  implements IRequestHandler<ListVerseVersionsQuery, BibleVerseVersionModel[]>
{
  async handle(
    request: ListVerseVersionsQuery,
    signal?: AbortSignal
  ): Promise<BibleVerseVersionModel[]> {
    const verseVersions = await prisma.bibleVerseVersions.findMany({
      where: {
        BibleVerses: {
          BibleChapters: {
            BibleBooks: {
              Slug: request.bookSlug,
            },
            ChapterNumber: request.chapterNumber,
          },
          VerseNumber: request.verseNumber,
        },
      },
      include: {
        BibleVersions: true,
      },
      orderBy: {
        BibleVersions: {
          Name: 'asc',
        },
      },
    });

    return verseVersions.map((vv) => ({
      id: vv.Id ?? undefined,
      verseId: vv.VerseId ?? undefined,
      bibleVersionId: vv.BibleVersionId ?? undefined,
      content: vv.Content ?? undefined,
    }));
  }
}
