import { IRequest } from '@/lib/mediator';
import { VerseOfTheDayModel } from '@/application/models';

/**
 * Query to get a random verse of the day
 */
export class GetVerseOfTheDayQuery implements IRequest<VerseOfTheDayModel> {
  version?: string;

  constructor(init?: Partial<GetVerseOfTheDayQuery>) {
    this.version = init?.version ?? 'NIV';
  }
}
