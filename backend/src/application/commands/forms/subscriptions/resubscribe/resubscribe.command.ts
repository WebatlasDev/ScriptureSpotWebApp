import { IRequest } from '@/lib/mediator';

/**
 * Command to resubscribe an email address to mailing list
 */
export class ResubscribeCommand implements IRequest<boolean> {
  email?: string;

  constructor(init?: Partial<ResubscribeCommand>) {
    Object.assign(this, init);
  }
}
