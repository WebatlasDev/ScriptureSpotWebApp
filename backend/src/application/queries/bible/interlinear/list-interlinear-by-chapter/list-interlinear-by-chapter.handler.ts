import { IRequestHandler } from '@/lib/mediator';
import { ListInterlinearByChapterQuery } from './list-interlinear-by-chapter.query';
import {
  VerseInterlinearModel,
  InterlinearWordModel,
} from '@/application/models/bible-models';
import { prisma } from '@/lib/prisma';

export class ListInterlinearByChapterQueryHandler
  implements
    IRequestHandler<ListInterlinearByChapterQuery, VerseInterlinearModel[]>
{
  async handle(
    request: ListInterlinearByChapterQuery,
    signal?: AbortSignal
  ): Promise<VerseInterlinearModel[]> {
    const verses = await prisma.bibleVerses.findMany({
      where: {
        BibleChapters: {
          BibleBooks: {
            Slug: request.bookSlug,
          },
          ChapterNumber: request.chapterNumber,
        },
      },
      orderBy: { VerseNumber: 'asc' },
    });

    const results: VerseInterlinearModel[] = [];

    for (const verse of verses) {
      const words = await prisma.interlinearWords.findMany({
        where: {
          BibleVerseReferences: {
            StartVerseId: verse.Id,
          },
        },
        include: {
          StrongsLexicons: true,
        },
        orderBy: { WordPosition: 'asc' },
      });

      if (words.length === 0) continue;

      const mappedWords: InterlinearWordModel[] = words.map((w) => ({
        id: w.Id,
        referenceId: w.BibleReferenceId ?? undefined,
        wordPosition: w.WordPosition ?? undefined,
        word: w.HebrewWord || w.GreekWord || undefined,
        transliteration: w.Transliteration ?? undefined,
        translation: w.EnglishWord ?? undefined,
        morphology: w.GrammarDetailed ?? undefined,
        strongLexiconKey: w.StrongsLexicons?.StrongsKey ?? undefined,
        strongsLexicon: w.StrongsLexicons
          ? {
              id: w.StrongsLexicons.Id,
              strongsKey: w.StrongsLexicons.StrongsKey ?? undefined,
              originalWord: w.StrongsLexicons.OriginalWord ?? undefined,
              transliteration: w.StrongsLexicons.Transliteration ?? undefined,
              pronunciation: w.StrongsLexicons.Pronunciation ?? undefined,
              strongsDef: w.StrongsLexicons.StrongsDef ?? undefined,
              shortDefinition: w.StrongsLexicons.ShortDefinition ?? undefined,
              wordOrigin: w.StrongsLexicons.WordOrigin ?? undefined,
            }
          : null,
      }));

      const language = words[0].HebrewWord ? 'HEBREW' : 'GREEK';

      results.push({
        verseNumber: verse.VerseNumber ?? 0,
        language,
        words: mappedWords,
      });
    }

    return results;
  }
}
