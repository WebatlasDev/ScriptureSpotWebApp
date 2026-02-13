import { IRequest } from '@/lib/mediator';
import { BibleVerseCrossReferenceModel } from '@/application/models/bible-models';

/**
 * Query to list cross-references for a specific verse
 */
export class ListVerseCrossReferencesQuery implements IRequest<BibleVerseCrossReferenceModel[]> {
  bookSlug?: string | null;
  chapterNumber?: string | null;
  verseNumber?: string | null;
  version?: string | null;

  constructor(init?: Partial<ListVerseCrossReferencesQuery>) {
    Object.assign(this, init);
  }
}
