import { IRequest } from '@/lib/mediator';
import { BibleVerseVersionModel } from '@/application/models/bible-models';

export class GetVerseVersionQuery implements IRequest<BibleVerseVersionModel> {
  bookSlug?: string;
  chapterNumber?: number;
  verseNumber?: number;
  versionName?: string;

  constructor(data?: {
    bookSlug?: string;
    chapterNumber?: number;
    verseNumber?: number;
    versionName?: string;
  }) {
    this.bookSlug = data?.bookSlug;
    this.chapterNumber = data?.chapterNumber;
    this.verseNumber = data?.verseNumber;
    this.versionName = data?.versionName;
  }
}
