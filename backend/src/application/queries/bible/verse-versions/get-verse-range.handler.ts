import { BibleVerseRangeModel } from '@/application/models/bible-models/bible-verse-range.model';
import { GetVerseRangeQuery, GetVerseRangeQueryResponse } from './get-verse-range.query';
import { prisma } from '@/lib/prisma';

/**
 * Handler for retrieving a range of verses with verse numbers  
 */
export class GetVerseRangeQueryHandler {
  async handle(query: GetVerseRangeQuery): Promise<GetVerseRangeQueryResponse> {
    if (!query.bookSlug || !query.chapterNumber || !query.verseRange || !query.versionName) {
      console.log('[GetVerseRange] Missing parameters:', { 
        bookSlug: query.bookSlug, 
        chapterNumber: query.chapterNumber, 
        verseRange: query.verseRange, 
        versionName: query.versionName 
      });
      return {
        content: '',
        verseCount: 0,
        verseNumbers: []
      };
    }

    const verseNumbers = this.parseVerseRange(query.verseRange);
    console.log('[GetVerseRange] Fetching verses:', { 
      bookSlug: query.bookSlug, 
      chapter: query.chapterNumber, 
      verseNumbers: verseNumbers.length,
      version: query.versionName 
    });

    // Batch fetch all verses in one query instead of looping
    const verses = await prisma.bibleVerseVersions.findMany({
      where: {
        BibleVerses: {
          BibleChapters: {
            BibleBooks: {
              Slug: query.bookSlug,
            },
            ChapterNumber: query.chapterNumber,
          },
          VerseNumber: {
            in: verseNumbers,
          },
        },
        BibleVersions: {
          Abbreviation: {
            equals: query.versionName,
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
    });

    console.log('[GetVerseRange] Found verses:', verses.length);

    // Create a map for quick lookup
    const verseMap = new Map<number, string>();
    for (const verse of verses) {
      const verseNum = verse.BibleVerses?.VerseNumber;
      if (verse.Content && verseNum) {
        verseMap.set(verseNum, verse.Content);
      }
    }

    // Build content in correct order based on verseNumbers array
    const content: string[] = [];
    for (const num of verseNumbers) {
      const verseContent = verseMap.get(num);
      if (verseContent) {
        content.push(`<sup>${num}</sup>${verseContent}`);
      }
    }

    console.log('[GetVerseRange] Generated content length:', content.join(' ').length);

    return {
      content: content.join(' '),
      verseCount: verses.length,
      verseNumbers
    };
  }

  private parseVerseRange(range: string): number[] {
    if (range.includes('-')) {
      const parts = range.split('-', 2);
      const start = parseInt(parts[0], 10);
      const end = parseInt(parts[1], 10);

      if (!isNaN(start) && !isNaN(end)) {
        const result: number[] = [];
        for (let i = start; i <= end; i++) {
          result.push(i);
        }
        return result;
      }
    }

    const single = parseInt(range, 10);
    if (!isNaN(single)) {
      return [single];
    }

    return [];
  }
}
