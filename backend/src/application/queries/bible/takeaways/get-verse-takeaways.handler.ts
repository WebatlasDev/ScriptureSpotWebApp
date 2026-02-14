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
    console.log('[GetVerseTakeaways] Query params:', {
      bookSlug: request.bookSlug,
      chapterNumber: request.chapterNumber,
      verseNumber: request.verseNumber
    });

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
      select: {
        Id: true,
        BibleReferenceId: true,
        Slug: true,
        CommentaryAuthors: true,
        BibleVerseTakeawayExcerpts_BibleVerseTakeawayExcerpts_BibleVerseTakeawayIdToBibleVerseTakeaways: {
          select: {
            Id: true,
            BibleVerseTakeawayId: true,
            Title: true,
            Content: true,
            Order: true,
          },
          orderBy: {
            Order: 'asc',
          },
          take: 50, // Limit excerpts
        },
        BibleVerseTakeawayQuotes_BibleVerseTakeawayQuotes_BibleVerseTakeawayIdToBibleVerseTakeaways: {
          select: {
            Id: true,
            BibleVerseTakeawayId: true,
            AuthorId: true,
            Title: true,
            Order: true,
            Content: true,
          },
          orderBy: {
            Order: 'asc',
          },
          take: 50, // Limit quotes
        },
      },
    });

    console.log('[GetVerseTakeaways] Found takeaway:', !!takeaway);

    if (!takeaway) {
      return null;
    }

    const excerptModels: BibleVerseTakeawayExcerptModel[] = takeaway.BibleVerseTakeawayExcerpts_BibleVerseTakeawayExcerpts_BibleVerseTakeawayIdToBibleVerseTakeaways.map((excerpt): BibleVerseTakeawayExcerptModel => ({
      id: excerpt.Id ?? undefined,
      takeAwayId: excerpt.BibleVerseTakeawayId ?? undefined,
      title: excerpt.Title ?? undefined,
      content: excerpt.Content ?? undefined,
      order: excerpt.Order ?? undefined,
    }));

    const quoteModels: BibleVerseTakeawayQuoteModel[] = takeaway.BibleVerseTakeawayQuotes_BibleVerseTakeawayQuotes_BibleVerseTakeawayIdToBibleVerseTakeaways.map((quote): BibleVerseTakeawayQuoteModel => ({
      id: quote.Id ?? undefined,
      takeAwayId: quote.BibleVerseTakeawayId ?? undefined,
      authorId: quote.AuthorId ?? undefined,
      order: quote.Order ?? undefined,
      title: quote.Title ?? undefined,
      content: quote.Content ?? undefined,
      source: undefined,
      author: undefined,
    }));

    const result = {
      id: takeaway.Id ?? undefined,
      bibleReferenceId: takeaway.BibleReferenceId ?? undefined,
      slug: takeaway.Slug ?? undefined,
      commentaryAuthors: takeaway.CommentaryAuthors ?? undefined,
      excerpts: excerptModels,
      quotes: quoteModels,
    };

    console.log('[GetVerseTakeaways] Result:', {
      id: result.id,
      excerptCount: result.excerpts?.length || 0,
      quoteCount: result.quotes?.length || 0,
    });

    return result;
  }
}
