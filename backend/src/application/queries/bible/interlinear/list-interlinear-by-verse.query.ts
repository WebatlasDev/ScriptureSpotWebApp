import { IRequest } from '@/lib/mediator';
import { InterlinearWordModel } from '@/application/models';

/**
 * Query to list interlinear words for a specific verse
 */
export class ListInterlinearByVerseQuery implements IRequest<InterlinearWordModel[]> {
  bookSlug?: string | null;
  chapterNumber?: number | null;
  verseNumber?: number | null;

  constructor(init?: Partial<ListInterlinearByVerseQuery>) {
    Object.assign(this, init);
  }
}
