import { IRequestHandler } from '@/lib/mediator';
import { 
  ListStrongsVerseReferencesQuery,
  PaginatedStrongsVerseReferencesModel 
} from './list-strongs-verse-references.query';
import { StrongsVerseReferenceModel } from '@/application/models/bible-models';
import { prisma } from '@/lib/prisma';

export class ListStrongsVerseReferencesQueryHandler
  implements
    IRequestHandler<
      ListStrongsVerseReferencesQuery,
      PaginatedStrongsVerseReferencesModel
    >
{
  async handle(
    request: ListStrongsVerseReferencesQuery,
    signal?: AbortSignal
  ): Promise<PaginatedStrongsVerseReferencesModel> {
    const version = request.version 
      ? await prisma.bibleVersions.findFirst({
          where: {
            Abbreviation: request.version,
          },
          select: {
            Id: true,
          },
        })
      : null;

    // Get total count of distinct references using groupBy
    const distinctReferences = await prisma.interlinearWords.groupBy({
      by: ['BibleReferenceId'],
      where: {
        StrongsLexicons: {
          StrongsKey: request.strongsKey,
        },
      },
    });
    const totalCount = distinctReferences.length;

    // Calculate pagination
    const page = request.page ?? 1;
    const pageSize = request.pageSize ?? 20;
    const skip = (page - 1) * pageSize;
    const totalPages = Math.ceil(totalCount / pageSize);

    const references = await prisma.interlinearWords.findMany({
      where: {
        StrongsLexicons: {
          StrongsKey: request.strongsKey,
        },
      },
      select: {
        BibleReferenceId: true,
        BibleVerseReferences: {
          select: {
            BibleVerses_BibleVerseReferences_StartVerseIdToBibleVerses: {
              select: {
                Id: true,
                VerseNumber: true,
                BibleChapters: {
                  select: {
                    ChapterNumber: true,
                    BibleBooks: {
                      select: {
                        Name: true,
                        Slug: true,
                        BookNumber: true,
                      },
                    },
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
      skip: skip,
      take: pageSize,
    });

    // Collect all verse IDs for batch query
    const verseIds = references
      .map(ref => ref.BibleVerseReferences?.BibleVerses_BibleVerseReferences_StartVerseIdToBibleVerses?.Id)
      .filter((id): id is string => !!id);

    // Batch load verse texts if version specified
    const verseTexts = version && verseIds.length > 0
      ? await prisma.bibleVerseVersions.findMany({
          where: {
            BibleVersionId: version.Id,
            VerseId: { in: verseIds },
          },
          select: {
            VerseId: true,
            Content: true,
          },
        })
      : [];

    // Create lookup map
    const verseTextMap = new Map(
      verseTexts.map(vt => [vt.VerseId, vt.Content])
    );

    const results: StrongsVerseReferenceModel[] = [];

    for (const ref of references) {
      if (!ref.BibleVerseReferences?.BibleVerses_BibleVerseReferences_StartVerseIdToBibleVerses) continue;

      const verse = ref.BibleVerseReferences.BibleVerses_BibleVerseReferences_StartVerseIdToBibleVerses;
      if (!verse.BibleChapters) continue;
      
      const book = verse.BibleChapters.BibleBooks;
      if (!book) continue;

      const verseText = verseTextMap.get(verse.Id) ?? null;

      results.push({
        book: book.Name ?? undefined,
        bookSlug: book.Slug ?? undefined,
        chapter: verse.BibleChapters.ChapterNumber ?? undefined,
        verse: verse.VerseNumber ?? undefined,
        reference: `${book.Name} ${verse.BibleChapters.ChapterNumber}:${verse.VerseNumber}`,
        text: verseText,
      });
    }

    return {
      results,
      totalCount,
      page,
      pageSize,
      totalPages,
    };
  }
}
