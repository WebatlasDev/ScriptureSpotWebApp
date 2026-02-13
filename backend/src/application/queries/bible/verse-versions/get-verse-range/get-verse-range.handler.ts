import { IRequestHandler } from '@/lib/mediator';
import { GetVerseRangeQuery } from './get-verse-range.query';
import { BibleVerseRangeModel, BibleVerseVersionModel } from '@/application/models/bible-models';
import { Mediator } from '@/lib/mediator';
import { GetVerseVersionQuery } from '../get-verse-version';

export class GetVerseRangeQueryHandler
  implements IRequestHandler<GetVerseRangeQuery, BibleVerseRangeModel>
{
  constructor(private mediator: Mediator) {}

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

    const verses = (await Promise.all(
      verseNumbers.map((number) =>
        this.mediator.send(
          new GetVerseVersionQuery({
            bookSlug: request.bookSlug,
            chapterNumber: request.chapterNumber,
            verseNumber: number,
            versionName: request.versionName,
          }),
          signal
        )
      )
    )) as BibleVerseVersionModel[];

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
      verseNumbers: verseNumbers,
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
