import { IRequest } from '@/lib/mediator';
import { StrongsLexiconModel } from '@/application/models/bible-models';

export class GetStrongsLexiconQuery
  implements IRequest<StrongsLexiconModel | null>
{
  strongsKey?: string;

  constructor(strongsKey?: string) {
    this.strongsKey = strongsKey;
  }
}
