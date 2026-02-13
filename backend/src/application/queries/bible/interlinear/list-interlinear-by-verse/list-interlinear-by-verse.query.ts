import { IRequest } from '@/lib/mediator';
import { InterlinearWordModel } from '@/application/models/bible-models';

export class ListInterlinearByVerseQuery
  implements IRequest<InterlinearWordModel[]>
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
