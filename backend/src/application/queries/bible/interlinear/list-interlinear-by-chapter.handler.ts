import { IRequestHandler } from '@/lib/mediator';
import { ListInterlinearByChapterQuery } from './list-interlinear-by-chapter.query';
import { VerseInterlinearModel, InterlinearWordModel } from '@/application/models';
import { prisma } from '@/lib/prisma';

/**
 * Handler for ListInterlinearByChapterQuery
 * Retrieves interlinear data for all verses in a chapter, grouped by verse
 */
export class ListInterlinearByChapterQueryHandler
  implements IRequestHandler<ListInterlinearByChapterQuery, VerseInterlinearModel[]>
{
  async handle(request: ListInterlinearByChapterQuery): Promise<VerseInterlinearModel[]> {
    // Get all verses in the chapter
    const verses = await prisma.bibleVerses.findMany({
      where: {
        BibleChapters: {
          BibleBooks: {
            Slug: request.bookSlug || undefined,
          },
          ChapterNumber: request.chapterNumber || undefined,
        },
      },
      orderBy: {
        VerseNumber: 'asc',
      },
    });

    const results: VerseInterlinearModel[] = [];

    for (const verse of verses) {
      // Get interlinear words for this verse
      const words = await prisma.interlinearWords.findMany({
        where: {
          BibleVerseReferences: {
            StartVerseId: verse.Id,
          },
        },
        include: {
          StrongsLexicons: true,
        },
        orderBy: {
          WordPosition: 'asc',
        },
      });

      if (words.length === 0) continue;

      // Map words to models
      const mappedWords: InterlinearWordModel[] = words.map((w): InterlinearWordModel => ({
        id: w.Id,
        bibleReferenceId: w.BibleReferenceId ?? undefined,
        strongLexiconKey: w.StrongsLexicons?.StrongsKey ?? null,
        englishWord: w.EnglishWord ?? undefined,
        transliteration: w.Transliteration ?? undefined,
        grammarCompact: w.GrammarCompact ?? undefined,
        grammarDetailed: w.GrammarDetailed ?? undefined,
        punctuation: w.Punctuation ?? undefined,
        wordPosition: w.WordPosition ?? undefined,
        hebrewWord: w.HebrewWord ?? undefined,
        greekWord: w.GreekWord ?? undefined,
      }));

      // Determine language (Hebrew if hebrewWord exists, otherwise Greek)
      const language = words.some((w: typeof words[0]) => w.HebrewWord != null) ? 'HEBREW' : 'GREEK';

      results.push({
        verseNumber: verse.VerseNumber ?? 0,
        language,
        words: mappedWords,
      });
    }

    return results;
  }
}
