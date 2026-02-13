import { IRequest } from '@/lib/mediator';
import { VerseOfTheDayModel } from '@/application/models/bible-models';

export class GetVerseOfTheDayQuery implements IRequest<VerseOfTheDayModel> {
  version: string;

  constructor(version: string = 'NIV') {
    this.version = version;
  }
}
