import { IRequestHandler } from '@/lib/mediator';
import { GetLandingPageQuery } from './get-landing-page.query';
import {
  LandingPageModel,
  LandingPageComponentModel,
  BibleBookOverviewModel,
  BibleVerseTakeawayModel,
  BibleBookStructureModel,
  BibleVerseTakeawayExcerptModel,
  BibleVerseTakeawayQuoteModel,
} from '@/application/models';
import { prisma } from '@/lib/prisma';

/**
 * Handler for GetLandingPageQuery
 * Retrieves a landing page with its components and associated data (overviews, takeaways)
 */
export class GetLandingPageQueryHandler
  implements IRequestHandler<GetLandingPageQuery, LandingPageModel | null>
{
  async handle(request: GetLandingPageQuery): Promise<LandingPageModel | null> {
    const page = await prisma.landingPages.findFirst({
      where: {
        OR: [{ Slug: request.slug || undefined }, { ReferenceSlug: request.slug || undefined }],
      },
      include: {
        LandingPageComponents: {
          orderBy: {
            Order: 'asc',
          },
        },
      },
    });

    if (!page) {
      return null;
    }

    const componentModels: LandingPageComponentModel[] = [];

    if (page.LandingPageComponents && page.LandingPageComponents.length > 0) {
      // Extract entity IDs by component type
      const overviewIds = page.LandingPageComponents
        .filter((c: typeof page.LandingPageComponents[0]) => c.ComponentType === 'BookOverviewSection')
        .map((c: typeof page.LandingPageComponents[0]) => c.EntityId);

      const takeawayIds = page.LandingPageComponents
        .filter((c: typeof page.LandingPageComponents[0]) => c.ComponentType === 'VerseTakeawaySection')
        .map((c: typeof page.LandingPageComponents[0]) => c.EntityId);

      // Load overviews
      const overviews =
        overviewIds.length > 0
          ? await prisma.bibleBookOverviews.findMany({
              where: {
                Id: { in: overviewIds },
              },
              include: {
                BibleBooks: true,
                BibleBookStructures: {
                  orderBy: {
                    Order: 'asc',
                  },
                },
              },
            })
          : [];

      const overviewMap = new Map(overviews.map((ov: typeof overviews[0]) => [ov.Id, ov]));

      // Load takeaways
      const takeaways =
        takeawayIds.length > 0
          ? await prisma.bibleVerseTakeaways.findMany({
              where: {
                Id: { in: takeawayIds },
              },
              include: {
                BibleVerseTakeawayExcerpts_BibleVerseTakeawayExcerpts_TakeAwayIdToBibleVerseTakeaways: {
                  orderBy: {
                    Order: 'asc',
                  },
                },
                BibleVerseTakeawayQuotes_BibleVerseTakeawayQuotes_TakeAwayIdToBibleVerseTakeaways: {
                  orderBy: {
                    Order: 'asc',
                  },
                },
              },
            })
          : [];

      const takeawayMap = new Map(takeaways.map((t: typeof takeaways[0]) => [t.Id, t]));

      // Build component models
      for (const component of page.LandingPageComponents) {
        const componentModel: LandingPageComponentModel = {
          id: component.Id ?? undefined,
          landingPageId: component.LandingPageId ?? undefined,
          componentType: component.ComponentType ?? undefined,
          entityId: component.EntityId ?? undefined,
          order: component.Order ?? 0,
          allowRandomOrder: component.AllowRandomOrder ?? false,
          data: undefined,
        };

        if (component.ComponentType === 'BookOverviewSection') {
          const overview = overviewMap.get(component.EntityId);
          if (overview) {
            let overviewModel: BibleBookOverviewModel = {
              id: overview.Id ?? undefined,
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
                id: overview.BibleBooks.Id ?? undefined,
                bookNumber: overview.BibleBooks.BookNumber ?? undefined,
                name: overview.BibleBooks.Name ?? undefined,
                slug: overview.BibleBooks.Slug ?? undefined,
              } : undefined,
              bibleBookStructures: overview.BibleBookStructures?.map(
                (structure: typeof overview.BibleBookStructures[0]): BibleBookStructureModel => ({
                  id: structure.Id ?? undefined,
                  bookOverviewId: structure.BookOverviewId ?? undefined,
                  order: structure.Order ?? undefined,
                  title: structure.Title ?? undefined,
                  description: structure.Description ?? undefined,
                  verses: structure.Verses ?? undefined,
                  verseReferenceSlug: structure.VerseReferenceSlug ?? undefined,
                })
              ),
            };

            // Filter fields based on slug patterns
            const slugLower = page.Slug?.toLowerCase();
            if (slugLower) {
              if (slugLower.startsWith('author-of-')) {
                overviewModel = {
                  ...overviewModel,
                  audience: undefined,
                  composition: undefined,
                  objective: undefined,
                  uniqueElements: undefined,
                  bookStructure: undefined,
                  keyThemes: undefined,
                  teachingHighlights: undefined,
                  historicalContext: undefined,
                  culturalBackground: undefined,
                  politicalLandscape: undefined,
                  bibleBookStructures: undefined,
                };
              } else if (slugLower.startsWith('audience-of-')) {
                overviewModel = {
                  ...overviewModel,
                  author: undefined,
                  composition: undefined,
                  objective: undefined,
                  uniqueElements: undefined,
                  bookStructure: undefined,
                  keyThemes: undefined,
                  teachingHighlights: undefined,
                  historicalContext: undefined,
                  culturalBackground: undefined,
                  politicalLandscape: undefined,
                  bibleBookStructures: undefined,
                };
              }
            }

            componentModel.data = overviewModel;
          }
        } else if (component.ComponentType === 'VerseTakeawaySection') {
          const takeaway = takeawayMap.get(component.EntityId);
          if (takeaway) {
            const excerptModels: BibleVerseTakeawayExcerptModel[] = (takeaway.BibleVerseTakeawayExcerpts_BibleVerseTakeawayExcerpts_TakeAwayIdToBibleVerseTakeaways || []).map(
              (excerpt): BibleVerseTakeawayExcerptModel => ({
                id: excerpt.Id ?? undefined,
                takeAwayId: excerpt.TakeAwayId ?? undefined,
                content: excerpt.Content ?? undefined,
                order: excerpt.Order ?? undefined,
                title: undefined,
              })
            );

            const quoteModels: BibleVerseTakeawayQuoteModel[] = (takeaway.BibleVerseTakeawayQuotes_BibleVerseTakeawayQuotes_TakeAwayIdToBibleVerseTakeaways || []).map(
              (quote): BibleVerseTakeawayQuoteModel => ({
                id: quote.Id ?? undefined,
                takeAwayId: quote.TakeAwayId ?? undefined,
                authorId: quote.AuthorId ?? undefined,
                order: quote.Order ?? undefined,
                title: undefined,
                content: quote.Content ?? undefined,
                source: undefined,
                author: undefined,
              })
            );

            const takeawayModel: BibleVerseTakeawayModel = {
              id: takeaway.Id ?? undefined,
              bibleReferenceId: takeaway.BibleReferenceId ?? undefined,
              slug: takeaway.Slug ?? undefined,
              commentaryAuthors: undefined,
              excerpts: excerptModels,
              quotes: quoteModels,
            };

            componentModel.data = takeawayModel;
          }
        }

        componentModels.push(componentModel);
      }
    }

    return {
      id: page.Id ?? undefined,
      slug: page.Slug ?? undefined,
      referenceSlug: page.ReferenceSlug ?? undefined,
      header: page.Header ?? undefined,
      subheader: page.Subheader ?? undefined,
      metaKeywords: page.MetaKeywords ?? undefined,
      metaDescription: page.MetaDescription ?? undefined,
      components: componentModels,
    };
  }
}
