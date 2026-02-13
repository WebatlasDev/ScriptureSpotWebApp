import { IRequest } from '@/lib/mediator';
import { VerseInterlinearModel } from '@/application/models/bible-models';

export class ListInterlinearByChapterQuery
  implements IRequest<VerseInterlinearModel[]>
{
  bookSlug?: string;
  chapterNumber?: number;

  constructor(data?: { bookSlug?: string; chapterNumber?: number }) {
    this.bookSlug = data?.bookSlug;
    this.chapterNumber = data?.chapterNumber;
  }
}
