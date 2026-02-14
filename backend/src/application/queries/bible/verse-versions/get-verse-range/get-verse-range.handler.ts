import { IRequestHandler } from '@/lib/mediator';
import { GetVerseRangeQuery } from './get-verse-range.query';
import { BibleVerseRangeModel } from '@/application/models/bible-models';
import { prisma } from '@/lib/prisma';

export class GetVerseRangeQueryHandler
  implements IRequestHandler<GetVerseRangeQuery, BibleVerseRangeModel>
{
  async handle(
    request: GetVerseRangeQuery,
    signal?: AbortSignal
  ): Promise<BibleVerseRangeModel> {
    if (
      !request.bookSlug ||
      !request.chapterNumber ||
      !request.verseRange ||
      !request.versionName
    ) {
      return {
        content: '',
        verseCount: 0,
        verseNumbers: [],
      };
    }

    const verseNumbers = this.parseVerseRange(request.verseRange);

    // Batch fetch all verses in one query instead of looping
    const verses = await prisma.bibleVerseVersions.findMany({
      where: {
        BibleVerses: {
          BibleChapters: {
            BibleBooks: {
              Slug: request.bookSlug,
            },
            ChapterNumber: request.chapterNumber,
          },
          VerseNumber: {
            in: verseNumbers,
          },
        },
        BibleVersions: {
          Abbreviation: {
            equals: request.versionName,
            mode: 'insensitive',
          },
        },
      },
      select: {
        Content: true,
        BibleVerses: {
          select: {
            VerseNumber: true,
          },
        },
      },
      orderBy: {
        BibleVerses: {
          VerseNumber: 'asc',
        },
      },
    });

    // Build content with verse numbers
    const content: string[] = [];
    for (const verse of verses) {
      const verseNum = verse.BibleVerses?.VerseNumber;
      if (verse.Content && verseNum) {
        content.push(`<sup>${verseNum}</sup>${verse.Content}`);
      }
    }

    return {
      content: content.join(' '),
      verseCount: verses.length,
      verseNumbers: verses.map(v => v.BibleVerses?.VerseNumber || 0).filter(n => n > 0),
    };
  }

  private parseVerseRange(range: string): number[] {
    if (range.includes('-')) {
      const parts = range.split('-', 2);
      const start = parseInt(parts[0]);
      const end = parseInt(parts[1]);
      if (!isNaN(start) && !isNaN(end)) {
        return Array.from({ length: end - start + 1 }, (_, i) => start + i);
      }
    }
    const single = parseInt(range);
    if (!isNaN(single)) {
      return [single];
    }
    return [];
  }
}
