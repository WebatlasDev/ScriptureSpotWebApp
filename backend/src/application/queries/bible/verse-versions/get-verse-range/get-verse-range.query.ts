import { IRequest } from '@/lib/mediator';
import { BibleVerseRangeModel } from '@/application/models/bible-models';

export class GetVerseRangeQuery implements IRequest<BibleVerseRangeModel> {
  bookSlug?: string;
  chapterNumber?: number;
  verseRange?: string;
  versionName?: string;

  constructor(data?: {
    bookSlug?: string;
    chapterNumber?: number;
    verseRange?: string;
    versionName?: string;
  }) {
    this.bookSlug = data?.bookSlug;
    this.chapterNumber = data?.chapterNumber;
    this.verseRange = data?.verseRange;
    this.versionName = data?.versionName;
  }
}
