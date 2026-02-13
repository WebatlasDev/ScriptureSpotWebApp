import { IRequest } from '@/lib/mediator';
import { BibleChapterModel } from '@/application/models/bible-models';

export class ListChaptersQuery implements IRequest<BibleChapterModel[]> {
  bookSlug?: string;

  constructor(bookSlug?: string) {
    this.bookSlug = bookSlug;
  }
}
