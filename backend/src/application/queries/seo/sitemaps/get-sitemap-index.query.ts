import { IRequest } from '@/lib/mediator';

/**
 * Query to generate the sitemap index XML
 */
export class GetSitemapIndexQuery implements IRequest<string> {
  constructor(init?: Partial<GetSitemapIndexQuery>) {
    Object.assign(this, init);
  }
}
