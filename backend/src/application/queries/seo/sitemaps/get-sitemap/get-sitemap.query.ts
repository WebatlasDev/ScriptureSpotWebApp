import { IRequest } from '@/lib/mediator';

export class GetSitemapQuery implements IRequest<string> {
  identifier: string;

  constructor(identifier: string) {
    this.identifier = identifier;
  }
}
