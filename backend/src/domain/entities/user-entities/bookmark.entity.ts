import { BookmarkType } from '../../enums/bookmark-type.enum';

export interface Bookmark {
  id: string;
  type?: BookmarkType | null;
  referenceId?: string | null;
  userId?: string | null;
  createdDate: Date;
}
