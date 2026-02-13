import { IRequestHandler } from '@/lib/mediator';
import { ListInterlinearByVerseQuery } from './list-interlinear-by-verse.query';
import { InterlinearWordModel } from '@/application/models';
import { prisma } from '@/lib/prisma';

/**
 * Handler for ListInterlinearByVerseQuery
 * Retrieves word-by-word interlinear data (Hebrew/Greek) for a specific verse
 */
export class ListInterlinearByVerseQueryHandler
  implements IRequestHandler<ListInterlinearByVerseQuery, InterlinearWordModel[]>
{
  async handle(request: ListInterlinearByVerseQuery): Promise<InterlinearWordModel[]> {
    const interlinears = await prisma.interlinearWords.findMany({
      where: {
        BibleVerseReferences: {
          BibleVerses_BibleVerseReferences_StartVerseIdToBibleVerses: {
            BibleChapters: {
              BibleBooks: {
                Slug: request.bookSlug || undefined,
              },
              ChapterNumber: request.chapterNumber || undefined,
            },
            VerseNumber: request.verseNumber || undefined,
          },
        },
      },
      include: {
        StrongsLexicons: true,
      },
      orderBy: {
        WordPosition: 'asc',
      },
    });

    return interlinears.map((item): InterlinearWordModel => ({
      id: item.Id,
      bibleReferenceId: item.BibleReferenceId ?? undefined,
      strongLexiconKey: item.StrongsLexicons?.StrongsKey ?? null,
      englishWord: item.EnglishWord ?? undefined,
      transliteration: item.Transliteration ?? undefined,
      grammarCompact: item.GrammarCompact ?? undefined,
      grammarDetailed: item.GrammarDetailed ?? undefined,
      punctuation: item.Punctuation ?? undefined,
      wordPosition: item.WordPosition ?? undefined,
      hebrewWord: item.HebrewWord ?? undefined,
      greekWord: item.GreekWord ?? undefined,
    }));
  }
}
