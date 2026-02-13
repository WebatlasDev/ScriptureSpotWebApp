import { IRequestHandler } from '@/lib/mediator';
import { ListVerseCrossReferencesQuery } from './list-verse-cross-references.query';
import { BibleVerseCrossReferenceModel, BibleVerseReferenceFlattenedModel } from '@/application/models';
import { prisma } from '@/lib/prisma';

type VerseData = {
  bookNumber: number;
  chapterNumber: number;
  verseNumber: number;
  content: string | null;
};

/**
 * Handler for ListVerseCrossReferencesQuery
 * Retrieves cross-references for a specific verse with formatted reference text
 */
export class ListVerseCrossReferencesQueryHandler
  implements IRequestHandler<ListVerseCrossReferencesQuery, BibleVerseCrossReferenceModel[]>
{
  async handle(request: ListVerseCrossReferencesQuery): Promise<BibleVerseCrossReferenceModel[]> {
    // Query cross-references
    const crossReferences = await prisma.bibleVerseCrossReferences.findMany({
      where: {
        BookSlug: request.bookSlug || undefined,
        Chapter: request.chapterNumber || undefined,
        Verse: request.verseNumber || undefined,
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
            BibleVerses_BibleVerseReferences_EndVerseIdToBibleVerses: {
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
    });

    // Order the results
    const ordered = crossReferences.sort((a: typeof crossReferences[0], b: typeof crossReferences[0]) => {
      // First by keyword slug
      const keywordCompare = (a.KeywordSlug || '').localeCompare(b.KeywordSlug || '');
      if (keywordCompare !== 0) return keywordCompare;

     // Then by first reference's book number
      const aFirstRef = a.BibleVerseReferences[0];
      const bFirstRef = b.BibleVerseReferences[0];

      const aBookNum = aFirstRef?.BibleVerses_BibleVerseReferences_StartVerseIdToBibleVerses?.BibleChapters?.BibleBooks?.BookNumber || 0;
      const bBookNum = bFirstRef?.BibleVerses_BibleVerseReferences_StartVerseIdToBibleVerses?.BibleChapters?.BibleBooks?.BookNumber || 0;
      if (aBookNum !== bBookNum) return aBookNum - bBookNum;

      // Then by chapter number
      const aChapter = aFirstRef?.BibleVerses_BibleVerseReferences_StartVerseIdToBibleVerses?.BibleChapters?.ChapterNumber || 0;
      const bChapter = bFirstRef?.BibleVerses_BibleVerseReferences_StartVerseIdToBibleVerses?.BibleChapters?.ChapterNumber || 0;
      if (aChapter !== bChapter) return aChapter - bChapter;

      // Then by verse number
      const aVerse = aFirstRef?.BibleVerses_BibleVerseReferences_StartVerseIdToBibleVerses?.VerseNumber || 0;
      const bVerse = bFirstRef?.BibleVerses_BibleVerseReferences_StartVerseIdToBibleVerses?.VerseNumber || 0;
      return aVerse - bVerse;
    });

    // Get version ID if specified
    const normalizedVersion = request.version?.trim() || '';
    let versionId: string | null = null;
    if (normalizedVersion) {
      const version = await prisma.bibleVersions.findFirst({
        where: { Abbreviation: normalizedVersion },
        select: { Id: true },
      });
      versionId = version?.Id || null;
    }

    // Build reference text lookup
    const allReferences = ordered.flatMap((cr: typeof ordered[0]) => cr.BibleVerseReferences);
    const referenceTextLookup = await this.buildReferenceTextLookup(allReferences, versionId);

    // Map to models
    const models: BibleVerseCrossReferenceModel[] = [];

    for (const crossRef of ordered) {
      const model: BibleVerseCrossReferenceModel = {
        id: crossRef.Id,
        book: crossRef.Book,
        bookSlug: crossRef.BookSlug,
        chapter: crossRef.Chapter,
        verse: crossRef.Verse,
        keyword: crossRef.Keyword,
        keywordSlug: crossRef.KeywordSlug,
        bibleVerseReferences: [],
      };

      for (const ref of crossRef.BibleVerseReferences) {
        const referenceModel: BibleVerseReferenceFlattenedModel = {
          id: ref.Id,
          label: this.formatReferenceLabel(
            ref.BibleVerses_BibleVerseReferences_StartVerseIdToBibleVerses?.BibleChapters?.BibleBooks?.Name || '',
            ref.BibleVerses_BibleVerseReferences_StartVerseIdToBibleVerses?.BibleChapters?.ChapterNumber || null,
            ref.BibleVerses_BibleVerseReferences_StartVerseIdToBibleVerses?.VerseNumber || null,
            ref.BibleVerses_BibleVerseReferences_EndVerseIdToBibleVerses?.BibleChapters?.ChapterNumber || null,
            ref.BibleVerses_BibleVerseReferences_EndVerseIdToBibleVerses?.VerseNumber || null
          ),
          slug: ref.BibleVerses_BibleVerseReferences_StartVerseIdToBibleVerses
            ? `/${ref.BibleVerses_BibleVerseReferences_StartVerseIdToBibleVerses.BibleChapters?.BibleBooks?.Slug}/${ref.BibleVerses_BibleVerseReferences_StartVerseIdToBibleVerses.BibleChapters?.ChapterNumber}/${ref.BibleVerses_BibleVerseReferences_StartVerseIdToBibleVerses.VerseNumber}`
            : '',
          text: referenceTextLookup.get(ref.Id) || '',
        };

        model.bibleVerseReferences?.push(referenceModel);
      }

      models.push(model);
    }

    return models;
  }

  private async buildReferenceTextLookup(
    references: any[],
    versionId: string | null
  ): Promise<Map<string, string>> {
    // Remove duplicates
    const uniqueRefs = Array.from(new Map(references.map((r) => [r.id, r])).values());

    if (uniqueRefs.length === 0 || !versionId) {
      return new Map();
    }

    // Collect all book numbers in range
    const bookNumbers = new Set<number>();

    for (const ref of uniqueRefs) {
      const startBookNum = ref.BibleVerses_BibleVerseReferences_StartVerseIdToBibleVerses?.BibleChapters?.BibleBooks?.BookNumber;
      if (!startBookNum) continue;

      const endBookNum = ref.BibleVerses_BibleVerseReferences_EndVerseIdToBibleVerses?.BibleChapters?.BibleBooks?.BookNumber || startBookNum;
      const min = Math.min(startBookNum, endBookNum);
      const max = Math.max(startBookNum, endBookNum);

      for (let i = min; i <= max; i++) {
        bookNumbers.add(i);
      }
    }

    if (bookNumbers.size === 0) {
      return new Map(uniqueRefs.map((r) => [r.Id, '']));
    }

    // Query verses for all books in range
    const verseData = await prisma.bibleVerseVersions.findMany({
      where: {
        BibleVersionId: versionId,
        BibleVerses: {
          BibleChapters: {
            BibleBooks: {
              BookNumber: { in: Array.from(bookNumbers) },
            },
          },
        },
      },
      select: {
        BibleVerses: {
          select: {
            BibleChapters: {
              select: {
                BibleBooks: {
                  select: {
                    BookNumber: true,
                  },
                },
                ChapterNumber: true,
              },
            },
            VerseNumber: true,
          },
        },
        Content: true,
      },
    });

    // Group verses by book number
    const versesByBook = new Map<number, VerseData[]>();
    for (const vd of verseData) {
      const bookNum = vd.BibleVerses?.BibleChapters?.BibleBooks?.BookNumber || 0;
      const chapterNum = vd.BibleVerses?.BibleChapters?.ChapterNumber || 0;
      const verseNum = vd.BibleVerses?.VerseNumber || 0;

      if (!versesByBook.has(bookNum)) {
        versesByBook.set(bookNum, []);
      }

      versesByBook.get(bookNum)!.push({
        bookNumber: bookNum,
        chapterNumber: chapterNum,
        verseNumber: verseNum,
        content: vd.Content,
      });
    }

    // Build lookup for each reference
    const lookup = new Map<string, string>();

    for (const ref of uniqueRefs) {
      const startBook = ref.BibleVerses_BibleVerseReferences_StartVerseIdToBibleVerses?.BibleChapters?.BibleBooks?.BookNumber || 0;
      if (startBook === 0) {
        lookup.set(ref.Id, '');
        continue;
      }

      const startChapter = ref.BibleVerses_BibleVerseReferences_StartVerseIdToBibleVerses?.BibleChapters?.ChapterNumber || 0;
      const startVerse = ref.BibleVerses_BibleVerseReferences_StartVerseIdToBibleVerses?.VerseNumber || 0;

      const endBook = ref.BibleVerses_BibleVerseReferences_EndVerseIdToBibleVerses?.BibleChapters?.BibleBooks?.BookNumber || startBook;
      const endChapter = ref.BibleVerses_BibleVerseReferences_EndVerseIdToBibleVerses?.BibleChapters?.ChapterNumber || startChapter;
      const endVerse = ref.BibleVerses_BibleVerseReferences_EndVerseIdToBibleVerses?.VerseNumber || startVerse;

      const versesInRange = this.getVersesInRange(
        versesByBook,
        startBook,
        startChapter,
        startVerse,
        endBook,
        endChapter,
        endVerse
      );

      lookup.set(ref.Id, this.formatVerseContent(versesInRange));
    }

    return lookup;
  }

  private getVersesInRange(
    versesByBook: Map<number, VerseData[]>,
    startBook: number,
    startChapter: number,
    startVerse: number,
    endBook: number,
    endChapter: number,
    endVerse: number
  ): VerseData[] {
    const minBook = Math.min(startBook, endBook);
    const maxBook = Math.max(startBook, endBook);

    const result: VerseData[] = [];

    for (let bookNum = minBook; bookNum <= maxBook; bookNum++) {
      const verses = versesByBook.get(bookNum);
      if (!verses) continue;

      for (const verse of verses) {
        if (this.isWithinRange(verse, startBook, startChapter, startVerse, endBook, endChapter, endVerse)) {
          result.push(verse);
        }
      }
    }

    // Sort results
    result.sort((a, b) => {
      if (a.bookNumber !== b.bookNumber) return a.bookNumber - b.bookNumber;
      if (a.chapterNumber !== b.chapterNumber) return a.chapterNumber - b.chapterNumber;
      return a.verseNumber - b.verseNumber;
    });

    return result;
  }

  private isWithinRange(
    verse: VerseData,
    startBook: number,
    startChapter: number,
    startVerse: number,
    endBook: number,
    endChapter: number,
    endVerse: number
  ): boolean {
    const minBook = Math.min(startBook, endBook);
    const maxBook = Math.max(startBook, endBook);

    if (verse.bookNumber < minBook || verse.bookNumber > maxBook) {
      return false;
    }

    if (verse.bookNumber === startBook) {
      if (verse.chapterNumber < startChapter) return false;
      if (verse.chapterNumber === startChapter && verse.verseNumber < startVerse) return false;
    }

    if (verse.bookNumber === endBook) {
      if (verse.chapterNumber > endChapter) return false;
      if (verse.chapterNumber === endChapter && verse.verseNumber > endVerse) return false;
    }

    return true;
  }

  private formatVerseContent(verses: VerseData[]): string {
    const parts: string[] = [];

    for (const verse of verses) {
      if (verse.content) {
        parts.push(`<sup>${verse.verseNumber}</sup> ${verse.content}`);
      }
    }

    return parts.join(' ').trim();
  }

  private formatReferenceLabel(
    bookName: string,
    startChapter: number | null,
    startVerse: number | null,
    endChapter: number | null,
    endVerse: number | null
  ): string {
    if (!endChapter || !endVerse) {
      return `${bookName} ${startChapter}:${startVerse}`;
    }

    if (startChapter === endChapter) {
      return `${bookName} ${startChapter}:${startVerse}–${endVerse}`;
    }

    return `${bookName} ${startChapter}:${startVerse} – ${endChapter}:${endVerse}`;
  }
}
