import { BibleVerseRangeModel } from '@/application/models/bible-models/bible-verse-range.model';
import { BibleVerseVersionModel } from '@/application/models/bible-models/bible-verse-version.model';
import { GetVerseRangeQuery, GetVerseRangeQueryResponse } from './get-verse-range.query';
import { GetVerseVersionQueryHandler } from './get-verse-version.handler';
import { GetVerseVersionQuery } from './get-verse-version.query';

/**
 * Handler for retrieving a range of verses with verse numbers  
 */
export class GetVerseRangeQueryHandler {
  private readonly getVerseVersionHandler = new GetVerseVersionQueryHandler();

  async handle(query: GetVerseRangeQuery): Promise<GetVerseRangeQueryResponse> {
    if (!query.bookSlug || !query.chapterNumber || !query.verseRange || !query.versionName) {
      return {
        content: '',
        verseCount: 0,
        verseNumbers: []
      };
    }

    const verseNumbers = this.parseVerseRange(query.verseRange);

    const verses: (BibleVerseVersionModel | null)[] = [];
    for (const number of verseNumbers) {
      const verse = await this.getVerseVersionHandler.handle({
        bookSlug: query.bookSlug,
        chapterNumber: query.chapterNumber,
        verseNumber: number,
        versionName: query.versionName
      });
      verses.push(verse);
    }

    const content: string[] = [];
    for (let i = 0; i < verses.length; i++) {
      const verse = verses[i];
      if (verse && verse.content) {
        content.push(`<sup>${verseNumbers[i]}</sup>${verse.content}`);
      }
    }

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
