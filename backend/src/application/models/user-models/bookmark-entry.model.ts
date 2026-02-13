import { SearchEntryModel } from '../search-models/search-entry.model';
import { BookmarkType } from '@/domain/enums/bookmark-type.enum';

export interface BookmarkEntryModel extends SearchEntryModel {
  bookmarkId: string;
  bookmarkType?: BookmarkType | null;
  createdDate: Date;
}
