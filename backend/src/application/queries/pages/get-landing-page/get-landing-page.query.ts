import { IRequest } from '@/lib/mediator';
import { LandingPageModel } from '@/application/models/page-models';

export class GetLandingPageQuery implements IRequest<LandingPageModel | null> {
  slug?: string;

  constructor(slug?: string) {
    this.slug = slug;
  }
}
