import { IRequest } from '@/lib/mediator';
import { SearchResultModel } from '@/application/models/search-models';

export class BalancedSearchQuery implements IRequest<SearchResultModel[]> {
  query?: string;

  constructor(query?: string) {
    this.query = query;
  }
}
