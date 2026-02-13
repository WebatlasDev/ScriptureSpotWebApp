import { IRequestHandler } from '@/lib/mediator';
import { GetVerseTakeawaysQuery } from './get-verse-takeaways.query';
import { BibleVerseTakeawayModel } from '@/application/models/bible-models';
import { prisma } from '@/lib/prisma';

export class GetVerseTakeawaysQueryHandler
  implements
    IRequestHandler<GetVerseTakeawaysQuery, BibleVerseTakeawayModel | null>
{
  async handle(
    request: GetVerseTakeawaysQuery,
    signal?: AbortSignal
  ): Promise<BibleVerseTakeawayModel | null> {
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

    return {
      id: takeaway.Id ?? undefined,
      slug: takeaway.Slug ?? undefined,
      bibleReferenceId: takeaway.BibleReferenceId ?? undefined,
      excerpts: takeaway.BibleVerseTakeawayExcerpts_BibleVerseTakeawayExcerpts_TakeAwayIdToBibleVerseTakeaways?.map(e => ({
        id: e.Id ?? undefined,
        takeAwayId: e.TakeAwayId ?? undefined,
        content: e.Content ?? undefined,
        order: e.Order ?? undefined,
        title: undefined,
      })) ?? [],
      quotes: takeaway.BibleVerseTakeawayQuotes_BibleVerseTakeawayQuotes_TakeAwayIdToBibleVerseTakeaways?.map(q => ({
        id: q.Id ?? undefined,
        takeAwayId: q.TakeAwayId ?? undefined,
        authorId: q.AuthorId ?? undefined,
        order: q.Order ?? undefined,
        title: undefined,
        content: q.Content ?? undefined,
        source: undefined,
        author: undefined,
      })) ?? [],
      commentaryAuthors: undefined,
    } as BibleVerseTakeawayModel;
  }
}
