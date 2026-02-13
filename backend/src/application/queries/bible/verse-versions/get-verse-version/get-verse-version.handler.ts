import { IRequestHandler } from '@/lib/mediator';
import { GetVerseVersionQuery } from './get-verse-version.query';
import { BibleVerseVersionModel } from '@/application/models/bible-models';
import { prisma } from '@/lib/prisma';

export class GetVerseVersionQueryHandler
  implements IRequestHandler<GetVerseVersionQuery, BibleVerseVersionModel>
{
  async handle(
    request: GetVerseVersionQuery,
    signal?: AbortSignal
  ): Promise<BibleVerseVersionModel> {
    const verseVersion = await prisma.bibleVerseVersions.findFirst({
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
        BibleVersions: {
          Abbreviation: {
            equals: request.versionName,
            mode: 'insensitive',
          },
        },
      },
    });

    if (!verseVersion) {
      throw new Error('Verse version not found');
    }

    return {
      id: verseVersion.Id ?? undefined,
      verseId: verseVersion.VerseId ?? undefined,
      bibleVersionId: verseVersion.BibleVersionId ?? undefined,
      content: verseVersion.Content ?? undefined,
    } as BibleVerseVersionModel;
  }
}
