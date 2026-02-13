import { IRequest } from '@/lib/mediator';
import { BibleVerseTakeawayModel } from '@/application/models';

/**
 * Query to get takeaways for a specific verse
 */
export class GetVerseTakeawaysQuery implements IRequest<BibleVerseTakeawayModel | null> {
  bookSlug?: string | null;
  chapterNumber?: number | null;
  verseNumber?: number | null;

  constructor(init?: Partial<GetVerseTakeawaysQuery>) {
    Object.assign(this, init);
  }
}
