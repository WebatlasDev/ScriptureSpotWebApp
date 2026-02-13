import { IRequest } from '@/lib/mediator';
import { BibleVerseModel } from '@/application/models/bible-models';

export class ListVersesQuery implements IRequest<BibleVerseModel[]> {
  bookSlug?: string | null;
  chapterNumber?: number | null;
}
