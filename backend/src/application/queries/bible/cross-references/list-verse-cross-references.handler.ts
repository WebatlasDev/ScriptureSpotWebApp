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
    // Query cross-references with optimized select (avoid loading full nested objects)
    const crossReferences = await prisma.bibleVerseCrossReferences.findMany({
      where: {
        BookSlug: request.bookSlug || undefined,
        Chapter: request.chapterNumber || undefined,
        Verse: request.verseNumber || undefined,
      },
      select: {
        Id: true,
        Book: true,
        BookSlug: true,
        Chapter: true,
        Verse: true,
        Keyword: true,
        KeywordSlug: true,
        BibleVerseReferences: {
          select: {
            Id: true,
            StartVerseId: true,
            EndVerseId: true,
            BibleVerses_BibleVerseReferences_StartVerseIdToBibleVerses: {
              select: {
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
            BibleVerses_BibleVerseReferences_EndVerseIdToBibleVerses: {
              select: {
                VerseNumber: true,
                BibleChapters: {
                  select: {
                    ChapterNumber: true,
                    BibleBooks: {
                      select: {
                        BookNumber: true,
                      },
                    },
                  },
                },
              },
            },
          },
          take: 100, // Limit references per cross-reference to prevent excessive data
        },
      },
      take: 50, // Limit total cross-references to prevent timeout
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

    // Build specific verse IDs to fetch instead of fetching all verses from all books
    const verseIds = new Set<string>();
    
    for (const ref of uniqueRefs) {
      const startVerseId = ref.StartVerseId;
      const endVerseId = ref.EndVerseId;
      
      if (startVerseId) {
        verseIds.add(startVerseId);
      }
      if (endVerseId && endVerseId !== startVerseId) {
        verseIds.add(endVerseId);
      }
    }

    if (verseIds.size === 0) {
      return new Map(uniqueRefs.map((r) => [r.Id, '']));
    }

    // Query only the specific verses needed (much more efficient)
    const verseData = await prisma.bibleVerseVersions.findMany({
      where: {
        BibleVersionId: versionId,
        VerseId: { in: Array.from(verseIds) },
      },
      select: {
        VerseId: true,
        Content: true,
        BibleVerses: {
          select: {
            Id: true,
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
      },
    });

    // Create a map of verse ID to verse data
    const verseMap = new Map<string, VerseData>();
    for (const vd of verseData) {
      if (vd.BibleVerses && vd.VerseId) {
        verseMap.set(vd.VerseId, {
          bookNumber: vd.BibleVerses.BibleChapters?.BibleBooks?.BookNumber || 0,
          chapterNumber: vd.BibleVerses.BibleChapters?.ChapterNumber || 0,
          verseNumber: vd.BibleVerses.VerseNumber || 0,
          content: vd.Content,
        });
      }
    }

    // Build lookup for each reference (simplified - just use start and end verses)
    const lookup = new Map<string, string>();

    for (const ref of uniqueRefs) {
      const startVerseId = ref.StartVerseId;
      const endVerseId = ref.EndVerseId || startVerseId;
      
      const startVerse = verseMap.get(startVerseId);
      const endVerse = endVerseId !== startVerseId ? verseMap.get(endVerseId) : startVerse;
      
      if (startVerse) {
        let content = '';
        
        // If single verse or same verse
        if (!endVerse || startVerseId === endVerseId) {
          content = `<sup>${startVerse.verseNumber}</sup> ${startVerse.content || ''}`;
        } else {
          // Range - show both verses with ellipsis
          content = `<sup>${startVerse.verseNumber}</sup> ${startVerse.content || ''}... <sup>${endVerse.verseNumber}</sup> ${endVerse.content || ''}`;
        }
        
        lookup.set(ref.Id, content.trim());
      } else {
        lookup.set(ref.Id, '');
      }
    }

    return lookup;
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
