import { IRequest } from '@/lib/mediator';

export class UnsubscribeCommand implements IRequest<boolean> {
  email: string;

  constructor(email: string) {
    this.email = email;
  }
}
