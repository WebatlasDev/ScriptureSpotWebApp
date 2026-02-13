import { IRequest } from '@/lib/mediator';
import { StrongsVerseReferenceModel } from '@/application/models/bible-models';

export class ListStrongsVerseReferencesQuery
  implements IRequest<StrongsVerseReferenceModel[]>
{
  strongsKey?: string;
  version?: string;

  constructor(data?: { strongsKey?: string; version?: string }) {
    this.strongsKey = data?.strongsKey;
    this.version = data?.version;
  }
}
