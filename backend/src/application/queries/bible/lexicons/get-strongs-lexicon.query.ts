import { IRequest } from '@/lib/mediator';
import { StrongsLexiconModel } from '@/application/models';

/**
 * Query to get a Strong's lexicon entry by key
 */
export class GetStrongsLexiconQuery implements IRequest<StrongsLexiconModel | null> {
  strongsKey?: string | null;

  constructor(init?: Partial<GetStrongsLexiconQuery>) {
    Object.assign(this, init);
  }
}
