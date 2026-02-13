import { IRequest } from '@/lib/mediator';
import { VerseInterlinearModel } from '@/application/models';

/**
 * Query to list interlinear data for all verses in a chapter
 */
export class ListInterlinearByChapterQuery implements IRequest<VerseInterlinearModel[]> {
  bookSlug?: string | null;
  chapterNumber?: number | null;

  constructor(init?: Partial<ListInterlinearByChapterQuery>) {
    Object.assign(this, init);
  }
}
