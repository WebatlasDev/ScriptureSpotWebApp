import { IRequestHandler } from '@/lib/mediator';
import { GetVerseTakeawaysQuery } from './get-verse-takeaways.query';
import { BibleVerseTakeawayModel, BibleVerseTakeawayExcerptModel, BibleVerseTakeawayQuoteModel } from '@/application/models';
import { prisma } from '@/lib/prisma';

/**
 * Handler for GetVerseTakeawaysQuery
 * Retrieves key takeaways, excerpts, and quotes for a specific verse
 */
export class GetVerseTakeawaysQueryHandler
  implements IRequestHandler<GetVerseTakeawaysQuery, BibleVerseTakeawayModel | null>
{
  async handle(request: GetVerseTakeawaysQuery): Promise<BibleVerseTakeawayModel | null> {
    const takeaway = await prisma.bibleVerseTakeaways.findFirst({
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
    });

    if (!takeaway) {
      return null;
    }

    const excerptModels: BibleVerseTakeawayExcerptModel[] = takeaway.BibleVerseTakeawayExcerpts_BibleVerseTakeawayExcerpts_TakeAwayIdToBibleVerseTakeaways.map((excerpt): BibleVerseTakeawayExcerptModel => ({
      id: excerpt.Id ?? undefined,
      takeAwayId: excerpt.TakeAwayId ?? undefined,
      content: excerpt.Content ?? undefined,
      order: excerpt.Order ?? undefined,
      title: undefined,
    }));

    const quoteModels: BibleVerseTakeawayQuoteModel[] = takeaway.BibleVerseTakeawayQuotes_BibleVerseTakeawayQuotes_TakeAwayIdToBibleVerseTakeaways.map((quote): BibleVerseTakeawayQuoteModel => ({
      id: quote.Id ?? undefined,
      takeAwayId: quote.TakeAwayId ?? undefined,
      authorId: quote.AuthorId ?? undefined,
      order: quote.Order ?? undefined,
      title: undefined,
      content: quote.Content ?? undefined,
      source: undefined,
      author: undefined,
    }));

    return {
      id: takeaway.Id ?? undefined,
      bibleReferenceId: takeaway.BibleReferenceId ?? undefined,
      slug: takeaway.Slug ?? undefined,
      commentaryAuthors: undefined,
      excerpts: excerptModels,
      quotes: quoteModels,
    };
  }
}
