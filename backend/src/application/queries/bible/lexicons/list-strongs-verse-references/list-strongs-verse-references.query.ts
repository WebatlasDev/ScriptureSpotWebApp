import { IRequest } from '@/lib/mediator';
import { StrongsVerseReferenceModel } from '@/application/models/bible-models';

export interface PaginatedStrongsVerseReferencesModel {
  results: StrongsVerseReferenceModel[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export class ListStrongsVerseReferencesQuery
  implements IRequest<PaginatedStrongsVerseReferencesModel>
{
  strongsKey?: string;
  version?: string;
  page?: number;
  pageSize?: number;

  constructor(data?: { 
    strongsKey?: string; 
    version?: string;
    page?: number;
    pageSize?: number;
  }) {
    this.strongsKey = data?.strongsKey;
    this.version = data?.version;
    this.page = data?.page ?? 1;
    this.pageSize = data?.pageSize ?? 20;
  }
}
