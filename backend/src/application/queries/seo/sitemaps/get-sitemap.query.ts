import { IRequest } from '@/lib/mediator';

/**
 * Query to generate a specific sitemap XML file by identifier
 */
export class GetSitemapQuery implements IRequest<string> {
  identifier?: string;

  constructor(init?: Partial<GetSitemapQuery>) {
    Object.assign(this, init);
  }
}
