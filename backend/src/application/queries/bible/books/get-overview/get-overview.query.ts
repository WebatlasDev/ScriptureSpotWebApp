import { IRequest } from '@/lib/mediator';
import { BibleBookOverviewModel } from '@/application/models/bible-models';

export class GetOverviewQuery implements IRequest<BibleBookOverviewModel | null> {
  slug?: string;

  constructor(slug?: string) {
    this.slug = slug;
  }
}
