import { IRequest } from '@/lib/mediator';
import { BibleVerseTakeawayModel } from '@/application/models/bible-models';

export class GetVerseTakeawaysQuery
  implements IRequest<BibleVerseTakeawayModel | null>
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
