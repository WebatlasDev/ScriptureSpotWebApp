import { IRequestHandler } from '@/lib/mediator';
import { ListStrongsVerseReferencesQuery } from './list-strongs-verse-references.query';
import { StrongsVerseReferenceModel } from '@/application/models/bible-models';
import { prisma } from '@/lib/prisma';

export class ListStrongsVerseReferencesQueryHandler
  implements
    IRequestHandler<
      ListStrongsVerseReferencesQuery,
      StrongsVerseReferenceModel[]
    >
{
  async handle(
    request: ListStrongsVerseReferencesQuery,
    signal?: AbortSignal
  ): Promise<StrongsVerseReferenceModel[]> {
    const version = await prisma.bibleVersions.findFirst({
      where: {
        Abbreviation: request.version,
      },
    });

    const references = await prisma.interlinearWords.findMany({
      where: {
        StrongsLexicons: {
          StrongsKey: request.strongsKey,
        },
      },
      include: {
        BibleVerseReferences: {
          include: {
            BibleVerses_BibleVerseReferences_StartVerseIdToBibleVerses: {
              include: {
                BibleChapters: {
                  include: {
                    BibleBooks: true,
                  },
                },
              },
            },
          },
        },
      },
      distinct: ['BibleReferenceId'],
      orderBy: [
        {
          BibleVerseReferences: {
            BibleVerses_BibleVerseReferences_StartVerseIdToBibleVerses: {
              BibleChapters: {
                BibleBooks: {
                  BookNumber: 'asc',
                },
              },
            },
          },
        },
      ],
    });

    const results: StrongsVerseReferenceModel[] = [];

    for (const ref of references) {
      if (!ref.BibleVerseReferences?.BibleVerses_BibleVerseReferences_StartVerseIdToBibleVerses) continue;

      const verse = ref.BibleVerseReferences.BibleVerses_BibleVerseReferences_StartVerseIdToBibleVerses;
      if (!verse.BibleChapters) continue;
      
      const book = verse.BibleChapters.BibleBooks;
      if (!book) continue;

      const verseText = version
        ? await prisma.bibleVerseVersions.findFirst({
            where: {
              BibleVersionId: version.Id,
              VerseId: verse.Id,
            },
            select: { Content: true },
          })
        : null;

      results.push({
        book: book.Name ?? undefined,
        chapter: verse.BibleChapters.ChapterNumber ?? undefined,
        verse: verse.VerseNumber ?? undefined,
        reference: `${book.Name} ${verse.BibleChapters.ChapterNumber}:${verse.VerseNumber}`,
        text: verseText?.Content ?? null,
      });
    }

    return results;
  }
}
