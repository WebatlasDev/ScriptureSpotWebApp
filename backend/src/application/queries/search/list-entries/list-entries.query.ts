import { IRequest } from '@/lib/mediator';
import { SearchResultModel } from '@/application/models/search-models';

export class ListEntriesQuery implements IRequest<SearchResultModel[]> {
  query?: string;
  page: number = 1;
  pageSize: number = 10;

  constructor(data?: { query?: string; page?: number; pageSize?: number }) {
    this.query = data?.query;
    this.page = data?.page || 1;
    this.pageSize = data?.pageSize || 10;
  }
}
