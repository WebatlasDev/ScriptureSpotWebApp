import { prisma } from '@/lib/prisma';
import { BibleBookOverviewModel } from '@/application/models/bible-models/bible-book-overview.model';
import { BibleBookStructureModel } from '@/application/models/bible-models/bible-book-structure.model';
import { GetOverviewQuery, GetOverviewQueryResponse } from './get-overview.query';

/**
 * Handler for retrieving a Bible book overview with structures
 */
export class GetOverviewQueryHandler {
  async handle(query: GetOverviewQuery): Promise<GetOverviewQueryResponse> {
    if (!query.slug) {
      return null;
    }

    const overview = await prisma.bibleBookOverviews.findFirst({
      where: {
        BibleBooks: {
          Slug: query.slug
        }
      },
      include: {
        BibleBooks: true,
        BibleBookStructures: {
          orderBy: {
            Order: 'asc'
          }
        }
      }
    });

    if (!overview) {
      return null;
    }

    const structures: BibleBookStructureModel[] = overview.BibleBookStructures.map(structure => ({
      id: structure.Id,
      bookOverviewId: structure.BookOverviewId ?? undefined,
      order: structure.Order ?? undefined,
      title: structure.Title ?? undefined,
      description: structure.Description ?? undefined,
      verses: structure.Verses ?? undefined,
      verseReferenceSlug: structure.VerseReferenceSlug ?? undefined
    }));

    return {
      id: overview.Id,
      bookId: overview.BookId ?? undefined,
      author: overview.Author ?? undefined,
      audience: overview.Audience ?? undefined,
      composition: overview.Composition ?? undefined,
      objective: overview.Objective ?? undefined,
      uniqueElements: overview.UniqueElements ?? undefined,
      bookStructure: overview.BookStructure ?? undefined,
      keyThemes: overview.KeyThemes ?? undefined,
      teachingHighlights: overview.TeachingHighlights ?? undefined,
      historicalContext: overview.HistoricalContext ?? undefined,
      culturalBackground: overview.CulturalBackground ?? undefined,
      politicalLandscape: overview.PoliticalLandscape ?? undefined,
      bibleBook: overview.BibleBooks ? {
        id: overview.BibleBooks.Id,
        name: overview.BibleBooks.Name ?? undefined,
        slug: overview.BibleBooks.Slug ?? undefined
      } : undefined,
      bibleBookStructures: structures
    };
  }
}
