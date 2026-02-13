import { IRequest } from '@/lib/mediator';
import { BibleVerseVersionModel } from '@/application/models/bible-models';

export class ListVerseVersionsQuery
  implements IRequest<BibleVerseVersionModel[]>
{
  bookSlug?: string;
  chapterNumber?: number;
  verseNumber?: number;

  constructor(data?: {
    bookSlug?: string;
    chapterNumber?: number;
    verseNumber?: number;
  }) {
    this.bookSlug = data?.bookSlug;
    this.chapterNumber = data?.chapterNumber;
    this.verseNumber = data?.verseNumber;
  }
}
