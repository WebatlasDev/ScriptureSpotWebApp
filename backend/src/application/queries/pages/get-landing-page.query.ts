import { IRequest } from '@/lib/mediator';
import { LandingPageModel } from '@/application/models';

/**
 * Query to get a landing page by slug
 */
export class GetLandingPageQuery implements IRequest<LandingPageModel | null> {
  slug?: string | null;

  constructor(init?: Partial<GetLandingPageQuery>) {
    Object.assign(this, init);
  }
}
