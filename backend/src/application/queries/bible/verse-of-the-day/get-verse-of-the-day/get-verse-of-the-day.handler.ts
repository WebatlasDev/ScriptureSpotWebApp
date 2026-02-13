import { IRequestHandler } from '@/lib/mediator';
import { GetVerseOfTheDayQuery } from './get-verse-of-the-day.query';
import { VerseOfTheDayModel } from '@/application/models/bible-models';
import { prisma } from '@/lib/prisma';

export class GetVerseOfTheDayQueryHandler
  implements IRequestHandler<GetVerseOfTheDayQuery, VerseOfTheDayModel>
{
  async handle(
    request: GetVerseOfTheDayQuery,
    signal?: AbortSignal
  ): Promise<VerseOfTheDayModel> {
    const version = await prisma.bibleVersions.findFirst({
      where: {
        Abbreviation: request.version,
      },
    });

    let versionId = version?.Id;

    if (!versionId) {
      const firstVersion = await prisma.bibleVersions.findFirst();
      versionId = firstVersion?.Id;
    }

    if (!versionId) {
      return {
        text: 'Start children off on the way they should go, and even when they are old they will not turn from it.',
        reference: 'Proverbs 22:6',
      };
    }

    // Get a random verse from the version
    const verseCount = await prisma.bibleVerseVersions.count({
      where: { BibleVersionId: versionId },
    });

    const randomSkip = Math.floor(Math.random() * verseCount);

    const verse = await prisma.bibleVerseVersions.findFirst({
      where: { BibleVersionId: versionId },
      skip: randomSkip,
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
    });

    if (!verse) {
      return {
        text: 'Start children off on the way they should go, and even when they are old they will not turn from it.',
        reference: 'Proverbs 22:6',
      };
    }

    if (!verse.BibleVerses?.BibleChapters?.BibleBooks) {
      return {
        text: verse.Content || 'Start children off on the way they should go, and even when they are old they will not turn from it.',
        reference: 'Proverbs 22:6',
      };
    }

    return {
      text: verse.Content || '',
      reference: `${verse.BibleVerses.BibleChapters.BibleBooks.Name} ${verse.BibleVerses.BibleChapters.ChapterNumber}:${verse.BibleVerses.VerseNumber}`,
    };
  }
}
