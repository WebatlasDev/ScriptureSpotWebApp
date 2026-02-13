import { IRequestHandler } from '@/lib/mediator';
import { GetVerseOfTheDayQuery } from './get-verse-of-the-day.query';
import { VerseOfTheDayModel } from '@/application/models';
import { prisma } from '@/lib/prisma';

/**
 * Handler for GetVerseOfTheDayQuery
 * Returns a random verse for "verse of the day" feature
 */
export class GetVerseOfTheDayQueryHandler
  implements IRequestHandler<GetVerseOfTheDayQuery, VerseOfTheDayModel>
{
  async handle(request: GetVerseOfTheDayQuery): Promise<VerseOfTheDayModel> {
    // Get version ID
    const normalizedVersion = request.version?.trim().toLowerCase() || 'niv';
    
    let version = await prisma.bibleVersions.findFirst({
      where: {
        Abbreviation: normalizedVersion,
      },
      select: { Id: true },
    });

    // Fallback to first available version
    if (!version) {
      version = await prisma.bibleVersions.findFirst({
        select: { Id: true },
      });
    }

    if (!version) {
      // Return default verse if no versions exist
      return {
        text: 'Start children off on the way they should go, and even when they are old they will not turn from it.',
        reference: 'Proverbs 22:6',
      };
    }

    // Get random verse (simulate ORDER BY RANDOM())
    // Note: Prisma doesn't support ORDER BY RANDOM() directly without raw SQL
    // For now, we'll get a random offset
    const count = await prisma.bibleVerseVersions.count({
      where: { BibleVersionId: version.Id },
    });

    if (count === 0) {
      return {
        text: 'Start children off on the way they should go, and even when they are old they will not turn from it.',
        reference: 'Proverbs 22:6',
      };
    }

    const randomOffset = Math.floor(Math.random() * count);

    const verseVersion = await prisma.bibleVerseVersions.findMany({
      where: { BibleVersionId: version.Id },
      include: {
        BibleVerses: {
          include: {
            BibleChapters: {
              include: {
                BibleBooks: true,
              },
            },
          },
        },
      },
      skip: randomOffset,
      take: 1,
    });

    const verse = verseVersion[0];

    if (!verse) {
      return {
        text: 'Start children off on the way they should go, and even when they are old they will not turn from it.',
        reference: 'Proverbs 22:6',
      };
    }

    return {
      text: verse.Content ?? '',
      reference: `${verse.BibleVerses?.BibleChapters?.BibleBooks?.Name} ${verse.BibleVerses?.BibleChapters?.ChapterNumber}:${verse.BibleVerses?.VerseNumber}`,
    };
  }
}
