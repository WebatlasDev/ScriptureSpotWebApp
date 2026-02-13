import { IRequestHandler } from '@/lib/mediator';
import { ListInterlinearByVerseQuery } from './list-interlinear-by-verse.query';
import { InterlinearWordModel } from '@/application/models/bible-models';
import { prisma } from '@/lib/prisma';

export class ListInterlinearByVerseQueryHandler
  implements IRequestHandler<ListInterlinearByVerseQuery, InterlinearWordModel[]>
{
  async handle(
    request: ListInterlinearByVerseQuery,
    signal?: AbortSignal
  ): Promise<InterlinearWordModel[]> {
    const interlinears = await prisma.interlinearWords.findMany({
      where: {
        BibleVerseReferences: {
          BibleVerses_BibleVerseReferences_StartVerseIdToBibleVerses: {
            BibleChapters: {
              BibleBooks: {
                Slug: request.bookSlug,
              },
              ChapterNumber: request.chapterNumber,
            },
            VerseNumber: request.verseNumber,
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

    return interlinears.map((item) => ({
      id: item.Id,
      referenceId: item.BibleReferenceId ?? undefined,
      wordPosition: item.WordPosition ?? undefined,
      word: item.EnglishWord ?? undefined,
      transliteration: item.Transliteration ?? undefined,
      translation: item.EnglishWord ?? undefined,
      morphology: item.GrammarDetailed ?? undefined,
      strongLexiconKey: item.StrongsLexicons?.StrongsKey ?? undefined,
      strongsLexicon: item.StrongsLexicons
        ? {
            id: item.StrongsLexicons.Id,
            strongsKey: item.StrongsLexicons.StrongsKey ?? undefined,
            originalWord: item.StrongsLexicons.OriginalWord ?? undefined,
            transliteration: item.StrongsLexicons.Transliteration ?? undefined,
            pronunciation: item.StrongsLexicons.Pronunciation ?? undefined,
            strongsDef: item.StrongsLexicons.StrongsDef ?? undefined,
            shortDefinition: item.StrongsLexicons.ShortDefinition ?? undefined,
            wordOrigin: item.StrongsLexicons.WordOrigin ?? undefined,
          }
        : null,
    })) as InterlinearWordModel[];
  }
}
