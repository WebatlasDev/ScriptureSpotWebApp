import { IRequestHandler } from '@/lib/mediator';
import { GetOverviewQuery } from './get-overview.query';
import { BibleBookOverviewModel } from '@/application/models/bible-models';
import { prisma } from '@/lib/prisma';

export class GetOverviewQueryHandler
  implements IRequestHandler<GetOverviewQuery, BibleBookOverviewModel | null>
{
  async handle(
    request: GetOverviewQuery,
    signal?: AbortSignal
  ): Promise<BibleBookOverviewModel | null> {
    const overview = await prisma.bibleBookOverviews.findFirst({
      where: {
        BibleBooks: {
          Slug: request.slug,
        },
      },
      include: {
        BibleBooks: true,
        BibleBookStructures: {
          orderBy: { Order: 'asc' },
        },
      },
    });

    if (!overview) {
      return null;
    }

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
        bookNumber: overview.BibleBooks.BookNumber ?? undefined,
        name: overview.BibleBooks.Name ?? undefined,
        slug: overview.BibleBooks.Slug ?? undefined,
      } : undefined,
      bibleBookStructures: overview.BibleBookStructures.map((structure) => ({
        id: structure.Id,
        bookOverviewId: structure.BookOverviewId ?? undefined,
        title: structure.Title ?? undefined,
        description: structure.Description ?? undefined,
        verses: structure.Verses ?? undefined,
        verseReferenceSlug: structure.VerseReferenceSlug ?? undefined,
        order: structure.Order ?? undefined,
      })),
    } as BibleBookOverviewModel;
  }
}
