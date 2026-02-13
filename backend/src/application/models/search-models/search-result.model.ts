import { SearchEntryModel } from './search-entry.model';

export interface SearchResultModel {
  type?: string | null;
  entries?: SearchEntryModel[] | null;
}
